const { Router } = require("express");
const {
  createUser,
  signInUser,
  findAll,
  findUserById,
  updateUserById,
  deleteUserById,
} = require("../controllers/user.controller");
const { auth, verifySignUp } = require("../middleware");

const router = Router();

router.post("/signup", verifySignUp, createUser);
router.post("/signin", signInUser);
router.get("/user", auth, findAll);
router.get("/user/:id", auth, findUserById);
router.put("/user/:id", auth, updateUserById);
router.delete("/user/:id", auth, deleteUserById);

module.exports = router;
