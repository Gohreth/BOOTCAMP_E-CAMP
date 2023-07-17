require("dotenv").config();

const { JWT_SECRET } = process.env;

module.exports = {
  SECRET: JWT_SECRET,
  SALT: 10,
};
