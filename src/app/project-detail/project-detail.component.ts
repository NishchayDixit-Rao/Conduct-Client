import {
  Component,
  OnInit,
  HostListener,
  ChangeDetectorRef,
  Output,
} from "@angular/core";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { ProjectService } from "../services/project.service";
import { AlertService } from "../services/alert.service";
import { ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import * as DecoupledEditor from "@ckeditor/ckeditor5-build-classic";
import { ChangeEvent } from "@ckeditor/ckeditor5-angular/ckeditor.component";
import { SearchTaskPipe } from "../search-task.pipe";
import { ChildComponent } from "../child/child.component";
import { config } from "../config";
import { LeaveComponent } from "../leave/leave.component";
import * as _ from "lodash";
import { CommentService } from "../services/comment.service";
import * as moment from "moment";
import Swal from "sweetalert2";
import { EventEmitter } from "events";
declare var $: any;
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-project-detail",
  templateUrl: "./project-detail.component.html",
  styleUrls: ["./project-detail.component.css"],
})
export class ProjectDetailComponent implements OnInit {
  tracks: any;
  modalTitle;
  comments: any;
  public model = {
    editorData: "",
  };
  url = [];
  commentUrl = [];
  searchText;
  newTask = {
    title: "",
    description: "",
    assignTo: "",
    sprint: "",
    status: "To Do",
    taskPriority: "Low",
    dueDate: "",
    estimatedTime: "",
    images: [],
  };
  task;
  tasks;
  taskId;
  projects: any;
  project;
  comment;
  projectId;
  allStatusList = this._projectService.getAllStatus();
  allPriorityList = this._projectService.getAllProtity();
  editTaskForm;
  assignTo;
  developers: any;
  loader: boolean = false;
  currentDate = new Date();
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  currentsprintId;
  pro;
  asc;
  desc;
  id;
  projectTeam;
  sprints;
  newSprint = [];
  sprintStatus = [];
  Teams;
  files: Array<File> = [];
  path = config.baseMediaUrl;
  priority: boolean = false;
  sprint;
  sorting: any;
  temp: any;
  activeSprint: any;
  sprintInfo: any;
  submitted = false;
  isDisable: boolean = false;
  projectTitle;

