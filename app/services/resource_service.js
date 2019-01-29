class ResourceService {
  constructor(modelKlass, modelFields) {
    this.modelKlass  = modelKlass
    this.modelFields = modelFields
  }

  async indexAction() {
    let result;

    await this.modelKlass.findAll().then((resources) => {
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
