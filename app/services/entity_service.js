const helper = require('../helper')

class EntityService {
  indexAction(db) {
    let models = db.sequelize.models,
        result = [];

    Object.keys(models).forEach(modelName => {
      let modelClass = helper.modelClass(db, modelName);

      let modelColumns = Object.keys(modelClass.attributes).map(modelColumn => {
        return {
          name: modelClass.attributes[modelColumn].fieldName,
          type: modelClass.attributes[modelColumn].type.key
        }
      })

      result.push({
        name:    modelClass.name,
        columns: modelColumns
      })
    })

    return {
      models: result
    }
  }

  showAction(db, resourceName) {
    let modelClass = helper.modelClass(db, resourceName);

    let modelColumns = Object.keys(modelClass.attributes).map(modelColumn => {
      return {
        name: modelClass.attributes[modelColumn].fieldName,
        type: modelClass.attributes[modelColumn].type.key
      }
    })

    return {
      name:         modelClass.name,
      column_names: Object.keys(modelClass.attributes),
      columns:      modelColumns,
      reflections:  ''

    }
  }
}

exports.instance = new EntityService()
