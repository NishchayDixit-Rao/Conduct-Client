import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  ElementRef,
} from "@angular/core";
import { Observable } from "rxjs";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { config } from "../../config";
import { ProjectService } from "../../services/project.service";
import Swal from "sweetalert2";
import { Router, ActivatedRoute } from "@angular/router";
import * as _ from "lodash";
import * as moment from "moment";
import { NgSelectComponent } from "@ng-select/ng-select";
import { S3UploadService } from "../../services/s3-upload.service";
import { NewFileUploadComponent } from "../../common-use/new-file-upload/new-file-upload.component";
import { find, pull } from "lodash";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { SelectAvatarComponent } from "../select-avatar/select-avatar.component";
import { InvitationLinkComponent } from "../invitation-link/invitation-link.component";
@Component({
  selector: "app-create-new-project",
  templateUrl: "./create-new-project.component.html",
  styleUrls: ["./create-new-project.component.css"],
})
export class CreateNewProjectComponent implements OnInit {
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;

  addForm: FormGroup;
  isSelectFile: boolean = false;
  url = "";
  baseUrl = config.baseMediaUrl;
  files: FileList;
  isAvatar: boolean = false;
  isDisable: boolean = false;
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  submitted = false;
  projectDeadlineDate: any;
  dteam = [];
  pmFinalTeam: any = [];
  projectTeam: any = [];
  projectMngrTeam: any = [];
  teamMemberId: any = [];
  projectManagerId: any = [];
  availableDevelopers: any = [];
  avaliableProjectManager: any = [];
  ProjectId;
  availData;
  pageTitle;
  deadlineDate;
  buttonTitle;
  Name = "Deadline Date";
  editProject;
  onlyPm;
  loader = false;
  loading = false;
  displayButton;
  sideMenuButton;
  editDescription;
  uploadedFile;
  inviteDevelopers: any;
  userInvitationList: any = [];
  workCircleList = [];
  todayDate = JSON.parse(localStorage.getItem("todayDate"));

  // ngSelectComponent: any;

  @ViewChild("tagInput") tagInputRef: ElementRef;
  tags: string[] = ["html", "Angular"];
  constructor(
    public dialog: MatDialog,
    public _projectService: ProjectService,
    public router: Router,
    public route: ActivatedRoute,
    public _change: ChangeDetectorRef,
    public s3Service: S3UploadService,
    private fb: FormBuilder
  ) {
    this.addForm = new FormGroup({
      title: new FormControl("", [Validators.required]),
      avatar: new FormControl(""),
      description: new FormControl("", [Validators.required]),
      deadline: new FormControl("", [Validators.required]),
      taskAlias: new FormControl("", [
        Validators.required,
        Validators.maxLength(6),
      ]),
      // dueDate: new FormControl("", [Validators.required]),
      projectManager: new FormControl([]),
      technology: new FormControl(""),
      // tags: this.fb.group({
      //   tag: [undefined]
      // })
      // teamMembers: new FormControl([])
      // allDeveloper: new FormControl(''),
    });

    this.route.params.subscribe((params) => {
      this.ProjectId = params.id;

      if (this.ProjectId) {
        this.sideMenuButton = true;
        // this.displayButton = false
        this.getEditprojectDetails(this.ProjectId);
        this.pageTitle = "Edit Project";
        this.getUsersNotInProject(this.ProjectId);
        this.buttonTitle = "Update Project";
      } else {
        this.pageTitle = "Create Project";
        this.buttonTitle = "Create Project";
      }
    });
  }

  ngOnInit() {
    localStorage.removeItem("tempProject");
    this.getWorkCircleList();
  }

  // focusTagInput(): void {
  //   this.tagInputRef.nativeElement.focus();
  // }

  // onKeyUp(event: KeyboardEvent): void {
  // //

  // //   // const inputValue: string = this.addForm.controls.tags.value;
  // //   if (event.code === 'Backspace' && !inputValue) {
  // //     this.removeTag();
  // //     return;
  // //   } else {
  // //     if (event.code === 'Comma' || event.code === 'Space') {
  // //       this.addTag(inputValue);
  // //       // this.addForm.controls.tags.setValue('');
  // //     }
  // //   }
  // // }

