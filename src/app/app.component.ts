import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoginService } from "./services/login.service";
import { MatDialog } from "@angular/material";
import { Observable } from "rxjs";
// import {} from "";
import { FeedbackComponent } from "./feedback/feedback.component";

declare var $: any;
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "project-manager";
  currentUser: any;
  constructor(
    public router: Router,
    public loginService: LoginService,
    public dialog: MatDialog
  ) {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    // var obj = JSON.parse(this.currentUser.replace(/ 0+(?![\. }])/g, ' '));
  }

  ngOnInit() {
    if (!this.currentUser) {
      // this.router.navigate(['/login'])
    }
    $("#dropdown").click(function (e) {
      e.stopPropagation();
    });
    this.getTodayDate();
  }

  getTodayDate() {
    this.loginService.getTodayDate().subscribe(
      (response) => {
        localStorage.setItem("todayDate", JSON.stringify(response));
      },
      (error) => {}
    );
  }

  /**
   *
   * @param someComponent to be opned
   * @param data
   * @returns
   */
  openDialog(someComponent, data = {}): Observable<any> {
    const dialogRef = this.dialog.open(someComponent, { data });
    return dialogRef.afterClosed();
  }

  openFeedbackModel() {
    let feedBackResponse = this.openDialog(FeedbackComponent, {}).subscribe(
      (feedBackResponse) => {
        console.log("FeedBack Response : ", feedBackResponse);
      }
    );
  }
}
