import { NgModule }                from '@angular/core';
import { BrowserModule }           from '@angular/platform-browser';
import { ReactiveFormsModule,
         FormsModule }             from '@angular/forms';
import { HttpClientModule, 
         HTTP_INTERCEPTORS }       from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import {
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatDatepickerModule, 
    MatNativeDateModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatTableModule,
    MatTooltipModule,
    MatDialogModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSelectModule,
    MatGridListModule,
    MatTabsModule
  }                                from '@angular/material';
import { AppRoutingModule }        from './app.routing';
import { JwtInterceptor,  
         ErrorInterceptor }        from './_helpers';
import { AppComponent }            from './app.component';
import { HomeComponent }           from './home';
import { LoginComponent }          from './login';
import { RegisterComponent }       from './register';
import { AlertComponent }          from './_components';
import { SpinComponent }           from './spin/spin.component';

import { ChatAppComponent } from "./chat-app/chat-app.component";
import { ChatWindowComponent } from "./chat-window/chat-window.component";
import { UsersListComponent } from "./users-list/users-list.component";
import { MessageComponent } from "./message/message.component";
import { ChatInputComponent } from "./chat-input/chat-input.component";
import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";
import { ChatNamePopupComponent } from './chat-name-popup/chat-name-popup.component';

const config: SocketIoConfig = { url: "http://localhost:3000", options: {} };
@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatRippleModule,
        MatDatepickerModule, 
        MatNativeDateModule,
        MatIconModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatSidenavModule,
        MatTableModule,
        MatTooltipModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatPaginatorModule,
        MatSelectModule,
        MatGridListModule,
        MatTabsModule,
        FormsModule,
        SocketIoModule.forRoot(config)
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        SpinComponent,
        AlertComponent,
        ChatAppComponent,
        ChatWindowComponent,
        UsersListComponent,
        MessageComponent,
        ChatInputComponent,
        ChatNamePopupComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ],
    bootstrap: [AppComponent],
})
export class AppModule { };