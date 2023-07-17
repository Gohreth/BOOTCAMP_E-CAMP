const db = require("../models");
const { HTTPError } = require("../utils/errors");
const User = db.users;
const Bootcamp = db.bootcamps;

// Crear y guardar un nuevo bootcamp
exports.createBootcamp = async (req, res, next) => {
  try {
    //Obtener cuerpo
    const { title, cue, description } = req.body;
    if (!title || !cue || !description) {
      throw new HTTPError(400, "Campos requeridos y no vacíos");
    }

    const bootcamp = await Bootcamp.create({
      title,
      cue,
      description,
    });

    return res.status(201).send(bootcamp);
  } catch (err) {
    next(err);
  }
};

// Agregar un Usuario al Bootcamp
exports.addUser = async (req, res, next) => {
  try {
    //Obtener cuerpo
    const { bootcampId, userId } = req.body;

    if (!bootcampId || !userId) {
      throw new HTTPError(400, "Campos requeridos y no vacíos");
    }

    const bootcamp = await Bootcamp.findByPk(bootcampId);

    if (!bootcamp) {
      throw new HTTPError(404, "Bootcamp no existe");
    }
    const user = await User.findByPk(userId);

    if (!user) {
      throw new HTTPError(404, "Usuario no existe");
    }
    bootcamp.addUser(user);
    return res
      .status(201)
      .send(
        `Agregado el usuario id=${user.id} al bootcamp con id=${bootcamp.id}`
      );
  } catch (err) {
    next(err);
  }
};

// obtener los bootcamp por id
exports.findById = async (req, res, next) => {
  try {
    //Obtener parametro
    const { id } = req.params;

    const bootcamp = await Bootcamp.findByPk(id, {
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "firstName", "lastName"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    return res.status(200).send(bootcamp);
  } catch (err) {
    next(err);
  }
};

// obtener todos los Usuarios incluyendo los Bootcamp
exports.findAll = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.findAll({
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "firstName", "lastName"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    return res.status(200).send(bootcamps);
  } catch (err) {
    next(err);
  }
};
