import { Component, OnInit, Inject } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { CommentService } from "../../services/comment.service";
import { Route, ActivatedRoute } from "@angular/router";
import { config } from "../../config";
import * as _ from "lodash";
import { AddTaskComponent } from "../add-task/add-task.component";
import { Observable } from "rxjs";
import Swal from "sweetalert2";
import { S3UploadService } from "../../services/s3-upload.service";
import { MoveCopyTaskComponent } from "../move-copy-task/move-copy-task.component";
import { ProjectService } from "../../services/project.service";
@Component({
  selector: "app-single-task-details",
  templateUrl: "./single-task-details.component.html",
  styleUrls: [
    "./single-task-details.component.css",
    "../single-project-details/single-project-details.component.css",
  ],
})
export class SingleTaskDetailsComponent implements OnInit {
  task;
  path = config.baseMediaUrl;
  movedUserName;
  comments: any = [];
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  projectId;
  resetComment;
  displayTeam: any = [];
  isDisplay = false;
  displayImages = [];
  displayBtn = true;
  notAssign = {
    name: "Unassigned",
  };
  displayContent;
  currentProject: any;
  constructor(
    public dialogRef: MatDialogRef<SingleTaskDetailsComponent>,

    public projectService: ProjectService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public commentService: CommentService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public s3Service: S3UploadService,
    private sanitizer: DomSanitizer
  ) {
    // this.dialogRef.disableClose = true;
    // this.route.params.subscribe(param => {
    //
    //
    //   // this.getEmptyTracks();
    // });
  }

  ngOnInit() {
    if (this.data.displayButton == false) {
      this.displayBtn = this.data.displayButton;
      this.projectId = this.data.projectId;
    }
    this.task = this.data.task;
    if (this.task) {
      this.isDisplay = true;
    }

    this.displayContent = this.sanitizer.bypassSecurityTrustHtml(
      this.task.description
    );
    this.displayImages = this.task.images;
    this.projectId = this.data.projectId;
    this.displayTeam = this.data.team;
    if (this.task.movedBy) {
      this.movedUserName = this.task.movedBy;
    }
    this.getAllComments(this.task._id);
  }

