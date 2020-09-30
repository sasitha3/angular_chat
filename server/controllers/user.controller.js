var jwt = require('jsonwebtoken');
var config = require('../constant/config');
var statusCode = require('../constant/status_codes');
var respones = require('../constant/responses');
var pwd = require('../constant/password');
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

  try {

    var user = new User();

    user.userName = req.body.UserName;
    user.name = req.body.Name;
    user.password = pwd.encrypt(req.body.Password);
    
    User.findOne({ 'userName': req.body.UserName }).exec(function (err, users) {

      if (err) {

        res.json(respones.failure(statusCode.METHOD_FAILURE, err, 'server_error', "#UNR000"));
      } else {

        if (users !== null) {

          res.json(respones.failure(statusCode.METHOD_FAILURE, "Looks like you’ve already registered that username.", 'user_already_exist', "#UNR001"));
        } else {

          user.save(function (err) {

            if (err) {
              console.log(err);
              res.json(respones.failure(statusCode.METHOD_FAILURE, err, "server_error", "#UNR002"));
            } else {

              /* Set token */
              const payload = {
                userId: user._id,
                type: "User",
              };
              var chatToken = jwt.sign(payload, config.secret, {
                // expiresIn: 60
              });
              res.json(respones.success(statusCode.OK, 'success', 'Registered successfully', {
                id: user.id, 
                token: chatToken,
                username: user.UserName,
                name: user.name,
              }));
              
            }
          });
        }
      }
    });
  } catch (error) {

    res.json(respones.failure(statusCode.METHOD_FAILURE, error, 'execution fail', "#UNR004"));
  }
}

/**
 * POST
 * Login user
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function Login(req, res, next) {
  
  try {
    
    User.findOne({ 'userName': req.body.UserName }).exec(function (err, user) {
      if (err) {

        res.json(respones.failure(statusCode.SERVICE_UNAVAILABLE, "Server error. Please try again in a bit.", "server_error", "#UL001"));
      } else {

        if (user !== null) {
          // console.log(user);
          // console.log(pwd.decrypt(user.password));
          if ( pwd.decrypt(user.password) === req.body.Password ) {
           
            const payload = {
              userId: user._id,
              type: "User"
            };
            var chatToken = jwt.sign(payload, config.secret, {

            });

            res.json(respones.success(statusCode.OK, 'success', 'Login successfully', { 
              id: user.id, 
              token: chatToken,
              username: user.UserName,
              name: user.name,
            }));
          } else {

            res.json(respones.failure(statusCode.NON_AUTHORITATIVE_INFORMATION, 'Looks like your password is incorrect!', 'wrong_password', "#UL003"));
          }
        } else {

          res.json(respones.failure(statusCode.NOT_FOUND, 'Hey! Your username is not valid.', 'invalid_username', "#UL004"));
        }
      }
    });
  } catch (error) {

    res.json(respones.failure(statusCode.METHOD_FAILURE, error, 'execution fail', "#UL005"));
  }
}

module.exports = {
  CreateUsers,
  Login
};
