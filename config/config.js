const dotenv = require(`dotenv`);
dotenv.config();

const config = {
  development: {
    username: process.env.PG_USER || '<YOUR_UNIX_USERNAME_HERE>',
    password: process.env.PG_PASSWORD || null,
    database: process.env.PG_DB_NAME || 'proj4_development',
    host: process.env.PG_HOST || '127.0.0.1',
    dialect: process.env.PG_DIALECT || 'postgres',
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: { // https://github.com/sequelize/sequelize/issues/12083
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};

module.exports = config;