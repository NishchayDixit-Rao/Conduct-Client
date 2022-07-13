import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ProjectService } from "../../services/project.service";
import { Router, ActivatedRoute } from "@angular/router";
import * as _ from "lodash";
import { SearchTaskPipe } from "../../search-task.pipe";
import { MatSort, MatTableDataSource, MatPaginator } from "@angular/material";
import { ApproveLogsModelComponent } from "../approve-logs-model/approve-logs-model.component";
import { SingleTaskDetailsComponent } from "../../task-display/single-task-details/single-task-details.component";
import { MatDialog } from "@angular/material";
import { Observable } from "rxjs";

@Component({
  selector: "app-user-logs-details",
  templateUrl: "./user-logs-details.component.html",
  styleUrls: ["./user-logs-details.component.css"],
})
export class UserLogsDetailsComponent implements OnInit {
  totalLogs = [];
  searchLogs = [];
  totalLogsCopy = [];
  allUsersList = [];
  diffHours = [];
  diffMinutes = [];
  totalHours;
  totalMinutes;
  isDisplay;
  loader = false;
  sort: MatSort;
  allProjectList = [];
  displayFilter = [
    // {
    //   displayName: "Developer",
    // },
    {
      displayName: "Projects",
    },
  ];
  noDataFound;
  displayReset = false;
  filterReset;
  searchText;
  dataSource: MatTableDataSource<any>;
  paginator: MatPaginator;
  pageSizeOptions: number[] = [10, 25, 100];
  currentUser = JSON.parse(localStorage.getItem("currentUser"));

  displayedColumns: string[] = [
    "date",
    "users",
    "taskTitle",
    "estimated",
    "difference",
    "from",
    "end",
    "verifyLogs",
  ];
  paramsData;
  isFileter = false;
  // displayedColumns: string[] = ['date', 'taskTitle']
  // @ViewChild(MatSort) set content(content: ElementRef) {
  //   this.sort = content;
  //   if (this.sort) {
  //     this.dataSource.sort = this.sort;

  //   }
  // }

