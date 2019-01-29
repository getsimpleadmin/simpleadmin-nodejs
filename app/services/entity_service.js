const helper = require('../helper')

class EntityService {
  indexAction(db) {
    let models = db.sequelize.models,
        result = [];

    Object.keys(models).forEach(modelName => {
      let modelKlass = helper.modelKlass(db, modelName);

      let modelColumns = Object.keys(modelKlass.attributes).map(modelColumn => {
        return {
          name: modelKlass.attributes[modelColumn].fieldName,
          type: modelKlass.attributes[modelColumn].type.key
        }
      })

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
    let modelKlass = helper.modelKlass(db, resourceName);

    let modelColumns = Object.keys(modelKlass.attributes).map(modelColumn => {
      return {
        name: modelKlass.attributes[modelColumn].fieldName,
        type: modelKlass.attributes[modelColumn].type.key
      }
    })

    return {
      name:         modelKlass.name,
      column_names: Object.keys(modelKlass.attributes),
      columns:      modelColumns,
      reflections:  ''

    }
  }
}

exports.instance = new EntityService()
