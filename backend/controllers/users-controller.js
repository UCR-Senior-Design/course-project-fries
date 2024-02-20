const jwt = require("jsonwebtoken");
const User = require("../models/users");

const bcrypt = require("bcrypt");

// Create json web token
const createToken = (id, firstname, lastname, isDoctor) => {
  return jwt.sign({ id: id, firstname: firstname, lastname: lastname, isDoctor: isDoctor }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

exports.register = async (req, res) => {
  try {
    const { email, firstname, lastname, role, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({ message: "Users already exists" });
    }

    // Check user's role
    let isDoctor = false;

    if (role === "patient") {
      isDoctor = false;
    } else if (role === "doctor") {
      isDoctor = true;
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Create a new user
    const user = new User({ email, firstname, lastname, isDoctor, password });
    await user.save();

    res.status(201).json({ message: "Users created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ message: "Not found the user" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createToken(user._id, user.firstname, user.lastname, user.isDoctor);
    console.log(token);
    res.json({ message: "Login successful", token: token, user: user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

exports.logout = (req, res) => {
  // Logout logic
  localStorage.removeItem("token");
  res.json({ message: "Logout successful" });
};
