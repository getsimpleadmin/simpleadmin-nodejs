String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

const Boom = require('boom');
const Bcrypt = require('bcrypt');

class Simpleadmin {
  constructor(serverInstance, databaseConnection, mountAt) {
    this.serverInstance = serverInstance;
    this.databaseConnection = databaseConnection;

    this.pathPrefix = `${mountAt}/v1`;
    this.allowedWidgets = ['quantity', 'week_statistic'];
  }

  mount() {
    const context = this;

    this.serverInstance.route({
      method: 'GET',
      path: `${context.pathPrefix}/widgets/{widget_name}`,
      async handler(request) {
        await context.respondForbidden(request.headers['simpleadmin-secret-key']);

        const widgetName = request.params.widget_name;

        if (!context.allowedWidgets.includes(widgetName)) {
          throw Boom.forbidden('Nonexistent widget');
        }

        const model = context.modelByTableName(request.query.table_name);

        if (widgetName === 'quantity') {
          let totalRecords;

          await model.count().then((total) => {
            totalRecords = total;
          }).catch((error) => {
            throw Boom.badRequest(error);
          });

          return new Object({
            widget_name: 'quantity',
            result: totalRecords,
          });
        }

        if (widgetName === 'week_statistic') {
          const result = await context.weekStatistic(model);

          return new Object({
            widget_name: 'week_statistic',
            result,
          });
        }
      },
    });

    this.serverInstance.route({
      method: 'GET',
      path: `${context.pathPrefix}/tables`,
      handler(request) {
        context.respondForbidden(request.headers['simpleadmin-secret-key']);

        return Object.keys(context.databaseConnection.sequelize.models).map((tableName) => {
          const model = context.modelByTableName(tableName);

          return new Object({ table_name: model.name, table_columns: context.columnsByModel(model) });
        });
      },
    });

    this.serverInstance.route({
      method: 'GET',
      path: `${context.pathPrefix}/tables/{table_name}`,
      handler(request) {
        context.respondForbidden(request.headers['simpleadmin-secret-key']);

        const model = context.modelByTableName(request.params.table_name);

        return context.columnsByModel(model);
      },
    });

    this.serverInstance.route({
      method: 'GET',
      path: `${context.pathPrefix}/resources`,
      async handler(request) {
        await context.respondForbidden(request.headers['simpleadmin-secret-key']);

        const model = context.modelByTableName(request.query.table_name);

        let requestResponse;
        let totalRecords;

        const tableFieldsNames = request.query['table_fields[][field_name]'];

        const queryParams = {
          limit: request.query.per_page,
          attributes: tableFieldsNames,
          offset: (request.query.per_page * request.query.page) - request.query.per_page,
        };

        if (request.query['sort[order]']) {
          queryParams.order = [
            [request.query['sort[column_name]'], request.query['sort[order]']],
          ];
        }

        if (request.query.query) {
          const searchResult = await context.search(model,
            request.query.query,
            request.query['model_attributes[]']);

          requestResponse = searchResult.resources;
          totalRecords = searchResult.total;
        } else {
          await model.findAll(queryParams).then((resources) => {
            requestResponse = resources.map(resource => resource.dataValues);
          }).catch((error) => {
            throw Boom.badRequest(error);
          });

          await model.count().then((total) => {
            totalRecords = total;
          }).catch((error) => {
            throw Boom.badRequest(error);
          });
        }

        return new Object({
          resources: requestResponse,
          total: totalRecords,
        });
      },
    });

    this.serverInstance.route({
      method: 'GET',
      path: `${context.pathPrefix}/resources/{id}`,
      async handler(request) {
        await context.respondForbidden(request.headers['simpleadmin-secret-key']);

        let requestResponse; let
          tableFields;

        const model = context.modelByTableName(request.query.table_name);

        await model.findById(request.params.id).then((resource) => {
          requestResponse = resource.dataValues;
        }).catch((error) => {
          throw Boom.badRequest(error);
        });

        if (typeof request.query['table_fields[]'] === 'string') {
          tableFields = [request.query['table_fields[]']];
        } else {
          tableFields = request.query['table_fields[]'];
        }

        requestResponse = tableFields.reduce((obj, key) => ({ ...obj, [key]: requestResponse[key] }), {});

        return requestResponse;
      },
    });

    this.serverInstance.route({
      method: 'POST',
      path: `${context.pathPrefix}/resources`,
      async handler(request) {
        await context.respondForbidden(request.headers['simpleadmin-secret-key']);

        let requestResponse;

        const model = context.modelByTableName(request.payload.table_name);

        await model.create(context.resourceParams(request.payload)).then((resource) => {
          requestResponse = resource;
        }).catch((error) => {
          throw Boom.badRequest(error);
        });

        return requestResponse;
      },
    });

    this.serverInstance.route({
      method: 'PATCH',
      path: `${context.pathPrefix}/resources/{id}`,
      async handler(request) {
        await context.respondForbidden(request.headers['simpleadmin-secret-key']);

        const model = context.modelByTableName(request.payload.table_name);

        return model.update(context.resourceParams(request.payload),
          { where: { id: request.params.id } });
      },
    });

    this.serverInstance.route({
      method: 'DELETE',
      path: `${context.pathPrefix}/resources/{id}`,
      async handler(request) {
        await context.respondForbidden(request.headers['simpleadmin-secret-key']);

        const model = context.modelByTableName(request.payload.table_name);

        return model.destroy({ where: { id: request.params.id } }).catch((error) => {
          throw Boom.badRequest(error);
        });
      },
    });
  }

