"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.createTable("users", {
        id: { type: Sequelize.BIGINT, primaryKey: true, autoIncreament: true },
        first_name: { type: Sequelize.STRING, allownull: false },
        last_name: { type: Sequelize.STRING, allownull: true },
        email: { type: Sequelize.STRING },
        phone: { type: Sequelize.STRING },
        password: { type: Sequelize.STRING },
        reset_hash: { type: Sequelize.STRING },
        created_at: { type: Sequelize.DATE, allowNull: false },
        updated_at: { type: Sequelize.DATE, allowNull: false },
        deleted_at: { type: Sequelize.DATE },
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("users");
  },
};
