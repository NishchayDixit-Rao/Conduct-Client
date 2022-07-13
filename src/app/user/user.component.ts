import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { config } from "../config";
@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"],
})
export class UserComponent implements OnInit {
  @Input("userDetails") userDetails;
  @Input("userRedirect") redirect;
  @Input("removeUser") displayIcon;
  @Output() deletUser: EventEmitter<any> = new EventEmitter();
  path = config.baseMediaUrl;
  // userDetails;
  redirectList;
  deleteDisplay;
  constructor(public router: Router) {}
  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    
    if (changes.user && changes.user.currentValue) {
      
      this.userDetails = changes.user.currentValue;
    }
    if (changes.redirect) {
      
      this.redirectList = changes.redirect.currentValue;
    }
    if (changes.displayIcon && changes.displayIcon.currentValue) {
      this.deleteDisplay = changes.displayIcon.currentValue;
    }
  }

  redirectUser(user) {
    
    if (this.redirectList !== false) {
      this.router.navigate(["./user/", user._id], {
        state: { userRole: user.userRole },
      });
    } else {
      
    }
  }

  getUserRole(userRole) {
    // 
    if (userRole == "Manager") {
      return "Manager";
    } else if (userRole == "Team Member") {
      return "Team Member";
    } else if (userRole == "admin") {
      return "Admin";
    } else {
      return "Unassigned";
    }
  }

  userBorder(userRole) {
    switch (userRole) {
      case "Manager":
        return { class: "pmBorder" };
        break;
      case "Team Member":
        return { class: "developerBorder" };
        break;
      default:
        return { class: "defaultBoder" };
        break;
    }
  }
  remoevDevelopoer(userDetails) {
    
    this.deletUser.emit(userDetails);
  }
}
