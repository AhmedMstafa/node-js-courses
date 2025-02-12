const asyncWrapper = require('../middlewares/asyncWrapper');
const User = require('../models/user.model');
const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/generateJWT');
const getAllUsers = asyncWrapper(async (req, res) => {
  // git all users from user model

  const query = req.query;
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;
  const users = await User.find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);
  res.json({ status: httpStatusText.SUCCESS, data: { users } });
});

const register = asyncWrapper(async (req, res, next) => {
  const { firsName, lastName, email, password, role } = req.body;

  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    const error = appError.create(
      'user already exists',
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const hashedPasswrod = await bcrypt.hash(password, 10);
  const newUser = new User({
    firsName,
    lastName,
    email,
    password: hashedPasswrod,
    role,
    avatar: req.file.filename,
  });

  // generate jwt token
  const t = await generateJWT({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });
  newUser.tokrn = t;

  console.log('token', t);
  await newUser.save();

  res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { user: newUser } });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email && !password) {
    const error = appError.create(
      'email and password are required',
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    const error = appError.create(
      'user not found exists',
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const matchedPassword = await bcrypt.compare(password, user.password);

  if (user && matchedPassword) {
    // logged in successfully
    const token = await generateJWT({
      email: user.email,
      id: user._id,
      role: user.role,
    });
    return res.json({
      status: httpStatusText.SUCCESS,
      data: { user: { token } },
    });
  }

  const error = appError.create('something wrong', 500, httpStatusText.ERROR);
  return next(error);
});

module.exports = {
  getAllUsers,
  register,
  login,
};
