var jwt = require('jsonwebtoken');
// var config = require('../constant/config');
var statusCode = require('../constant/status_codes');
var respones = require('../constant/responses');

// Pass the path to your zuliprc file here.
var Jitsi = require('../models/jitsi.model');
const { response } = require('../app');

/**
 * POST
 * Register partner
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function JWTCraete(req, res, next) {

  var token = jwt.sign({
    "context": {
      "user": {
        "avatar" : req.body.Avatar,
        "name"   : req.body.Name,
        "email"  : req.body.Email
        }
      },
      "aud"  : "meet.idesk.lk",
      "iss"  : "meet-idesk-app-id",
      "sub"  : "meet.idesk.lk",
      "room" : req.body.Room
    }, 
    'meet-idesk-token-secret'
  );
  res.json(
  respones.success(statusCode.CREATED, 'Token created', '', token)
  );
}

module.exports = {
  JWTCraete
};
