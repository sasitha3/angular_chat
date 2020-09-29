var jwt = require('jsonwebtoken');
// var config = require('../constant/config');
var statusCode = require('../constant/status_codes');
var respones = require('../constant/responses');
var ClassRoom = require('../models/class.model');
const e = require('express');

/**
 * POST
 * Register class
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function CreateClass(req, res, next) {

  var classes       = new ClassRoom();
  classes.grade     = req.body.grade;
  classes.subject   = req.body.subject;
  classes.amount    = req.body.amount;
  classes.startTime = req.body.startTime;
  classes.endTime   = req.body.endTime;
  classes.date      = req.body.date;
  classes.userName  = req.body.userName;
  classes.roomId    = req.body.roomId;
  classes.userId    = req.body.userId;
  var currentDate   = req.body.date;
  var newDate       = currentDate.split('T');  
  currentDate       = newDate[0];   
  var tomorrow      = new Date(currentDate);
  var errorMessage  = 'fail to create room';
  tomorrow.setDate(tomorrow.getDate() + 1);
  ClassRoom.find({
            date     : { $gte: currentDate, $lt: tomorrow }, 
            userName : {$eq: req.body.userName} }, 
  function(err, getclass){
              
    if(!err){

      var createStatus = false;
      if (getclass.length == 0) {

        createStatus = true;
      } else {

        for (let index = 0; index < getclass.length; index++) {
          
          if(!(getclass[index].startTime <= req.body.startTime && getclass[index].endTime >= req.body.startTime))  {

            if(!(getclass[index].startTime <= req.body.endTime && getclass[index].endTime >= req.body.endTime))  {
      
              if((req.body.startTime < getclass[index].startTime && req.body.endTime < getclass[index].startTime) ||
                  req.body.startTime > getclass[index].endTime){

                  createStatus = true;
              } else {
                
                errorMessage = 'Class already exist';
                createStatus = false;
                break;
              }
            } else {

              errorMessage = 'Class already exist';  
              createStatus = false;
              break;
            }
          } else {

            errorMessage = 'Class already exist';   
            createStatus = false;
            break;
          } 
        }
       
      }
      if(createStatus){

        classes.save(function (err, classes) {

          if (err) {

            if(err.code == 11000){
      
              res.json(respones.failure(statusCode.EXPECTATION_FAILED, err, 'Class room has been already created', "#PR001"));
            } else {
              
              res.json(respones.failure(statusCode.EXPECTATION_FAILED, err, 'fail to create room', "#PR002"));
            }
          } else {
            res.json(
              respones.success(statusCode.CREATED, 'Class created', '', classes)
            );
          }
        }
        );
     } else {
       
      res.json(respones.failure(statusCode.EXPECTATION_FAILED, '', errorMessage, "#PR003"));
     }
      
    } else {

      res.json(
        respones.failure(statusCode.EXPECTATION_FAILED, err, 'No able to create a class. Please check you online class time table', "#PR004")
      );
    }
  });
  
}

/**
 * Get
 * get All classes
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function GetAllClasses(req, res, next) {

  ClassRoom.find({userName: req.body.userName}, function(err, classes){

    if(!err){

      res.json(
        respones.success(statusCode.CREATED, 'Token created', '', classes)
      );
    } else {

      res.json(
        respones.failure(statusCode.EXPECTATION_FAILED, err, 'failt to get room', "#PR009")
      );
    }
  });
  
}

function GetTeacherClasses(req, res, next) {

  ClassRoom.find({userId: req.body.userId}, function(err, classes){

    if(!err){

      res.json(
        respones.success(statusCode.CREATED, '', '', classes)
      );
    } else {
      console.log(err);
      res.json(
        respones.failure(statusCode.EXPECTATION_FAILED, err, 'failt to get room', "#PR009")
      );
    }
  });
}

//edit this with aggregration 
function GetStudentClasses(req, res, next) {

  var currentDate = req.body.date;
  var endTime     = req.body.time;
  var grade       = req.body.grade;
  var type        = req.body.type;
  var newDate     = currentDate.split('T');  
  currentDate     = newDate[0]; 
  var tomorrow = new Date(currentDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if(type == 1){

    ClassRoom.find({date: { $gt: currentDate, $lt: tomorrow }, endTime: { $gt: endTime}, "grade.id": grade }, function(err, classes){

      if(!err){
  
        res.json(
          respones.success(statusCode.CREATED, '', 'Success', classes)
        );
      } else {
  
        res.json(
          respones.failure(statusCode.EXPECTATION_FAILED, err, 'failt to get room', "#PR009")
        );
      }
    });
  } else {
    
    ClassRoom.find({date: { $gte: tomorrow }, "grade.id": grade  }, function(err2, classesNext){
  
      if(!err2){

        res.json(
          respones.success(statusCode.CREATED, '', 'Success', classesNext)
        );
      } else {

        res.json(
          respones.failure(statusCode.EXPECTATION_FAILED, err2, 'failt to get next class rooms', "#PR009")
        );
      }
    });
  }
  
}

function GetClassByRoomId(req, res, next) {

  ClassRoom.findOne({roomId: req.params.roomid}, function(err, classes){

    if(!err){

      res.json(
        respones.success(statusCode.CREATED, 'Room Details', '', classes)
      );
    } else {

      res.json(
        respones.failure(statusCode.EXPECTATION_FAILED, err, 'failt to get room', "#PR009")
      );
    }
  });
}

function AddStudents(req, res, next){

  ClassRoom.update({ 'roomId': req.body.roomId }, { $addToSet: { students: req.body.studentId } }, function (err) {

    if (err) {

      res.json(respones.failure(statusCode.NOT_ACCEPTABLE, err, 'fail', "#PFV001"));
    } else {

      res.json(respones.success(statusCode.OK, 'success', "You attended on lecture", "lecture attendance"));
    }
  });
}

function GetTeacherRoomId(req, res, next) {

  var currentDate = req.body.date;
  var endTime     = req.body.time;
  var userName    = req.body.userName;
  var newDate     = currentDate.split('T');  
  currentDate     = newDate[0];   
  var tomorrow    = new Date(currentDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  ClassRoom.findOne({date: { $gte: currentDate, $lt: tomorrow }, endTime: { $gt: endTime}, userName: {$eq: userName} }, function(err, classes){

    if(!err){
      res.json(
        respones.success(statusCode.CREATED, '', '', classes)
      );
    } else {
      res.json(
        respones.failure(statusCode.EXPECTATION_FAILED, err, 'failt to get room', "#PR009")
      );
    }
  });
}

function GetStudentCurrentClass(req, res, next) {

  var currentDate = req.body.date;
  var endTime     = req.body.time;
  var userId      = req.body.userId;
  var newDate     = currentDate.split('T');  
  currentDate     = newDate[0];  
  console.log(currentDate);
  var tomorrow = new Date(currentDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  ClassRoom.findOne({date: { $gt: currentDate, $lt: tomorrow }, endTime: { $gt: endTime}, students: userId }, function(err, classes){
    try{
        
      if(!err){

        res.json(
          respones.success(statusCode.CREATED, '', '', classes.roomId)
        );
      } else {

        res.json(
          respones.failure(statusCode.EXPECTATION_FAILED, err, 'failt to get room', "#PR009")
        );
      }
  } catch {

    res.json(
      respones.failure(statusCode.EXPECTATION_FAILED, err, 'No class found', "#PR009")
    );
  }
  });
}

function GetTeacherComingClasses(req, res, next) {

  var currentDate = req.body.date;
  var userId      = req.body.userId;
  var newDate     = currentDate.split('T');  
  currentDate     = newDate[0]; 
  var tomorrow    = new Date(currentDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  ClassRoom.find({date: { $gt: tomorrow } , userId: userId}, function(err2, classesNext){

    if(!err2){

      res.json(
        respones.success(statusCode.CREATED, '', '', classesNext)
      );
    } else {

      res.json(
        respones.failure(statusCode.EXPECTATION_FAILED, err2, 'failt to get next class rooms', "#PR009")
      );
    }
  });
    
}

function GetTeacherTodayClasses(req, res, next) {

  var currentDate = req.body.date;
  var endTime     = req.body.time;
  var userId      = req.body.userId;
  var newDate     = currentDate.split('T');  
  currentDate     = newDate[0];   
  var tomorrow    = new Date(currentDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  ClassRoom.find({date: { $gt: currentDate, $lt: tomorrow }, endTime: { $gt: endTime} , userId: userId }, function(err, classes){

    if(!err){

      res.json(
        respones.success(statusCode.CREATED, '', '', classes)
      );
    } else {

      res.json(
        respones.failure(statusCode.EXPECTATION_FAILED, err, 'failt to get room', "#PR009")
      );
    }
  });
}

function GetTeacherPreviousClasses(req, res, next) {

  var currentDate = req.body.date;
  var startTime     = req.body.time;
  var userId      = req.body.userId;
  var newDate     = currentDate.split('T');  
  currentDate     = newDate[0]; 
  var tomorrow = new Date(currentDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
//   ClassRoom.aggregate([
//     {
//       $project: {
//          "_id": 1,
//          "userId": 1,
//          "startTime": 1,
//         }
//      }
//   ]).exec(function (err, classes) {

//       console.log('###');
//       console.log(err);
//   })
  ClassRoom.find({date: { $gt: currentDate, $lt: tomorrow }, startTime: { $lt: startTime} , userId: userId}).limit(2)
  .exec(function(err, classes){

    if(!err){

      ClassRoom.find({date: { $lt: currentDate } }, function(err2, classesNext){

        if(!err2){

          var allClasses = classes.concat(classesNext);
          res.json(
            respones.success(statusCode.CREATED, '', '', allClasses)
          );
        } else {

          res.json(
            respones.failure(statusCode.EXPECTATION_FAILED, err2, 'failt to get next class rooms', "#PR009")
          );
        }
      });
    } else {

      res.json(
        respones.failure(statusCode.EXPECTATION_FAILED, err, 'failt to get room', "#PR009")
      );
    }
  });
}

function UpdateClass(req, res, next){

  console.log('####');
  
  var currentDate   = req.body.date;
  var newDate       = currentDate.split('T');  
  currentDate       = newDate[0];   
  var tomorrow      = new Date(currentDate);
  var errorMessage  = 'fail to create room';
  tomorrow.setDate(tomorrow.getDate() + 1);
  ClassRoom.find({
    date   : { $gte: currentDate, $lt: tomorrow }, 
    userId : { $eq: req.body.userId },
    roomId : { $ne: req.body.roomId } }, 
  function(err, getclass){
        
    if(!err){

      var createStatus = false;
      if (getclass.length == 0) {

        createStatus = true;
      } else {
        console.log('#########1');
        
        for (let index = 0; index < getclass.length; index++) {
          
          if(!(getclass[index].startTime <= req.body.startTime && getclass[index].endTime >= req.body.startTime))  {

            if(!(getclass[index].startTime <= req.body.endTime && getclass[index].endTime >= req.body.endTime))  {

              if((req.body.startTime < getclass[index].startTime && req.body.endTime < getclass[index].startTime) ||
                  req.body.startTime > getclass[index].endTime){

                  createStatus = true;
              } else {
                
                errorMessage = 'Class already exist';
                createStatus = false;
                break;
              }
            } else {

              errorMessage = 'Class already exist';  
              createStatus = false;
              break;
            }
          } else {

            errorMessage = 'Class already exist';   
            createStatus = false;
            break;
          } 
        }

      }
      if(createStatus){

        ClassRoom.update({ 'roomId' : req.body.roomId }, { $set: { 
          subject   : req.body.subject, 
          grade     : req.body.grade, 
          startTime : req.body.startTime, 
          endTime   : req.body.endTime, 
          amount    : req.body.amount,
          date      : req.body.date,
          roomId    : req.body.newRoomId
        } }, function (err) {

            if (err) {

              res.json(respones.failure(statusCode.NOT_ACCEPTABLE, err, 'fail', "#PFV001"));
            } else {  

              res.json(respones.success(statusCode.OK, "success", "Edited the class details", "class edit"));
            }
        });
      } else {

      res.json(respones.failure(statusCode.EXPECTATION_FAILED, '', errorMessage, "#PR003"));
      }

    } else {

      res.json(
      respones.failure(statusCode.EXPECTATION_FAILED, err, 'No able to update a class. Please check you online class time table', "#PR004")
      );
    }
  });
}

module.exports = {
  CreateClass,
  GetAllClasses,
  GetTeacherClasses,
  GetStudentClasses,
  GetClassByRoomId,
  AddStudents,
  GetTeacherRoomId,
  GetStudentCurrentClass,
  GetTeacherComingClasses,
  GetTeacherTodayClasses,
  GetTeacherPreviousClasses,
  UpdateClass
};
