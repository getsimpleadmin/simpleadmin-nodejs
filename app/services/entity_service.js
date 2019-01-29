const helper = require('../helper')

class EntityService {
  indexAction(db) {
    const models = db.sequelize.models;
    let result = [];

    Object.keys(models).forEach(modelName => {
      const modelClass = helper.modelClass(db, modelName);

      if(!modelClass) {
        throw new Error(`Model with name ${modelName} doesn't exist`);
      }

      const modelColumns = Object.keys(modelСlass.attributes).map(modelColumn => ({
          name: modelClass.attributes[modelColumn].fieldName,
          type: modelClass.attributes[modelColumn].type.key}));

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
    const modelСlass = helper.modelСlass(db, resourceName);

    const modelColumns = Object.keys(modelСlass.attributes).map(modelColumn => ({
        name: modelСlass.attributes[modelColumn].fieldName,
        type: modelСlass.attributes[modelColumn].type.key}));

    return {
      reflections:  '',
      name:         modelСlass.name,
      columns:      modelColumns,
      column_names: Object.keys(modelClass.attributes)
    }
  }
}

exports.instance = new EntityService()
