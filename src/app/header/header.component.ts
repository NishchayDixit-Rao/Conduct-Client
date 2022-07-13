import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { LoginService } from "../services/login.service";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
// import { untilDestroyed } from 'ngx-take-until-destroy';
import { AlertService } from "../services/alert.service";
import { ProjectService } from "../services/project.service";
import { MessagingService } from "../services/messaging.service";
import { ViewProjectComponent } from "../new-view-project/view-project/view-project.component";
import * as moment from "moment";
import { LeaveService } from "../services/leave.service";
import { config } from "../config";
import * as _ from "lodash";
import Swal from "sweetalert2";
import { Content } from "@angular/compiler/src/render3/r3_ast";
import { NgSelectComponent } from "@ng-select/ng-select";
import { DatePipe } from "@angular/common";
import { setTime } from "ngx-bootstrap/chronos/utils/date-setters";
import { document } from "ngx-bootstrap";
// import undefined = require('firebase/empty-import');
declare var $: any;

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  @ViewChild(NgSelectComponent) ngSelect: NgSelectComponent;
  currentEmployeeId = JSON.parse(localStorage.getItem("currentUser"))._id;
  currentUserName = JSON.parse(localStorage.getItem("currentUser")).name;
  checkInStatus = JSON.parse(localStorage.getItem("checkIn"));
  tracks: any;
  task = this.getEmptyTask();
  userId;
  project;
  url = [];
  commentUrl = [];
  projectArr = [];
  finalArr = [];
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
  path = config.baseMediaUrl;
  projectId;
  modalTitle;
  projects;
  timediff: any;
  attendence: any;
  demoprojects;
  userNotification;
  addUserProfile: FormGroup;
  allStatusList = this._projectService.getAllStatus();
  allPriorityList = this._projectService.getAllProtity();
  developers = [];
  profileuser;
  editTaskForm: FormGroup;
  currentUser: any;
  files: Array<File> = [];
  loader: boolean = false;
  sprints;
  picture;
  unreadNotification;
  newNotification;
  newSprint = [];
  submitted = false;
  dataRefresher;
  isDisable: boolean = false;
  displayNotice;
  pushNotificationData;
  addTaskType;
  isDisplay = true;
  resetTask;
  projectAdd;
  sideMenuControl: boolean;
  // notificationCount = localStorage.getItem('countOfNotification')
  totalTeam = [];
  addTaskDisable;
  taskDisplay = false;
  selectedIndex;
  sideMenu = false;
  projectID: any;
  activeRoute: any;
  constructor(
    public _leaveService: LeaveService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private _loginService: LoginService,
    public _projectService: ProjectService,
    public _alertService: AlertService,
    public _messegingService: MessagingService,
    private dateFilter: DatePipe
  ) {
    // $('.datepicker').pickadate();
    this._loginService.getObservableResponse().subscribe((res) => {
      if (res.id == true) {
        this.isDisplay = false;
        this.projectID = this.router.url.split("/")[2];
        this.getUserAccess();
        // this._projectService
        //   .getProjectById(this.projectID)
        //   .subscribe((project: any) => {
        //
        //
        //     if (project) {
        //       let userID = this.currentUser._id;
        //       project.data.teamMembers.forEach((member) => {
        //         if (member._id === userID) {
        //
        //           this.currentUser.userRole = member.userRole;
        //           this.sideMenuControl = true;
        //
        //         }
        //       });
        //       project.data.projectManager.forEach((member) => {
        //         if (member._id === userID) {
        //
        //           this.currentUser.userRole = member.userRole;
        //           this.sideMenuControl = true;
        //
        //         }
        //       });
        //     }
        //     this.sideMenuControl = true;
        //   });
      } else {
        this.isDisplay = true;
      }
    });

    this._loginService.getSideMenu().subscribe((res) => {
      if (res.id == true) {
        this.sideMenu = true;
      } else {
        this.sideMenu = false;
      }
      this.checkRoute(this.router.url);
    });

    this._loginService.notificationCount.subscribe((data) => {
      this.newNotification = data;
    });

    // this._messegingService.notificationCount.subscribe(data => {
    //
    // 	this.pushNotificationData = data

    // 	if (data == 'notificationCount') {
    // 		// localStorage.setItem('countOfNotification', this.notificationCount)
    // 		//
    // 		this.getUnreadNotification();
    // 	}
    // })

    this._projectService.Updateproject.subscribe((data) => {
      if (data == "Updateproject") {
        this.getProjects();
      }
    });

    this._projectService.Deleteproject.subscribe((data) => {
      if (data == "Deleteproject") {
        this.getProjects();
      }
    });

    this._loginService.ProfilePicture.subscribe((data) => {
      // if (data == 'ProfilePicture') {
      this.currentUser.profilePhoto = data.profilePhoto;
      // this.currentUser = localStorage.getItem('currentUser');

      // }
    });

    this._projectService.UpdateDeveloper.subscribe((data) => {
      if (data == "UpdateDeveloper") {
        this.getProjects();
      }
    });

    this.addUserProfile = this.formBuilder.group({
      name: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      userrole: new FormControl("", [Validators.required]),
      fileName: new FormControl("", [Validators.required]),
    });
    this.createEditTaskForm();
  }

  getUserAccess() {
    this._projectService
      .getProjectById(this.projectID)
      .subscribe((project: any) => {
        if (project) {
          let userID = this.currentUser._id;

          if (project.data.admin[0]._id == userID) {
            this.currentUser.userRole = "admin";
            this.sideMenuControl = true;
          } else {
            project.data.teamMembers.forEach((member) => {
              if (member._id === userID) {
                this.currentUser.userRole = member.userRole;
                this.sideMenuControl = true;
              }
            });
            project.data.projectManager.forEach((member) => {
              if (member._id === userID) {
                this.currentUser.userRole = member.userRole;
                this.sideMenuControl = true;
              }
            });
          }
        } else {
          this.currentUser.userRole = "admin";
        }
        this.sideMenuControl = true;
      });
  }

  checkRoute(url) {
    if (url.includes("task-list")) {
      this.selectedIndex = 1;
    } else if (url.includes("edit-project")) {
      this.selectedIndex = 2;
    } else if (url.includes("discussions")) {
      this.selectedIndex = 3;
    } else if (url.includes("documents")) {
      this.selectedIndex = 4;
    } else if (url.includes("project-summary")) {
      this.selectedIndex = 5;
    } else if (url.includes("document-file")) {
      this.selectedIndex = 4;
    } else if (url.includes("discussion")) {
      this.selectedIndex = 3;
    } else if (url.includes("verify-log")) {
      this.selectedIndex = 6;
    } else if (url.includes("time-log")) {
      this.selectedIndex = 7;
    } else if (url.includes("project-settings")) {
      this.selectedIndex = 8;
    }
  }

  editProject() {
    let tempProjectId = localStorage.getItem("tempProject");

    if (tempProjectId == null) {
      let tempId = this.router.url.split("/");

      this.router.navigate(["./edit-project/", tempId[2]]);
    } else {
      this.router.navigate(["./edit-project/", tempProjectId]);
    }
  }
  taskDetails() {
    let tempProjectId = localStorage.getItem("tempProject");
    if (tempProjectId == null) {
      let tempId = this.router.url.split("/");

      this.router.navigate(["./task-list/", tempId[2]]);
    } else {
      this.router.navigate(["./task-list/", tempProjectId]);
    }
  }
  addDiscussion() {
    let tempProjectId = localStorage.getItem("tempProject");
    if (tempProjectId == null) {
      let tempId = this.router.url.split("/");

      this.router.navigate(["./discussions/", tempId[2]]);
    } else {
      this.router.navigate(["./discussions/", tempProjectId]);
    }
  }
  projectFiles() {
    let tempProjectId = localStorage.getItem("tempProject");
    if (tempProjectId == null) {
      let tempId = this.router.url.split("/");

      this.router.navigate(["./documents/", tempId[2]]);
    } else {
      this.router.navigate(["./documents/", tempProjectId]);
    }
  }

  projectSummary() {
    let tempProjectId = localStorage.getItem("tempProject");
    if (tempProjectId == null) {
      let tempId = this.router.url.split("/");

      this.router.navigate(["./project-summary/", tempId[2]]);
    } else {
      this.router.navigate(["./project-summary/", tempProjectId]);
    }
  }
  verifyLogs() {
    let tempProjectId = localStorage.getItem("tempProject");
    if (tempProjectId == null) {
      let tempId = this.router.url.split("/");

      this.router.navigate(["./verify-log/", tempId[2]]);
    } else {
      this.router.navigate(["./verify-log/", tempProjectId]);
    }
  }
  displayTimeLog() {
    let tempProjectId = localStorage.getItem("tempProject");
    console.log("tempProjectId : ", tempProjectId);
    if (tempProjectId == null) {
      let tempId = this.router.url.split("/");

      this.router.navigate(["./time-log/", tempId[2]]);
    } else {
      this.router.navigate(["./time-log/", tempProjectId]);
    }
  }
  displayProjectSettings() {
    let tempProjectId = localStorage.getItem("tempProject");
    if (tempProjectId == null) {
      let tempId = this.router.url.split("/");

      this.router.navigate(["./project-settings/", tempId[2]]);
    } else {
      this.router.navigate(["./project-settings/", tempProjectId]);
    }
  }
  // singleProjectLogs() {
  // 	let tempProjectId = localStorage.getItem('tempProject')
  // 	if (tempProjectId == null) {
  // 		let tempId = this.router.url.split("/")
  //
  // 		this.router.navigate(['./user-logs/', tempId[2]])
  // 	} else {
  // 		this.router.navigate(['./user-logs/', tempProjectId])
  // 	}
  // }
  createEditTaskForm() {
    this.editTaskForm = new FormGroup({
      title: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      assignTo: new FormControl(""),
      sprint: new FormControl(""),
      taskPriority: new FormControl("", Validators.required),
      dueDate: new FormControl(""),
      estimatedTime: new FormControl(""),
      status: new FormControl(
        { value: "To Do", disabled: true },
        Validators.required
      ),
      taskType: new FormControl(""),
    });
  }

  closeNav() {
    $("header").removeClass("open_menu");
  }

  ngOnInit() {
    this.route.queryParams.subscribe(async (queryParams) => {
      this.projectID = this.router.url.split("/")[2];
      console.log("queryParams : ", this.projectID);
      this.currentUser = JSON.parse(localStorage.getItem("currentUser"));

      if (
        this.projectID &&
        (await this.router.url.split("/")[1]) == "task-list"
      ) {
        // this._projectService
        //   .getProjectById(this.projectID)
        //   .subscribe((project: any) => {
        //
        //
        //     if (project) {
        //       let userID = this.currentUser._id;
        //       project.data.teamMembers.forEach((member) => {
        //         if (member._id === userID) {
        //
        //           this.currentUser.userRole = member.userRole;
        //           this.sideMenuControl = true;
        //
        //         }
        //       });
        //       project.data.projectManager.forEach((member) => {
        //         if (member._id === userID) {
        //
        //           this.currentUser.userRole = member.userRole;
        //           this.sideMenuControl = true;
        //
        //         }
        //       });
        //     }
        //   });
        this.getUserAccess();

        // do something with the query params
      }
    });

    let user = JSON.parse(localStorage.getItem("currentUser"));

    if (user != null) {
      let totalLength = Object.keys(user).length;

      // if (totalLength != 0) {
      // setInterval(() => {
      //   this.getCount();
      // }, 60000);
      // // }

      // if (totalLength != 0) {
      this.getProjects();
      // }
    }

    $(".nav_toggle_btn").click(function () {
      $("header").addClass("open_menu");
    });
    $(".menu_content_with_overlay,.nav_toggle_btn").click(function (et) {
      et.stopPropagation();
    });

    $(".collapsible-header").click(function () {
      $(".collapsible-body").toggle();
    });

    $(document).click(function (ent) {
      ent.stopPropagation();
      $("header").removeClass("open_menu");
    });

    $(".button-collapse").sideNav({
      edge: "left",
      closeOnClick: true,
    });
    $("#editModel").on("hidden.bs.modal", function () {
      this.projectId = null;
      // do something…
    });
  }

  getCount() {
    let user = JSON.parse(localStorage.getItem("currentUser"));

    if (user != null) {
      this._loginService.getNotificationCount().subscribe(
        (response) => {},
        (error) => {}
      );
    }
  }
  forTime() {
    $("#input_starttime").pickatime({
      darktheme: true,
      onSet: async (data) => {
        await setTime(data);
      },
    });

    var setTime = async (data) => {
      await this.editTaskForm.controls.estimatedTime.setValue(
        $("#input_starttime").val()
      );
    };
  }
  forDate() {
    $(".datepicker").pickadate({
      min: new Date(),
      onSet: async (context) => {
        await setDate(context);
      },
    });
    var setDate = async (context) => {
      await this.editTaskForm.controls.dueDate.setValue(
        this.dateFilter.transform(new Date(context.select), "yyyy-MM-dd")
      );
    };
  }

  myProfile(currentUser) {
    this.router.navigate(["./user/", currentUser._id]);
    this.closeNav();
  }
  projectSelected(item) {
    if (item) {
      this.addTaskDisable = false;
      this.resetTask = true;
      this._projectService.getProjectById(item._id).subscribe(
        (res: any) => {
          let data = res.data;

          $(".progress").addClass("abc");
          setTimeout(() => {
            this.projectId = item._id;
            this.totalTeam = [];
            this.developers = [];
            this.loader = false;
            this.taskDisplay = true;
            $(".progress").removeClass("abc");
            this.task.projectId = item._id;
            _.forEach(data.teamMembers, (singleMember) => {
              delete singleMember.update;
              this.developers.push(singleMember);
            });
            _.forEach(data.projectManager, (singleMember) => {
              delete singleMember.update;
              this.developers.push(singleMember);
            });
            _.forEach(data.admin, (admin) => {
              delete admin.update;
              this.developers.push(admin);
            });
            this.totalTeam = this.developers;
            // this.developers = data.teamMembers
          }, 3000);
        },
        (err) => {}
      );
    }
  }

  events: Event[] = [];

  onClear() {
    if (this.projectAdd == null) {
      this.addTaskDisable = true;
    }
  }

  clearSelection(event) {}

  getProjects() {
    this._projectService.getProjects().subscribe(
      (res: any) => {
        this.projects = res.data.projects;
        if (this.currentUser.userRole == "Manager") {
          this.demoprojects = [];

          _.forEach(this.projects.projects, (project) => {
            this.demoprojects.push(project);
          });
        } else {
          this.demoprojects = [];
          _.forEach(this.projects, (project) => {
            this.demoprojects.push(project);
          });
        }
      },
      (err) => {}
    );
  }

  closeModel() {
    $("#editModel").modal("hide");
  }

  createNewProject() {
    this.router.navigate(["/create-project"]);
    $("#editModel").modal("hide");
  }

  logout() {
    let DeviceToken = localStorage.getItem("DeviceToken");
    console.log("token : ", DeviceToken);
    // this._loginService.logout(userId).then(
    //   (res) => {
    //     localStorage.clear();
    //     this.router.navigate(["/login"]);
    //     this.ngOnInit();
    //   },
    //   (err) => {
    //     console.log(" err : ", err);
    //     localStorage.clear();
    //     this.router.navigate(["/login"]);
    //     this.ngOnInit();
    //   }
    // );

    if (DeviceToken) {
      console.log("device token : ", DeviceToken);
      this._loginService.logout(DeviceToken).subscribe(
        (res: any) => {
          localStorage.clear();
          this.router.navigate(["/login"]);
          this.ngOnInit();
        },
        (error) => {
          // localStorage.clear();
          // this.router.navigate(["/login"]);
          // this.ngOnInit();
        }
      );
    } else {
      localStorage.clear();
      this.router.navigate(["/login"]);
      this.ngOnInit();
    }
  }
  getTitle(name) {
    var str = name.split(" ");
    return (
      str[0].charAt(0).toUpperCase() +
      str[0].slice(1) +
      " " +
      str[1].charAt(0).toUpperCase() +
      str[1].slice(1)
    );
  }

  getInitialsOfName(name) {
    if (name != "admin") {
      var str = name.split(" ")[0][0] + name.split(" ")[1][0];
      return str.toUpperCase();
    } else if (name == "admin") {
      return "A";
    } else {
      return "";
    }
  }

  getAllDevelopers() {
    this._projectService.getAllDevelopers().subscribe(
      (res: any) => {
        this.developers = res.data;

        this.developers.sort(function (a, b) {
          var nameA = a.name.toLowerCase(),
            nameB = b.name.toLowerCase();
          if (nameA < nameB)
            //sort string ascending
            return -1;
          if (nameA > nameB) return 1;
          return 0; //default return value (no sorting)
        });
      },
      (err) => {
        this._alertService.error(err);
      }
    );
  }

  addItem(option) {
    // this.task = this.getEmptyTask();
    // this.editTaskForm.reset()
    // this.demoprojects = []
    this.submitted = false;
    this.modalTitle = "Add " + option;
    if (option == "Bugg") {
      this.addTaskType = "Bugg";
    } else {
      this.addTaskType = option;
    }
    this.resetTask = true;
    this.totalTeam = [];
    this.taskDisplay = false;
    // $('.datepicker').pickadate();
    this.ngSelect.handleClearClick();
    $("#editModel").modal("show");
    // this.editTaskForm.controls.taskType.setValue(option)
  }

  get f() {
    return this.editTaskForm.controls;
  }

  taskAdded(event) {
    $("#editModel").modal("hide");
    this.ngSelect.handleClearClick();
  }

  saveTheData(task) {
    // if (task.assignTo == null)
    // 	delete task.assignTo

    this.submitted = true;
    if (this.editTaskForm.invalid) {
      return;
    }
    this.isDisable = true;
    this.loader = true;
    task["projectId"] = this.projectId;

    task.taskPriority = task.taskPriority;

    task.dueDate = $("#date-picker").val();
    task.estimatedTime = $("#input_starttime").val();

    let data = new FormData();
    _.forOwn(task, function (value, key) {
      if (value != null) {
        data.append(key, value);
      }
    });
    if (this.files.length > 0) {
      for (var i = 0; i < this.files.length; i++) {
        data.append("fileUpload", this.files[i]);
      }
    }

    /**
     * @param res its about track
     * @param return its gives result someitnng
     */
    this._projectService.addTask(data).subscribe(
      (res: any) => {
        // this.editTaskForm.reset();

        // let name = res.data.data[0].name;
        //
        Swal.fire({
          type: "success",
          title: "Task Added Successfully to",
          text: name,
          showConfirmButton: false,
          timer: 2000,
          // position: 'top-end'
        });
        this.isDisable = false;
        // this.getProject(res.projectId._id);
        $("#save_changes").attr("disabled", false);
        $("#refresh_icon").css("display", "none");
        $("#itemManipulationModel").modal("hide");
        $("#editModel").modal("hide");
        this.newTask = this.getEmptyTask();
        this.ngSelect.handleClearClick();
        this.files = this.url = [];
        this.submitted = false;
        this.demoprojects = null;
        this.editTaskForm.clearValidators();
        this.editTaskForm.reset();
        this.loader = false;
        this.getProjects();
        this.forTime();
        $("#input_starttime").timepicker({
          default: "00:00",
        });
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
        //$('#alert').css('display','block');
      }
    );
  }
  getEmptyTask() {
    return {
      title: "",
      description: "",
      assignTo: "",
      sprint: "",
      status: "To Do",
      taskPriority: "",
      dueDate: "",
      estimatedTime: "",
      projectId: "",
      images: [],
    };
  }

  reloadProjects() {
    this._projectService.getProjects().subscribe(
      (res) => {
        this.projects = res;
      },
      (err) => {}
    );
  }

  onSelectFile(event, option) {
    _.forEach(event.target.files, (file: any) => {
      //
      if (
        file.type == "image/png" ||
        file.type == "image/jpeg" ||
        file.type == "image/jpg"
      ) {
        this.files.push(file);
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e: any) => {
          if (option == "item") this.url.push(e.target.result);
          if (option == "comment") this.commentUrl.push(e.target.result);
        };
      } else {
        Swal.fire({
          title: "Error",
          text: "You can upload images only",
          type: "warning",
        });
      }
    });
  }
  getUnreadNotification() {
    //
    let notificationCount = localStorage.getItem("countOfNotification");
    let count = 0;

    if (notificationCount != null && this.pushNotificationData != undefined) {
      // Number(uniqueNumber) + +1
      let newCount = Number(notificationCount) + +1;

      localStorage.setItem("countOfNotification", JSON.stringify(newCount));

      this.newNotification = newCount;
    } else if (this.pushNotificationData != undefined) {
      let count1 = Number(count) + +1;
      localStorage.setItem("countOfNotification", JSON.stringify(count1));

      this.newNotification = count1;
    } else {
      this.newNotification = notificationCount;
    }

    //
    // this._projectService.getUnreadNotification(this.currentUser._id).subscribe((res: any) => {
    // 	this.unreadNotification = res;
    //
    // 	this.newNotification = this.unreadNotification.length;
    // 	// this.unreadNotification.length = this.newNotification;
    // });
  }

  viewNotification() {
    localStorage.removeItem("countOfNotification");
    this.newNotification = 0;
    this.router.navigate(["/notifications"]);
  }

  removeAvatar(file, index) {
    this.url.splice(index, 1);
    if (this.files && this.files.length) this.files.splice(index, 1);
  }
  removeCommentImage(file, index) {
    this.commentUrl.splice(index, 1);
    if (this.files && this.files.length) this.files.splice(index, 1);
  }

  removeAlreadyUplodedFile(option) {
    this.newTask.images.splice(option, 1);
  }
  close() {
    this.editTaskForm.reset();
    this.url = this.files = [];
    // this.task.estimatedTime = " ";
    // this.editTaskForm.estimatedTime = "";
    $("#estTime").val(null);
    $("#priority").val(null);
    // this.task.priority = null;
    // this.newTask.priority = null;
  }
  changeFile(event) {
    this.files = event;
  }
}
