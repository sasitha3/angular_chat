import { Component }             from '@angular/core';
import { Router }                from '@angular/router';
import { first }                 from 'rxjs/operators';
import { AuthenticationService}  from './_services';
import { User, }                 from './_modal';

import './_content/app.less';

@Component({ selector: 'app', 
             templateUrl: 'app.component.html', 
             styleUrls   : ['app.component.css'] 
            })
export class AppComponent {
    currentUser   : User;
    walletbalance : number;
    constructor(
        private router                : Router,
        private authenticationService : AuthenticationService,
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }


    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

}