var express = require('express');
var router  = express.Router();
var Class   = require('../controllers/user.controller');

router.route('/')
    .get(Class.GetAllClasses)
    .post(Class.CreateClass)
    .put(Class.UpdateClass);

module.exports = router;