  // addTag(tag: string): void {
  //   if (tag[tag.length - 1] === ',' || tag[tag.length - 1] === ' ') {
  //     tag = tag.slice(0, -1);
  //   }
  //   if (tag.length > 0 && !find(this.tags, tag)) {
  //     this.tags.push(tag);
  //   }
  // }

  // removeTag(tag?: string): void {
  //   if (!!tag) {
  //     pull(this.tags, tag);
  //   } else {
  //     this.tags.splice(-1);
  //   }
  // }

  uploadNewFile() {
    let obj = {
      singleFile: true,
      avtar: true,
      path: "Projects",
    };
    let data = obj;
    var taskDetails = this.openDialog(NewFileUploadComponent, data).subscribe(
      (response) => {
        if (response != undefined) {
          this.uploadedFile = response[0];
          this.url = this.uploadedFile.Location;
          // this.discussionList.push(response)
          // this.updateData(this.discussionList)
        }
      }
    );
  }

  // openDialog(someComponent, data = {}): Observable<any> {
  //
  //   const dialogRef = this.dialog.open(someComponent, { data });
  //   return dialogRef.afterClosed();
  // }

  contentData(event) {
    //
    if (event == null) {
      this.addForm.controls["description"].setValue(null);
    } else {
      this.addForm.controls["description"].setValue(event);
    }
  }

  getEditprojectDetails(id) {
    // this.loader = false;
    this.loader = true;

    this._projectService.getProjectById(id).subscribe(
      (res: any) => {
        this.availData = res.data;

        this.editDescription = this.availData.description;
        localStorage.setItem("teams", JSON.stringify(this.availData));
        this.availData["add"] = [];
        this.availData["delete"] = [];
        this.availData["pmAdd"] = [];
        this.availData["pmRemove"] = [];
        this.url = this.availData.avatar;

        this.deadlineDate = moment(this.availData.deadline).format(
          "YYYY-MM-DD"
        );
        this.loader = false;
        this.projectTeam = this.availData.teamMembers;
        // this.editProject = true
        // localStorage.setItem('teams', JSON.stringify(this.projectTeam))

        _.forEach(this.projectTeam, (member) => {
          this.teamMemberId.push(member._id);
        });
        this.projectMngrTeam = this.availData.projectManager;
        _.forEach(this.projectMngrTeam, (pm1) => {
          this.projectManagerId.push(pm1._id);
        });
      },
      (err) => {
        this.loader = false;
      }
    );
  }

  getUsersNotInProject(projectId) {
    this._projectService.getUsersNotInProject(projectId).subscribe(
      (response: any) => {
        this.loader = false;
        this.availableDevelopers = response.teamMembers;

        this.dteam = [];
        _.forEach(this.availableDevelopers, (developer) => {
          //
          developer["redirect"] = false;
          this.dteam.push(developer);
        });
        this.pmFinalTeam = [];
        this.avaliableProjectManager = response.projectManager;
        _.forEach(this.avaliableProjectManager, (projectManager) => {
          //
          projectManager["redirect"] = false;
          this.pmFinalTeam.push(projectManager);
        });
        //
        //
      },
      (error) => {
        console.error("error of not getting users", error);
        this.loader = false;
      }
    );
  }

