const mongoose = require('mongoose');
const validator = require('validator');
const userRoles = require('../utils/userRoles');
const userSchema = new mongoose.Schema({
  firsName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'filed must be a valid email address'],
  },
  password: {
    type: String,
    required: true,
  },
  tokrn: {
    type: String,
  },
  role: {
    type: String,
    enum: [userRoles.USER, userRoles.ADMIN, userRoles.MANGER],
    default: userRoles.USER,
  },
  avatar: {
    type: String,
    default: 'uploads/profile.png',
  },
});

module.exports = mongoose.model('User', userSchema);
