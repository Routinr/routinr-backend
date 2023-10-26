import { Sequelize } from 'sequelize';

const dbHost = process.env.DB_HOST ?? 'localhost';
const dbUser = process.env.DB_USER ?? 'alexin';
const dbPassword = process.env.DB_PASSWORD ?? 'default-password';
const dbName = process.env.DB_NAME ?? 'relisted-labels';

const dbConfig = {
  database: dbName,
  username: dbUser,
  password: dbPassword,
  host: dbHost,
  dialect: 'mysql',
};

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: 23447,
    dialect: 'mysql',
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Export the Sequelize instance
export default sequelize;