  getWorkCircleList() {
    this._projectService.getWorkCircleList().subscribe(
      (response: any) => {
        if (Object.keys(response).length !== 0) {
          this.dteam = [];
          // this.dteam = response.data.participants;
          this.workCircleList = response.data.participants;
          _.forEach(response.data.participants, (developer) => {
            //
            developer["redirect"] = false;
            // this.dteam.push(developer);
            // this.pmFinalTeam = [...this.pmFinalTeam, developer];
            this.teamMemberId.push(developer._id);
            this.availableDevelopers.push(developer);
            this.projectManagerId.push(developer._id);
            this.avaliableProjectManager.push(developer);
            // this.workCircleList.push(developer);

            // if (
            //   developer.userRole == "Manager" &&
            //   developer._id != this.currentUser._id
            // ) {
            //   //
            //   developer["redirect"] = false;
            //   this.pmFinalTeam = [...this.pmFinalTeam, developer];
            //
            //   this.projectManagerId.push(developer._id);
            //   this.avaliableProjectManager.push(developer);
            // } else if (developer.userRole == "Team Member") {
            //   //
            //   developer["redirect"] = false;
            //   this.dteam.push(developer);
            //   this.teamMemberId.push(developer._id);
            //   this.availableDevelopers.push(developer);
            // }

            // this.dteam.push(developer);
          });
        }
        // _.forEach(response.data.participants, (developer) => {
        //
        //   developer["redirect"] = false;
        //   this.dteam.push(developer);
        //   this.teamMemberId.push(developer._id);
        //   this.availableDevelopers.push(developer);
        //   this.projectManagerId.push(developer._id);
        //   this.avaliableProjectManager.push(developer);
        //   this.pmFinalTeam = [...this.pmFinalTeam, developer];

        //   // if (
        //   //   developer.userRole == "Manager" &&
        //   //   developer._id != this.currentUser._id
        //   // ) {
        //   //   //
        //   //   developer["redirect"] = false;
        //   //   this.pmFinalTeam = [...this.pmFinalTeam, developer];
        //   //
        //   //   this.projectManagerId.push(developer._id);
        //   //   this.avaliableProjectManager.push(developer);
        //   // } else if (developer.userRole == "Team Member") {
        //   //   //
        //   //   developer["redirect"] = false;
        //   //   this.dteam.push(developer);
        //   //   this.teamMemberId.push(developer._id);
        //   //   this.availableDevelopers.push(developer);
        //   // }

        //   // this.dteam.push(developer);
        // });
      },
      (error) => {}
    );
  }
  get f() {
    return this.addForm.controls;
  }

  /**
   *
   * @param userRole - Role of the particular user for the particular project.
   * This function will open Invitation modal, from where user can enter email
   * address of the particular user to add him to his project.
   */
  openInvitationModal(userRole) {
    var addBank = this.openDialog(InvitationLinkComponent, userRole).subscribe(
      (response) => {
        if (response != undefined) {
          console.log("workCircleList : ", this.workCircleList);
          if (
            this.userInvitationList.some(
              (user) => user.email == response.email
            ) ||
            this.workCircleList.some((user) => user.email == response.email)
          ) {
            alert("Email has already assign a different role");
          } else {
            let invitationObj = {
              userRole: userRole,
              email: response.email,
            };
            this.userInvitationList.push(invitationObj);
          }
        }
      }
    );
  }

  selectProjectAvatar() {
    let data = "vivek";
    var addBank = this.openDialog(SelectAvatarComponent, data).subscribe(
      (response) => {
        if (response != undefined) {
          this.isSelectFile = true;
          this._projectService.fileNotSelect(this.isSelectFile);
          //
          // this.addForm.value['avatar'] = response;
          this.addForm.patchValue({
            avatar: response,
          });
          this.addForm.get("avatar").updateValueAndValidity();

          this.url = response;
        }
      }
    );
  }
  openDialog(someComponent, data = {}): Observable<any> {
    const dialogRef = this.dialog.open(someComponent, { data });
    return dialogRef.afterClosed();
  }

  removeAvatar() {
    this.isSelectFile = false;
    this._projectService.fileNotSelect(this.isSelectFile);
    this.url = null;
    this.uploadedFile = null;
    if (this.files && this.files.length) this.files = null;
  }

  onSelectFile(event) {
    this.isAvatar = true;

    this.files = event;
    if (event == false) {
      this.isAvatar = false;
    }
  }

  getDate(event) {
    this.projectDeadlineDate = moment(event.value).format("YYYY-MM-DD");

    this.addForm.patchValue({
      deadline: this.projectDeadlineDate,
    });
    this.addForm.get("deadline").updateValueAndValidity();
  }

