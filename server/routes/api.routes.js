var express   = require('express');
var router    = express.Router();
const jitsi   = require('./jitsi.route');
const classes = require('./class.route');

router.use('/jitsi', jitsi);
router.use('/class', classes);

module.exports = router;
