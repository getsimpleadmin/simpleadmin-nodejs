const entityService   = require('./app/services/entity_service')
const resourceService = require('./app/services/resource_service')

const helper = require('./app/helper')

class SimpleAdmin {
  static get version() { return '1.3.2' }

  constructor(server, db) {
    this.server = server
    this.db     = db
  }

  mountRoutes() {
    this.buildResources()
    this.buildEntities()

    this.server.route({
      method: 'GET',
      path: '/simple_admin/version',
      handler: function(request, h) {
        helper.isRequestAuthorized(request.headers['simpleadmin-secret-key'])

        return {
          version: SimpleAdmin.version
        }
      }
    })
  }

  resourceParams(payload) {
    const excludedParam = 'model_klass_name'
    const regexpPattern = /(?<=\[).+?(?=\])/

    let result = {}

    Object.keys(payload).filter((value, index, arr) => {
      return value != excludedParam
    }).forEach((paramKey) => {
      let paramName = paramKey.match(regexpPattern)[0]

      result[paramName] = payload[paramKey]
    })

    return result
  }

  buildResources() {
    let _this = this;

    this.server.route({
      method: 'GET',
      path: '/simple_admin/resources',
      handler: function(request, h) {
        helper.isRequestAuthorized(request.headers['simpleadmin-secret-key'])

        return new resourceService.klass(helper.modelClass(_this.db, request.query.model_klass_name)).indexAction()
      }
    })

    this.server.route({
      method: 'GET',
      path: '/simple_admin/resources/{id}',
      handler: async function(request ,h) {
        helper.isRequestAuthorized(request.headers['simpleadmin-secret-key'])

        let result = {},
            resourceAttributes;

        let modelClassName = request.query.model_klass_name;

        await helper.modelClass(_this.db, modelClassName).findById(request.params.id).then((resource) => {
          resourceAttributes = resource.dataValues
        });

        request.query['model_fields[][field_name]'].forEach((fieldName) => {
          result[fieldName] = resourceAttributes[fieldName]
        })

        return result
      }
    })

    this.server.route({
      method: 'POST',
      path: '/simple_admin/resources',
      handler: async function(request ,h) {
        helper.isRequestAuthorized(request.headers['simpleadmin-secret-key'])

        let result;
        let modelClassName = request.payload.model_klass_name;

        await helper.modelClass(_this.db, modelClassName).create(_this.resourceParams(request.payload)).then((resource) => {
          result = resource;
        });

        return result
      }
    })

    this.server.route({
      method: 'PUT',
      path: '/simple_admin/resources/{id}',
      handler: async function(request ,h) {
        helper.isRequestAuthorized(request.headers['simpleadmin-secret-key'])

        return helper.modelClass(_this.db, request.payload.model_klass_name).update(
          _this.resourceParams(request.payload),
          { where: { id: request.params.id } }
        )
      }
    })

    this.server.route({
      method: 'DELETE',
      path: '/simple_admin/resources/{id}',
      handler: async function(request ,h) {
        helper.isRequestAuthorized(request.headers['simpleadmin-secret-key'])

        await helper.modelClass(_this.db, request.payload.model_klass_name).destroy({ where: { id: request.params.id } })

        return {}
      }
    })
  }

  buildEntities() {
    let _this = this;

    this.server.route({
      method: 'GET',
      path: '/simple_admin/entities',
      handler: function(request ,h) {
        helper.isRequestAuthorized(request.headers['simpleadmin-secret-key'])

        return entityService.instance.indexAction(_this.db)
      }
    });

    this.server.route({
      method: 'GET',
      path: '/simple_admin/entities/{id}',
      handler: function(request ,h) {
        helper.isRequestAuthorized(request.headers['simpleadmin-secret-key'])

        return entityService.instance.showAction(_this.db, request.params.id)
      }
    })
  }
}

exports.mountSimpleAdmin = function(server, db) {
  let simpleAdminInstance = new SimpleAdmin(server, db)
      simpleAdminInstance.mountRoutes()
}
