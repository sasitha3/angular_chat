import {
  Component,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
  ViewChild, 
  ElementRef
} from "@angular/core";
import { IUser } from "src/assets/interfaces/shared.interface";

@Component({
  selector: "users-list",
  templateUrl: "./users-list.component.html",
  styleUrls: ["./users-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent {

  // @ViewChild("dataBlock", {static: true}) block: ElementRef;
  
  @Input() usersList: IUser[];
  @Output() onUserSelect = new EventEmitter<IUser>();
  myDiv;

  chatUser;
  constructor(private elementRef:ElementRef) {}
  public selectUser(user: IUser) {
    console.log('user slecetion');
    
    this.onUserSelect.emit(user);
  }

  openForm (user){

    // this.block.nativeElement.style.display = "block";
    this.chatUser = user.name
    this.myDiv.style.display = 'block';
    console.log('works');
    
  }

  closeForm (){

    // this.block.nativeElement.style.display = "block";
    this.myDiv.style.display = 'none';
    console.log('works');
    
  }

  ngAfterViewInit() {

    this.myDiv = this.elementRef.nativeElement.querySelector('.my-div');
  }

}
