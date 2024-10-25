const User = require("../models/User");

// CRUD operation create , update , read , delete users
// only admin can update and delete users

// get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ "number of users": users.length, users });
  } catch (error) {
    res.status(500).send(err);
  }
};

// update user by id    /:id   (Admin only can update)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

// delete user by id    /:id     (Admin only can delete)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted success" });
  } catch (error) {
    res.status(500).send(error);
  }
};
