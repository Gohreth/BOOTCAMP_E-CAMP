const sequelize = require("./app/models");
const User = require("./app/models/user.model");
const Bootcamp = require("./app/models/bootcamp.model");
const {
  createUser,
  findUserById,
  findAll: findAllUsers,
  deleteUserById,
  updateUserById,
} = require("./app/controllers/user.controller");
const {
  createBootcamp,
  addUser,
  findAll: findAllBootcamps,
  findById,
} = require("./app/controllers/bootcamp.controller");
const { USERS, BOOTCAMPS, BOOTCAMP_USERS } = require("./data");

(async function () {
  try {
    // Asociación entre los modelos
    User.associate({ Bootcamp });
    Bootcamp.associate({ User });

    //Elimina las tablas y las crea nuevamente
    await sequelize.drop();
    await sequelize.sync();

    console.log("Conectado a la base de datos");

    //Map para almacenar `firstName lastName` de usuarios con sus ids
    const usersMap = new Map();

    //Map para almacenar `title` de bootcamps con sus ids
    const bootcampsMap = new Map();

    // Creación de usuarios
    for (const user of USERS) {
      const u = await createUser(user);
      usersMap.set(`${u.firstName} ${u.lastName}`, u.id);
    }

    //Creación de bootcamps
    for (const bootcamp of BOOTCAMPS) {
      const b = await createBootcamp(bootcamp);
      bootcampsMap.set(b.title, b.id);
    }

    //Asociación de usuarios con bootcamps
    for (const bootcamp of BOOTCAMPS) {
      const bootcampId = bootcampsMap.get(bootcamp.title);
      for (const user of BOOTCAMP_USERS[bootcamp.title]) {
        const userId = usersMap.get(user);
        await addUser(bootcampId, userId);
      }
    }

    // Consultando el Bootcamp por id, incluyendo los usuarios.
    await findById(2);

    // Listar todos los Bootcamp con sus usuarios.
    await findAllBootcamps(); //Bootcamps findAll

    // Consultar un usuario por id, incluyendo los Bootcamp.
    await findUserById(1);

    // Listar los usuarios con sus Bootcamp.
    await findAllUsers(); //Users findAll

    // Actualizar el usuario según su id; por ejemplo: actualizar el usuario con id=1 por Pedro
    await updateUserById(1, { firstName: "Pedro", lastName: "Sánchez" });

    // Eliminar un usuario por id; por ejemplo: el usuario con id=1.
    await deleteUserById(1);
  } catch (error) {
    console.log(error.message);
  }
})();

//Desconectar de la base de datos cuando el proceso finalice
process.on("exit", async () => {
  try {
    await sequelize.close();
    console.log("Desconectado de la base de datos");
  } catch (error) {
    console.log("Error desconectando de la base de datos: ", error.message);
  }
});
