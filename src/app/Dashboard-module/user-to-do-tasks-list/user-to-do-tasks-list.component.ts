import { Component, OnInit } from "@angular/core";
import { DashboardService } from "../../services/dashboard.service";
@Component({
  selector: "app-user-to-do-tasks-list",
  templateUrl: "./user-to-do-tasks-list.component.html",
  styleUrls: ["./user-to-do-tasks-list.component.css"],
})
export class UserToDoTasksListComponent implements OnInit {
  userTaskList;
  constructor(private _dashboardService: DashboardService) {}
  ngOnInit() {
    console.log("UserToDoTasksListComponent : ");
    this._dashboardService.getUserToDoTasksLists().subscribe(
      (tasksList) => {
        this.userTaskList = tasksList;
        console.log("userTaskList : ", this.userTaskList);
      },
      (err) => {
        console.log("err : ", err);
      }
    );
  }
}
