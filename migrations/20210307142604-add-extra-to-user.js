"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all(
      await queryInterface.addColumn("users", "profile_url", {
        type: Sequelize.STRING,
      }),
      await queryInterface.addColumn("users", "is_deactived", {
        type: Sequelize.STRING,
      }),
      await queryInterface.addColumn("users", "zipcode", {
        type: Sequelize.STRING,
      })
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
