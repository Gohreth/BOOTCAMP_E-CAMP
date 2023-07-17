require("dotenv").config();

const { DB_USER, DB_NAME, DB_PASSWORD, DB_PORT, DB_HOST } = process.env;

module.exports = {
  HOST: DB_HOST,
  USER: DB_USER,
  PASSWORD: DB_PASSWORD,
  DB: DB_NAME,
  PORT: parseInt(DB_PORT),
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
