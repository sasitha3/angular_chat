var express = require('express');
var router  = express.Router();
var Class   = require('../controllers/message.controller');

router.route('/')
    .get(Class.GetAllClasses)
    .post(Class.CreateClass);


module.exports = router;
