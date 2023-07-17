const { Router } = require("express");
const { auth } = require("../middleware");
const {
  createBootcamp,
  findAll,
  addUser,
  findById,
} = require("../controllers/bootcamp.controller");

const router = Router();

router.get("/bootcamp", findAll);
router.get("/bootcamp/:id", auth, findById);
router.post("/bootcamp/addUser", auth, addUser);
router.post("/bootcamp", auth, createBootcamp);

module.exports = router;
