import { Component, OnInit } from "@angular/core";
import { MessagingService } from "../../services/messaging.service";
import { LoginService } from "../../services/login.service";
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  message;
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  totalCount;
  loader = false;
  constructor(
    private messagingService: MessagingService,
    public loginService: LoginService
  ) {}

  ngOnInit() {
    const currentUserId = JSON.parse(localStorage.getItem("currentUser"))._id;

    this.messagingService.requestPermission(currentUserId);
    this.messagingService.receiveMessage();
    this.message = this.messagingService.currentMessage;
    this.getTotalCounts();
  }

  getTotalCounts() {
    this.loader = true;
    this.loginService.getTotalCounts().subscribe(
      (response: any) => {
        this.totalCount = response;
        this.loader = false;
      },
      (error) => {
        this.loader = false;
      }
    );
  }

  zeroPad(num, numZeros) {
    //

    var n = Math.abs(num);
    //

    var zeros = Math.max(0, numZeros - Math.floor(n).toString().length);
    //

    var zeroString = Math.pow(10, zeros).toString().substr(1);
    //

    if (num < 0) {
      zeroString = "-" + zeroString;
    }

    return zeroString + n;
  }
}
