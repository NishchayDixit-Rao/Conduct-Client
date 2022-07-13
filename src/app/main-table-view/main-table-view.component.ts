import { Component, OnInit, HostListener } from "@angular/core";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { ProjectService } from "../services/project.service";
import { AlertService } from "../services/alert.service";
import { ActivatedRoute } from "@angular/router";
import { config } from "../config";
import { CommentService } from "../services/comment.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
declare var $: any;
import * as _ from "lodash";
import { SearchTaskPipe } from "../search-task.pipe";
import * as DecoupledEditor from "@ckeditor/ckeditor5-build-classic";
import { ChangeEvent } from "@ckeditor/ckeditor5-angular/ckeditor.component";

@Component({
  selector: "app-main-table-view",
  templateUrl: "./main-table-view.component.html",
  styleUrls: ["./main-table-view.component.css"],
})
export class MainTableViewComponent implements OnInit {
  tracks: any;
  modalTitle;
  comments: any;
  public model = {
    editorData: "",
  };
  url = [];
  commentUrl = [];
  newTask = {
    title: "",
    desc: "",
    assignTo: "",
    status: "to do",
    priority: "low",
    dueDate: "",
    estimatedTime: "",
    images: [],
  };
  task;
  project;
  tasks;
  taskId;
  comment;
  projectId;
  allStatusList = this._projectService.getAllStatus();
  allPriorityList = this._projectService.getAllProtity();
  editTaskForm;
  developers;
  loader: boolean = false;
  currentDate = new Date();
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  files: Array<File> = [];
  path = config.baseMediaUrl;
  searchText;
  projectTeam;
  Teams;
  selectedProjectId = "all";
  selectedDeveloperId = "all";
  priority: boolean = false;
  sorting;
  isTaskFound = false;
  constructor(
    public _projectService: ProjectService,
    private route: ActivatedRoute,
    public _alertService: AlertService,
    public searchTextFilter: SearchTaskPipe,
    public _commentService: CommentService
  ) {
    this.route.params.subscribe((param) => {
      this.projectId = param.id;
    });
    this.getEmptyTracks();
    this.getTasks();
    this.createEditTaskForm();
  }

  getEmptyTracks() {
    
    if (
      this.currentUser.userRole == "Manager" ||
      this.currentUser.userRole == "admin"
    ) {
      this.tracks = [
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
      ];
      
    } else {
      this.tracks = [
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
      ];
      
    }
  }