  addProject(addForm) {
    //

    let s3File;
    this.loading = true;

    // this.loader = true
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    this.isDisable = true;

    var data: FormData = new FormData();
    _.forOwn(addForm, function (value, key) {
      data.append(key, value);
    });
    if (this.currentUser.userRole == "Manager") {
      const pmId = this.currentUser._id;
      const projectManager: any = {
        _id: pmId,
      };
      data.append("projectManager", JSON.stringify(projectManager));
    }

    let add = [];
    _.forEach(this.projectTeam, (singleDeve) => {
      let teamId = {
        _id: singleDeve._id,
      };
      add.push(teamId);
    });
    data.append("add", JSON.stringify(add));
    let pmAdd = [];
    _.forEach(this.projectMngrTeam, (singlePm) => {
      let pmId = {
        _id: singlePm._id,
      };
      pmAdd.push(pmId);
    });
    data.append("pmAdd", JSON.stringify(pmAdd));

    /** IF userInvitationList is present then it will add it to the FormData() */
    if (this.userInvitationList.length !== 0) {
      data.append("inviteMembers", JSON.stringify(this.userInvitationList));
    }
    if (this.uploadedFile != undefined || this.uploadedFile != null) {
      let path = "Projects";
      // this.s3Service.uploadFile(this.files[0], path).subscribe((response: any) => {
      //
      // if (response && response.Location) {
      s3File = this.uploadedFile.Location;

      data.append("avatar", s3File);
      this._projectService.addProject(data).subscribe(
        (res: any) => {
          Swal.fire({
            type: "success",
            title: "Project Created Successfully",
            showConfirmButton: false,
            timer: 2000,
          });
          this.addForm.reset();
          // this.url = '';

          // setTimeout(() => {
          this.router.navigate(["/projects"]);
          // }, 1000)
          this.isDisable = false;
          this.loading = false;
        },
        (err) => {
          Swal.fire({
            type: "error",
            title: err.message,
            showConfirmButton: false,
            timer: 2000,
          });
          this.isDisable = false;
          this.loading = false;
        }
      );
      // }

      // }, error => {
      //

      // })
      //

      // for (var i = 0; i < this.files.length; i++) {
      //   data.append('uploadfile', this.files[i]);
      // }
    } else {
      this._projectService.addProject(data).subscribe(
        (res: any) => {
          Swal.fire({
            type: "success",
            title: "Project Created Successfully",
            showConfirmButton: false,
            timer: 2000,
          });
          this.addForm.reset();
          // this.url = '';

          // setTimeout(() => {
          this.router.navigate(["/projects"]);
          // }, 1000)
          this.isDisable = false;
          this.loading = false;
        },
        (err) => {
          Swal.fire({
            type: "error",
            title: err.message,
            showConfirmButton: false,
            timer: 2000,
          });
          this.isDisable = false;
          this.loading = false;
        }
      );
    }
    //
  }
  inviteDeveloper(event) {}
  validateEmailList(raw) {
    const emails = raw.split(",");

    let valid = true;
    let regex =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    for (let i = 0; i < emails.length; i++) {
      if (emails[i] === "" || !regex.test(emails[i].replace(/\s/g, ""))) {
        valid = false;
      }
    }
    return valid;
  }

  clear(data) {}
  clearData(event) {}

