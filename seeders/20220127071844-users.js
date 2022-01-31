module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersList = [
      {
        email: 'doraemon@future.com',
        name: 'Doraemon',
        password: '$2a$12$k1a1fQeKYJPCzNmA5KR1puDAfxqXVWMlcbD84rv2AKOCDCbCI9pCi',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'nobita@future.com',
        name: 'Nobita',
        password: '$2a$12$y0NJY/RGTrWAGprfWlPYbe.ChbESjdROYSlDMWyqxDgtkws5lo0rq',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'shizuka@future.com',
        name: 'Shizuka',
        password: '$2a$12$ATSqa74Kgx34doeQH7R3.Ol5l.6PDWa1m3ZHB8bhryrgXUxhBdcN.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'dorami@future.com',
        name: 'Dorami',
        password: '$2a$12$m4ADshIRRupQ66.UNl0Y/uoNmXjmy5dfSM3bPtCNm3Hl/l415eVBa',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'takeshi@future.com',
        name: 'Takeshi',
        password: '$2a$12$M7wilkWmf7cr0jXY5fVPluNYWTmhzHeuiak0gp0OcJiAC8p9ASffG',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'suneo@future.com',
        name: 'Suneo',
        password: '$2a$12$MigUSSAyBRViYdXeNVH9/O.MomKUKNmSgzbQbT7ltt0DtXwmMz616',
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
