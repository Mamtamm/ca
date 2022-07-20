const { handleEx } = require("../../helper/handle_ex");
const { User } = require("../../models");

module.exports = async (req, res) => {
  const currentUser = res.locals.decoded.user;
  User.findOne({
    attributes: User.basicAttributes(),
    where: { id: currentUser.id },
  })
    .then((user) => res.send(user))
    .catch((ex) => {
      error = handleEx(res, ex);
      res.status(error.code).send(error.msg);
    });
};