  removeDeveloper(event) {
    //
    if (event.update) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-default",
          cancelButton: "btn btn-delete",
        },
        buttonsStyling: false,
      });
      swalWithBootstrapButtons
        .fire({
          html:
            "<span style=" +
            "font-size:25px" +
            ">  Are you sure you want to remove <strong style=" +
            "font-weight:bold" +
            ">" +
            " " +
            event.name +
            " </strong> " +
            " from  <strong style=" +
            "font-weight:bold" +
            ">" +
            " " +
            this.availData.title +
            "</strong> ? </span>",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "Delete",
          showCloseButton: true,
          reverseButtons: true,
        })
        .then((result) => {
          if (result.value) {
            var body;
            // this.projectTeam.splice(_.findIndex(this.projectTeam, event), 1);

            let index = this.projectTeam.findIndex((x) => x._id === event._id);
            this.projectTeam.splice(index, 1);
            //
            if (_.findIndex(this.dteam, { _id: event._id }) == -1) {
              this.teamMemberId.splice(this.teamMemberId.indexOf(event._id), 1);

              this.availData.delete.push(event);
              // this.availData.add.splice(this.availData.add.indexOf(event._id), 1)

              this.availableDevelopers.push(event);
              // this.ngSelectComponent.handleClearClick();
              // this.dteam = this.availableDevelopers

              this.dteam = [...this.dteam, event];
            }
          }
        });
    } else {
      let index = this.projectTeam.findIndex((x) => x._id === event._id);
      this.projectTeam.splice(index, 1);
      // this.projectTeam.splice(_.findIndex(this.projectTeam, event), 1);

      if (_.findIndex(this.workCircleList, { _id: event._id }) == -1) {
        this.teamMemberId.splice(this.teamMemberId.indexOf(event._id), 1);
        // this.availableDevelopers.push(event);
        //

        this.workCircleList = [...this.workCircleList, event.value];

        if (this.availData) {
          this.availData.add.splice(this.availData.add.indexOf(event._id), 1);
        }
        // this.dteam = this.availableDevelopers
      }
    }
  }

  addDeveloper(event) {
    // if (this.availData) {
    //   this.availData.add.push(event._id);
    // }
    // this.projectTeam.push(event);
    // let index = this.workCircleList.findIndex((x) => x._id === event._id);
    //
    // this.workCircleList.splice(index, 1);
    //
    // this._change.detectChanges();
    if (this.availData) {
      if (event) {
        let developer = {
          _id: event._id,
          name: event.name,
          userRole: event.userRole,
          profilePhoto: event.profilePhoto,
          redirect: event.redirect,
        };
        this.projectTeam.push(developer);
        this.availData.add.push(event._id);
      }
      // this.dteam = this.dteam.filter((deve) => deve._id !== event._id);
      // this.availableDevelopers = this.dteam.filter(
      //   (deve) => deve._id !== event._id
      // );

      this.workCircleList = this.workCircleList.filter(
        (deve) => deve._id !== event._id
      );
      this.availableDevelopers = this.workCircleList.filter(
        (deve) => deve._id !== event._id
      );
    } else {
      if (event) {
        let developer = {
          _id: event._id,
          name: event.name,
          userRole: event.userRole,
          profilePhoto: event.profilePhoto,
          redirect: event.redirect,
        };

        this.projectTeam.push(developer);
        // this.availData.add.push(event._id);
      }
      // this.dteam = this.dteam.filter((deve) => deve._id !== event._id);
      // this.availableDevelopers = this.dteam.filter(
      //   (deve) => deve._id !== event._id
      // );
      this.workCircleList = this.workCircleList.filter(
        (deve) => deve._id !== event._id
      );
      this.availableDevelopers = this.workCircleList.filter(
        (deve) => deve._id !== event._id
      );
      //
    }
    //
  }

  addProjectManager(event) {
    // if (this.availData) {
    //   this.availData.pmAdd.push(event._id);
    // }
    // this.projectMngrTeam.push(event);
    // let index = this.workCircleList.findIndex((x) => x._id === event._id);
    //
    // this.workCircleList.splice(index, 1);
    //
    // this._change.detectChanges();
    if (this.availData) {
      if (event) {
        let projectManagers = {
          _id: event._id,
          name: event.name,
          userRole: event.userRole,
          profilePhoto: event.profilePhoto,
          redirect: event.redirect,
        };
        this.projectMngrTeam.push(projectManagers);
        this.availData.pmAdd.push(event._id);
      }
      // this.pmFinalTeam = this.pmFinalTeam.filter(
      //   (deve) => deve._id !== event._id
      // );
      // this.avaliableProjectManager = this.pmFinalTeam.filter(
      //   (deve) => deve._id !== event._id
      // );
      this.workCircleList = this.workCircleList.filter(
        (deve) => deve._id !== event._id
      );
      this.avaliableProjectManager = this.workCircleList.filter(
        (deve) => deve._id !== event._id
      );
    } else {
      if (event) {
        let projectManagers = {
          _id: event._id,
          name: event.name,
          userRole: event.userRole,
          profilePhoto: event.profilePhoto,
          redirect: event.redirect,
        };
        this.projectMngrTeam.push(projectManagers);
      }

      // this.pmFinalTeam = this.pmFinalTeam.filter(
      //   (deve) => deve._id !== event._id
      // );
      // this.avaliableProjectManager = this.pmFinalTeam.filter(
      //   (deve) => deve._id !== event._id
      // );

      this.workCircleList = this.workCircleList.filter(
        (deve) => deve._id !== event._id
      );
      this.avaliableProjectManager = this.workCircleList.filter(
        (deve) => deve._id !== event._id
      );
    }
  }

  removeProjectManager(event) {
    if (event.update) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-default",
          cancelButton: "btn btn-delete",
        },
        buttonsStyling: false,
      });
      swalWithBootstrapButtons
        .fire({
          html:
            "<span style=" +
            "font-size:25px" +
            ">  Are you sure you want to remove <strong style=" +
            "font-weight:bold" +
            ">" +
            " " +
            event.name +
            " </strong> " +
            " from  <strong style=" +
            "font-weight:bold" +
            ">" +
            " " +
            this.availData.title +
            "</strong> ? </span>",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "Delete",
          showCloseButton: true,
          reverseButtons: true,
        })
        .then((result) => {
          if (result.value) {
            var body;

            let index = this.projectMngrTeam.findIndex(
              (x) => x._id === event._id
            );
            this.projectMngrTeam.splice(index, 1);
            // this.projectMngrTeam.splice(_.findIndex(this.projectMngrTeam, event), 1);
            if (_.findIndex(this.pmFinalTeam, { _id: event._id }) == -1) {
              this.projectManagerId.splice(
                this.projectManagerId.indexOf(event._id),
                1
              );
              this.availData.pmRemove.push(event);
              // this.availData.pmAdd.splice(this.availData.pmAdd.indexOf(event._id), 1)
              this.avaliableProjectManager.push(event);
              // this.ngSelectComponent.handleClearClick();
              // this.pmFinalTeam = this.avaliableProjectManager

              this.pmFinalTeam = [...this.pmFinalTeam, event];
            }
          }
        });
    } else {
      let index = this.projectMngrTeam.findIndex((x) => x._id === event._id);
      this.projectMngrTeam.splice(index, 1);
      var body;
      // this.projectMngrTeam.splice(_.findIndex(this.projectMngrTeam, event), 1);
      if (_.findIndex(this.workCircleList, { _id: event._id }) == -1) {
        this.projectManagerId.splice(
          this.projectManagerId.indexOf(event._id),
          1
        );
        this.avaliableProjectManager.push(event);
        // this.workCircleList.push(event)

        this.workCircleList = [...this.workCircleList, event.value];

        // this._change.detectChanges()
        if (this.availData) {
          this.availData.pmAdd.splice(
            this.availData.pmAdd.indexOf(event._id),
            1
          );
        }
      }
    }
  }
  updateProject(updateForm) {
    this.loading = true;
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    this.isDisable = true;

    updateForm.delete = [];
    _.forEach(this.availData.delete, (removeDeve) => {
      let removeId = {
        _id: removeDeve._id,
      };
      updateForm.delete.push(removeId);
    });
    updateForm.add = [];
    _.forEach(this.availData.add, (singleDeve) => {
      let teamId = {
        _id: singleDeve,
      };
      updateForm.add.push(teamId);
    });
    updateForm.pmAdd = [];
    _.forEach(this.availData.pmAdd, (singlePm) => {
      let pmId = {
        _id: singlePm,
      };
      updateForm.pmAdd.push(pmId);
    });
    updateForm.pmRemove = [];
    _.forEach(this.availData.pmRemove, (removePm) => {
      let removePmId = {
        _id: removePm._id,
      };
      updateForm.pmRemove.push(removePmId);
    });

    // updateForm.taskAlias = this.availData.taskAlias;
    // updateForm.avatar = this.availData.avatar;
    updateForm._id = this.availData._id;
    if (updateForm.deadline == "") {
      updateForm.deadline = this.deadlineDate;
    }
    if (updateForm.avatar == "") {
      updateForm.avatar = this.availData.avatar;
    }

    const data = new FormData();
    data.append("title", updateForm.title);
    data.append("description", updateForm.description);
    data.append("taskAlias", updateForm.taskAlias);
    data.append("deadline", updateForm.deadline);

    data.append("technology", updateForm.technology);
    data.append("add", JSON.stringify(updateForm.add));
    data.append("delete", JSON.stringify(updateForm.delete));
    data.append("pmAdd", JSON.stringify(updateForm.pmAdd));
    data.append("pmRemove", JSON.stringify(updateForm.pmRemove));
    /** IF userInvitationList is present then it will add it to the FormData() */
    if (this.userInvitationList.length !== 0) {
      data.append("inviteMembers", JSON.stringify(this.userInvitationList));
    }
    let s3File;
    if (this.uploadedFile != undefined || this.uploadedFile != null) {
      // data.append('upload', this.files[0]);
      let path = "Projects";
      // this.s3Service.uploadFile(this.files[0], path).subscribe((response: any) => {
      //
      // if (response && response.Location) {
      s3File = this.uploadedFile.Location;
      data.append("avatar", s3File);
      this._projectService.updateProject(updateForm._id, data).subscribe(
        (response: any) => {
          this.onlyPm = [];
          this.ngSelectComponent.handleClearClick();
          this.loading = false;
          Swal.fire({
            type: "success",
            title: "Project Updated Successfully",
            showConfirmButton: false,
            timer: 3000,
          });
          this.router.navigate(["/projects"]);
          this.url = "";
          this.isDisable = false;
          // this.clearSelection(event)
        },
        (error) => {
          Swal.fire("Oops...", "Something went wrong!", "error");
          this.isDisable = false;
          this.loading = false;
        }
      );
      // }
      // }, error => {
      //

      // })
    } else {
      data.append("avatar", updateForm.avatar);
      this._projectService.updateProject(updateForm._id, data).subscribe(
        (response: any) => {
          this.onlyPm = [];
          this.ngSelectComponent.handleClearClick();
          this.loading = false;
          Swal.fire({
            type: "success",
            title: "Project Updated Successfully",
            showConfirmButton: false,
            timer: 3000,
          });
          this.router.navigate(["/projects"]);
          this.url = "";
          this.isDisable = false;
          // this.clearSelection(event)
        },
        (error) => {
          Swal.fire("Oops...", "Something went wrong!", "error");
          this.isDisable = false;
          this.loading = false;
        }
      );
    }
  }
  deleteProject(projectId) {
    if (projectId.tasks) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-default",
          cancelButton: "btn btn-delete",
        },
        buttonsStyling: false,
      });
      swalWithBootstrapButtons
        .fire({
          title: "You can not delete this project!",
          html:
            "Number of team-members : <strong style=" +
            "font-weight:bold" +
            ">" +
            projectId.teamMembers.length +
            "</strong><br> Total number of tasks : <strong style=" +
            "font-weight:bold" +
            ">" +
            projectId.tasks.length +
            "</strong> <br> <strong style=" +
            "font-weight:bold" +
            ">Are you sure to delete? </strong> ",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "Delete",
          showCloseButton: true,
          reverseButtons: true,
        })
        .then((result) => {
          this.isDisable = true;
          if (result.value) {
            this.loading = true;
            var body;

            this._projectService.deleteProjectById(projectId._id).subscribe(
              (res: any) => {
                // $("#projects,#item_list,#visit_team_members").addClass('disabled');
                // this.projects = res;

                Swal.fire({
                  type: "success",
                  title: "Project deleted Successfully",
                  showConfirmButton: false,
                  timer: 2000,
                });
                this.isDisable = false;
                this.loading = false;
                this.router.navigate(["./projects"]);
              },
              (err: any) => {
                this.isDisable = false;

                Swal.fire("Oops...", "Something went wrong!", "error");
                this.loading = false;
              }
            );
          }
        });
    } else {
      this.isDisable = true;
      this._projectService.deleteProjectById(projectId._id).subscribe(
        (res: any) => {
          // this.projects = res;
          Swal.fire({
            type: "success",
            title: "Project deleted Successfully",
            showConfirmButton: false,
            timer: 2000,
          });
          this.router.navigate(["./projects"]);
          this.isDisable = false;
        },
        (err: any) => {
          this.isDisable = false;

          Swal.fire("Oops...", "Something went wrong!", "error");
        }
      );
    }
  }
}
