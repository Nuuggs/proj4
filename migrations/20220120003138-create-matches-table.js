module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('matches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      p1_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      p2_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      parameters: {
        allowNull: false,
        type: Sequelize.JSON,
      },
      search_results: {
        type: Sequelize.JSON,
      },
      time_expiry: {
        type: Sequelize.DATE,
      },
      likes_list: {
        type: Sequelize.JSON,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('matches');
  },
};
