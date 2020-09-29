import { Injectable }  from '@angular/core';
import { HttpClient }  from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User,
         Class }       from '../_modal';
import { Common }      from '../_properties';

@Injectable({ providedIn: 'root' })
export class JitsiService {

    // public roomId : string;
    constructor(
                private http   : HttpClient,
                public  common : Common
               ) { }

    getToken(jitsi: User, roomid) {
        if(jitsi.image == null){
            jitsi.image = 'https://i.ibb.co/ZTBLVvm/Logo.png';
        }
        console.log(roomid);
        
        var reqBody = {
            "Name"  : jitsi.first_name, 
            "Email" : jitsi.email,
            "Avatar": jitsi.image,
            "Room"  : roomid
        }
        return this.http.post(`${environment.jitsibackend}/jitsi/`, reqBody);
    }


    updateClass(userId, 
        roomId, 
        grade, 
        subject, 
        startTime, 
        endTime, 
        amount, 
        date) {

        const newDate    = new Date(date);
        var timeArr      = startTime.split(':');
        const timeChange = timeArr[0] + timeArr[1];
        const roomDate   = newDate.getUTCFullYear() + '-' + newDate.getMonth() + '-' + (newDate.getDate())
        const newRoomId  = userId + grade.id + subject.id + roomDate + timeChange;

        var classes = {

            roomId    : roomId,
            newRoomId : newRoomId,
            subject   : subject,
            grade     : grade,
            startTime : startTime,
            endTime   : endTime,
            amount    : amount,
            date      : date,
            userId    : userId
        }
        
        return this.http.put(`${environment.jitsibackend}/class/`, classes);
    }

    saveMeeting(classes: Class, user, subObj, gradeObj) {
        
        console.log(classes.subject);
        classes.userName = user.username; 
        classes.userId   = user.id; 
        classes.date     = new Date();
        classes.subject  = subObj;
        classes.grade    = gradeObj;
        var timeArr      = classes.startTime.split(':');
        const timeChange = timeArr[0] + timeArr[1];
        const roomDate   = classes.date.getUTCFullYear() + '-' + classes.date.getMonth() + '-' + (classes.date.getDate())
        classes.roomId   = user.id + classes.grade['id'] + classes.subject['id'] + roomDate + timeChange; // unique-id
        return this.http.post(`${environment.jitsibackend}/class/`, classes);
    }

    saveScheduleMeeting(classes: Class, user, subObj, gradeObj){

        classes.userName = user.username; 
        classes.userId   = user.id; 
        classes.subject  = subObj;
        classes.grade    = gradeObj;
        var timeArr      = classes.startTime.split(':');
        const timeChange = timeArr[0] + timeArr[1];
        const roomDate   = classes.date.getUTCFullYear() + '-' + (classes.date.getMonth() + 1) + '-' + (classes.date.getDate());
        classes.date     = new Date(roomDate);
        classes.roomId   = user.id + classes.grade['id'] + classes.subject['id'] + roomDate + timeChange; // unique-id
        
        return this.http.post(`${environment.jitsibackend}/class/`, classes);
    }

    getTeacherClasses(userId){

        var reqBody = { 'userId': userId}
        return this.http.post(`${environment.jitsibackend}/class/teacherClasses`, reqBody);
    }

    getTeacherTodayClasses(userId){

        var date      = new Date();
        var minutes = this.common.setHoursNMiniutes(date.getMinutes());
        var hours   = this.common.setHoursNMiniutes(date.getHours());

        var endTime = hours + ':' + minutes;
        var reqBody = { 'date': date, 'time':endTime, 'userId': userId}
        return this.http.post(`${environment.jitsibackend}/class/teacherTodayClasses`, reqBody);
    }

    getTeacherPreviousClasses(userId){

        var date      = new Date();
        var minutes = this.common.setHoursNMiniutes(date.getMinutes());
        var hours   = this.common.setHoursNMiniutes(date.getHours());
        var endTime = hours + ':' + minutes;
        var reqBody = { 
            'date'       : date, 
            'time'       : endTime, 
            'userId'     : userId,
            'lowerLimit' : 0,
            'upperLimit' : 5
        }
        return this.http.post(`${environment.jitsibackend}/class/teacherPreviousClasses`, reqBody);
    }

    getTeacherComingClasses(userId){

        var date      = new Date();
        var reqBody = { 'date': date, 'userId': userId}
        return this.http.post(`${environment.jitsibackend}/class/teacherComingClasses`, reqBody);
    }

    getStudentClasses(grade, type){

        var date      = new Date();
        var minutes = this.common.setHoursNMiniutes(date.getMinutes());
        var hours   = this.common.setHoursNMiniutes(date.getHours());
        var endTime = hours + ':' + minutes;
        var reqBody = { 'date': date, 'time':endTime, grade: grade, type: type}
        return this.http.post(`${environment.jitsibackend}/class/studentClasses`, reqBody);
    }

    getClassByRoom(roomId){

        return this.http.get(`${environment.jitsibackend}/class/${roomId}`);
    }

    addUserToClass(roomId, userId){

        var reqBody = {
            roomId: roomId,
            studentId : userId
        }
        return this.http.put(`${environment.jitsibackend}/class/addStudent`, reqBody);
    }

    getTeacherRoomId(userName){

        var date    = new Date(); 
        var minutes = this.common.setHoursNMiniutes(date.getMinutes());
        var hours   = this.common.setHoursNMiniutes(date.getHours());
        var startTime = hours + ':' + minutes;
        
        var reqBody = { 'date': date, 'time':startTime, 'userName': userName}
        return this.http.post(`${environment.jitsibackend}/class/getTeacherRoomId`, reqBody);
    }

    getStudentCurrentClass (userId){

        var date    = new Date();
        var minutes = this.common.setHoursNMiniutes(date.getMinutes());
        var hours   = this.common.setHoursNMiniutes(date.getHours());
        var endTime = hours + ':' + minutes;
        var reqBody = { 'date': date, 'time':endTime, 'userId': userId}
        return this.http.post(`${environment.jitsibackend}/class/getStudentCurrentRoom`, reqBody);
    }
}