const UsersController = require('../models/Users');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  try {
    const {email, password} = req.body;

    const user = await UsersController.findOne({email: email});

    if (!user) {
      return res.status(401).json({message: 'Authentication failed'});
    }

    try {
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          throw err;
        }

        if (isMatch) {
          res.json({message: 'Login successful', token: 'your_token_here'});
        } else {
          res.status(401).json({message: 'Authentication failed'});
        }
      });
    } catch (error) {
      console.log("bcrypt error");
    }
  } catch (error) {
    res.status(500).json({message: 'Internal server error'});
  }
};

exports.logout = (req, res) => {
  // Logout logic
  res.json({message: 'Logout successful'});
};

exports.register = async (req, res) => {
  try {
    const {email, username, password} = req.body;

    // Check if user already exists
    const existingUser = await UsersController.findOne({email: email});
    if (existingUser) {
      return res.status(400).json({message: 'Users already exists'});
    }

    // Create a new user
    const user = new UsersController({email, username, password});
    await user.save();

    res.status(201).json({message: 'Users created successfully'});
  } catch (error) {
    res.status(500).json({message: 'Internal server error'});
  }
};
