var express = require('express');
var router  = express.Router();
var User    = require('../controllers/user.controller');

router.route('/')
    .post(User.CreateUsers);

router.route('/login')
    .post(User.Login);

module.exports = router;
