const Bootcamp = require("../models/bootcamp.model");
const User = require("../models/user.model");

async function createBootcamp(body) {
  try {
    const bootcamp = await Bootcamp.create(body);
    console.log(
      `>> Se ha creado el usuario: ${JSON.stringify(
        bootcamp.dataValues,
        null,
        2
      )}`
    );
    return bootcamp;
  } catch (error) {
    throw error;
  }
}

async function addUser(bootcampId, userId) {
  try {
    //Obtenemos los ids correspondientes y deshabilitamos el logging
    const user = await User.findByPk(userId, { logging: false });
    const bootcamp = await Bootcamp.findByPk(bootcampId, { logging: false });
    await bootcamp.addUser(user, { logging: false });
    console.log(
      `\n***************************
Agregado el usuario id=${userId} al bootcamp con id=${bootcampId}
***************************\n`
    );
  } catch (error) {
    throw error;
  }
}

async function findById(id) {
  try {
    const bootcamp = await Bootcamp.findByPk(id, {
      include: {
        association: "users",
        through: {
          attributes: [],
        },
      },
    });

    console.log(
      `>> Se ha encontrado el bootcamp con id=${id}: ${JSON.stringify(
        bootcamp.dataValues,
        null,
        2
      )}`
    );
  } catch (error) {
    throw error;
  }
}

async function findAll() {
  try {
    const bootcamps = await Bootcamp.findAll({
      include: {
        association: "users",
        through: {
          attributes: [],
        },
      },
    });

    console.log(`>> Se ha encontrado los siguientes bootcamps: [`);
    for (const bootcamp of bootcamps) {
      console.log(`${JSON.stringify(bootcamp.dataValues, null, 2)}`);
    }
    console.log(`]`);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createBootcamp,
  addUser,
  findById,
  findAll,
};
