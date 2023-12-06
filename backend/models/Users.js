const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true, match: /.+@.+\..+/},
  username: {type: String, required: true, },
  password: {type: String, required: true, minlength: 6, },
});

userSchema.pre(method = 'save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model('User', userSchema);
