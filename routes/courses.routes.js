const express = require('express');

const courseController = require('../controller/courses.controller');
const { validationSchema } = require('../middlewares/validationSchema');
const verifyToken = require('../middlewares/verfiyToken.js');
const userRoles = require('../utils/userRoles.js');
const allowdTo = require('../middlewares/allowdTo.js');
const router = express.Router();

router
  .route('/:id')
  .get(
    verifyToken,
    allowdTo(userRoles.ADMIN, userRoles.MANGER, userRoles.USER),
    courseController.getCourse
  )
  .delete(
    verifyToken,
    allowdTo(userRoles.ADMIN, userRoles.MANGER),
    courseController.deleteCourse
  )
  .patch(
    verifyToken,
    allowdTo(userRoles.ADMIN, userRoles.MANGER, userRoles.USER),
    courseController.updateCourse
  );

router
  .route('/')
  .get(verifyToken, allowdTo(userRoles.MANGER), courseController.getAllCourses)
  .post(
    verifyToken,
    allowdTo(userRoles.ADMIN, userRoles.MANGER),
    validationSchema(),
    courseController.addCourse
  );

module.exports = router;
