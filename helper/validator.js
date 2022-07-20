const Validator = require("validatorjs");

Validator.register(
  "mobilePhone",
  function (value, requirement, attribute) {
    // requirement parameter defaults to null
    return value.match(/^\+\d{12}$/);
  },
  "The :attribute phone number is not in the format +XXXXXXXXXX."
);

Validator.register(
  "telephone",
  function (value, requirement, attribute) {
    // requirement parameter defaults to null
    return value.match(/^\d{3}-\d{3}-\d{4}$/);
  },
  "The :attribute phone number is not in the format XXX-XXX-XXXX."
);

exports.validate = (rules, data, res) => {
  const validation = new Validator(data, rules, res);
  if (validation.fails()) {
    validation.fails(() => {
      return res.status(422).send(validation.errors);
    });
  } else return true;
};
