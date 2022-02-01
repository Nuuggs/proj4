module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('matches', 'last_card', { type: Sequelize.JSONB });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('last_card');
  },
};
