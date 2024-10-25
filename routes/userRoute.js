const express = require("express");
const userController = require("./../controller/userController");
const { authenticateUser, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", userController.getAllUsers);
router.put("/:id", isAdmin, userController.updateUser);
router.delete("/:id", isAdmin, userController.deleteUser);

module.exports = router;