  // @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  constructor(
    public projectService: ProjectService,
    public router: Router,
    public dialog: MatDialog,
    public searchTextFilter: SearchTaskPipe,
    public activated: ActivatedRoute
  ) {
    this.dataSource = new MatTableDataSource(this.totalLogs);
  }

  ngOnInit() {
    this.activated.queryParams.subscribe((params) => {
      //
      // if (params.projects) {
      //

      // }
      this.paramsData = params;
    });

    let temp = Object.keys(this.paramsData).length;
    console.log("temp : ", temp);
    console.log("this.paramsData type : ", typeof this.paramsData.projects);

    if (temp != 0) {
      let projectArray = [];
      let userArray = [];
      if (typeof this.paramsData.projects == "string") {
        let obj = {
          _id: this.paramsData.projects,
        };
        projectArray.push(obj);
        //
      } else {
        _.forEach(this.paramsData.projects, (singleProject) => {
          let obj = {
            _id: singleProject,
          };
          projectArray.push(obj);
        });
        //
      }
      if (typeof this.paramsData.user == "string") {
        //
        let obj = {
          _id: this.paramsData.user,
        };
        userArray.push(obj);
      } else {
        //
        _.forEach(this.paramsData.user, (singleUser) => {
          let obj = {
            _id: singleUser,
          };
          userArray.push(obj);
        });
      }
      console.log("userArray :: ", userArray);
      console.log("projectArray :: ", projectArray);
      if (userArray && userArray.length && !projectArray.length) {
        // this.filterOnDeveloper(userArray)
        this.developerFilter(userArray);
      } else if (projectArray && projectArray.length && !userArray.length) {
        // this.filterOnProject(projectArray)
        this.projectFilter(projectArray);
      } else {
        console.log("isFileter before : ", this.isFileter);
        // this.isFileter = true;
        let obj = {
          projectArray: projectArray,
          developerArray: userArray,
        };
        // this.filterOnProjectAndDeveloper(obj)
        this.projectDeveloperFilter(obj);
      }
    } else {
      this.getAllLogsWithDetails();
    }
    // this.totalLogs.sort = this.sort;
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    // this.dataSource = new MatTableDataSource(this.totalLogs);
    this.dataSource.sort = this.sort;
  }

  getAllLogsWithDetails() {
    this.isFileter = true;
    this.loader = true;
    this.projectService.getLogsWithDetails().subscribe(
      (response: any) => {
        console.log("response : ", response);
        if (response.totalLgs && response.totalLgs.length) {
          this.totalLogs = response.totalLgs;
          this.totalLogsCopy = response.totalLgs;
          this.searchLogs = response.totalLgs;
          this.isDisplay = 0;
          this.displayData();
        } else {
          this.isDisplay = 1;
          this.noDataFound = {
            text: "There is no logs",
          };
          this.totalHours = "0";
          this.totalMinutes = "0";
        }
        this.allUsersList = response.totalUser;
        this.allProjectList = response.allProjects;
        this.loader = false;
      },
      (error) => {
        this.loader = false;
      }
    );
  }

  displayData() {
    this.isDisplay = 0;
    let totalTime = [];
    this.diffHours = [];
    this.diffMinutes = [];
    let fromHour;
    let fromMinute;
    let finalFromTime;
    this.updateData(this.totalLogs);
    _.forEach(this.totalLogs, (singleTime) => {
      //

      if (singleTime && singleTime.fromTime) {
        let test = singleTime.fromTime.split(":");
        // let startHours = test[0]
        //

        let test2 = test[1].split(" ");
        // let startMinutes = test2[0]
        // let ampm = test2[1]

        if (test[0] && test[0].length == 1) {
          fromHour = this.zeroPad(test[0], 2);
          //
        } else {
          //
          fromHour = test[0];
        }

        if (test2[0] && test2[0].length == 1) {
          fromMinute = this.zeroPad(test2[0], 2);
          //
        } else {
          //
          fromMinute = test2[0];
        }

        finalFromTime = fromHour + ":" + fromMinute + " " + test2[1];
        //
        singleTime["fromTime"] = finalFromTime;
      }

      if (singleTime && singleTime.endTime) {
        let test = singleTime.endTime.split(":");
        // let startHours = test[0]
        //

        let test2 = test[1].split(" ");
        // let startMinutes = test2[0]
        // let ampm = test2[1]

        if (test[0] && test[0].length == 1) {
          fromHour = this.zeroPad(test[0], 2);
          //
        } else {
          //
          fromHour = test[0];
        }

        if (test2[0] && test2[0].length == 1) {
          fromMinute = this.zeroPad(test2[0], 2);
          //
        } else {
          //
          fromMinute = test2[0];
        }

        finalFromTime = fromHour + ":" + fromMinute + " " + test2[1];
        //
        singleTime["endTime"] = finalFromTime;
      }

      let finalTime = singleTime.difference.split(":");
      this.diffHours.push(finalTime[0]);
      this.diffMinutes.push(finalTime[1]);
      let tempTime = singleTime.difference.split(":");
      let totalMili =
        Number(Number(tempTime[0]) * (60000 * 60)) +
        Number(Number(tempTime[1]) * 60000);
      //
      if (singleTime.verifyLogs) {
        let verifyTime =
          Number(Number(singleTime.verifyLogs.hours) * (60000 * 60)) +
          Number(Number(singleTime.verifyLogs.minutes) * 60000);
        //
        if (totalMili == verifyTime) {
          //
          singleTime["isverify"] = true;
        } else {
          //
          singleTime["isverify"] = false;
        }
      }

      totalTime.push(totalMili);
    });
    let finalSum = totalTime.reduce((a, b) => a + b, 0);
    //

    let finalData = this.msToTime(finalSum);
    this.totalHours = finalData.split(":")[0];
    // let minutes = Math.floor((finalSum / (1000 * 60)) % 60)
    this.totalMinutes = finalData.split(":")[1];
    // let hours = Math.floor((finalSum / (1000 * 60 * 60)) % 24);
    // let totalTimeLog = hours + ":" + minutes
    // this.totalHours = hours
    // this.totalMinutes = minutes
    //
  }

  msToTime(s) {
    let milliseconds;
    let hours;
    let minutes;
    let seconds;

    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return hrs + ":" + mins;
  }

  updateData(clients) {
    this.dataSource = new MatTableDataSource(clients);
    this.dataSource.paginator = this.paginator;

    this.dataSource.sortingDataAccessor = (item, property) => {
      //

      //
      switch (property) {
        case "date":
          return item.timeDate;
        case "users":
          return item.userId.name;
        case "taskTitle":
          return item.taskId.title;
        case "taskTitle":
          return item.taskId.taskUniqueId;
        case "estimated":
          return item.taskId.estimatedTime;
        case "difference":
          return item.difference;
        case "from":
          return item.fromTime;
        case "end":
          return item.endTime;
        // case 'location.title': return item.location.title;
        // case 'course.title': return item.course.title;
        default:
          return item[property];
      }
    };
    this.dataSource.sort = this.sort;
    //
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // if (this.dataSource)
    this.dataSource.sort = this.sort;
  }

  someMethod(event) {}

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

  filterOnDeveloper(event) {
    this.loader = true;
    if (event && event.length) {
      this.displayReset = true;
      this.filterReset = false;
      // _.forEach(event, (singleUser) => {
      //   this.router.navigate(['/user-logs'], { queryParams: { user: singleUser._id } });
      // })
      let finalArray = [];
      var arr = event;
      var texts = arr.map(function (el) {
        // finalArray.push(el._id)
        return el._id;
      });

      let obj = {
        userArray: texts,
      };

      this.router.navigate(["/user-logs"], { queryParams: { user: texts } });
      this.projectService.getLogsWithDetails(obj).subscribe(
        (response: any) => {
          console.log("getLogsWithDetails : ", response);
          if (response.totalLgs && response.totalLgs.length) {
            this.totalLogs = response.totalLgs;
            this.displayData();
          } else {
            this.isDisplay = 1;
            this.noDataFound = {
              text: "There is no logs of this developer",
            };
            this.totalHours = "0";
            this.totalMinutes = "0";
          }
          this.loader = false;
        },
        (error) => {
          this.loader = false;
        }
      );
    } else {
      this.loader = false;
      this.totalLogs = this.totalLogsCopy;
      this.displayData();
      this.isDisplay = 0;
    }
  }

  developerFilter(event) {
    this.isFileter = true;
    this.loader = true;
    if (event && event.length) {
      let finalArray = [];
      var arr = event;
      var texts = arr.map(function (el) {
        // finalArray.push(el._id)
        return el._id;
      });

      let obj = {
        userArray: texts,
      };

      this.router.navigate(["/user-logs"], { queryParams: { user: texts } });
      this.projectService.getLogsWithDetails(obj).subscribe(
        (response: any) => {
          console.log("Total logs response  : ", response);
          if (response.totalLgs && response.totalLgs.length) {
            this.totalLogs = response.totalLgs;
            // including the Admin as well.
            response.totalUser.push({
              email: this.currentUser.email,
              name: this.currentUser.name,
              _id: this.currentUser._id,
            });
            this.displayData();
            this.searchLogs = response.totalLgs;
            this.totalLogsCopy = response.totalLgs;
            this.allUsersList = response.totalUser;
            this.allProjectList = response.allProjects;
          } else {
            this.isDisplay = 1;
            this.noDataFound = {
              text: "There is no logs of this developer",
            };
            this.totalHours = "0";
            this.totalMinutes = "0";
          }
          this.loader = false;
        },
        (error) => {
          this.loader = false;
        }
      );
    } else {
      this.totalLogs = this.totalLogsCopy;
      this.displayData();
      this.isDisplay = 0;
    }
  }

  filterOnProject(event) {
    this.loader = true;

    if (event && event.length) {
      this.filterReset = false;
      this.displayReset = true;
      let finalArray = [];
      var arr = event;
      var texts = arr.map(function (el) {
        // finalArray.push(el)
        return el._id;
      });
      let obj = {
        projectArray: texts,
      };

      this.router.navigate(["/user-logs"], {
        queryParams: { projects: texts },
      });
      this.projectService.getLogsWithDetails(obj).subscribe(
        (response: any) => {
          if (response.totalLgs && response.totalLgs.length) {
            this.searchLogs = response.totalLgs;
            this.totalLogs = response.totalLgs;
            this.displayData();
          } else {
            this.isDisplay = 1;
            this.noDataFound = {
              text: "There is no logs of this project",
            };
            this.totalHours = "0";
            this.totalMinutes = "0";
          }
          this.loader = false;
        },
        (error) => {
          this.loader = false;
        }
      );
    } else {
      this.totalLogs = this.totalLogsCopy;
      this.displayData();
      this.loader = false;
      this.isDisplay = 0;
      this.displayReset = false;
    }
  }

  projectFilter(event) {
    this.loader = true;
    if (event && event.length) {
      // this.filterReset = false
      // this.displayReset = true
      let finalArray = [];
      var arr = event;
      var texts = arr.map(function (el) {
        // finalArray.push(el)
        return el._id;
      });
      let obj = {
        projectArray: texts,
      };

      this.router.navigate(["/user-logs"], {
        queryParams: { projects: texts },
      });
      this.projectService.getLogsWithDetails(obj).subscribe(
        (response: any) => {
          if (response.totalLgs && response.totalLgs.length) {
            this.totalLogs = response.totalLgs;
            // this.totalLogsCopy = response.totalLogs
            this.searchLogs = response.totalLgs;
            this.allUsersList = response.totalUser;
            this.allProjectList = response.allProjects;
            this.displayData();
          } else {
            this.isDisplay = 1;
            this.noDataFound = {
              text: "There is no logs of this project",
            };
            this.totalHours = "0";
            this.totalMinutes = "0";
          }
          this.loader = false;
        },
        (error) => {
          this.loader = false;
        }
      );
    } else {
      this.totalLogs = this.totalLogsCopy;
      this.displayData();
    }
  }

  filterOnProjectAndDeveloper(event) {
    this.loader = true;
    this.filterReset = false;
    this.displayReset = true;
    var arr1 = event.projectArray;
    var texts = arr1.map(function (el) {
      // finalArray.push(el)
      return el._id;
    });
    var arr2 = event.developerArray;
    var texts1 = arr2.map(function (el) {
      // finalArray.push(el)
      return el._id;
    });
    let obj = {
      userArray: texts1,
      projectArray: texts,
    };

    this.router.navigate(["/user-logs"], {
      queryParams: { user: texts1, projects: texts },
    });
    this.projectService.getLogsWithDetails(obj).subscribe(
      (response: any) => {
        if (response.totalLgs && response.totalLgs.length) {
          this.totalLogs = response.totalLgs;
          this.displayData();
        } else {
          this.isDisplay = 1;
          this.noDataFound = {
            text: "There is no logs of this developer in this project",
          };
          this.totalHours = "0";
          this.totalMinutes = "0";
        }
        this.loader = false;
      },
      (error) => {
        this.loader = false;
      }
    );
  }

  projectDeveloperFilter(event) {
    this.loader = true;
    var arr1 = event.projectArray;
    var texts = arr1.map(function (el) {
      // finalArray.push(el)
      return el._id;
    });
    var arr2 = event.developerArray;
    var texts1 = arr2.map(function (el) {
      // finalArray.push(el)
      return el._id;
    });
    let obj = {
      userArray: texts1,
      projectArray: texts,
    };

    this.router.navigate(["/user-logs"], {
      queryParams: { user: texts1, projects: texts },
    });
    this.projectService.getLogsWithDetails(obj).subscribe(
      (response: any) => {
        console.log("projectDeveloperFilter : ", response);
        if (response.totalLgs && response.totalLgs.length) {
          this.totalLogs = response.totalLgs;
          this.displayData();
          this.searchLogs = response.totalLgs;
          this.allUsersList = response.totalUser;
          this.allProjectList = response.allProjects;
          // this.totalLogsCopy = response.totalLogs
        } else {
          this.isDisplay = 1;
          this.noDataFound = {
            text: "There is no logs of this developer in this project",
          };
          this.totalHours = "0";
          this.totalMinutes = "0";
        }
        this.loader = false;
      },
      (error) => {
        this.loader = false;
      }
    );
  }

  resetFilter() {
    console.log("this.totalLogsCopy : ", this.totalLogsCopy);
    if (this.totalLogsCopy && this.totalLogsCopy.length) {
      this.totalLogs = JSON.parse(JSON.stringify(this.totalLogsCopy));
      this.searchLogs = this.totalLogsCopy;
      this.filterReset = true;
      this.displayReset = false;
      this.isDisplay = 0;
      this.displayData();
      this.router.navigate(["/user-logs"]);
    } else {
      this.filterReset = true;
      this.displayReset = false;
      this.isDisplay = 1;
      this.noDataFound = {
        text: "There is no logs",
      };
      this.totalHours = "0";
      this.totalMinutes = "0";
      this.router.navigate(["/user-logs"]);
    }
  }
  approveTime(log) {
    this.loader = true;
    this.projectService.getVerifyLogs(log._id).subscribe(
      (response: any) => {
        let displayData;

        if (response.logs) {
          displayData = {
            taskTitle: log.taskId.title,
            difference: log.difference,
            taskDescription: log.taskId.description,
            timeDescription: log.description,
            hours: response.logs.hours,
            minutes: response.logs.minutes,
            reason: response.logs.reason,
            edit: true,
            verifyId: response.logs._id,
            timeLogId: log._id,
          };
        } else {
          let tempDiff = log.difference.split(":");
          displayData = {
            taskTitle: log.taskId.title,
            difference: log.difference,
            taskDescription: log.taskId.description,
            timeDescription: log.description,
            timeLogId: log._id,
            hours: tempDiff[0],
            minutes: tempDiff[1],
            // reason: response.reason
          };
        }
        let data = displayData;
        var taskDetails = this.openDialog(
          ApproveLogsModelComponent,
          data
        ).subscribe((response) => {
          if (response != undefined) {
            let tempElement = this.totalLogs.filter(
              (x) => x._id === response.timelogId
            );
            let index = this.totalLogs.findIndex(
              (x) => x._id === response.timelogId
            );

            let tempTime = tempElement[0].difference.split(":");
            let totalMili =
              Number(Number(tempTime[0]) * (60000 * 60)) +
              Number(Number(tempTime[1]) * 60000);

            let verifyTime =
              Number(Number(response.hours) * (60000 * 60)) +
              Number(Number(response.minutes) * 60000);

            if (totalMili == verifyTime) {
              this.totalLogs[index]["isverify"] = true;
              this.totalLogs[index]["verifyLogs"] = response;
            } else {
              this.totalLogs[index]["isverify"] = false;
              this.totalLogs[index]["verifyLogs"] = response;
            }
          }
        });
        this.loader = false;
      },
      (error) => {
        this.loader = false;
      }
    );
  }

  openDialog(someComponent, data = {}): Observable<any> {
    const dialogRef = this.dialog.open(someComponent, { data });
    return dialogRef.afterClosed();
  }

  onKey(searchText) {
    let message = document.getElementById("message");
    if (!this.totalLogs) {
      // let message = document.getElementById('message')
      if (searchText) {
        message.innerHTML = "There is no search result";
      } else {
        message.innerHTML = "";
      }
    } else {
      var dataToBeFiltered = this.searchLogs;
      var task = this.searchTextFilter.transform8(dataToBeFiltered, searchText);

      this.totalLogs = [];
      if (task.length > 0) {
        let message = document.getElementById("message");
        message.innerHTML = "";
      }
      if (task.length > 0) {
        this.totalLogs = task;
        this.displayData();
      } else {
        message.innerHTML = "There is no search result";
        this.totalHours = "0";
        this.totalMinutes = "0";
        this.displayData();
        this.isDisplay = -1;
        // this.totalLogs = []
      }
    }
  }

  openTaskModel(taskId) {
    let obj = {
      task: taskId,
      projectId: taskId.projectId._id,
      displayButton: false,
    };
    let data = obj;
    var taskDetails = this.openDialog(
      SingleTaskDetailsComponent,
      data
    ).subscribe((response) => {});
  }
}
