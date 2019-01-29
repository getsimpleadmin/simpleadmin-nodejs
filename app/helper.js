let capitalizeString = function(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

let isSecretKeyInvalid = function(secretKey) {
  return secretKey != process.env.SIMPLE_ADMIN_SECRET_KEY
}

exports.capitalizeString   = capitalizeString
exports.isSecretKeyInvalid = isSecretKeyInvalid

exports.modelClass = function(db, name) {
  let modelNames = Object.keys(db.sequelize.models).map(modelName => capitalizeString(modelName));

  if (modelNames.includes(capitalizeString(name))) {
    return eval(capitalizeString(name))
  }
}

exports.isRequestAuthorized = function(secretKey) {
  if (isSecretKeyInvalid(secretKey)) {
    throw Boom.forbidden('Invalid secret key')
  }
}
