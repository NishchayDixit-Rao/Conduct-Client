import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  HostListener,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ProjectService } from "../../services/project.service";
import { SearchTaskPipe } from "../../search-task.pipe";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { AddTaskComponent } from "../add-task/add-task.component";
import Swal from "sweetalert2";
import * as _ from "lodash";
import { TaskCardComponent } from "../task-card/task-card.component";
import { SingleTaskDetailsComponent } from "../single-task-details/single-task-details.component";
import { MatDialog } from "@angular/material";
import { Observable } from "rxjs";
import * as moment from "moment";
import { retry } from "rxjs/operators";
import { async } from "@angular/core/testing";
// import { interval } from "rxjs";
import { TimeIntervalService } from "../../services/time-interval.service";
import { interval } from "rxjs";
import { exit } from "process";

declare var $: any;
@Component({
  selector: "app-single-project-details",
  templateUrl: "./single-project-details.component.html",
  styleUrls: ["./single-project-details.component.css"],
})
export class SingleProjectDetailsComponent implements OnInit {
  // @Output() dueDate: EventEmitter<any> = new EventEmitter();
  @Output() priority: EventEmitter<any> = new EventEmitter();
  @Output() taskUnique: EventEmitter<any> = new EventEmitter();
  dueDateSort;
  projectId;
  tracks;
  pro;
  taskList;
  searchList;
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  totalTeam: any = [];
  singleTask;
  sendTeam = [];
  searchText;
  taskLength;
  filterReset;
  sortingReset;
  taskListCopy;
  isDisplay = 0;
  noDataFound;

  taskLimit: number = 3;

  sortingList = [
    {
      displayName: "Due Date",
    },
    {
      displayName: "Priority",
    },
    {
      displayName: "Task",
    },
  ];
  displayFilter = [
    {
      displayName: "Developer",
    },
    {
      displayName: "Due Date",
    },
    {
      displayName: "Task Type",
    },
    {
      displayName: "Priority",
    },
  ];
  displayType = [
    {
      name: "Task",
      icon: "icon-list",
    },
    {
      name: "Issue",
      icon: "icon-energy",
    },
    {
      name: "Bugg",
      icon: "icon-question",
    },
  ];
  Priority = [
    {
      name: "Low",
    },
    {
      name: "Medium",
    },
    {
      name: "High",
    },
    {
      name: "Highest",
    },
  ];
  displayReset = false;
  displayButton = true;
  loader = false;
  paramsData;
  allProjectList = [];
  itemListPage;
  isMenu = true;
  sideMenuButton;
  public intervalTimer = interval(60000);

  private intervalSubscription;
  @HostListener("window:popstate", ["$event"])
  onPopState(event) {
    this.activated.queryParams.subscribe((params) => {
      this.paramsData = params;

      let temp = Object.keys(this.paramsData).length;
      if (temp != 0) {
        // this.opentaskModel(this.paramsData);
        this.router.navigate(['projects']);
      }
    });
    // let newRoute = event.target.location.pathname.split("/")
    //
    // this.currentUrl = newRoute[1]
    // //
    // if (!this.currentUrl) {
    //   this.currentUrl = this.router.url
    // }
    // //
    //
  }

  ngOnDestroy() {
    this.intervalSubscription.unsubscribe();
  }

  constructor(
    private route: ActivatedRoute,
    public projectService: ProjectService,
    public searchTextFilter: SearchTaskPipe,
    public dialog: MatDialog,
    public activated: ActivatedRoute,
    public router: Router // public timeIntervalService: TimeIntervalService
  ) {
    this.route.params.subscribe((param) => {
      this.projectId = param.id;
      // this.getEmptyTracks();
      if (this.projectId) {
        this.getProject(this.projectId, true);
        this.sideMenuButton = true;
      } else {
        let obj = {
          displayName: "Projects",
        };
        this.displayFilter.push(obj);
        this.getAllTaskOfProjects();
        this.isMenu = false;
      }
    });
  }

