const capitalizeString = string => string.charAt(0).toUpperCase() + string.slice(1);

const isSecretKeyIsInValid = request => request.headers['simpleadmin-secret-key'] != process.env.SIMPLE_ADMIN_SECRET_KEY;


exports.capitalizeString = capitalizeString
exports.isSecretKeyIsInValid = isSecretKeyIsInValid

exports.modelKlass = (db, name) => {
  const modelNames = Object.keys(db.sequelize.models).map(modelName => capitalizeString(modelName));

  if (modelNames.includes(capitalizeString(name))) {
    return eval(capitalizeString(name))
  }
}
