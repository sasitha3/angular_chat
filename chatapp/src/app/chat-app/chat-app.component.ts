import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";
import { IUser, IMessage } from "../../assets/interfaces/shared.interface";
import { Socket } from "ngx-socket-io";
import { AuthenticationService } from '../_services';

@Component({
  selector: "chat-app",
  templateUrl: "./chat-app.component.html",
  styleUrls: ["./chat-app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatAppComponent implements OnInit {

  @Output() onMessage = new EventEmitter<string>();

  public currentUser: IUser;
  public usersList: IUser[] = [];
  public messages: IMessage[] = [];
  public selectedUser: IUser;
  constructor(
    private socket: Socket, 
    private cdr: ChangeDetectorRef,
    private authenticationService : AuthenticationService,
  ) {

    this.currentUser = this.authenticationService.currentUserValue;
    console.log('#########################31');
    
    console.log(this.authenticationService.currentUserValue);
    console.log(this.currentUser);
    console.log('#########################31');
    
  }

  ngOnInit() {

    console.log(this.currentUser);
    this.socket.emit("user name added", this.currentUser);
    this.initSocketListener();
  }

  private getUserNameById(userId: string) {

    console.log('#############1');
    const user = this.usersList.find(user => user.id === userId);
    return user ? user.name : "anonymous";
  }

  private initSocketListener() {

    console.log('#############2');
    this.socket.on("get users list", (users: string) => {
      console.log('#############3');
      this.usersList = [...JSON.parse(users)];
      this.cdr.markForCheck();
    });

    this.socket.on("get messages history", (messages: string) => {

      console.log('#############4');
      const historyMessages = [...JSON.parse(messages)];
      this.messages = historyMessages.map(message => {
        return {
          ...message,
          userName: this.getUserNameById(message.userId)
        };
      });
      this.cdr.markForCheck();
    });

    this.socket.on("message", (message: string) => {

      console.log('#############5');
      const msg = JSON.parse(message);
      this.messages = [
        ...this.messages,
        {
          ...msg,
          userName: this.getUserNameById(msg.userId)
        }
      ];
      this.cdr.markForCheck();
    });

    this.socket.on("user name added", (user: string) => {

      console.log('#############6');
      console.log(this.usersList);
      console.log(user);
      
      const newUser = JSON.parse(user);
      // this.usersList = [
      //   ...this.usersList,
      //   {
      //     ...newUser,
      //     isCurrent: this.currentUser
      //       ? newUser.id === this.currentUser.id
      //       : false
      //   }
      // ];
      this.usersList.push(newUser);
      console.log(this.usersList);
      
      this.cdr.markForCheck();
    });

    this.socket.on("my user added", (user: string) => {

      console.log('#############7');
      console.log(user);
      const createdUser = JSON.parse(user);
      this.currentUser = {
        ...createdUser,
        isCurrent: true
      };
    });
  }

  public handleName(name: string) {

    console.log('#############8');
    this.socket.emit("user name added", name);
  }

  public handleMessage(text: string) {

    console.log('#############9');
    const msg: any = {
      text,
      userId: this.authenticationService.currentUserValue.id
    };    
    this.socket.emit("message", msg);
  }

  public handleUserSelect(user: IUser) {

    console.log('#############10');
    this.selectedUser = user;
  }
}
