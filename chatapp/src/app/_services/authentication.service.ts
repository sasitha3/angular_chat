import { first }            from 'rxjs/operators';
import { Injectable }       from '@angular/core';
import { HttpClient,
         HttpHeaders }      from '@angular/common/http';
import { BehaviorSubject, 
         Observable }       from 'rxjs';
import { map }              from 'rxjs/operators';
import { environment }      from '../../environments/environment';
import { User }             from '../_modal';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
       private currentUserSubject : BehaviorSubject<User>;
       public  currentUser        : Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser        = this.currentUserSubject.asObservable();
        
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username, password) {
        console.log(username);
        const payLoad = {
            "UserName": username,
            "Password":password
        }
        return this.http.post<any>(`${environment.apiUrl}api/user/login`, payLoad)
        .pipe(map(user => {
            console.log(user);
            
            // login successful if there's a jwt token in the response
            if (user.content && user.content.token) {

                localStorage.setItem('currentUser', JSON.stringify(user.content));
                this.currentUserSubject.next(user.content);
                
            }
            return user;
        }));
    }

    logout() {
        
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

}