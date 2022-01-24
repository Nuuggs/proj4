module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersList = [
      {
        email: 'doraemon@future.com',
        name: 'Doraemon',
        password: 'doradora',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'nobita@future.com',
        name: 'Nobita',
        password: 'nobinobi',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'shizuka@future.com',
        name: 'Shizuka',
        password: 'shizushizu',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'dorami@future.com',
        name: 'Dorami',
        password: 'doradora',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'takeshi@future.com',
        name: 'Takeshi',
        password: 'taketake',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'suneo@future.com',
        name: 'Suneo',
        password: 'sunesune',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    await queryInterface.bulkInsert('users', usersList, { returning: true });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
