var jwt = require('jsonwebtoken');
// var config = require('../constant/config');
var statusCode = require('../constant/status_codes');
var respones = require('../constant/responses');

// Pass the path to your zuliprc file here.
var User = require('../models/user.model');

/**
 * POST
 * Register user
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function CreateUsers(req, res, next) {

  res.json(
    respones.success(statusCode.CREATED, 'Token created', '', 'Success')
  );
}

/**
 * POST
 * Login user
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function Login(req, res, next) {
  
  res.json(
    respones.success(statusCode.CREATED, 'Token created', 'Logged in', 'Success')
  );
}

module.exports = {
  CreateUsers,
  Login
};
