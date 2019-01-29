class ResourceService {
  constructor(modelClass, modelFields) {
    this.modelClass  = modelClass
    this.modelFields = modelFields
  }

  async indexAction() {
    let result;

    await this.modelClass.findAll().then((resources) => {
      result = resources.map((resource) => {
        return resource.dataValues
      })
    })

    return {
      resources: result,
      total:     result.length
    }
  }
}

exports.klass = ResourceService
