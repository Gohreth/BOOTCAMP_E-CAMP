const { Sequelize } = require("sequelize");

const {
  user,
  database,
  password,
  port,
  host,
} = require("../config/env.config");

const sequelize = new Sequelize(database, user, password, {
  host: host,
  port: parseInt(port),
  dialect: "postgres",
});

(async function () {
  try {
    await sequelize.authenticate();
    console.log("Conectado a la base de datos");
  } catch (error) {
    console.log("Error conectando con la base de datos: ", error.message);
  }
})();

module.exports = sequelize;
