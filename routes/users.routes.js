const express = require('express');
const multer = require('multer');

const router = express.Router();

const verifyToken = require('../middlewares/verfiyToken.js');

const userController = require('../controller/users.controller');
const appError = require('../utils/appError.js');

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('FILE', file);
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    const fileName = `user-${Date.now()}.${ext}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split('/')[0];
  if (imageType === 'image') {
    cb(null, 'true');
  } else {
    return cb(appError.create('file must be an image', 400), false);
  }
};

const upload = multer({ storage: diskStorage, fileFilter });

router.route('/').get(verifyToken, userController.getAllUsers);

router
  .route('/register')
  .post(upload.single('avatar'), userController.register);

router.route('/login').post(userController.login);

module.exports = router;
