const helper = require('../helper')

class EntityService {
  indexAction(db) {
    const models = db.sequelize.models;
    let result = [];

    Object.keys(models).forEach(modelName => {
      const modelKlass = helper.modelKlass(db, modelName);

      const modelColumns = Object.keys(modelKlass.attributes).map(modelColumn => ({
          name: modelKlass.attributes[modelColumn].fieldName,
          type: modelKlass.attributes[modelColumn].type.key}));

      result.push({
        name: modelKlass.name,
        columns: modelColumns
      })
    })

    return {
      models: result
    }
  }

  showAction(db, resourceName) {
    const modelKlass = helper.modelKlass(db, resourceName);

    const modelColumns = Object.keys(modelKlass.attributes).map(modelColumn => ({
        name: modelKlass.attributes[modelColumn].fieldName,
        type: modelKlass.attributes[modelColumn].type.key}));

    return {
      reflections:'',
      name: modelKlass.name,
      columns: modelColumns,
      column_names: Object.keys(modelKlass.attributes)
    }
  }
}

exports.instance = new EntityService()
