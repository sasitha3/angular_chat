import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../_modal';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    findUser(userId) {
        return this.http.get(`${environment.jitsibackend}/user/${userId}`);
    }

    register(userId) {

        var reqBody = {
            "userId"    : userId, 
            "walletApp" : 'meet-idesk-' + userId,
        }
        return this.http.post(`${environment.jitsibackend}/user/`,reqBody);
    }

}