import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { MatDialog } from "@angular/material";
import { AddTimelogModelComponent } from "../add-timelog-model/add-timelog-model.component";
import { ProjectService } from "../../services/project.service";
import { Observable, Subject } from "rxjs";
import * as _ from "lodash";
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from "angular-calendar";
import * as moment from "moment";
import { uniqBy } from "lodash";
@Component({
  selector: "app-main-time-log",
  templateUrl: "./main-time-log.component.html",
  styleUrls: ["./main-time-log.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainTimeLogComponent implements OnInit {
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  projectId;
  totalTask = [];
  displayHours;
  totalTimeLogs = [];
  totalMonthTimeLogs = [];
  loader = false;
  view: CalendarView = CalendarView.Day;
  viewDate: Date = new Date();
  events = [];
  clickedDate: Date;
  clickedColumn: number;
  refresh: Subject<any> = new Subject();
  projectCreatedDate;
  projectName;
  changeDayDate;
  sideMenuButton = true;
  constructor(
    public dialog: MatDialog,
    public activated: ActivatedRoute,
    public router: Router,
    public projectService: ProjectService,
    public _change: ChangeDetectorRef
  ) {
    this.activated.params.subscribe((param) => {
      this.projectId = param.id;
      this.getTaskById(this.projectId);
      this.getTotalHoursOfSingleDay(this.projectId);
    });
    this.router.events.subscribe((ev: any) => {
      if (ev instanceof NavigationEnd) {
        let taskId = localStorage.getItem("currentTask");

        if (taskId != null) {
          this.storRunnigTime();
        }
        // this.urlId = ev.id
        //
        // this.func('reload', this.urlId);
      }
    });
  }

  ngOnInit() {
    localStorage.removeItem("tempProject");
    window.addEventListener("beforeunload", function (e) {
      let taskId = localStorage.getItem("currentTask");

      // Cancel the event
      // if (localStorage.getItem('isTimerRunning') != "null") {
      // fromReload('reload');
      if (taskId != null) {
        runningTime();
      }
      e.stopPropagation();
      // Chrome requires returnValue to be set
      e.returnValue = "";

      // }
    });
    var runningTime = () => {
      this.storRunnigTime();
    };
    // this.convertDate()
  }

  daysChange(event) {
    this.events = [];

    if (this.view == "day") {
      this.loader = true;
      this.changeDayDate = event;
      let obj = {
        projectId: this.projectId,
        userId: this.currentUser._id,
        newDate: moment(event).format("YYYY-MM-DD"),
      };

      this.projectService.getSingleDayLog(obj).subscribe(
        (response: any) => {
          this.displayHours = response.totalTime;
          _.forEach(this.totalMonthTimeLogs, (singleLog) => {
            // convertDate()
            let newStartDate = this.convertDate(
              singleLog.timeDate,
              singleLog.fromTime
            );
            let newEndDate = this.convertDate(
              singleLog.timeDate,
              singleLog.endTime
            );
            let obj = {
              title:
                singleLog.taskId.taskUniqueId +
                " " +
                "(" +
                singleLog.taskId.title +
                ")",
              start: newStartDate,
              end: newEndDate,
              taskId: singleLog.taskId._id,
              timeLogId: singleLog._id,
            };
            this.events.push(obj);
          });
          this.loader = false;

          this.refresh.next();
        },
        (error) => {
          this.loader = false;
        }
      );
    } else {
      _.forEach(this.totalMonthTimeLogs, (singleLog) => {
        // convertDate()
        let newStartDate = this.convertDate(
          singleLog.timeDate,
          singleLog.fromTime
        );
        let newEndDate = this.convertDate(
          singleLog.timeDate,
          singleLog.endTime
        );
        let obj = {
          title:
            singleLog.taskId.taskUniqueId +
            " " +
            "(" +
            singleLog.taskId.title +
            ")",
          start: newStartDate,
          end: newEndDate,
          taskId: singleLog.taskId._id,
          timeLogId: singleLog._id,
        };
        this.events.push(obj);
      });
      // this.loader = false

      this.refresh.next();
    }
  }

  changeView(event) {
    if (event == "month") {
      this.events = [];

      _.forEach(this.totalMonthTimeLogs, (singleLog) => {
        // convertDate()
        let newEndDate;
        let newStartDate = this.convertDate(
          singleLog.timeDate,
          singleLog.fromTime
        );
        if (singleLog.endTime != "") {
          newEndDate = this.convertDate(singleLog.timeDate, singleLog.endTime);
        } else {
          newEndDate = new Date();
          this.storRunnigTime();
        }
        // let newEndDate = this.convertDate(singleLog.timeDate, singleLog.endTime)
        let obj = {
          title:
            singleLog.taskId.taskUniqueId +
            " " +
            "(" +
            singleLog.taskId.title +
            ")",
          start: newStartDate,
          end: newEndDate,
          taskId: singleLog.taskId._id,
          timeLogId: singleLog._id,
        };
        this.events.push(obj);
      });

      this.refresh.next();
    }
    if (event == "week") {
      this.events = [];
      _.forEach(this.totalMonthTimeLogs, (singleLog) => {
        // convertDate()
        let newEndDate;
        let newStartDate = this.convertDate(
          singleLog.timeDate,
          singleLog.fromTime
        );
        if (singleLog.endTime != "") {
          newEndDate = this.convertDate(singleLog.timeDate, singleLog.endTime);
        } else {
          newEndDate = new Date();
          this.storRunnigTime();
        }
        // let newEndDate = this.convertDate(singleLog.timeDate, singleLog.endTime)
        let obj = {
          title:
            singleLog.taskId.taskUniqueId +
            " " +
            "(" +
            singleLog.taskId.title +
            ")",
          start: newStartDate,
          end: newEndDate,
          taskId: singleLog.taskId._id,
          timeLogId: singleLog._id,
        };
        this.events.push(obj);
      });

      this.refresh.next();
    }

    if (event == "day") {
      this.events = [];
      //
      let tempDate = moment(this.viewDate).format("YYYY-MM-DD");
      let todayDate = moment(new Date()).format("YYYY-MM-DD");
      if (tempDate == todayDate) {
        _.forEach(this.totalTimeLogs, (singleLog) => {
          let newEndDate;
          // convertDate()
          let newStartDate = this.convertDate(
            singleLog.timeDate,
            singleLog.fromTime
          );
          if (singleLog.endTime != "") {
            newEndDate = this.convertDate(
              singleLog.timeDate,
              singleLog.endTime
            );
          } else {
            newEndDate = new Date();
            this.storRunnigTime();
          }
          // let newEndDate = this.convertDate(singleLog.timeDate, singleLog.endTime)
          let obj = {
            title:
              singleLog.taskId.taskUniqueId +
              " " +
              "(" +
              singleLog.taskId.title +
              ")",
            start: newStartDate,
            end: newEndDate,
            taskId: singleLog.taskId._id,
            timeLogId: singleLog._id,
          };
          this.events.push(obj);
        });
        this.refresh.next();
      } else {
        this.events = [];

        _.forEach(this.totalMonthTimeLogs, (singleLog) => {
          // convertDate()
          let newEndDate;
          let newStartDate = this.convertDate(
            singleLog.timeDate,
            singleLog.fromTime
          );
          if (singleLog.endTime != "") {
            newEndDate = this.convertDate(
              singleLog.timeDate,
              singleLog.endTime
            );
          } else {
            newEndDate = new Date();
            this.storRunnigTime();
          }
          // let newEndDate = this.convertDate(singleLog.timeDate, singleLog.endTime)
          let obj = {
            title:
              singleLog.taskId.taskUniqueId +
              " " +
              "(" +
              singleLog.taskId.title +
              ")",
            start: newStartDate,
            end: newEndDate,
            taskId: singleLog.taskId._id,
            timeLogId: singleLog._id,
          };
          this.events.push(obj);
        });

        this.refresh.next();
      }
    }
  }

  getTotalHoursOfSingleDay(projectId) {
    // let date = moment(new Date()).format('YYYY-MM-DD')
    //
    this.loader = true;
    let obj = {
      projectId: projectId,
      userId: this.currentUser._id,
      // todayDate:
    };
    this.projectService.getSingleDayLog(obj).subscribe(
      (response: any) => {
        this.projectName = response.projectName;
        this.displayHours = response.totalTime;
        this.totalTimeLogs = response.list;
        this.totalMonthTimeLogs = response.totalTimeMonth;
        this.loader = false;
        this._change.detectChanges();
        console.log("getTotalHoursOfSingleDay : ", response, this.loader);
        _.forEach(this.totalTimeLogs, (singleLog) => {
          let textLimit = 10;
          let words = false;
          let ellipsis = "...";
          let newTitle = this.transform(
            singleLog.taskId.title,
            textLimit,
            words,
            ellipsis
          );

          // convertDate()
          let newEndDate;
          let newStartDate = this.convertDate(
            singleLog.timeDate,
            singleLog.fromTime
          );

          if (singleLog.endTime != "") {
            newEndDate = this.convertDate(
              singleLog.timeDate,
              singleLog.endTime
            );
          } else {
            newEndDate = new Date();
            this.storRunnigTime();
          }
          let obj = {
            title:
              singleLog.taskId.taskUniqueId +
              " " +
              "(" +
              singleLog.taskId.title +
              ")",
            start: newStartDate,
            end: newEndDate,
            taskId: singleLog.taskId._id,
            timeLogId: singleLog._id,
          };
          this.events.push(obj);
        });

        this.refresh.next();
      },
      (error) => {
        this.loader = false;
      }
    );
  }

  transform(title, limit, words, ellipsis) {
    if (words) {
      limit = title.substr(0, limit).lastIndexOf(" ");
    }
    return title.length > limit ? title.substr(0, limit) + ellipsis : title;
  }

  convertDate(date, newTime) {
    var time = newTime;
    var startTime = new Date(date);
    var parts = time.match(/(\d+):(\d+) (AM|PM)/);
    if (parts) {
      var hours = parseInt(parts[1]),
        minutes = parseInt(parts[2]),
        tt = parts[3];
      if (tt === "PM" && hours < 12) hours += 12;
      startTime.setHours(hours, minutes, 0, 0);
    }
    // alert(startTime);
    //
    return startTime;
  }

  dayClicked(event) { }

  /**
   * @param event
   * These is for open time log model from calendar view
   */
  dateClick(event) {
    let newDate = moment(event).format("YYYY-MM-DD");

    let newTime = moment(event).format("h:m:A");

    let data = {
      taskList: this.totalTask,
      user: this.currentUser,
      selectedDate: newDate,
      selectedTime: newTime,
      projectId: this.projectId,
      projectDate: this.projectCreatedDate,
      noTimer: false,
    };
    var timelog = this.openDialog(AddTimelogModelComponent, data).subscribe(
      (response: any) => {
        if (response != undefined) {
          let todayDate = moment(new Date()).format("YYYY-MM-DD");
          if (response.timeDate == todayDate && this.view == "day") {
            let newTotalTime = this.displayHours.split(":");
            let startMiliTime =
              Number(Number(newTotalTime[0]) * (60000 * 60)) +
              Number(Number(newTotalTime[1]) * 60000);
            let diffCount = response.difference.split(":");
            let endMiliTime =
              Number(Number(diffCount[0]) * (60000 * 60)) +
              Number(Number(diffCount[1]) * 60000);
            let finalCount = Number(startMiliTime) + Number(endMiliTime);
            let time = new Date(finalCount);
            let hours = time.getUTCHours();
            let minutes = time.getUTCMinutes();

            this.displayHours = hours + ":" + minutes;
          }
          if (
            this.changeDayDate != undefined &&
            response.timeDate != todayDate &&
            this.view == "day"
          ) {
            let newTotalTime = this.displayHours.split(":");
            let startMiliTime =
              Number(Number(newTotalTime[0]) * (60000 * 60)) +
              Number(Number(newTotalTime[1]) * 60000);
            let diffCount = response.difference.split(":");
            let endMiliTime =
              Number(Number(diffCount[0]) * (60000 * 60)) +
              Number(Number(diffCount[1]) * 60000);
            let finalCount = Number(startMiliTime) + Number(endMiliTime);
            let time = new Date(finalCount);
            let hours = time.getUTCHours();
            let minutes = time.getUTCMinutes();

            this.displayHours = hours + ":" + minutes;
          }

          let newStartDate = this.convertDate(
            response.timeDate,
            response.fromTime
          );
          let newEndDate = this.convertDate(
            response.timeDate,
            response.endTime
          );
          let obj = {
            title:
              response.taskId.taskUniqueId + "(" + response.taskId.title + ")",
            start: newStartDate,
            end: newEndDate,
            taskId: response.taskId._id,
            timeLogId: response._id,
          };
          this.events.push(obj);
          this.refresh.next();
          this.totalTimeLogs.push(response);

          this.totalMonthTimeLogs.push(response);
        }
      }
    );
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();
  }

  eventClicked({ event }: { event: CalendarEvent }): void { }

  getTaskById(projectId) {
    this.projectService.getTaskById(projectId).subscribe(
      (response: any) => {
        if (this.currentUser.userRole == "Manager") {
          this.projectCreatedDate = response.data.response[0].createdAt;
          if (
            response.data.response[0] &&
            response.data.response[0].tasks.length
          ) {
            let taskList = response.data.response[0].tasks;
            _.forEach(taskList, (singletask) => {
              if (singletask.assignTo) {
                if (singletask.assignTo._id == this.currentUser._id) {
                  this.totalTask.push(singletask);
                }
              }
            });
          }
        } else {
          this.projectCreatedDate = response.data.response[0].createdAt;
          if (response.data && response.data.response[0].tasks.length) {
            let taskList = response.data.response[0].tasks;
            _.forEach(taskList, (singletask) => {
              if (singletask.assignTo) {
                if (singletask.assignTo._id == this.currentUser._id) {
                  this.totalTask.push(singletask);
                }
              }
            });
          }
        }
      },
      (error) => { }
    );
  }

  /**
   * @param event
   * @param task
   * These is for edit time log
   */
  handleEvent(event, task) {
    //

    let skinName;
    if (this.view == "month" || this.view == "week" || this.view == "day") {
      skinName = this.totalMonthTimeLogs.find((x) => x._id == task.timeLogId);
    } else {
      skinName = this.totalTimeLogs.find((x) => x._id == task.timeLogId);
    }

    // if()

    let data = {
      task: skinName,
      user: this.currentUser,
      projectId: this.projectId,
      edit: true,
      taskList: this.totalTask,
      projectDate: this.projectCreatedDate,
      // noTimer: false
    };
    let todayDate = moment(new Date()).format("YYYY-MM-DD");
    if (skinName.timeDate == todayDate && this.view == "day") {
      let newTotalTime = this.displayHours.split(":");
      let startMiliTime =
        Number(Number(newTotalTime[0]) * (60000 * 60)) +
        Number(Number(newTotalTime[1]) * 60000);
      let diffCount = skinName.difference.split(":");
      let endMiliTime =
        Number(Number(diffCount[0]) * (60000 * 60)) +
        Number(Number(diffCount[1]) * 60000);
      let finalCount = Number(startMiliTime) - Number(endMiliTime);
      let time = new Date(finalCount);
      let hours = time.getUTCHours();
      let minutes = time.getUTCMinutes();

      this.displayHours = hours + ":" + minutes;
    }

    if (
      this.changeDayDate != undefined &&
      skinName.timeDate != todayDate &&
      this.view == "day"
    ) {
      let newTotalTime = this.displayHours.split(":");
      let startMiliTime =
        Number(Number(newTotalTime[0]) * (60000 * 60)) +
        Number(Number(newTotalTime[1]) * 60000);
      let diffCount = skinName.difference.split(":");
      let endMiliTime =
        Number(Number(diffCount[0]) * (60000 * 60)) +
        Number(Number(diffCount[1]) * 60000);
      let finalCount = Number(startMiliTime) - Number(endMiliTime);
      let time = new Date(finalCount);
      let hours = time.getUTCHours();
      let minutes = time.getUTCMinutes();

      this.displayHours = hours + ":" + minutes;
    }

    var timelog = this.openDialog(AddTimelogModelComponent, data).subscribe(
      (response) => {
        if (response != undefined) {
          let update = this.events.findIndex(
            (x) => x.timeLogId == response._id
          );

          let newStartDate = this.convertDate(
            response.timeDate,
            response.fromTime
          );
          let newEndDate = this.convertDate(
            response.timeDate,
            response.endTime
          );
          let obj = {
            title:
              response.taskId.taskUniqueId + "(" + response.taskId.title + ")",
            start: newStartDate,
            end: newEndDate,
            taskId: response.taskId._id,
            timeLogId: response._id,
          };
          this.events[update] = obj;
          this.refresh.next();

          let index = this.totalTimeLogs.findIndex(
            (x) => x._id == response._id
          );

          this.totalTimeLogs[index] = response;
          let index1 = this.totalMonthTimeLogs.findIndex(
            (x) => x._id == response._id
          );

          this.totalMonthTimeLogs[index1] = response;

          if (response.timeDate == todayDate && this.view == "day") {
            let newTotalTime = this.displayHours.split(":");
            let startMiliTime =
              Number(Number(newTotalTime[0]) * (60000 * 60)) +
              Number(Number(newTotalTime[1]) * 60000);
            let diffCount = response.difference.split(":");
            let endMiliTime =
              Number(Number(diffCount[0]) * (60000 * 60)) +
              Number(Number(diffCount[1]) * 60000);
            let finalCount = Number(startMiliTime) + Number(endMiliTime);
            let time = new Date(finalCount);
            let hours = time.getUTCHours();
            let minutes = time.getUTCMinutes();

            this.displayHours = hours + ":" + minutes;

            this._change.detectChanges();
          }
          if (
            this.changeDayDate != undefined &&
            skinName.timeDate != todayDate &&
            this.view == "day"
          ) {
            let newTotalTime = this.displayHours.split(":");
            let startMiliTime =
              Number(Number(newTotalTime[0]) * (60000 * 60)) +
              Number(Number(newTotalTime[1]) * 60000);
            let diffCount = response.difference.split(":");
            let endMiliTime =
              Number(Number(diffCount[0]) * (60000 * 60)) +
              Number(Number(diffCount[1]) * 60000);
            let finalCount = Number(startMiliTime) + Number(endMiliTime);
            let time = new Date(finalCount);
            let hours = time.getUTCHours();
            let minutes = time.getUTCMinutes();

            this.displayHours = hours + ":" + minutes;

            this._change.detectChanges();
          }
        } else {
          if (skinName.timeDate == todayDate && this.view == "day") {
            let newTotalTime = this.displayHours.split(":");
            let startMiliTime =
              Number(Number(newTotalTime[0]) * (60000 * 60)) +
              Number(Number(newTotalTime[1]) * 60000);
            let diffCount = skinName.difference.split(":");
            let endMiliTime =
              Number(Number(diffCount[0]) * (60000 * 60)) +
              Number(Number(diffCount[1]) * 60000);
            let finalCount = Number(startMiliTime) + Number(endMiliTime);
            let time = new Date(finalCount);
            let hours = time.getUTCHours();
            let minutes = time.getUTCMinutes();

            this.displayHours = hours + ":" + minutes;
            this._change.detectChanges();
          }
          if (
            this.changeDayDate != undefined &&
            skinName.timeDate != todayDate &&
            this.view == "day"
          ) {
            let newTotalTime = this.displayHours.split(":");
            let startMiliTime =
              Number(Number(newTotalTime[0]) * (60000 * 60)) +
              Number(Number(newTotalTime[1]) * 60000);
            let diffCount = skinName.difference.split(":");
            let endMiliTime =
              Number(Number(diffCount[0]) * (60000 * 60)) +
              Number(Number(diffCount[1]) * 60000);
            let finalCount = Number(startMiliTime) + Number(endMiliTime);
            let time = new Date(finalCount);
            let hours = time.getUTCHours();
            let minutes = time.getUTCMinutes();

            this.displayHours = hours + ":" + minutes;
            this._change.detectChanges();
          }
        }
      }
    );
  }

  storRunnigTime() {
    // let storeTime = Date.now()

    let setTime = setInterval(() => {
      //
      let currentTask = localStorage.getItem("currentTask");

      if (currentTask != null) {
        let index = this.events.find((x) => x.timeLogId == currentTask);

        let findIndexOftask = this.events.findIndex(
          (x) => x.timeLogId == currentTask
        );
        let count = new Date();
        //

        let obj = {
          title: index.title,
          start: index.start,
          end: count,
          taskId: index.taskId,
          timeLogId: index.timeLogId,
        };
        this.events[findIndexOftask] = obj;
        this.refresh.next();
      }
    }, 60000);
  }

  addTimeLog() {
    //
    let daySelected;
    if (this.view == "day") {
      daySelected = moment(new Date()).format("YYYY-MM-DD");
    }
    let data = {
      taskList: this.totalTask,
      user: this.currentUser,
      projectId: this.projectId,
      timeValidation: this.totalTimeLogs,
      projectDate: this.projectCreatedDate,
      selectedDate: daySelected,
      addTime: true,
    };
    var timelog = this.openDialog(AddTimelogModelComponent, data).subscribe(
      (response) => {
        let todayDate = moment(new Date()).format("YYYY-MM-DD");

        if (response != undefined) {
          // this.storRunnigTime()
          //
          if (response.difference && response.timeDate == todayDate) {
            let newTotalTime = this.displayHours.split(":");
            let startMiliTime =
              Number(Number(newTotalTime[0]) * (60000 * 60)) +
              Number(Number(newTotalTime[1]) * 60000);
            let diffCount = response.difference.split(":");
            let endMiliTime =
              Number(Number(diffCount[0]) * (60000 * 60)) +
              Number(Number(diffCount[1]) * 60000);
            let finalCount = Number(startMiliTime) + Number(endMiliTime);
            let time = new Date(finalCount);
            let hours = time.getUTCHours();
            let minutes = time.getUTCMinutes();

            this.displayHours = hours + ":" + minutes;
          }
          let newEndDate;
          let newStartDate = this.convertDate(
            response.timeDate,
            response.fromTime
          );
          if (response.endTime != "") {
            newEndDate = this.convertDate(response.timeDate, response.endTime);
          } else {
            newEndDate = new Date();
            // localStorage.setItem('currentTask', response.taskId._id)
            this.storRunnigTime();
          }

          let obj = {
            title:
              response.taskId.taskUniqueId + "(" + response.taskId.title + ")",
            start: newStartDate,
            end: newEndDate,
            taskId: response.taskId._id,
            timeLogId: response._id,
          };
          this.events.push(obj);
          this.refresh.next();
          this.totalTimeLogs.push(response);
          this.totalMonthTimeLogs.push(response);
        }
      }
    );
  }
  openDialog(someComponent, data = {}): Observable<any> {
    const dialogRef = this.dialog.open(someComponent, { data });
    return dialogRef.afterClosed();
  }

  totalHours(displayHours) {
    //
    let newTime = displayHours.split(":");
    let finalTime = newTime[0] + "." + newTime[1];
    let time = Number(8.3);
    if (Number(finalTime) < time) {
      //
      return { class: "lessHours" };
    }
    if (Number(finalTime) > time) {
      return { class: "moreHours" };
    }
    if (Number(finalTime) == time) {
      return { class: "perfectHours" };
    }
  }
}
