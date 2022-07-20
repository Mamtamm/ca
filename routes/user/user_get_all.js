const { Op } = require("sequelize");
const { handleEx } = require("../../helper/handle_ex");
const { User } = require("../../models");
const { searchQuery } = require("../../helper/search_query");

module.exports = async (req, res) => {
  let whereOps = {};
  if (req.query.search) {
    whereOps = {
      [Op.and]: [
        {
          [Op.or]: [
            { firstName: searchQuery(req.query.search) },
            { lastName: searchQuery(req.query.search) },
            { email: searchQuery(req.query.search) },
            { phone: searchQuery(req.query.search) },
          ],
        },
      ],
    };
  } else {
    whereOps = {};
  }

  //init sorting
  const sortArrDefault = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "updatedAt",
  ];

  let sortArr;
  let sortOrder = req.query.order ? req.query.order : "DESC";
  if (req.query.sortBy) {
    if (!sortArrDefault.includes(req.query.sortBy)) {
      return res.status(422).send({ error: "invalid sortBy params" });
    }
    sortArr = [[req.query.sortBy, sortOrder]];
  } else {
    sortArr = [["updatedAt", "DESC"]];
  }

  User.findAndCountAll({
    attributes: User.basicAttributes(),
    where: whereOps,
    order: sortArr,
  })
    .then((user) => res.send(user))
    .catch((ex) => {
      error = handleEx(res, ex);
      res.status(error.code).send(error.msg);
    });
};
