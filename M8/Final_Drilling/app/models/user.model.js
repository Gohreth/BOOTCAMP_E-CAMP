const { SALT, SECRET } = require("../config/auth.config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "users",
    {
      firstName: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "El Campo del nombre es requerido",
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "El Campo del apellido es requerido",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "el correo electronico es requerido",
          },
          isEmail: {
            args: true,
            msg: "Formato de correo invalido",
          },
        },
        unique: {
          args: true,
          msg: "correo electronico actualmente registrado en la base de datos!",
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "La contraseña es requerida",
          },
          min: {
            args: [8],
            msg: "Mínimo 8 caracteres de contraseña",
          },
        },
      },
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, SALT);
          }
        },
        beforeUpdate: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, SALT);
          }
        },
      },
    }
  );

  //Funcion a nivel de clase que permite validar password
  User.validatePassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
  };

  User.generateToken = (content, lifetime) => {
    return jwt.sign(content, SECRET, {
      expiresIn: lifetime,
    });
  };

  return User;
};
