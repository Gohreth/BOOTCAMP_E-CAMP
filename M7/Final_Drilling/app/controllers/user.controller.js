const User = require("../models/user.model");

async function createUser(body) {
  try {
    const user = await User.create(body);
    console.log(
      `>> Se ha creado el usuario: ${JSON.stringify(user.dataValues, null, 2)}`
    );
    return user;
  } catch (error) {
    throw error;
  }
}

async function findUserById(id) {
  try {
    const user = await User.findByPk(id, {
      include: {
        association: "bootcamps",
        through: {
          attributes: [],
        },
      },
    });
    console.log(
      `>> Se ha creado el usuario con id=${id}: ${JSON.stringify(
        user.dataValues,
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
    const users = await User.findAll({
      include: {
        association: "bootcamps",
        through: {
          attributes: [],
        },
      },
    });
    console.log(`>> Se ha encontrado los siguientes usuarios: [`);
    for (const user of users) {
      console.log(`${JSON.stringify(user.dataValues, null, 2)},`);
    }
    console.log(`]`);
  } catch (error) {
    throw error;
  }
}

async function updateUserById(id, body) {
  try {
    const [_, [user]] = await User.update(body, {
      where: { id },
      returning: true,
    });
    console.log(
      `>> Se ha actualizado el usuario con id=${id}: ${JSON.stringify(
        user.dataValues,
        null,
        2
      )}`
    );
  } catch (error) {
    throw error;
  }
}

async function deleteUserById(id) {
  try {
    await User.destroy({ where: { id }, returning: true });
    console.log(`>> Se ha eliminado el usuario con id=${id}`);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  findUserById,
  findAll,
  updateUserById,
  deleteUserById,
};
