let capitalizeString = function(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

let isSecretKeyIsInValid = function(request) {
  return request.headers['simpleadmin-secret-key'] != process.env.SIMPLE_ADMIN_SECRET_KEY
}

exports.capitalizeString = capitalizeString
exports.isSecretKeyIsInValid = isSecretKeyIsInValid

exports.modelKlass = function(db, name) {
  let modelNames = Object.keys(db.sequelize.models).map(modelName => capitalizeString(modelName));

  if (modelNames.includes(capitalizeString(name))) {
    return eval(capitalizeString(name))
  }
}
