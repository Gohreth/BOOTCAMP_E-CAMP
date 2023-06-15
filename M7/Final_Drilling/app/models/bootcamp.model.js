const { Model, Sequelize } = require("sequelize");
const sequelize = require("./");

class Bootcamp extends Model {
  static associate(models) {
    this.belongsToMany(models.User, {
      through: "user_bootcamp",
      foreignKey: "bootcamp_id",
      otherKey: "user_id",
      as: "users",
    });
  }
}

//Campos createdAt y updatedAt vienen por defecto
Bootcamp.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    cue: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true,
        //Con 5 y 10 no se podían agregar los bootcamps de ejemplo
        min: 10,
        max: 20,
      },
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "bootcamps",
    modelName: "Bootcamp",
  }
);

module.exports = Bootcamp;
