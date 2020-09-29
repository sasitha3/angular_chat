var express = require('express');
var router = express.Router();

var Jitsi = require('../controllers/jitsi.controller');

router.route('/')
    .post(Jitsi.JWTCraete);

module.exports = router;
