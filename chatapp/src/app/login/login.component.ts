import { Component, OnInit }    from '@angular/core';
import { FormBuilder, 
         FormGroup, 
         Validators }           from '@angular/forms';
import { ActivatedRoute, 
         Router }               from '@angular/router';
import { AuthenticationService,
         UserService,
         AlertService }         from '../_services';
import { first }                from 'rxjs/operators';
import { Role }                from '../_modal';

@Component({
  selector    : 'app-login',
  templateUrl : './login.component.html',
  styleUrls   : ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form                      : FormGroup;
  public loginInvalid       : boolean;
  private formSubmitAttempt : boolean;
  private returnUrl         : string;
  loading   = false;
  submitted = false;
  
  constructor(
    private fb            : FormBuilder,
    private route         : ActivatedRoute,
    private router        : Router,
    private authService   : AuthenticationService,
    private userService   : UserService,
    private alertService  : AlertService
  ) {
      
    if (this.authService.currentUserValue) {
      
        this.router.navigate(['/']);
    }
  }

  async ngOnInit() {
     
      this.form      = this.fb.group({

      username : ['', Validators.required],
      password : ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.form.controls; }

  async onSubmit() {
    
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {

      return;
    }
    this.loginInvalid      = false;
    this.formSubmitAttempt = false;
    // if (this.form.valid) {

      try {

        this.loading = true;
        
        await this.authService.login(this.f.username.value, this.f.password.value)
        .pipe(first())
        .subscribe(
            data => {
              console.log(data);
              
              this.router.navigate(['/']);
            },
            error => {

                this.alertService.error(error);
                this.loading = false;
            });
      } catch (err) {

        this.loginInvalid = true;
      }
    // } else {

    //   this.formSubmitAttempt = true;
    // }
  }
}