  getPriorityClass(priority) {
    // 
    switch (priority) {
      case "Low":
        return { class: "primary", title: "Low" };
        break;

      case "Medium":
        return { class: "warning", title: "Medium" };
        break;

      case "High":
        return { class: "success", title: "High" };
        break;

      case "Highest":
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
      startDate: new FormControl("", Validators.required),
      dueDate: new FormControl("", Validators.required),
      status: new FormControl(
        { value: "", disabled: true },
        Validators.required
      ),
      files: new FormControl(),
    });
  }

  ngOnInit() {
    this.getAllDevelopers();
    this.getAllProjects();
    // this.getAllCommentOfTask(this.taskId);
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }

  // func = async (option) => {
  // 	// debugger;
  // 	
  // 	
  // 	var taskId = localStorage.getItem('isTimerRunning');
  // 	
  // 	let isAnyTrackHasTask = false;
  // 	await _.forEach(this.tracks, async (track) => {
  // 	  
  // 	  if (track.tasks.length) {
  // 		isAnyTrackHasTask = true;

  // 	  }

  // 	  await _.forEach(track.tasks, (task) => {
  // 		
  // 		// if (task._id == taskId) {
  // 		//   
  // 		//   if (option == 'reload')
  // 		// 	this.timerUpdate(task);
  // 		//   else if (option == 'load')
  // 		// 	this.startTimer(task);
  // 		// }

  // 	  })
  // 	})
  // 	if (isAnyTrackHasTask) this.isTaskFound = true;
  //   }

  getAllDevelopers() {
    this._projectService.getAllDevelopers().subscribe(
      (res: any) => {
        this.developers = res.data;
        this.developers.sort(function (a, b) {
          if (a.name && b.name) {
            var nameA = a.name.toLowerCase(),
              nameB = b.name.toLowerCase();
            if (nameA < nameB)
              //sort string ascending
              return -1;
            if (nameA > nameB) return 1;
            return 0; //default return value (no sorting)
          }
        });
        
      },
      (err) => {
        
        this._alertService.error(err);
      }
    );
  }

  getTasks() {
    this.loader = true;
    setTimeout(() => {
      this._projectService.getAllTasks().subscribe(
        (res: any) => {
          
          this.getEmptyTracks();
          // this.tracks.tasks.reverse();
          this.tasks = res.data;
          // this.tasks.sort(custom_sort);
          // this.tasks.reverse();
          
          _.forEach(this.tasks, (task) => {
            _.forEach(this.tracks, (track) => {
              if (task.status == track.id) {
                track.tasks.push(task);
              }
            });
          });
          
          this.loader = false;
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

  get trackIds(): string[] {
    return this.tracks.map((track) => track.id);
  }

  onTalkDrop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      this.updateStatus(event.container.id, event.container.data[0]);
    }
  }

  onTrackDrop(event: CdkDragDrop<any>) {
    // 
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

  updateStatus(newStatus, data) {
    if (newStatus == "complete") {
      data.status = newStatus;
      
      this._projectService.completeItem(data).subscribe(
        (res: any) => {
          
          // this.getProject(res.projectId);
        },
        (err) => {
          
        }
      );
    } else {
      data.status = newStatus;
      
      this._projectService.updateStatus(data).subscribe(
        (res: any) => {
          
        },
        (err: any) => {
          
        }
      );
    }
  }

  getTitle(name) {
    if (name) {
      var str = name.split(" ");
      return (
        str[0].charAt(0).toUpperCase() +
        str[0].slice(1) +
        " " +
        str[1].charAt(0).toUpperCase() +
        str[1].slice(1)
      );
    } else {
      return "";
    }
  }

  getInitialsOfName(name) {
    if (name) {
      var str = name.split(" ")[0][0] + name.split(" ")[1][0];
      return str.toUpperCase();
    } else {
      return "";
    }
  }

  addItem(option) {
    this.loader = true;
    setTimeout(() => {
      this.task = {
        title: "",
        desc: "",
        assignTo: "",
        status: "to do",
        priority: "low",
      };
      this.modalTitle = "Add " + option;
      $(".datepicker").pickadate();
      $("#editModel").modal("show");
      this.loader = false;
    }, 1000);
  }

  saveTheData(task) {
    task["projectId"] = this.projectId;
    task["type"] = _.includes(this.modalTitle, "Task")
      ? "TASK"
      : _.includes(this.modalTitle, "Bug")
      ? "BUG"
      : _.includes(this.modalTitle, "Issue")
      ? "ISSUE"
      : "";
    task.startDate = $("#startDate").val();
    task.dueDate = $("#dueDate").val();
    task["createdBy"] = JSON.parse(localStorage.getItem("currentUser"))._id;
    
    this._projectService.addTask(task).subscribe(
      (res: any) => {
        $("#editModel").modal("hide");
      },
      (err) => {
        
      }
    );
  }

  filterTracks(projectId, developerId) {
    this.selectedDeveloperId = developerId;
    this.selectedProjectId = projectId;
    
    this.getEmptyTracks();
    if (projectId != "all" && developerId == "all") {
      
      _.forEach(this.tasks, (project) => {
        
        // _.forEach(project.assignTo, (assign) => {
        if (project.projectId == projectId) {
          _.forEach(this.tracks, (track) => {
            
            // if (this.currentUser.userRole != 'Manager' && this.currentUser.userRole != 'admin') {
            if (project.status == track.id && project.assignTo) {
              track.tasks.push(project);
            }
            // }
            // else if (project.assignTo == null) {
            // if (project.status == track.id) {
            // 	track.tasks.push(project);
            // }
            // }
          });
        }
        // })
      });
    } else if (projectId == "all" && developerId != "all") {
      
      _.forEach(this.tasks, (project) => {
        
        // _.forEach(project.assignTo, (assign) => {
        // 
        _.forEach(this.tracks, (track) => {
          // 
          if (
            project.status == track.id &&
            project.assignTo._id == developerId
          ) {
            track.tasks.push(project);
          }
        });
        // })
      });
    } else if (projectId != "all" && developerId != "all") {
      
      _.forEach(this.tasks, (project) => {
        
        // _.forEach(project.assignTo, (assign) => {
        if (project.projectId == projectId) {
          _.forEach(this.tracks, (track) => {
            if (
              project.status == track.id &&
              project.assignTo._id == developerId
            ) {
              track.tasks.push(project);
            }
          });
        }
        // })
      });
    } else {
      _.forEach(this.tasks, (project) => {
        
        
        _.forEach(this.tracks, (track) => {
          if (
            this.currentUser.userRole != "Manager" &&
            this.currentUser.userRole != "admin"
          ) {
            if (
              project.status == track.id &&
              project.assignTo &&
              project.assignTo._id == this.currentUser._id
            ) {
              track.tasks.push(project);
            }
          } else {
            if (project.status == track.id) {
              track.tasks.push(project);
            }
          }
        });
      });
    }
  }
  onKey(searchText) {
    
    
    var dataToBeFiltered = this.tasks;
    var task = this.searchTextFilter.transform(dataToBeFiltered, searchText);
    
    this.getEmptyTracks();

    if (this.selectedProjectId != "all" && this.selectedDeveloperId == "all") {
      _.forEach(task, (project) => {
        if (project.projectId._id == this.selectedProjectId) {
          _.forEach(this.tracks, (track) => {
            
            if (
              this.currentUser.userRole != "Manager" &&
              this.currentUser.userRole != "admin"
            ) {
              if (
                project.status == track.id &&
                project.assignTo &&
                project.assignTo._id == this.currentUser._id
              ) {
                track.tasks.push(project);
              }
            } else {
              if (project.status == track.id) {
                track.tasks.push(project);
              }
            }
          });
        }
      });
    } else if (
      this.selectedProjectId == "all" &&
      this.selectedDeveloperId != "all"
    ) {
      _.forEach(task, (project) => {
        
        _.forEach(this.tracks, (track) => {
          if (
            project.status == track.id &&
            project.assignTo &&
            project.assignTo._id == this.selectedDeveloperId
          ) {
            track.tasks.push(project);
          }
        });
      });
    } else if (
      this.selectedProjectId != "all" &&
      this.selectedDeveloperId != "all"
    ) {
      _.forEach(task, (project) => {
        
        if (project.projectId._id == this.selectedProjectId) {
          _.forEach(this.tracks, (track) => {
            if (
              project.status == track.id &&
              project.assignTo &&
              project.assignTo._id == this.selectedDeveloperId
            ) {
              track.tasks.push(project);
            }
          });

          // _.forEach(task, (content)=>{
          // 	_.forEach(this.tracks, (track)=>{
          // 		if(content.status == track.id){
          // 			track.tasks.push(content);
        }
      });
    } else {
      _.forEach(task, (project) => {
        
        _.forEach(this.tracks, (track) => {
          if (
            this.currentUser.userRole != "Manager" &&
            this.currentUser.userRole != "admin"
          ) {
            if (
              project.status == track.id &&
              project.assignTo &&
              project.assignTo._id == this.currentUser._id
            ) {
              track.tasks.push(project);
            }
          } else {
            if (project.status == track.id) {
              track.tasks.push(project);
            }
          }
        });
      });
    }
  }
  projects;
  getAllProjects() {
    this._projectService.getProjects().subscribe(
      (res: any) => {
        
        this.projects = res.data;
      },
      (err) => {
        this._alertService.error(err);
        
      }
    );
  }
}
