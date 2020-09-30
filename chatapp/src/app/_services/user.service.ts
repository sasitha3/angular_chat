import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../_modal';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    findUser(userId) {
        // return this.http.get(`${environment.apiUrl}/user/${userId}`);
    }

    register(data) {
        console.log(data);
        
        var reqBody = {
            "Name" : data.firstName,
            "UserName" : data.username,
            "Password" : data.password,
        }
        
        return this.http.post(`${environment.apiUrl}api/user/`,reqBody);
    }

}