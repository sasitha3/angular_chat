var express = require('express');
var router  = express.Router();
var Class   = require('../controllers/class.controller');

router.route('/')
    .get(Class.GetAllClasses)
    .post(Class.CreateClass)
    .put(Class.UpdateClass);

router.route('/:roomid')
    .get(Class.GetClassByRoomId);

router.route('/teacherClasses')
    .post(Class.GetTeacherClasses);

router.route('/teacherTodayClasses')
    .post(Class.GetTeacherTodayClasses);

router.route('/teacherPreviousClasses')
    .post(Class.GetTeacherPreviousClasses);

router.route('/teacherComingClasses')
    .post(Class.GetTeacherComingClasses);

router.route('/studentClasses')
    .post(Class.GetStudentClasses);

router.route('/addStudent')
    .put(Class.AddStudents);

router.route('/getTeacherRoomId')
    .post(Class.GetTeacherRoomId);

router.route('/getStudentCurrentRoom')
    .post(Class.GetStudentCurrentClass);

module.exports = router;
