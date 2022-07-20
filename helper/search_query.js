const { Op } = require("sequelize");

exports.searchQuery = (searchData) => {
  return {
    [Op.like]: "%" + searchData.toLowerCase() + "%",
    [Op.like]: "%" + searchData.toUpperCase() + "%",
  };
};
