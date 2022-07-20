const { handleEx } = require("../../helper/handle_ex");
const { User } = require("../../models");

module.exports = async (req, res) => {
  User.findOne({
    attributes: User.basicAttributes(),
    where: { id: req.params.id },
  })
    .then((user) => {
      if (user) {
        res .status(200).send(user);
      } else {
        res.status(422).send({ error: "No data Found" });
      }
    })
    .catch((ex) => {
      error = handleEx(res, ex);
      res.status(error.code).send(error.msg);
    });
};
