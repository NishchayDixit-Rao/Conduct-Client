import { Component, OnInit, HostListener, EventEmitter } from "@angular/core";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { ProjectService } from "../services/project.service";
import { AlertService } from "../services/alert.service";
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import * as DecoupledEditor from "@ckeditor/ckeditor5-build-classic";
import { ChangeEvent } from "@ckeditor/ckeditor5-angular/ckeditor.component";
import { SearchTaskPipe } from "../search-task.pipe";
import { ChildComponent } from "../child/child.component";
import { config } from "../config";
import { LeaveComponent } from "../leave/leave.component";
declare var $: any;
import * as _ from "lodash";
import { CommentService } from "../services/comment.service";
import * as moment from "moment";
import { Chart } from "chart.js";
import Swal from "sweetalert2";

@Component({
  selector: "app-summary",
  templateUrl: "./summary.component.html",
  styleUrls: ["./summary.component.css"],
})
export class SummaryComponent implements OnInit {
  chart = [];
  tracks: any;
  modalTitle;
  comments: any;
  public model = {
    editorData: "Enter comments here",
  };
  projectManager;
  url;
  searchText;
  newTask;
  task;
  tasks;
  projects: any;
  project;
  pror;
  comment;
  projectId;
  allStatusList = this._projectService.getAllStatus();
  allPriorityList = this._projectService.getAllProtity();
  editTaskForm;
  developers: any;
  loader: boolean = false;
  developerId;
  currentDate = new Date();
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  pro;
  allcompleteproject;
  projectTeam: any;
  Teams;
  myresponse: any;
  selectedProjectId;
  selectedDeveloperId = "all";
  Team;
  completedTask;
  projectLength;
  total: any;
  round: any;
  allCount: any;
  path = config.baseMediaUrl;
  activeSprint: any;
  sprintInfo: any;
  status: any;
  sprints;
  newSprint = [];
  currentsprintId;
  taskId;
  id;
  statusp: any = [];
  taskArr = [];
  selectedSprint: "all";
  public myChart: Chart;
  public myChart1: Chart;
  notActiveSprint;

  constructor(
    public _projectService: ProjectService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((param) => {
      this.projectId = param.id;
      this.getEmptyTracks();
      // this.getProject(this.projectId);
      // this.getTeamByProjectId(this.projectId);
      // this.getTaskbyProject(this.projectId);
      this.getProject1(this.projectId);
      // this.getProject(this.projectId);
      // this.getsummary(this.projectId);
    });
    this.createEditTaskForm();
  }
  ngOnInit() {
    this.getEmptyTracks();
    this.getSprint(this.projectId);
    this.getProject1(this.id);
  }
  getEmptyTracks() {
    

    this.tracks = [
      {
        title: "Todo",
        id: "to do",
        class: "primary",
        tasks: [],
      },
      {
        title: "In Progress",
        id: "in progress",
        class: "info",
        tasks: [],
      },
      {
        title: "Testing",
        id: "testing",
        class: "warning",
        tasks: [],
      },
      {
        title: "Done",
        id: "complete",
        class: "success",
        tasks: [],
      },
    ];

    
  }
  getPriorityClass(priority) {
    switch (Number(priority)) {
      case 4:
        return { class: "primary", title: "Low" };
        break;

      case 3:
        return { class: "warning", title: "Medium" };
        break;

      case 2:
        return { class: "success", title: "High" };
        break;

      case 1:
        return { class: "danger", title: "Highest" };
        break;

      default:
        return "";
        break;
    }
  }

  createEditTaskForm() {
    this.editTaskForm = new FormGroup({
      title: new FormControl("", Validators.required),
      desc: new FormControl("", Validators.required),
      assignTo: new FormControl("", Validators.required),
      priority: new FormControl("", Validators.required),
      dueDate: new FormControl("", Validators.required),
      status: new FormControl(
        { value: "", disabled: true },
        Validators.required
      ),
    });
  }