  constructor(
    public _projectService: ProjectService,
    private route: ActivatedRoute,
    public _alertService: AlertService,
    public searchTextFilter: SearchTaskPipe,
    public _commentService: CommentService,
    public _change: ChangeDetectorRef,
    private dateFilter: DatePipe
  ) {
    // $('.datepicker').pickadate();
    this.route.params.subscribe((param) => {
      this.projectId = param.id;
      this.getEmptyTracks();
      this.getProject(this.projectId);
    });
    this.createEditTaskForm();
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
    switch (Number(priority)) {
      case 4:
        return { class: "primary", title: "Low", value: "Low" };
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
      title: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      assignTo: new FormControl(""),
      // sprint: new FormControl(''),
      taskPriority: new FormControl("", Validators.required),
      dueDate: new FormControl(""),
      estimatedTime: new FormControl("", [Validators.required]),
      status: new FormControl(
        { value: "To Do", disabled: true },
        Validators.required
      ),
      taskType: new FormControl(""),
    });
  }

  ngOnInit() {
    // setTimeout(() => {

    // 	$('[data-toggle="popover-hover"]').popover({
    // 		html: true,
    // 		trigger: 'hover',
    // 		placement: 'bottom',
    // 		content: "<ul type=none ><li>" + 'Start-date : ' + "<strong>" + this.sprintInfo.length ? this.sprintInfo.startDate : '' + "</strong></li>" + "<li>" + 'End-date : ' + "<strong>" + this.sprintInfo.length ? this.sprintInfo.endDate : '' + "</strong></li>" + "<li>" + 'Sprint-duration : ' + "<strong>" + this.sprintInfo.length ? this.sprintInfo.duration : '' + ' days' + "</strong></li></ul>"
    // 	});
    // }, 2000);

    $(".datepicker").pickadate({
      min: new Date(),
      onSet: function (context) {
        setDate(context);
      },
    });
    var setDate = (context) => {
      this.editTaskForm.controls.dueDate.setValue(
        this.dateFilter.transform(new Date(context.select), "yyyy-MM-dd")
      );
    };

    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
    $("#save_changes").on("click", function () {
      $("#save_changes").attr("disabled", true);
      $("#refresh_icon").css("display", "block");
    });

    // this.filterTracks(this.activeSprint._id);
    // this.getSprint(this.projectId);
    // this.getSprintWithoutComplete(this.projectId);
    // this.getProject(this.projectId);
    // this.gettrackdisplay(this.projectId);
  }

  // timePicked() {
  // 	this.editTaskForm.controls.dueDate.setValue($('datepicker').val())
  // }

  filterTracks(sprintId) {
    //
    this.getEmptyTracks();
    this.currentsprintId = sprintId;
    //
    _.forEach(this.project, (task) => {
      //
      _.forEach(this.tracks, (track) => {
        if (task.sprint._id == sprintId && track.id == task.status) {
          track.tasks.push(task);
        }
      });
    });
  }

  getAllDevelopers() {
    this._projectService.getAllDevelopers().subscribe(
      (res) => {
        this.developers = res;
        this.developers.sort(function (a, b) {
          if (name) {
            var nameA = a.name.toLowerCase(),
              nameB = b.name.toLowerCase();
            if (nameA < nameB)
              //sort string ascending
              return -1;
            if (nameA > nameB) return 1;
            return 0; //default return value (no sorting)
          }
        });
        //
      },
      (err) => {
        //
        this._alertService.error(err);
      }
    );
  }
  /**
   * @param id Project Id
   * Get details of project and team members list
   */
  getProject(id) {
    //
    console.log("proejct detail component called : ");
    this.loader = true;
    setTimeout(() => {
      this._projectService.getProjectById(this.projectId).subscribe(
        (res: any) => {
          //
          this.temp = res;
          this.pro = res.data;
          this.projectId = this.pro._id;
          //
          this.projectTeam = this.pro.teamMembers;
          //
        },
        (err: any) => {
          //
        }
      );

      this._projectService.getTaskById(this.projectId).subscribe(
        (res: any) => {
          this.getEmptyTracks();

          if (
            this.currentUser.userRole == "Manager" ||
            this.currentUser.userRole == "admin"
          ) {
            this.project = res.data.response[0];
          }
          if (this.currentUser.userRole == "Team Member") {
            this.project = res.data[0];
          }

          //
          //
          this.temp = this.tracks;
          this.loader = false;
        },
        (err) => {
          this.loader = false;
        }
      );
    }, 1000);
    function custom_sort(a, b) {
      return (
        new Date(new Date(a.createdAt)).getTime() -
        new Date(new Date(b.createdAt)).getTime()
      );
    }
  }

  get trackIds(): string[] {
    return this.tracks.map((track) => track.id);
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
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
          //
          this.updateStatus(
            event.container.id,
            event.container.data[
              _.findIndex(event.container.data, {
                status: event.previousContainer.id,
              })
            ]
          );
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
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }
  updateStatus(newStatus, data) {
    //
    localStorage.removeItem("startTime");
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
      this._projectService.completeItem(completeStatus).subscribe(
        (res: any) => {
          const status = res.data;
          Swal.fire({
            type: "info",
            title: status.status,
            showConfirmButton: false,
            timer: 2000,
          });
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
      this._projectService.updateStatus(updateStatusOdTask).subscribe(
        (res: any) => {
          //

          const status = res.data;
          Swal.fire({
            type: "info",
            title: status.status,
            showConfirmButton: false,
            timer: 3000,
          });
        },
        (err: any) => {
          Swal.fire("Oops...", "Something went wrong!", "error");
        }
      );
    }
  }

  ngOnDestroy() {
    this._change.detach();
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
      // return name.split(' ')[0][0]+name.split(' ')[1][0];
    } else {
      return "";
    }
  }

  getColorCodeOfPriority(priority) {
    for (var i = 0; i < this.allPriorityList.length; i++) {
      if (this.allPriorityList[i].value == priority) {
        return this.allPriorityList[i].colorCode;
      }
    }
  }
  openModel(task) {
    this.task = task;
    // this.getAllCommentOfTask(task._id);
    $("#fullHeightModalRight").modal("show");
  }

  editTask(task) {
    //
    this.newTask = task;
    //
    this.modalTitle = "Edit Item";
    $(".datepicker").pickadate();
    $("#estimatedTime").pickatime({});
    $("#itemManipulationModel").modal("show");
  }

  getEmptyTask() {
    return {
      title: "",
      description: "",
      assignTo: "",
      sprint: "",
      status: "To Do",
      taskPriority: "Low",
      dueDate: "",
      estimatedTime: "",
      images: [],
    };
  }

  addItem(option) {
    // this.newTask = { title: '', desc: '', assignTo: '', sprint: '', status: 'To Do', priority: 'low', dueDate: '', estimatedTime: '', images: [] };
    this.modalTitle = "Add " + option;
    this.files = this.url = [];
    $("#itemManipulationModel").modal("show");
    this.editTaskForm.controls.taskType.setValue(option);
  }
  get f() {
    return this.editTaskForm.controls;
  }

  saveTheData(task) {
    //
    this.submitted = true;
    if (this.editTaskForm.invalid) {
      return;
    }
    this.isDisable = true;
    this.loader = true;
    task["projectId"] = this.projectId;
    //
    task.taskPriority = task.taskPriority;
    // task.dueDate = $('.datepicker').val();
    //
    //
    let data = new FormData();
    _.forOwn(task, function (value, key) {
      if (
        value.length != null ||
        value.length != 0 ||
        value.length == undefined
      ) {
        data.append(key, value);
      }
    });
    //
    if (this.files.length > 0) {
      for (var i = 0; i < this.files.length; i++) {
        data.append("fileUpload", this.files[i]);
      }
    }
    this._projectService.addTask(data).subscribe(
      (res: any) => {
        this.files = this.url = [];
        //
        if (res) {
          if (res.data.data) {
            let assign = res.data.data[0];
            //
            let name = assign.name;
            //
            Swal.fire({
              type: "success",
              title: "Task Added Successfully To",
              text: name,
              showConfirmButton: false,
              timer: 2000,
            });
          } else {
            Swal.fire({
              type: "success",
              title: "Task Added Successfully To",
              text: "Unassigned",
              showConfirmButton: false,
              timer: 2000,
            });
          }
        } else {
          Swal.fire({
            type: "success",
            title: "please Task Added first",
            text: name,
            showConfirmButton: false,
            timer: 2000,
            // position: 'top-end'
          });
        }
        $("#save_changes").attr("disabled", false);
        $("#refresh_icon").css("display", "none");
        $("#itemManipulationModel").modal("hide");
        this.newTask = this.getEmptyTask();
        this.editTaskForm.reset();
        this.loader = false;
        this.isDisable = false;
      },
      (err) => {
        Swal.fire({
          type: "error",
          title: "Ooops",
          text: "Something went wrong",
          animation: false,
          customClass: {
            popup: "animated tada",
          },
        });
        this.isDisable = false;
        this.loader = false;
        //$('#alert').css('display','block');
      }
    );
    // }
  }
  searchTask() {}
  onKey(searchText) {
    let message = document.getElementById("message");
    if (!this.project) {
      // let message = document.getElementById('message')
      if (searchText) {
        message.innerHTML = "There is no search result";
      } else {
        message.innerHTML = "";
      }
    } else {
      //
      var dataToBeFiltered = this.project.tasks;
      //
      var task = this.searchTextFilter.transform(dataToBeFiltered, searchText);

      this.getEmptyTracks();
      if (task.length > 0) {
        message.innerHTML = "";
        _.forEach(task, (content) => {
          _.forEach(this.tracks, (track) => {
            if (
              this.currentUser.userRole != "Manager" &&
              this.currentUser.userRole != "admin"
            ) {
              if (
                content.status == track.id &&
                content.assignTo &&
                content.assignTo._id == this.currentUser._id
              ) {
                // if(content.status == track.id){
                track.tasks.push(content);
              }
            } else {
              if (content.status == track.id) {
                track.tasks.push(content);
              }
            }
          });
        });
      } else {
        message.innerHTML = "There is no search result";
      }
    }
  }

  getAllProjects() {
    this._projectService.getProjects().subscribe(
      (res) => {
        this.projects = res;
      },
      (err) => {
        this._alertService.error(err);
      }
    );
  }
  deleteTask(taskId) {
    this._projectService.deleteTaskById(this.task).subscribe(
      (res: any) => {
        $("#exampleModalPreview").modal("hide");
        Swal.fire({
          type: "success",
          title: "Task Deleted Successfully",
          showConfirmButton: false,
          timer: 2000,
        });

        this.task = res;
      },
      (err: any) => {
        Swal.fire("Oops...", "Something went wrong!", "error");
      }
    );
  }

  removeCommentImage(file, index) {
    this.commentUrl.splice(index, 1);
    if (this.files && this.files.length) this.files.splice(index, 1);
  }
  removeAlreadyUplodedFile(option) {
    this.newTask.images.splice(option, 1);
  }

  completeSprint(sprintId) {
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
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Complete",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          this._projectService.completeSprint(sprintId).subscribe(
            (res: any) => {
              Swal.fire(
                "Complete!",
                "Your Sprint has been Completed.",
                "success"
              );
              this.activeSprint = null;
              this.sprintInfo = null;

              // this.getSprint(this.projectId);
            },
            (err) => {
              Swal.fire("Oops...", "Something went wrong!", "error");
            }
          );
        }
      });
  }

  changeFile(event) {
    if (event) {
      this.files = event;
    } else {
      this.url = [];
    }
  }
}
