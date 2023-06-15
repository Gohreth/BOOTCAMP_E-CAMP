const { Model, Sequelize } = require("sequelize");
const sequelize = require("./");

class User extends Model {
  static associate(models) {
    this.belongsToMany(models.Bootcamp, {
      through: "user_bootcamp",
      foreignKey: "user_id",
      otherKey: "bootcamp_id",
      as: "bootcamps",
    });
  }
}

//Campos createdAt y updatedAt vienen por defecto
User.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
  },
  {
    sequelize,
    tableName: "users",
    modelName: "User",
  }
);

module.exports = User;
