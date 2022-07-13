import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  HostListener,
  ChangeDetectorRef,
} from "@angular/core";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { ChangeEvent } from "@ckeditor/ckeditor5-angular/ckeditor.component";
import { CommentService } from "../services/comment.service";
import { ProjectService } from "../services/project.service";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import * as DecoupledEditor from "@ckeditor/ckeditor5-build-classic";
import { SearchTaskPipe } from "../search-task.pipe";
import { config } from "../config";
import * as moment from "moment";
import * as _ from "lodash";
import Swal from "sweetalert2";
declare var $: any;
import { MessagingService } from "../services/messaging.service";

@Component({
  selector: "app-child",
  templateUrl: "./child.component.html",
  styleUrls: ["../project-detail/project-detail.component.css"],
})
export class ChildComponent implements OnInit {
  name;
  @Input() projectId;
  @Input() developers;
  @Input() tracks;
  task: any;
  @Output() trackDrop: EventEmitter<any> = new EventEmitter();
  @Output() talkDrop: EventEmitter<any> = new EventEmitter();
  currentUser = JSON.parse(localStorage.getItem("currentUser"));

  public model = {
    editorData: "",
  };
  taskId;
  url = [];
  commentUrl = [];
  newTask: any = {
    title: "",
    desc: "",
    assignTo: "",
    sprint: "",
    status: "To Do",
    priority: "low",
    dueDate: "",
    estimatedTime: "",
    images: [],
  };
  modalTitle;
  3;
  project: any = [];
  tasks;
  comments: any = [];
  comment;
  developerId;
  allStatusList = this._projectService.getAllStatus();
  allPriorityList = this._projectService.getAllProtity();
  editTaskForm: FormGroup;
  loader: boolean = false;
  currentDate = new Date();
  pro;
  id;
  files: Array<File> = [];
  path = config.baseMediaUrl;
  searchText;
  projectTeam;
  Teams;
  selectedProjectId = "all";
  selectedDeveloperId = "all";
  sprints;
  timeLog;
  logs;
  diff;
  counter: number;
  taskdata;
  startText = "START";
  time: any;
  assignTo;
  taskArr = [];
  running: boolean = false;
  timerRef;
  initialTime = 0;
  trackss: any;
  currentsprintId;
  newSprint = [];
  commentImg: any;
  temp;
  difference;
  file = [];
  count;
  priority: boolean = false;
  sorting;
  activeSprint;
  submitted = false;
  isTaskFound = false;
  isDisable: boolean = false;
  assignDeveloper;
  assignSprint;
  isChangedAssign;
  movedUserName;
  isStartTime: boolean = false;
  isTimerStart: boolean = false;
  urlId;
  startDate;
  constructor(
    private route: ActivatedRoute,
    public _projectService: ProjectService,
    public _commentService: CommentService,
    public _messegingService: MessagingService,
    public _change: ChangeDetectorRef,
    public searchTextFilter: SearchTaskPipe,
    private router: Router
  ) {
    this.route.params.subscribe((param) => {
      this.projectId = param.id;
    });

    this._projectService.AddTask.subscribe((data) => {
      if (data == "AddTask") {
        this.getProject(this.projectId);
      }
    });
    this.createEditTaskForm();

    this.router.events.subscribe((ev: any) => {
      
      if (ev instanceof NavigationEnd) {
        
        this.urlId = ev.id;
        
        this.func("reload", this.urlId);
      }
    });
    this._projectService.compledteSprint.subscribe((data) => {
      // 
      // this.afterCompleteSprint(this.projectId)
    });
  }
  ngOnInit() {
    this.getProject(this.projectId);
    

    window.addEventListener("beforeunload", function (e) {
      
      // Cancel the event
      if (localStorage.getItem("isTimerRunning") != "null") {
        fromReload("reload");
        e.stopPropagation();
        // Chrome requires returnValue to be set
        e.returnValue = "";
      }
    });
    var fromReload = (option) => {
      
      this.func(option);
    };
  }

