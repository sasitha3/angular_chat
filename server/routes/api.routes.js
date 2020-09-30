var express   = require('express');
var router    = express.Router();
const user    = require('./user.route');
const message = require('./message.route');

router.use('/user', user);
router.use('/messages', message);

module.exports = router;