  resourceParams(payload) {
    const regexpPattern = /(?<=\[).+?(?=\])/;
    const result = {};

    Object.keys(payload).filter(value => value !== 'table_name').forEach((paramKey) => {
      const paramName = paramKey.match(regexpPattern)[0];

      result[paramName] = payload[paramKey];
    });

    return result;
  }

  modelByTableName(name) {
    return this.databaseConnection.models[name.capitalize()];
  }

  columnsByModel(model) {
    return Object.keys(model.attributes).map(columnName => ({
      column_name: model.attributes[columnName].fieldName,
      data_type: model.attributes[columnName].type.key,
    }));
  }

  async weekStatistic(model) {
    const Luxon = require('luxon');

    const result = [];
    const context = this;

    [6, 5, 4, 3, 2, 1, 0].forEach((dayIndex) => {
      const currentDateTime = Luxon.DateTime.local().minus({ days: dayIndex });
      const dayStatistic = context.dayStatistic(model, currentDateTime);

      result.push(dayStatistic);
    });

    return await Promise.all(result);
  }

  async dayStatistic(model, currentDateTime) {
    let result;

    await model.findAll({
      where: {
        createdAt: {
          $between: [
            currentDateTime.startOf('day').toUTC().toISO(),
            currentDateTime.endOf('day').toUTC().toISO(),
          ],
        },
      },
    }).then((resources) => {
      result = resources;
    });

    return result.length;
  }

  async search(model, searchQuery, modelAttributes) {
    let searchResult;

    const queryParams = {
      [this.databaseConnection.Sequelize.Op.or]: [],
    };

    if (typeof modelAttributes === 'string') {
      modelAttributes = [modelAttributes];
    }

    modelAttributes.map((modelAttribute) => {
      const sqlQuery = {};

      sqlQuery[modelAttribute] = {
        [this.databaseConnection.Sequelize.Op.iLike]: `%${searchQuery}%`,
      };

      queryParams[this.databaseConnection.Sequelize.Op.or].push(sqlQuery);
    });

    await model.findAll({ where: queryParams }).then((queryResult) => {
      searchResult = queryResult;
    }).catch((error) => {
      throw Boom.badRequest(error);
    });

    return new Object({
      resources: searchResult,
      total: searchResult.length,
    });
  }

  async respondForbidden(secretKey) {
    if (await this.isSecretKeyInvalid(secretKey)) {
      throw Boom.forbidden('Invalid secret key');
    }
  }

  async isSecretKeyInvalid(secretKey) {
    const compareResult = await Bcrypt.compare(process.env.SIMPLE_ADMIN_SECRET_KEY, secretKey);

    return !compareResult;
  }
}

exports.mount = function (serverInstance, databaseConnection, mountAt) {
  new Simpleadmin(serverInstance, databaseConnection, mountAt).mount();
};