  getCurrentUser() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    let userID = user._id;
    if (this.pro) {
      this.pro.teamMembers.forEach((member) => {
        if (member._id === userID) {
          this.currentUser.userRole = member.userRole;
        }
      });
      this.pro.projectManager.forEach((member) => {
        if (member._id === userID) {
          this.currentUser.userRole = member.userRole;
        }
      });
    }
  }
  ngOnInit() {
    localStorage.removeItem("tempProject");
    $("#circularMenu a.floating-btn").click(() => {
      $("#circularMenu").toggleClass("active");
    });
    $("menu a.menu-item").click(() => {
      $("#circularMenu").removeClass("active");
    });

    this.subscribTimeInterval();
  }

  subscribTimeInterval() {
    /**
     * This interval runs every 5min and get the updated proejct.
     * so that every user has a updated Trasks.
     */

    this.intervalSubscription = this.intervalTimer.subscribe(
      (x) => {
        this.getProject(this.projectId, false);
      },
      (err) => {
        console.log("Error in interval: ", err);
      }
    );
    // this.timeIntervalService.startInterval().subscribe((z) => {
    //   this.getProject(this.projectId, false);
    // });
    // this.timeIntervalService.startInterval().then(
    //   (x) => {
    //     this.getProject(this.projectId, false);
    //   },
    //   (err) => {
    //     console.log("Error in time-interval service");
    //   }
    // );
  }

  opentaskModel(task) {
    console.log("TaskDetails:", this.paramsData.taskDetails);
    let taskId = this.paramsData.taskDetails;
    let taskDetails = this.taskListCopy.find((x) => x._id == taskId);

    let obj = {
      task: taskDetails,
      projectId: this.projectId,
      team: this.totalTeam,
    };
    let data = obj;
    var taskDetail = this.openDialog(
      SingleTaskDetailsComponent,
      data
    ).subscribe((response) => {
      console.log("response : ", response);
      this.subscribTimeInterval();
      if (response == undefined) {
        if (this.projectId == undefined) {
          this.router.navigate(["/tasks"]);
        } else {
          this.router.navigate(["/task-list/" + this.projectId]);
        }
        // this.router.navigate(['/task-list/' + this.projectId]);
      } else {
        if (response && response.status) {
          this.changeStatus(response);
          // this.statusChange.emit(response)
        }
      }
      // if (response && response.task) {
      //   this.updateTaskDetails(response.task)
      // }
      // if (response && response.deleteTask) {
      //   this.removeTask(response.deleteTask)
      // }
    });
  }

  // getEmptyTracks() {
  //   console.log("getEmptyTracks : ", this.currentUser);
  //   if (
  //     this.currentUser.userRole == "Manager" ||
  //     this.currentUser.userRole == "admin"
  //   ) {
  //     this.tracks = [
  //       {
  //         title: "Todo",
  //         id: "To Do",
  //         class: "primary",
  //         tasks: [],
  //       },
  //       {
  //         title: "In Progress",
  //         id: "In Progress",
  //         class: "info",
  //         tasks: [],
  //       },
  //       {
  //         title: "Testing",
  //         id: "Testing",
  //         class: "warning",
  //         tasks: [],
  //       },
  //       {
  //         title: "Done",
  //         id: "Done",
  //         class: "success",
  //         tasks: [],
  //       },
  //     ];
  //     //
  //   } else {
  //     this.tracks = [
  //       {
  //         title: "Todo",
  //         id: "To Do",
  //         class: "primary",
  //         tasks: [],
  //       },
  //       {
  //         title: "In Progress",
  //         id: "In Progress",
  //         class: "info",
  //         tasks: [],
  //       },
  //       {
  //         title: "Testing",
  //         id: "Testing",
  //         class: "warning",
  //         tasks: [],
  //       },
  //     ];
  //     //
  //   }
  // }

  getAllTaskOfProjects() {
    this.loader = true;
    this.projectService.getAllTasks().subscribe(
      (response: any) => {
        this.taskList = response.data.taskList;
        this.totalTeam = response.data.allUsers;
        this.taskListCopy = response.data.taskList;
        this.allProjectList = response.data.projects;
        this.searchList = this.taskList;
        this.taskLength = this.taskList.length;


        // this.itemListPage = true
        /**
         * 
         */
        console.log("abc :",);
        console.log("Total Tracks : ", this.tracks);


        this.activated.queryParams.subscribe((params) => {
          this.paramsData = params;
          // this.paramsData = params.taskDetails
        });
        let temp = Object.keys(this.paramsData).length;

        if (temp != 0) {
          let taskId = this.paramsData.taskDetails;
          let taskDetails = this.taskList.find((x) => x._id == taskId);

          let obj = {
            task: taskDetails,
            // projectId: this.projectId,
            team: this.totalTeam,
          };

          // console.log("taskLength :", taskDetails);
          let data = obj;
          var taskDetail = this.openDialog(
            SingleTaskDetailsComponent,
            data
          ).subscribe((response) => {
            if (response == undefined) {
              this.router.navigate(["/tasks"]);
            } else {
              if (response && response.status) {
                this.changeStatus(response);
                // this.statusChange.emit(response)
              }
            }
            // if (response && response.task) {
            //   this.updateTaskDetails(response.task)
            // }
            // if (response && response.deleteTask) {
            //   this.removeTask(response.deleteTask)
            // }
          });
        } else {
        }

        this.loader = false;
      },
      (error) => {
        this.loader = false;
      }
    );
  }

  getDefaultTracks() {
    return (this.tracks = [
      {
        title: "Todo",
        id: "To Do",
        class: "primary",
        tasks: [],
      },
      {
        title: "In Progress",
        id: "In Progress",
        class: "info",
        tasks: [],
      },
      {
        title: "Testing",
        id: "Testing",
        class: "warning",
        tasks: [],
      },
      {
        title: "Done",
        id: "Done",
        class: "success",
        tasks: [],
      },
    ]);
  }

  getProjectTracks(workFlowList) {
    let tempTracks = [];
    if (workFlowList) {
      console.log("workFlowList : ", workFlowList);
      workFlowList.tracks.forEach((track) => {
        let newTrack = {
          title: track.track,
          id: track.track,
          class: "primary",
          tasks: [],
        };
        tempTracks.push(newTrack);
      });
      this.tracks = tempTracks;
      console.log("this is dynamic track : ", this.tracks);
    } else {
      this.tracks = this.getDefaultTracks();
      console.log("This is default tracks : ", this.tracks);
    }
  }

  /**
   * @param id of the particular project.
   * @param isLoading if it's first time call then value is TRUE else value is FALSE.
   * else it calles every 5min with 'interval' to refresh the updated data.
   */
  getProject(id, isLoading) {
    this.loader = isLoading
    this.projectService.getProjectById(id).subscribe(
      (response: any) => {
        console.log("response :: ", response);
        this.getProjectTracks(response.data.workFlow[0]);
        this.pro = response.data;
        this.getCurrentUser();

        /**
         * 
        let resp = response.data.workFlow[0].tracks;

        console.log("Total Tracks :", resp);
        let arr = [];

        resp.forEach(element => {
          console.log("Total Tracks :", element.track);
          arr.push(element.track);
        });
        console.log("Total Tracks :", arr);

        

         */
        console.log("Total Tracks :", this.tracks);

        /**
         * 
         */


        this.pro.teamMembers.forEach((single) => {
          // let obj = {
          //   _id: single._id,

          // }
          delete single.update;

          single["redirect"] = false;
          this.totalTeam.push(single);
        });
        this.pro.projectManager.forEach((single) => {
          delete single.update;
          single["redirect"] = false;
          this.totalTeam.push(single);
        });
        this.pro.admin.forEach((singleAdmin) => {
          delete singleAdmin.update;
          singleAdmin["redirect"] = false;
          this.totalTeam.push(singleAdmin);
        });
        this.sendTeam = this.totalTeam;

        this.projectService.getTaskById(id).subscribe(
          (response: any) => {
            this.loader = false;
            if (
              this.currentUser.userRole == "Manager" ||
              this.currentUser.userRole == "admin" ||
              this.currentUser.userRole == "Team Member"
            ) {
              if (response.data.response && response.data.response.length) {
                this.taskList = response.data.response[0].tasks;

                console.log("taskList :", this.taskList);
                this.searchList = this.taskList;
                this.taskLength = this.taskList.length;
                this.taskListCopy = response.data.response[0].tasks;
                console.log("taskListCopy::", this.taskListCopy);
              } else {
                this.taskList = [];
                this.searchList = this.taskList;
              }
            } else {
              if (response.data && response.data.length) {
                this.taskList = response.data[0].tasks;
                this.searchList = this.taskList;
                this.taskLength = this.taskList.length;
                this.taskListCopy = response.data[0].tasks;
              } else {
                this.taskList = [];
                this.searchList = this.taskList;
              }
            }

            this.activated.queryParams.subscribe((params) => {
              // let temp = Object.keys(this.paramsData).length
              this.paramsData = params;
            });

            let temp = Object.keys(this.paramsData).length;
            if (temp != 0 && isLoading) {
              let taskId = this.paramsData.taskDetails;
              let taskDetails = this.taskList.find((x) => x._id == taskId);

              let obj = {
                task: taskDetails,
                projectId: this.projectId,
                team: this.totalTeam,
              };
              let data = obj;
              var taskDetail = this.openDialog(
                SingleTaskDetailsComponent,
                data
              ).subscribe((response) => {
                if (response == undefined) {
                  this.router.navigate(["/task-list/" + this.projectId]);
                } else {
                  if (response && response.status) {
                    this.changeStatus(response);
                    // this.statusChange.emit(response)
                  }
                }
                // if (response && response.task) {
                //   this.updateTaskDetails(response.task)
                // }
                // if (response && response.deleteTask) {
                //   this.removeTask(response.deleteTask)
                // }
              });
            } else {
              // const dialogRef = this.dialog.open(SingleTaskDetailsComponent);
              // return dialogRef.afterClosed();
            }
          },
          (error) => {
            this.loader = false;
          }
        );
      },
      (error) => {
        this.loader = false;
      }
    );


  }

  onKey(searchText) {
    let message = document.getElementById("message");
    if (this.searchList && !this.searchList.length) {
      // let message = document.getElementById('message')
      if (searchText) {
        message.innerHTML = "There is no search result";
      } else {
        message.innerHTML = "";
      }
    } else {
      var dataToBeFiltered = this.searchList;
      var task = this.searchTextFilter.transform(dataToBeFiltered, searchText);
      this.taskList = [];
      if (task.length > 0) {
        let message = document.getElementById("message");
        message.innerHTML = "";
      }
      if (task.length > 0) {
        this.taskList = task;
      } else {
        message.innerHTML = "There is no search result";
      }
    }
  }

  onTalkDrop(event: CdkDragDrop<any>) {
    if (
      event.previousContainer.data[
      _.findIndex(event.previousContainer.data, {
        _id: event.item.element.nativeElement.id,
      })
      ]
    ) {
      //
      //
      if (
        event.previousContainer.data[
          _.findIndex(event.previousContainer.data, {
            status: event.previousContainer.id,
          })
        ].running
      ) {
        // Swal.fire('Oops...', 'Stop timer!', 'error')
      } else {
        if (event.previousContainer === event.container) {
          moveItemInArray(
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
        } else {

          //

          console.log("data :: ", event.previousContainer.data);

          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );

          console.log("data :: ", event.container.data);
          const updated = this.updateStatus(
            event.container.id,
            event.container.data[
            _.findIndex(event.container.data, {
              status: event.previousContainer.id,
            })
            ]
          );
          console.log("updated :", updated);
          //
          if (!updated) {
            transferArrayItem(
              event.container.data,
              event.previousContainer.data,
              event.currentIndex,
              event.previousIndex
            );
            this.updateStatus(
              event.previousContainer.id,
              event.previousContainer.data[
              _.findIndex(event.previousContainer.data, {
                status: event.container.id,
              })
              ]
            );
          }

        }
      }
    } else {
      Swal.fire({
        type: "error",
        title: "Sorry!",
        text: "Project's Sprint is not activated",
        animation: false,
        customClass: {
          popup: "animated tada",
        },
      });
      //
    }
    // }
  }

  onTrackDrop(event: CdkDragDrop<any>) {
    //
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

  updateStatus(newStatus, data): boolean {
    //

    localStorage.removeItem("startTime");
    let flag = true;

    console.log("Pro ::", this.pro.workFlow[0]);
    // console.log("Data : ", data);
    // console.log("newStatus : ", newStatus);
    // console.log("Tracks : ", this.tracks);
    // console.log("To do length : ", this.tracks[0].tasks.length);
    let arr = [];
    this.pro.workFlow[0].tracks.forEach(track => {
      console.log(track);
      if (track.isTaskAllowLimit)
        arr.push(track.taskAllowValue);
      else
        arr.push(Number.MAX_SAFE_INTEGER);
    });
    console.log("Array Values:", arr);
    let i = 0;
    this.tracks.forEach(track => {
      if (newStatus === track.title) {
        if (track.tasks.length > arr[i]) {
          Swal.fire("Oops...", `Cannot add more than ${arr[i]} tasks`, "error");
          flag = false;
        }
      }
      i++;
    });


    // localStorage.removeItem('runningStatus')
    // localStorage.removeItem('isTimerRunning')
    if (newStatus == "Done") {
      //
      data.status = newStatus;
      const completeStatus = {
        taskId: data._id,
        status: newStatus,
        movedBy: JSON.parse(localStorage.getItem("currentUser"))._id,
      };
      this.projectService.completeItem(completeStatus).subscribe(
        (res: any) => {
          const status = res.data.data;
          // Swal.fire({
          //   type: "info",
          //   title: status.status,
          //   showConfirmButton: false,
          //   timer: 2000,
          // });
        },
        (err) => {
          Swal.fire("Oops...", "Something went wrong!", "error");
        }
      );
    } else {
      //

      data.status = newStatus;

      //
      //
      const updateStatusOdTask = {
        taskId: data._id,
        status: newStatus,
        movedBy: JSON.parse(localStorage.getItem("currentUser"))._id,
      };
      this.projectService.updateStatus(updateStatusOdTask).subscribe(
        (res: any) => {
          //
          const status = res.data.data;

          // Swal.fire({
          //   type: "info",
          //   title: status.status,
          //   showConfirmButton: false,
          //   timer: 3000,
          // });
        },
        (err: any) => {
          Swal.fire("Oops...", "Something went wrong!", "error");
        }
      );
    }
    return flag;
  }
  changeStatus(event) {
    this.updateStatus(event.status, event.task);
    if (this.projectId) {
      this.projectService.getTaskById(this.projectId).subscribe(
        (response: any) => {
          if (
            this.currentUser.userRole == "Manager" ||
            this.currentUser.userRole == "admin"
          ) {
            if (response.data.response && response.data.response.length) {
              this.taskList = response.data.response[0].tasks;
              this.searchList = this.taskList;
            } else {
              this.taskList = [];
              this.searchList = this.taskList;
            }
          } else {
            if (response.data && response.data.length) {
              this.taskList = response.data[0].tasks;
              this.searchList = this.taskList;
            } else {
              this.taskList = [];
              this.searchList = this.taskList;
            }
          }
        },
        (error) => { }
      );
    } else {
      // this.getAllTaskOfProjects()
      this.projectService.getAllTasks().subscribe(
        (response: any) => {
          this.taskList = response.data.taskList;
          this.totalTeam = response.data.allUsers;
          this.taskListCopy = response.data.taskList;
          this.allProjectList = response.data.projects;
          this.searchList = this.taskList;
          this.taskLength = this.taskList.length;
          // this.itemListPage = true

          // this.loader = false
        },
        (error) => {
          // this.loader = false
        }
      );
    }
  }



  addItem(type) {
    // if (type == "Bugg") {
    //   type = "Bug"
    // }

    if (this.tracks[0].tasks.length >= this.pro.workFlow[0].tracks[0].taskAllowValue) {
      Swal.fire("Oops...", `Cannot add more than ${this.pro.workFlow[0].tracks[0].taskAllowValue} in to do`, "error");
      return;
    }

    let obj = {
      taskType: type,
      projectId: this.projectId,
      total: this.totalTeam,
      edited: false,
    };
    let data = obj;
    var taskDetails = this.openDialog(AddTaskComponent, data).subscribe(
      (response) => {
        //
        if (response != undefined) {
          // this.singleTask = response.task
          // if()
          console.log("taskListCopy:", this.taskListCopy.length);
          this.taskListCopy.push(this.taskListCopy, response.task);
        }
      }
    );
  }

  openDialog(someComponent, data = {}): Observable<any> {
    const dialogRef = this.dialog.open(someComponent, { data });
    return dialogRef.afterClosed();
  }

  dueDateSorting(event) {
    this.dueDateSort = event;
    this.displayReset = true;

    this.sortingReset = false;
  }

  taskPriority(event) {
    this.priority = event;
    this.displayReset = true;

    this.sortingReset = false;
  }
  taskSorting(event) {
    this.taskUnique = event;
    this.displayReset = true;

    this.sortingReset = false;
  }
  resetFilter() {
    this.taskList = JSON.parse(JSON.stringify(this.taskListCopy));
    this.filterReset = true;
    this.sortingReset = true;
    this.displayReset = false;
    this.isDisplay = 0;

    this.searchText = "";
    let message = document.getElementById("message");
    message.innerHTML = "";
    // this.searchText = ''
  }

  filterOnDeveloper(event) {
    if (event && event.length) {
      this.taskList = this.taskListCopy;
      let finalList = event;
      this.displayReset = true;
      this.sortingReset = false;
      this.filterReset = false;
      let array = [];
      var count;
      _.forEach(finalList, (track) => {
        count = _.filter(this.taskList, (o: any) => {
          if ((o.assignTo && o.assignTo._id) == track._id) array.push(o);
          // return o
        });
      });
      //
      if (array && array.length) {
        this.isDisplay = 0;
        this.taskList = JSON.parse(JSON.stringify(array));
      } else {
        // this.taskList = []
        this.isDisplay = 1;
        this.noDataFound = {
          text: "There is no task of this developer",
        };
      }
    } else {
      this.taskList = this.taskListCopy;
      this.isDisplay = 0;
    }
  }
  filterOnType(event) {
    if (event && event.length) {
      this.taskList = this.taskListCopy;
      let finalList = event;
      this.displayReset = true;
      this.filterReset = false;
      this.sortingReset = false;
      let array = [];
      var count;
      _.forEach(finalList, (track) => {
        count = _.filter(this.taskList, (o: any) => {
          if (o.taskType == track.name) array.push(o);
          // return o
        });
      });
      //
      if (array && array.length) {
        this.isDisplay = 0;
        this.taskList = JSON.parse(JSON.stringify(array));
      } else {
        // this.taskList = []
        this.isDisplay = 1;
        this.noDataFound = {
          text: "There is no task of this developer",
        };
      }
    } else {
      this.taskList = this.taskListCopy;
      this.isDisplay = 0;
    }
  }

  filterOnPriority(event) {
    if (event && event.length) {
      this.taskList = this.taskListCopy;
      let finalList = event;
      this.displayReset = true;
      this.filterReset = false;
      this.sortingReset = false;
      let array = [];
      var count;
      _.forEach(finalList, (track) => {
        count = _.filter(this.taskList, (o: any) => {
          if (o.taskPriority == track.name) array.push(o);
          // return o
        });
      });
      //
      if (array && array.length) {
        this.isDisplay = 0;
        this.taskList = JSON.parse(JSON.stringify(array));
      } else {
        // this.taskList = []
        this.isDisplay = 1;
        this.noDataFound = {
          text: "There is no task of this developer",
        };
      }
    } else {
      this.taskList = this.taskListCopy;
      this.isDisplay = 0;
    }
  }

  filterOnDueDate(event) {
    this.taskList = this.taskListCopy;
    this.displayReset = true;
    this.filterReset = false;
    this.sortingReset = false;

    let selectedMembers;
    if (event.startDate.getTime() == event.endDate.getTime()) {
      selectedMembers = this.taskList.filter(
        (m) => m.dueDate == moment(event.startDate).format("YYYY-MM-DD")
      );
    } else {
      selectedMembers = this.taskList.filter(
        (m) =>
          new Date(m.dueDate) >= new Date(event.startDate) &&
          new Date(m.dueDate) <= new Date(event.endDate)
      );
    }

    if (selectedMembers && selectedMembers.length) {
      this.taskList = selectedMembers;
      this.isDisplay = 0;
    } else {
      this.isDisplay = 1;
      this.noDataFound = {
        text: "There is no task between this dates",
      };
      // this.adminUniqueProject = this.adminUniqueProjectCopy
    }
  }

  filterOnProject(event) {
    if (event && event.length) {
      this.taskList = this.taskListCopy;
      let finalList = event;
      this.displayReset = true;
      this.sortingReset = false;
      this.filterReset = false;
      let array = [];
      var count;
      _.forEach(finalList, (track) => {
        count = _.filter(this.taskList, (o: any) => {
          if (o.projectId == track._id) array.push(o);
          // return o
        });
      });
      //
      if (array && array.length) {
        this.isDisplay = 0;
        this.taskList = JSON.parse(JSON.stringify(array));
      } else {
        // this.taskList = []
        this.isDisplay = 1;
        this.noDataFound = {
          text: "There is no task of this project",
        };
      }
    } else {
      this.taskList = this.taskListCopy;
      this.isDisplay = 0;
    }
  }
  filterOnDeveAndProject(event) {
    if (event) {
      let developerArray = event.developerArray;
      let projectArray = event.projectArray;
      this.displayReset = true;
      this.sortingReset = false;
      this.filterReset = false;
      this.taskList = this.taskListCopy;

      let array = [];
      var count;
      _.forEach(developerArray, (track) => {
        count = _.filter(this.taskList, (o: any) => {
          if ((o.assignTo && o.assignTo._id) == track._id) array.push(o);
          // return o
        });
      });

      if (array && array.length) {
        let finalArray = [];
        var count;
        _.forEach(projectArray, (track) => {
          count = _.filter(array, (o: any) => {
            if (o.projectId == track._id) finalArray.push(o);
            // return o
          });
        });

        if (finalArray && finalArray.length) {
          this.isDisplay = 0;
          this.taskList = JSON.parse(JSON.stringify(finalArray));
        } else {
          this.isDisplay = 1;
          this.noDataFound = {
            text: "There is no task in this project",
          };
        }
      } else {
        this.isDisplay = 1;
        this.noDataFound = {
          text: "There is no task of this developer",
        };
      }
    }
  }
}