  func = async (option, url?) => {
    
    var taskId = localStorage.getItem("isTimerRunning");
    let isAnyTrackHasTask = false;
    await _.forEach(this.tracks, async (track) => {
      if (track.tasks.length) {
        isAnyTrackHasTask = true;
      }
      await _.forEach(track.tasks, (task) => {
        if (task._id == taskId) {
          if (option == "reload") {
            if (url == 2) {
              this.isStartTime = true;
              let statusOfTime = this.isStartTime;
              
              this.timerUpdate(task, statusOfTime);
            } else {
              this.timerUpdate(task);
            }
            
          } else if (option == "load") this.startTimer(task);
          this.startDate = new Date();
          
          var setDate = localStorage.setItem("startTime", this.startDate);
          
        }
      });
    });
    if (isAnyTrackHasTask) this.isTaskFound = true;
  };

  ngOnChanges() {
    this._change.detectChanges();
    // 
  }
  getEmptyTracks() {
    // 
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
      // 
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
      // 
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
      description: new FormControl("", Validators.required),
      assignTo: new FormControl("", Validators.required),
      sprint: new FormControl("", Validators.required),
      taskPriority: new FormControl("", Validators.required),
      dueDate: new FormControl(""),
      status: new FormControl(
        { value: "", disabled: true },
        Validators.required
      ),
      files: new FormControl(),
      estimatedTime: new FormControl(),
    });
  }

  getTitle(name) {
    if (name) {
      var str = name.split(" ");
      if (str.length > 1)
        return (
          str[0].charAt(0).toUpperCase() +
          str[0].slice(1) +
          " " +
          str[1].charAt(0).toUpperCase() +
          str[1].slice(1)
        );
      else return str[0].charAt(0).toUpperCase() + str[0].slice(1);
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

  get trackIds(): string[] {
    return this.tracks.map((track) => track.id);
  }

  onTrackDrop(event) {
    this.trackDrop.emit(event);
  }
  onTalkDrop(event) {
    if (this.startText == "Stop") {
    }
    this.talkDrop.emit(event);
  }
  ondrag(task) {
    
  }

  public Editor = DecoupledEditor;
  public configuration = { placeholder: "Enter Comment Text..." };
  public onReady(editor) {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
  }
  public onChange({ editor }: ChangeEvent) {
    const data = editor.getData();
    this.comment = data;
  }
  sendComment(taskId) {
    this.isDisable = true;
    // this.func('reload');
    // 
    var data: any;
    if (this.files.length > 0) {
      data = new FormData();
      data.append("description", this.comment ? this.comment : "");
      data.append("userId", this.currentUser._id);
      data.append("projectId", this.projectId);
      data.append("taskId", taskId);
      // data.append("Images",this.images);
      for (var i = 0; i < this.files.length; i++)
        data.append("fileUpload", this.files[i]);
    } else {
      data = {
        description: this.comment,
        userId: this.currentUser._id,
        taskId: taskId,
        projectId: this.projectId,
      };
    }
    // 
    this._commentService.addComment(data).subscribe(
      (res: any) => {
        
        this.commentImg = res;
        this.commentUrl = [];
        this.comment = "";
        this.model.editorData = "Enter comments here";
        this.files = [];
        this.file = [];
        // 
        this.isDisable = false;
        this.getAllCommentOfTask(taskId);
      },
      (err) => {
        console.error(err);
        this.isDisable = false;
      }
    );
  }

  getAllCommentOfTask(taskId) {
    this._commentService.getAllComments(taskId).subscribe(
      (res: any) => {
        
        let details = res.data[0];
        // this.comments = res.data[0];
        
        if (res.data && res.data.length) {
          _.forEach(details.developerComments, (comment) => {
            
            // this.comments = comment
            this.comments.push(comment);
          });
        }
        if (res.data && res.data.length) {
          _.forEach(res.data[0].projectManagerComments, (pmComments) => {
            
            this.comments.push(pmComments);
          });
        }
        
      },
      (err) => {
        console.error("error while get comment details", err);
      }
    );
  }
  onSelectFile(event, option) {
    _.forEach(event.target.files, (file: any) => {
      this.files.push(file);
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        if (option == "item") this.url.push(e.target.result);
        if (option == "comment") this.commentUrl.push(e.target.result);
      };
    });
  }
  removeAvatar(file, index) {
    
    this.url.splice(index, 1);
    if (this.files && this.files.length) this.files.splice(index, 1);
    
  }
  removeCommentImage(file, index) {
    
    this.commentUrl.splice(index, 1);
    if (this.files && this.files.length) this.files.splice(index, 1);
    
  }
  removeCommentImage1(file, index) {
    
    this.file.splice(index, 1);
    if (this.files && this.files.length) this.files.splice(index, 1);
    
  }
  removeAlreadyUplodedFile(option) {
    this.newTask.images.splice(option, 1);
  }
  openModel(task) {
    
    this.task = task;
    if (task.movedBy) {
      this.movedUserName = task.movedBy.name;
    }
    
    this.getAllCommentOfTask(task._id);
    this.files = this.url = [];
    $("#fullHeightModalRight").modal("show");
  }
  editTask(task) {
    
    this.newTask = task;
    
    this.assignSprint = this.newTask.sprint;
    
    
    this.modalTitle = "Edit Item";
    if (this.newTask.assignTo) {
      this.assignDeveloper = this.newTask.assignTo._id;
    }
    
    $("#itemManipulationModel1").modal("show");
    this.getProject(task.projectId._id);
  }
  focusOnTextArea(comment) {
    $(".ck.ck-content.ck-editor__editable").focus();
    
    this.model.editorData =
      "<blockquote><q>" + comment.content + "</q></blockquote><p></p>";
  }

  get f() {
    return this.editTaskForm.value;
  }

  updateTask(task) {
    // 
    if (task.assignTo) {
      const changeId = task.assignTo._id;
      // 
      // 
      if (changeId != this.assignDeveloper) {
        // 
        this.isChangedAssign = true;
      }
    }
    // })

    this.isDisable = true;
    task.assignTo = this.editTaskForm.value.assignTo;
    task.sprint = this.editTaskForm.value.sprint;
    // 
    let data = new FormData();
    data.append("projectId", task.projectId);
    data.append("title", task.title);
    data.append("description", task.description);
    data.append("assignTo", task.assignTo);
    data.append("sprint", task.sprint);
    data.append("taskPriority", task.taskPriority);
    data.append("dueDate", task.dueDate);
    data.append("estimatedTime", task.estimatedTime);
    data.append("images", task.images);
    data.append("isAssign", this.isChangedAssign);
    if (this.files.length > 0) {
      for (var i = 0; i < this.files.length; i++) {
        data.append("fileUpload", this.files[i]);
      }
    }
    // 
    this._projectService.updateTask(task._id, data).subscribe(
      (res: any) => {
        
        let updateResponse = res.data.data;
        // 
        let taskNo = updateResponse;
        Swal.fire({
          type: "success",
          title: taskNo + " updated successfully",
          showConfirmButton: false,
          timer: 2000,
          // position: 'top-end',
        });
        this.isDisable = false;
        $("#save_changes").attr("disabled", false);
        $("#refresh_icon").css("display", "none");
        $("#itemManipulationModel1").modal("hide");
        $("#fullHeightModalRight").modal("hide");
        this.getProject(this.projectId);
        var cardid = "#" + "cardId_" + taskNo;
        // 
        setTimeout(() => {
          $(cardid).css({ "background-color": "#F5F5F5" });
        }, 2000);
        this.newTask = this.getEmptyTask();
        this.files = this.url = [];
        this.editTaskForm.reset();
        this.loader = false;
      },
      (err) => {
        Swal.fire("Oops...", "Something went wrong!", "error");
        
        this.loader = false;
      }
    );
  }
  getEmptyTask() {
    return {
      title: "",
      desc: "",
      assignTo: "",
      status: "to do",
      sprint: "",
      priority: "low",
      dueDate: "",
      estimatedTime: "",
      images: [],
    };
  }
  getHHMMTime(difference) {
    // 
    if (difference != "00:00") {
      difference = difference.split("T");
      difference = difference[1];
      difference = difference.split(".");
      difference = difference[0];
      difference = difference.split(":");
      var diff1 = difference[0];
      // 
      var diff2 = difference[1];

      difference = diff1 + ":" + diff2;
      // 
      return difference;
    }
    return "00:00";
  }
  getTime(counter) {
    var milliseconds = (counter % 1000) / 100,
      seconds = Math.floor((counter / 1000) % 60),
      minutes = Math.floor((counter / (1000 * 60)) % 60),
      hours = Math.floor((counter / (1000 * 60 * 60)) % 24);
    return hours + ":" + minutes + ":" + seconds;
  }
  deleteTask(taskId) {
    
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-default",
        cancelButton: "btn btn-delete",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "'You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancle",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          this._projectService.deleteTaskById(this.task).subscribe(
            (res: any) => {
              swalWithBootstrapButtons.fire(
                "Deleted!",
                "Task " + this.task.uniqueId + " has been deleted.",
                "success"
              );
              $("#exampleModalPreview").modal("hide");
              $("#itemManipulationModel1").modal("hide");
              $("#fullHeightModalRight").modal("hide");
              this.getProject(this.projectId);

              
              this.task = res;
              
              this.func("reload");
            },
            (err: any) => {
              Swal.fire({
                type: "error",
                title: "Ooops",
                text: "Something went wrong",
                animation: false,
                customClass: {
                  popup: "animated tada",
                },
              });
              
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancled!",
            "Your task has been safe.",
            "error"
          );
        }
      });
  }

  getProject(id) {
    // 
    this.loader = true;
    setTimeout(() => {
      this._projectService.getProjectById(this.projectId).subscribe(
        (res: any) => {
          
          this.temp = res;
          this.pro = res.data;
          this.projectId = this.pro._id;
          this.projectTeam = this.pro.teamMembers;
          /**
           * Get task of login user using projectId
           */
          this._projectService.getTaskById(this.projectId).subscribe(
            (res: any) => {
              
              this.getEmptyTracks();
              if (
                res.data.response == [] &&
                (this.currentUser.userRole == "Manager" ||
                  this.currentUser.userRole == "admin")
              ) {
                this.project = res.data.response;
                
              }
              if (
                this.currentUser.userRole == "Manager" ||
                this.currentUser.userRole == "admin"
              ) {
                this.project = res.data.response[0];
                
               
              } else if (this.currentUser.userRole == "Team Member") {
                this.project = res.data[0];
              }
              
              if (this.project && this.project.tasks)
                _.forEach(this.project.tasks, (task) => {
                  
                  // let assignId = task.assignTo._id
                  // 
                  _.forEach(this.tracks, (track) => {
                    
                    if (task.status == track.id) {
                      track.tasks.push(task);
                    }
                  });
                });
              // 
              
              // this.temp = this.tracks;
              this.func("load");
              this.loader = false;
            },
            (err) => {
              
              this.loader = false;
            }
          );
        },
        (err: any) => {
          this.loader = false;
          
        }
      );
    }, 1000);
  }

  CheckTimer(data) {
    let taskTimer = localStorage.getItem("isTimerRunning");
    if (taskTimer == data._id || taskTimer == "null") {
      this.startTimer(data);
    } else if (!taskTimer) {
      this.startTimer(data);
    } else {
      Swal.fire({
        type: "error",
        title: "Sorry",
        text: "Your Another Task Time-Log Is Running",
        animation: false,
        customClass: {
          popup: "animated tada",
        },
      });
    }
  }

  startTimer(data) {
    
    this.running = !this.running;
    data["running"] = data.running ? !data.running : true;
    
    // this.isTimerStart = true
    if (data.running) {
      data["startText"] = "STOP";
      var startTime =
        Date.now() -
        (data.taskTimelog ? data.taskTimelog.count : this.initialTime);
      data["timerRef"] = setInterval(() => {
        data.taskTimelog["count"] = Date.now() - startTime;
        // 
        var milliseconds = (data.taskTimelog.count % 1000) / 100,
          seconds = Math.floor((data.taskTimelog.count / 1000) % 60),
          minutes = Math.floor((data.taskTimelog.count / (1000 * 60)) % 60),
          hours = Math.floor((data.taskTimelog.count / (1000 * 60 * 60)) % 24);
        this.time = hours + ":" + minutes + ":" + seconds;
        data["time"] = this.time;
        localStorage.setItem("isTime", this.time);
        // 
      });
      localStorage.setItem("isTimerRunning", data._id);
      localStorage.setItem("runningStatus", data.running);
    } else {
      data.startText = "RESUME";
      if (data.startText == "RESUME") {
        localStorage.setItem("isTimerRunning", "null");
        localStorage.removeItem("isTime");
        // localStorage.setItem("runningStatus",)
      }
      
      clearInterval(data.timerRef);
    }
    this.timerUpdate(data);
  }

  timerUpdate(data, status?) {
    let newDate = localStorage.getItem("startTime");
    // 
    // let newDate = new Date(date).toString()
    // let newDate = moment(date).format("DD MMM YYYY") //parse integer
    
    
    this.taskdata = {
      taskId: data._id,
      time: data.time,
      timerRef: data.timerRef,
      taskTimelog: data.taskTimelog,
      count: data.taskTimelog.count,
      statusOfTime: status,
      newDate: newDate,
    };
    
    // this._projectService.addTimeLog(this.taskdata).subscribe((res: any) => {
    //   
    //   this.timeLog = res;
    //   // 
    //   this.logs = res.log;

    // }, (err: any) => {
    //   
    // });
  }

  changeFile(event) {
    
    this.files = event;
  }

  sortTasksByDueDate(type) {
    if (this.priority == true) {
      
      
      _.forEach(this.sorting, function (track) {
        
        track.tasks.sort(custom_sort);
        // track.tasks.sort(custom_sort1);
        if (type == "desc") {
          track.tasks.reverse();
        }
        
      });
    } else {
      

      _.forEach(this.tracks, function (track) {
        
        track.tasks.sort(custom_sort);
        if (type == "desc") {
          track.tasks.reverse();
        }
        
      });
      // }
    }

    function custom_sort(a, b) {
      // var   Aarr = a.dueDate.split(" ");
      // a.dueDate = Aarr[0];
      // var   Barr = b.dueDate.split(" ");
      // b.dueDate = Barr[0];
      return (
        new Date(new Date(a.dueDate)).getTime() -
        new Date(new Date(b.dueDate)).getTime()
      );
    }
    function custom_sort1(a, b) {
      return a.priority - b.priority;
    }

    
    $(".due_date_sorting_btn i.fas").toggleClass("hide");
  }
  sortTasksByPriority(type) {
    this.priority = true;
    
    _.forEach(this.tracks, function (track) {
      
      track.tasks.sort(custom_sort1);
      if (type == "desc") {
        track.tasks.reverse();
      }
      
    });
    this.sorting = this.tracks;
    

    function custom_sort1(a, b) {
      return a.priority - b.priority;
    }
    
    $(".priority_sorting_btn i.fas").toggleClass("hide");
  }
}