  getSprint(projectId) {
    this._projectService.getSprint(projectId).subscribe(
      (res: any) => {
        
        this.sprints = res;
        _.forEach(this.sprints, (sprint) => {
          
          if (sprint.status == "Active") {
            this.activeSprint = sprint;
            
            this.sprintInfo = sprint;
            this.sprintInfo.startDate = moment(sprint.startDate).format(
              "DD MMM YYYY"
            );
            this.sprintInfo.endDate = moment(sprint.endDate).format(
              "DD MMM YYYY"
            );
          } else {
            this.notActiveSprint = sprint;
            
          }
        });
      },
      (err: any) => {
        
      }
    );
  }

  filterTracks(sprintId) {
    this.getEmptyTracks();
    this.selectedSprint = sprintId;
    this.currentsprintId = sprintId;
    
    _.forEach(this.project, (task) => {
      _.forEach(this.tracks, (track) => {
        if (
          this.currentUser.userRole != "Manager" &&
          this.currentUser.userRole != "admin"
        ) {
          if (task.sprint._id == sprintId && track.id == task.status) {
            track.tasks.push(task);
          }
        } else {
          if (task.status == track.id) {
            track.tasks.push(task);
          }
        }
      });
    });
    var completedTask = this.getCompletedTask("complete");
    var projectLength = this.getTask();
    this.allCount = projectLength;
    
    var allcompleteproject = (completedTask * 100) / projectLength;
    this.total = allcompleteproject;
    this.round = Math.round(this.total);
    var ctx = document.getElementById("myChart");
    if (this.myChart1) this.myChart1.destroy();
    this.myChart1 = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["to do", "In Progress", "testing", "Complete"],
        datasets: [
          {
            label: "# of Tasks",
            data: this.getTaskCountEachTrack(this.tracks),
            backgroundColor: [
              "rgba(24, 17, 35, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
            ],
            borderColor: [
              "rgba(255,99,132,1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
    var ctxL = document.getElementById("lineChart");
    var myLineChart = new Chart(ctxL, {
      type: "line",
      data: {
        labels: ["To Do", "In Progress", "Testing", "Complete"],
        datasets: [
          {
            label: "Highest Priority",
            data: this.getTaskPriority(1, this.tracks),

            borderColor: ["#DC143C"],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
    var ctxL = document.getElementById("lineChart1");
    var myLineChart = new Chart(ctxL, {
      type: "line",
      data: {
        labels: ["To Do", "In Progress", "Testing", "Complete"],
        datasets: [
          {
            label: "High Priority",
            data: this.getTaskPriority(2, this.tracks),

            borderColor: ["#ff8100"],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
    var ctxP = document.getElementById("pieChart5");
    if (this.myChart) this.myChart.destroy();
    this.myChart = new Chart(ctxP, {
      type: "pie",
      data: {
        labels: ["To Do", "In Progress", "Testing", "Complete"],
        datasets: [
          {
            data: this.getTaskCountEachTrack(this.tracks),
            backgroundColor: ["#181123", "#3998c5", "#91b9cc", "#cacbcc"],
            hoverBackgroundColor: ["gray", "gray", "gray", "gray"],
          },
        ],
      },
      options: {
        responsive: true,
        legend: {
          position: "left",
          labels: {
            boxwidth: 12,
          },
        },
      },
    });
  }

  getCompletedTask(status) {
    var sprint = this.selectedSprint;
    return _.filter(this.project, function (o) {
      if (o.sprint._id == sprint && o.status == status) return o;
    }).length;
  }

  getTaskCountEachTrack(tracks) {
    var sprint = this.selectedSprint;
    var count1 = [];
    _.forEach(tracks, (track) => {
      count1.push(
        _.filter(this.project, function (o) {
          if (o.sprint._id == sprint && o.status == track.id) return o;
        }).length
      );
    });
    
    return count1;
  }

  getTask() {
    var sprint = this.selectedSprint;
    
    return _.filter(this.project, function (o) {
      if (o.sprint._id == sprint) return o;
    }).length;
  }

  getTaskPriority(priority, tracks) {
    var sprint = this.selectedSprint;
    var count = [];
    _.forEach(tracks, (track) => {
      count.push(
        _.filter(this.project, function (o) {
          if (
            o.priority == priority &&
            o.status == track.id &&
            o.sprint._id == sprint
          )
            return o;
        }).length
      );
    });
    
    return count;
  }

  getProject1(id) {
    
    this.loader = true;
    setTimeout(() => {
      this._projectService.getProjectById(id).subscribe(
        (res: any) => {
          
          this.selectedProjectId = id;
          
          this.pro = res;
          
          this._projectService.getTeamByProjectId(id).subscribe(
            (res: any) => {
              
              // var Manager = res.teams.pmanagerId;
              // res.Teams.push(this.pro);
              this.projectTeam = res.Teams;
              // this.Manager = res.Teams[0].pmanagerId;
              // 
              this.projectTeam.sort(function (a, b) {
                if (a.name && b.name) {
                  var nameA = a.name.toLowerCase(),
                    nameB = b.name.toLowerCase();
                  if (nameA < nameB) return -1;
                  if (nameA > nameB) return 1;
                  return 0;
                  // this.projectTeam.push
                }
              });
              
            },
            (err: any) => {
              
            }
          );
        },
        (err: any) => {
          
        }
      );
      this._projectService.getTaskById(id).subscribe(
        (res: any) => {
          123412;
          this.getEmptyTracks();
          this.project = res;
          this.pror = res;
          this.project.sort(custom_sort);
          this.project.reverse();
          
          let length;
          _.forEach(this.project, (status) => {
            // 
            if (status.sprint.status == "Active") {
              
              this.status = status.sprint.status;
              this.statusp.push(this.status);
              this.allCount = this.statusp.length;
              
            }
          });
          if (this.statusp == "Active") {
            _.forEach(this.project, (task) => {
              // 
              _.forEach(this.tracks, (track) => {
                // 
                if (
                  this.currentUser.userRole != "Manager" &&
                  this.currentUser.userRole != "admin"
                ) {
                  if (
                    task.sprint._id == this.activeSprint._id &&
                    track.id == task.status &&
                    task.sprint.status == "Active"
                  ) {
                    track.tasks.push(task);
                  }
                } else {
                  if (
                    task.status == track.id &&
                    task.sprint.status == "Active"
                  ) {
                    track.tasks.push(task);
                  }
                }
              });
              
          
            });
            this.loader = false;
            setTimeout(() => {
              var completedTask = this.getCompletedTask1("complete");
              

              var projectLength = this.getTask1();
              
              this.allCount = projectLength;
              var allcompleteproject = (completedTask * 100) / projectLength;
              

              this.total = allcompleteproject;
              

              this.round = Math.round(this.total);
              

              var ctx = document.getElementById("myChart");
              if (this.myChart1) this.myChart1.destroy();
              this.myChart1 = new Chart(ctx, {
                type: "bar",
                data: {
                  labels: ["to do", "In Progress", "testing", "Complete"],
                  datasets: [
                    {
                      label: "# of Tasks",
                      data: [
                        this.tracks[0].tasks.length,
                        this.tracks[1].tasks.length,
                        this.tracks[2].tasks.length,
                        this.tracks[3].tasks.length,
                      ],
                      backgroundColor: [
                        "rgba(24, 17, 35, 0.2)",
                        "rgba(57, 152, 197, 0.2)",
                        "rgba(145, 185, 204, 0.2)",
                        "rgba(202, 203, 204, 0.2)",
                      ],
                      borderColor: [
                        "rgba(24, 17, 35,1)",
                        "rgba(57, 152, 197, 1)",
                        "rgba(145, 185, 204, 1)",
                        "rgba(202, 203, 204, 1)",
                      ],
                      borderWidth: 1,
                      hoverBackgroundColor: ["gray", "gray", "gray", "gray"],
                    },
                  ],
                },
                options: {
                  scales: {
                    yAxes: [
                      {
                        ticks: {
                          beginAtZero: true,
                        },
                      },
                    ],
                  },
                },
              });
              var ctxL = document.getElementById("lineChart");
              var myLineChart = new Chart(ctxL, {
                type: "line",
                data: {
                  labels: ["To Do", "In Progress", "Testing", "Complete"],
                  datasets: [
                    {
                      label: "Highest Priority",
                      data: this.getTaskPriority1(1, this.tracks),

                      borderColor: ["#DC143C"],
                      borderWidth: 2,
                    },
                  ],
                },
                options: {
                  responsive: true,
                },
              });
              var ctxL = document.getElementById("lineChart1");
              var myLineChart = new Chart(ctxL, {
                type: "line",
                data: {
                  labels: ["To Do", "In Progress", "Testing", "Complete"],
                  datasets: [
                    {
                      label: "High Priority",
                      data: this.getTaskPriority1(2, this.tracks),

                      borderColor: ["#ff8100"],
                      borderWidth: 2,
                    },
                  ],
                },
                options: {
                  responsive: true,
                },
              });
              var ctxP = document.getElementById("pieChart5");
              if (this.myChart) this.myChart.destroy();
              this.myChart = new Chart(ctxP, {
                type: "pie",
                data: {
                  labels: [
                    "To Do" + " =" + this.tracks[0].tasks.length,
                    "In Progress" + " = " + this.tracks[1].tasks.length,
                    "Testing" + " = " + this.tracks[2].tasks.length,
                    "Complete" + " = " + this.tracks[3].tasks.length,
                  ],
                  datasets: [
                    {
                      data: [
                        this.tracks[0].tasks.length,
                        this.tracks[1].tasks.length,
                        this.tracks[2].tasks.length,
                        this.tracks[3].tasks.length,
                      ],
                      backgroundColor: [
                        "#181123",
                        "#3998c5",
                        "#91b9cc",
                        "#cacbcc",
                      ],
                      hoverBackgroundColor: ["gray", "gray", "gray", "gray"],
                    },
                  ],
                },
                options: {
                  responsive: true,
                  legend: {
                    position: "left",
                    labels: {
                      boxwidth: 12,
                    },
                  },
                },
              });
            }, 1000);
          } else {
            this._projectService.getTeamByProjectId(id).subscribe(
              (res: any) => {
                
              
                // var Manager = res.teams.pmanagerId;
                // res.Teams.push(this.pro);
                this.projectTeam = res.Teams;
                // this.Manager = res.Teams[0].pmanagerId;
                // 
                this.projectTeam.sort(function (a, b) {
                  if (a.name && b.name) {
                    var nameA = a.name.toLowerCase(),
                      nameB = b.name.toLowerCase();
                    if (nameA < nameB) return -1;
                    if (nameA > nameB) return 1;
                    return 0;
                    // this.projectTeam.push
                  }
                });
                
              },
              (err: any) => {
                
              }
            );
            _.forEach(this.project, (task) => {
              // 
              _.forEach(this.tracks, (track) => {
                // 
                if (
                  this.currentUser.userRole != "Manager" &&
                  this.currentUser.userRole != "admin"
                ) {
                  if (
                    task.status == track.id &&
                    task.assignTo &&
                    task.assignTo._id == this.currentUser._id
                  ) {
                    
                    track.tasks.push(task);
                  }
                } else {
                  if (task.status == track.id) {
                    track.tasks.push(task);
                  }
                }
              });
            });
            this.loader = false;
            setTimeout(() => {
              
           
              var completedTask = this.getCompletedTaskproject("complete");
              

              var projectLength = this.project.length;
              

              var allcompleteproject = (completedTask * 100) / projectLength;
              

              this.total = allcompleteproject;
              

              this.round = Math.round(this.total);
              

              var ctx = document.getElementById("myChart");
              var myChart = new Chart(ctx, {
                type: "bar",
                data: {
                  labels: ["to do", "In Progress", "testing", "Complete"],
                  datasets: [
                    {
                      label: "# of Tasks",
                      // data:[7,14,43,33],
                      data: [
                        this.tracks[0].tasks.length,
                        this.tracks[1].tasks.length,
                        this.tracks[2].tasks.length,
                        this.tracks[3].tasks.length,
                      ],
                      backgroundColor: [
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(255, 206, 86, 0.2)",
                        "rgba(75, 192, 192, 0.2)",
                      ],
                      borderColor: [
                        "rgba(255,99,132,1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(75, 192, 192, 1)",
                      ],
                      borderWidth: 1,
                    },
                  ],
                },
                options: {
                  scales: {
                    yAxes: [
                      {
                        ticks: {
                          beginAtZero: true,
                        },
                      },
                    ],
                  },
                },
              });

              var ctxL = document.getElementById("lineChart");
              var myLineChart = new Chart(ctxL, {
                type: "line",
                data: {
                  labels: ["To Do", "In Progress", "Testing", "Complete"],
                  datasets: [
                    {
                      label: "Highest Priority",
                      data: this.getpriority(1, this.tracks),

                      borderColor: ["#DC143C"],
                      borderWidth: 2,
                    },
                  ],
                },
                options: {
                  responsive: true,
                },
              });

              var ctxL = document.getElementById("lineChart1");
              var myLineChart = new Chart(ctxL, {
                type: "line",
                data: {
                  labels: ["To Do", "In Progress", "Testing", "Complete"],
                  datasets: [
                    {
                      label: "High Priority",
                      data: this.getpriority(2, this.tracks),

                      borderColor: ["#ff8100"],
                      borderWidth: 2,
                    },
                  ],
                },
                options: {
                  responsive: true,
                },
              });
              var ctxP = document.getElementById("pieChart5");
              var myPieChart = new Chart(ctxP, {
                type: "pie",
                data: {
                  labels: [
                    "to do" + " =" + this.tracks[0].tasks.length,
                    "In Progress" + " =" + this.tracks[1].tasks.length,
                    "testing" + " =" + this.tracks[2].tasks.length,
                    "Complete" + " =" + this.tracks[3].tasks.length,
                  ],
                  datasets: [
                    {
                      data: [
                        this.tracks[0].tasks.length,
                        this.tracks[1].tasks.length,
                        this.tracks[2].tasks.length,
                        this.tracks[3].tasks.length,
                      ],

                      backgroundColor: [
                        "#ff0000",
                        "#ff8100",
                        "#ffee21",
                        "#0087ff",
                      ],
                      hoverBackgroundColor: [
                        "lightgray",
                        "lightgray",
                        "gray",
                        "gray",
                      ],
                    },
                  ],
                },
                options: {
                  responsive: true,
                  legend: {
                    position: "left",
                    labels: {
                      boxwidth: 12,
                    },
                  },
                },
              });
            }, 1000);
          }
        },
        (err) => {
          
          this.loader = false;
        }
      );
    }, 1000);
    function custom_sort(a, b) {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
  }
  getCompletedTask1(status) {
    var sprint = this.activeSprint._id;
    return _.filter(this.project, function (o) {
      if (o.sprint._id == sprint && o.status == status) return o;
    }).length;
  }

  getTaskPriority1(priority, tracks) {
    var sprint = this.activeSprint._id;
    var count = [];
    _.forEach(tracks, (track) => {
      count.push(
        _.filter(this.project, function (o) {
          if (
            o.priority == priority &&
            o.status == track.id &&
            o.sprint._id == sprint
          )
            return o;
        }).length
      );
    });
    
    return count;
  }

  getTask1() {
    var sprint = this.activeSprint._id;
    return _.filter(this.project, function (o) {
      if (o.sprint._id == sprint) return o;
    }).length;
  }

  getpriority(priority, tracks) {
    var count = [];
    _.forEach(tracks, (track) => {
      count.push(
        _.filter(this.project, function (o) {
          if (o.priority == priority && o.status == track.id) return o;
        }).length
      );
    });
    
    return count;
  }

  getCompletedTaskproject(status) {
    // 
    return _.filter(this.project, function (o) {
      if (o.status == status) return o;
    }).length;
  }
}
