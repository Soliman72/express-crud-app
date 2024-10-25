const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (role) {
      user = new User({ name, email, password, role });
      await user.save();
    } else {
      user = new User({ name, email, password });
      await user.save();
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    user.password = undefined;
    res.status(201).json({
      status: "success",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    throw error;
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    user.password = undefined;
    res.status(200).json({
      status: "success",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    throw error;
  }
};
