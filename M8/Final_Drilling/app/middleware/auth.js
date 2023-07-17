const jwt = require("jsonwebtoken");
const { SECRET } = require("../config/auth.config");
const { HTTPError } = require("../utils/errors");
const db = require("../models");
const User = db.users;

async function auth(req, res, next) {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new HTTPError(401, "Sin autorización");
    }

    const token = authorization.substring(7);
    const decodedToken = jwt.verify(token, SECRET);
    if (!decodedToken) {
      throw new HTTPError(401, "Token no autorizado");
    }

    const authenticatedUser = await User.findByPk(decodedToken.id);
    if (!authenticatedUser) {
      throw new HTTPError(404, "Usuario no registrado");
    }

    return next();
  } catch (error) {
    next(error);
  }
}

module.exports = auth;
