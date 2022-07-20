const { Sequelize } = require("../models");

exports.handleEx = (res, ex) => {
  if (ex.errors && ex.errors[0] instanceof Sequelize.ValidationErrorItem)
    return { code: 422, msg: { error: ex.errors[0].message } };
  else return { code: 500, msg: { error: ex.toString() } };
};