  getAllComments(taskId) {
    this.comments = [];
    this.commentService.getAllComments(taskId).subscribe(
      (res: any) => {
        let details = res.data[0];
        let totalComments = res.totalCommments;
        let newArray = [];

        if (totalComments.length !== 0) {
          let sortedComments = totalComments.sort(function (a, b) {
            let c = new Date(a.createdAt);
            let d = new Date(b.createdAt);
            return Number(d) - Number(c);
          });

          _.forEach(sortedComments, (comment) => {
            var x = Object.keys(comment);

            if (x && x.length > 0) {
              newArray.push(comment);
            }
          });
        }
        // this.comments = res.data[0];
        // if (res.data && res.data.length) {
        //   _.forEach(details.developerComments, (comment) => {
        //
        //     var x = Object.keys(comment);
        //
        //     if (x && x.length > 0) {
        //       newArray.push(comment);
        //     }
        //   });
        // }
        // if (res.data && res.data.length) {
        //   _.forEach(res.data[0].projectManagerComments, (pmComments) => {
        //     var x = Object.keys(pmComments);
        //
        //     if (x && x.length > 0) {
        //       newArray.push(pmComments);
        //     }
        //   });
        // }
        this.comments = newArray;
      },
      (error) => { }
    );
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

  moveTask() {
    console.log(this.data);
    this.projectService.getProjectById(this.data.projectId).subscribe(
      (response: any) => {
        if (response) {
          console.log("moveTask:", response);
          this.currentProject = response;
          const data = {
            displayTitle: "Move Task",
            task: this.data.task,
            currentProject: this.currentProject
          }
          this.openDialogMoveCopy(MoveCopyTaskComponent, data).subscribe(
            (response) => {
              //
              // if (response != undefined) {
              //   // this.singleTask = response.task
              //   // if()
              //   Swal.fire("Error", "Cannot Move Task", "error");
              //   console.log("Not Working -> moveTask()");
              // } else {
              console.log("Response ::", response);
              if (response) {
                if (response.id == 1 && response.message) {
                  console.log("moveTask() ::", response.message);
                  Swal.fire("Completed", response.message, "success");
                }
                else {
                  // this.closeModel();
                }
              } else {
              }
            }
            // }
          );
        }

      }
    );
  }
  copyTask() {
    console.log(this.data);
    this.projectService.getProjectById(this.data.projectId).subscribe(
      (response: any) => {
        if (response) {
          console.log("copyTask:", response);
          this.currentProject = response;
          const data = {
            displayTitle: "Copy Task",
            task: this.data.task,
            currentProject: this.currentProject
          }
          this.openDialogMoveCopy(MoveCopyTaskComponent, data).subscribe(
            (response) => {
              //
              // if (response != undefined) {
              //   // this.singleTask = response.task
              //   // if()
              //   Swal.fire("Error", "Cannot Move Task", "error");
              //   console.log("Not Working -> moveTask()");
              // } else {
              // console.log("Response ::", response);
              if (response) {
                if (response.id == 1 && response.message) {
                  console.log("copyTask() ::", response.message);
                  Swal.fire("Completed", response.message, "success");
                }
                else {
                  // this.closeModel();
                }
              } else {
              }
            }
            // }
          );
        }

      }
    );
  }

  openDialogMoveCopy(someComponent, data = {}): Observable<any> {
    const dialogRef = this.dialog.open(someComponent, { data });
    return dialogRef.afterClosed();
  }

  getPriorityClass(priority) {
    //
    switch (priority) {
      case "Low":
        return { class: "#0087ff", title: "Low" };
        break;

      case "Medium":
        return { class: "warning", title: "Medium" };
        break;

      case "High":
        return { class: "#f08920", title: "High" };
        break;

      case "Highest":
        return { class: "danger", title: "Highest" };
        break;

      default:
        return "";
        break;
    }
  }
  getPriorityOfClass(priority) {
    switch (priority) {
      case "Low":
        return "#0087ff";
        break;

      case "Medium":
        return "#f0de08";
        break;

      case "High":
        return "#f08920";
        break;

      case "Highest":
        return "#c30d0d";
        break;

      default:
        return "";
        break;
    }
  }

  closeModel() {
    this.dialogRef.close();
  }

  updateStatus(status, data) {
    console.log("updateStatus : ", status);
    this.dialogRef.close({ status: status, task: data });
  }

  commentDetails(event) {
    this.resetComment = false;

    let file = event.file;

    let data = new FormData();

    // let data = event
    data.append("description", event.comment);
    data.append("userId", this.currentUser._id);
    data.append("projectId", this.projectId);
    data.append("taskId", this.task._id);
    if (file && file.length) {
      data.append("images", JSON.stringify(file));
    }
    let fileArray: any = [];
    // if (file.length > 0) {
    //   let path = "Comments"
    //
    //   _.forEach(file, (singleFile) => {
    //     this.s3Service.uploadFile(singleFile, path).subscribe((response: any) => {
    //       if (response && response.Location) {
    //         let obj = {
    //           singleFile: response.Location
    //         }
    //         fileArray.push(obj)
    //         if (fileArray.length == file.length) {
    //
    //           data.append('images', JSON.stringify(fileArray))
    //           this.commentService.addComment(data).subscribe((res: any) => {
    //
    //             this.resetComment = true
    //             this.getAllComments(this.task._id);
    //           }, err => {
    //             console.error(err);
    //           });
    //         } else {
    //
    //         }
    //       }
    //     }, error => {
    //

    //     })
    //   })
    // } else {
    this.commentService.addComment(data).subscribe(
      (res: any) => {
        this.resetComment = true;
        this.getAllComments(this.task._id);
      },
      (err) => {
        console.error(err);
      }
    );
    // }
  }
  // editTask(task) {
  //

  // }

  editTask(task) {
    task["edited"] = true;
    let obj = {
      task: task,
      team: this.displayTeam,
    };
    this.isDisplay = false;
    let data = obj;
    var taskDetails = this.openDialog(AddTaskComponent, data).subscribe(
      (response) => {
        if (response != undefined) {
          this.dialogRef.close({ task: response.task });
        }
        if (response == undefined) {
          this.dialogRef.close();
        }
      }
    );
  }

  openDialog(someComponent, data = {}): Observable<any> {
    const dialogRef = this.dialog.open(someComponent, { data });
    return dialogRef.afterClosed();
  }

  removeTask(task) {
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
        cancelButtonText: "Cancel",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          let obj = {
            deleteTask: task,
            delete: true,
          };
          this.dialogRef.close(obj);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancled!",
            "Your task has been safe.",
            "error"
          );
        }
      });
  }

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
}
