const capitalizeString   = string    => string.charAt(0).toUpperCase() + string.slice(1);
const isSecretKeyInValid = secretKey => secretKey != process.env.SIMPLE_ADMIN_SECRET_KEY;

exports.capitalizeString   = capitalizeString
exports.isSecretKeyInvalid = isSecretKeyInvalid

exports.modelClass = (db, name) => {
  const modelNames = Object.keys(db.sequelize.models).map(modelName => capitalizeString(modelName));

  if (modelNames.includes(capitalizeString(name))) {
    return eval(capitalizeString(name))
  }
}

exports.isRequestAuthorized = function(secretKey) {
  if (isSecretKeyInvalid(secretKey)) {
    throw Boom.forbidden('Invalid secret key')
  }
}
