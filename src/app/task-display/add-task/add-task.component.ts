import {
  Component,
  OnInit,
  Inject,
  Injector,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig,
} from "@angular/material/dialog";
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
} from "@angular/forms";
import { ProjectService } from "../../services/project.service";
import { Router } from "@angular/router";
import * as moment from "moment";
import * as _ from "lodash";
import Swal from "sweetalert2";
import { config } from "../../config";
import { S3UploadService } from "../../services/s3-upload.service";
import { NewFileUploadComponent } from "../../common-use/new-file-upload/new-file-upload.component";
import { Observable } from "rxjs";
import { single } from "rxjs/operators";
@Component({
  selector: "app-add-task",
  templateUrl: "./add-task.component.html",
  styleUrls: ["./add-task.component.css"],
})
export class AddTaskComponent implements OnInit {
  @Input("selectedProject") projectSelected;
  @Input("teamMember") totalTeam;
  @Input("taskType") taskTypeAdded;
  @Input("sideBar") isDisplay;
  @Input("taskReset") resetTask;
  @Input("taskDisable") disableTask;
  @Output() taskUpdate: EventEmitter<any> = new EventEmitter();

  displayTitle;
  addTask: FormGroup;
  Name = "Due Date";
  color = "wheat";
  path = config.baseMediaUrl;
  isDisable = false;
  teamMember = [];
  selectedDueDate;
  files: Array<File> = [];
  editTask;
  pro;
  tasks;
  deadlineDate;
  displayButton;
  selected;
  selected1;
  isChangedAssign;
  assignDeveloper;
  newImages: any = [];
  editImage;
  removeImageArray = [];
  dialogRef: MatDialogRef<any>;
  data: any;
  projectId;
  displayData = false;
  loading = false;
  finalTaskType;
  editDescription;
  // selected
  // selected1
  uploadedFileArray = [];
  constructor(
    // public dialogRef: MatDialogRef<AddTaskComponent>,  
    // @Inject(MAT_DIALOG_DATA) public data: any,
    public projectService: ProjectService,
    private injector: Injector,
    public route: Router,
    public s3Service: S3UploadService,
    public dialog: MatDialog
  ) {
    this.data = this.injector.get(MAT_DIALOG_DATA);
    this.dialogRef = this.injector.get(MatDialogRef);
    // this.dialogRef.disableClose = true;
  }

  ngOnInit() {


    if (this.data) {
      if (this.data.edited == false) {
        if (this.data.taskType == "Bugg") {
          this.displayTitle = "Bug";
        } else {
          this.displayTitle = this.data.taskType;
        }
        this.finalTaskType = this.data.taskType;
        this.teamMember = this.data.total;
        this.displayButton = "Add Task";
        this.projectId = this.data.projectId;
      }
      if (this.data.task && this.data.task.edited == true) {
        this.editTask = this.data.task;
        this.deadlineDate = this.data.task.dueDate;
        this.editDescription = this.editTask.description;
        this.displayButton = "Edit Task";
        if (this.editTask.taskType == "Bugg") {
          this.displayTitle = "Bug";
        } else {
          this.displayTitle = this.editTask.taskType;
        }
        // this.displayTitle = this.editTask.taskType
        this.teamMember = this.data.team;
        this.editImage = true;
        if (this.editTask.assignTo) {
          this.assignDeveloper = this.editTask.assignTo._id;
        }
        if (this.editTask.images && this.editTask.images.length) {
          _.forEach(this.editTask.images, (singleImage) => {


            this.newImages.push(singleImage);
          });

        }

      }
    }

    this.addTask = new FormGroup({
      title: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      assignTo: new FormControl(""),
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

  ngOnChanges(changes: SimpleChanges) {

    if (changes.projectSelected && changes.projectSelected.currentValue) {
      this.projectId = changes.projectSelected.currentValue;
      this.displayButton = "Add Task";
      this.addTask.reset();
      this.isDisable = false;
    }
    if (changes.totalTeam && changes.totalTeam.currentValue) {
      this.teamMember = changes.totalTeam.currentValue;
      // this.displayButton = 'Add Task'
    }
    if (changes.taskTypeAdded && changes.taskTypeAdded.currentValue) {
      this.displayTitle = changes.taskTypeAdded.currentValue;
      this.finalTaskType = changes.taskTypeAdded.currentValue;
    }
    if (changes.isDisplay && changes.isDisplay.currentValue) {

      this.displayData = changes.isDisplay.currentValue;
    }
    if (changes.resetTask && changes.resetTask.currentValue) {
      this.addTask.reset();
    }
    if (changes.disableTask && changes.disableTask.currentValue) {
      let value = changes.disableTask.currentValue;
      if (value == true) {
        this.isDisable = true;
      } else {
        // this.isDisable = false
      }
    }
  }

  contentData(event) {
    // 
    if (event == null) {
      this.addTask.controls["description"].setValue(null);
    } else {
      this.addTask.controls["description"].setValue(event);
    }
  }

  getDate(event) {

    this.selectedDueDate = moment(event).format("YYYY-MM-DD");
    this.addTask.patchValue({
      dueDate: this.selectedDueDate,
    });
    this.addTask.get("dueDate").updateValueAndValidity();
  }

  uploadNewFile() {
    let obj = {
      // singleFile: true,
      // avtar: true,
      path: "Tasks",
    };
    let data = obj;
    var taskDetails = this.openDialog(NewFileUploadComponent, data).subscribe(
      (response) => {


        if (response != undefined) {
          this.editImage = true;
          if (this.data.task && this.data.task.edited == true) {
            _.forEach(response, (singleFile) => {
              this.newImages.push(singleFile.Location);
            });
          } else {
            _.forEach(response, (singleFile) => {
              let obj = {
                singleFile: singleFile.Location,
              };
              this.uploadedFileArray.push(obj);
            });


          }
        }
      }
    );
  }
  uploadedRemove(event) {
    // 
    this.uploadedFileArray.splice(event, 1);

  }

  openDialog(someComponent, data = {}): Observable<any> {

    const dialogRef = this.dialog.open(someComponent, { data });
    return dialogRef.afterClosed();
  }

  taskAdded(task) {


    this.isDisable = true;
    this.loading = true;
    task.taskType = this.finalTaskType;


    if (
      this.addTask.controls.assignTo.value == "" ||
      this.addTask.controls.assignTo.value == null
    ) {
      // 
      // this.addTask.patchValue({
      //   assignTo: undefined
      // });
      // this.addTask.get('assignTo').updateValueAndValidity();
      task["assignTo"] = undefined;
    }
    // 


    let data = new FormData();
    _.forOwn(task, function (value, key) {
      data.append(key, value);
    });
    // if (this.data != {}) {
    let flag = true;
    data.append("projectId", this.projectId);
    this.projectService.getProjectById(this.projectId).subscribe(
      (response: any) => {
        console.log("response :: ", response);
        this.pro = response.data;
        console.log("Pro :: ", this.pro);
        if (this.pro && this.pro.workFlow[0]) {
          // console.log("Pro ::", this.pro.workFlow[0]);
          // console.log("Data : ", data);
          // console.log("newStatus : ", newStatus);
          // console.log("Tracks : ", this.tracks);
          // console.log("To do length : ", this.tracks[0].tasks.length);
          let arr = [];
          // for (let index = 0; index < this.pro.workFlow[0].tracks.length; index++) {
          //   console.log(this.pro.workFlow[0].tracks[index]);
          //   if (this.pro.workFlow[0].tracks[index].isTaskAllowLimit)
          //     arr.push(this.pro.workFlow[0].tracks[index].taskAllowValue);
          //   else
          //     arr.push(Number.MAX_SAFE_INTEGER);
          // }
          this.pro.workFlow[0].tracks.forEach(track => {
            console.log(track);
            if (track.isTaskAllowLimit)
              arr.push(track.taskAllowValue);
            else
              arr.push(Number.MAX_SAFE_INTEGER);
          });

          this.projectService.getAllTasks().subscribe(
            (response: any) => {
              console.log("abc :",);
              console.log("Total Tracks : ", response);
              this.tasks = response.data.taskList;
              console.log("Array Values:", arr);
              let i = 0;
              this.tasks.forEach(track => {
                if (track.projectId === this.projectId) {
                  if (track.status === "To Do") {
                    i++;
                  }
                }
              });
              if (i >= arr[0]) {
                // Swal.fire("Oops...", `Cannot add more than ${i} tasks`, "error");
                flag = false;
              }
              console.log("Flag condition ", flag)
              if (flag) {
                let path = "Tasks";
                let fileArray = [];
                if (this.uploadedFileArray && this.uploadedFileArray.length) {
                  data.append("images", JSON.stringify(this.uploadedFileArray))
                }

                console.log("Add Data ::", data);
                this.projectService.addTask(data).subscribe(
                  (response: any) => {

                    this.loading = false;
                    if (response.data.taskData.assignTo) {
                      let name = response.data.taskData.assignTo.name;
                      if (name) {
                        Swal.fire({
                          type: "success",
                          title: "New Task Created For",
                          text: name,
                          showConfirmButton: false,
                          timer: 2000,
                        });
                      }
                    } else {
                      Swal.fire({
                        type: "success",
                        title: "New Task Created Successfully",
                        // text: name,
                        showConfirmButton: false,
                        timer: 2000,
                      });
                    }
                    this.addTask.reset();
                    this.taskUpdate.emit({ id: 0, message: "Task Added completed" });

                    if (this.dialogRef) {
                      this.dialogRef.close({ task: response.data.taskData });
                    }
                    this.addTask.reset();
                    this.isDisable = false;
                  },
                  (error) => {

                    this.isDisable = false;
                    this.loading = false;
                  }
                );
              } else {

                this.addTask.reset();
                this.isDisable = false;
                this.loading = false;
                // this.dialogRef.close();
                this.taskUpdate.emit({ id: 1, message: `Cannot add more than ${i} tasks` });
                // Swal.fire("Oops...", `Cannot add more than ${i} tasks`, "error");

              }
            }
          );
        }
      }
    );

    // if (!flag) {
    //   return;
    // }


    // } else {
    //   data.append('projectId', this.projectId)
    // }
    // if (flag) {
    //   console.log("Cond true")
    //   let path = "Tasks";
    //   let fileArray = [];
    //   if (this.uploadedFileArray && this.uploadedFileArray.length) {
    //     data.append("images", JSON.stringify(this.uploadedFileArray))
    //   }


    //   this.projectService.addTask(data).subscribe(
    //     (response: any) => {

    //       this.loading = false;
    //       if (response.data.taskData.assignTo) {
    //         let name = response.data.taskData.assignTo.name;
    //         if (name) {
    //           Swal.fire({
    //             type: "success",
    //             title: "New Task Created For",
    //             text: name,
    //             showConfirmButton: false,
    //             timer: 2000,
    //           });
    //         }
    //       } else {
    //         Swal.fire({
    //           type: "success",
    //           title: "New Task Created Successfully",
    //           // text: name,
    //           showConfirmButton: false,
    //           timer: 2000,
    //         });
    //       }
    //       this.addTask.reset();
    //       this.taskUpdate.emit({ message: "Task Added completed" });

    //       if (this.dialogRef) {
    //         this.dialogRef.close({ task: response.data.taskData });
    //       }
    //       this.addTask.reset();
    //       this.isDisable = false;
    //     },
    //     (error) => {

    //       this.isDisable = false;
    //       this.loading = false;
    //     }
    //   );
    //   // } else {
    //   //   
    //   // }
    //   // }
    //   // }, error => {
    //   //   

    //   // })
    //   // })
    // } else if (flag) {
    //   console.log("else if condition");
    //   this.projectService.addTask(data).subscribe(
    //     (response: any) => {

    //       this.loading = false;

    //       if (response.data.taskData.assignTo) {
    //         let name = response.data.taskData.assignTo.name;
    //         if (name) {
    //           Swal.fire({
    //             type: "success",
    //             title: "New Task Created For",
    //             text: name,
    //             showConfirmButton: false,
    //             timer: 2000,
    //           });
    //         }
    //       } else {
    //         Swal.fire({
    //           type: "success",
    //           title: "New Task Created Successfully",
    //           // text: name,
    //           showConfirmButton: false,
    //           timer: 2000,
    //         });
    //       }
    //       this.addTask.reset();
    //       this.taskUpdate.emit({ message: "Task Added completed" });

    //       // if (this.dialogRef) {
    //       this.dialogRef.close({ task: response.data.taskData });
    //       // }
    //       this.addTask.reset();
    //       this.isDisable = false;
    //     },
    //     (error) => {

    //       this.isDisable = false;
    //       this.loading = false;
    //     }
    //   );
    // }
  }
  changeFile(event) {
    this.files = event;
  }

  closeModel() {
    console.log('closing');
    this.dialogRef.close('closing');
  }

  selectAssignee(user) {
    console.log("selcted user : ", user);
  }
  updateTask(task) {
    this.isDisable = true;
    this.loading = true;

    if (task.assignTo) {
      const changeId = task.assignTo;
      if (this.assignDeveloper != undefined) {
        if (changeId != this.assignDeveloper) {

          this.isChangedAssign = true;
        }
      } else {
        console.log("assign to : ", this.addTask.value.assignTo);
        this.isChangedAssign = true;
      }
      task.assignTo = this.addTask.value.assignTo;
    }
    if (this.addTask.controls.assignTo.value == "") {

      task["assignTo"] = undefined;
    }
    let data = new FormData();
    data.append("projectId", this.editTask.projectId);
    data.append("title", task.title);
    data.append("description", task.description);
    data.append("assignTo", task.assignTo);
    data.append("taskPriority", task.taskPriority);
    data.append("estimatedTime", task.estimatedTime);
    data.append("isAssign", this.isChangedAssign);
    if (this.selectedDueDate == undefined) {
      data.append("dueDate", this.editTask.dueDate);
    } else {
      data.append("dueDate", task.dueDate);
    }
    if (this.files.length > 0) {
      let path = "Tasks";
      let fileArray = [];
      _.forEach(this.files, (singleFile) => {
        this.s3Service.uploadFile(singleFile, path).subscribe(
          (response: any) => {
            if (response && response.Location) {
              let obj = {
                singleFile: response.Location,
              };
              fileArray.push(obj);
              this.newImages.push(response.Location);
              if (fileArray.length == this.files.length) {

                data.append("images", JSON.stringify(this.newImages));
                this.projectService
                  .updateTask(this.editTask._id, data)
                  .subscribe(
                    (response: any) => {

                      let taskNo = response.data.data.taskUniqueId;
                      Swal.fire({
                        type: "success",
                        title: taskNo + " updated successfully",
                        showConfirmButton: false,
                        timer: 2000,
                        // position: 'top-end',
                      });
                      this.dialogRef.close({ task: response.data.data });
                      this.isDisable = false;
                      this.loading = false;
                    },
                    (error) => {

                      this.isDisable = false;
                      this.loading = false;
                    }
                  );
              } else {

              }
            }
          },
          (error) => {

          }
        );
      });
      // for (var i = 0; i < this.files.length; i++) {
      //   data.append('fileUpload', this.files[i]);
      // }
    } else {


      data.append("images", JSON.stringify(this.newImages));
      this.projectService.updateTask(this.editTask._id, data).subscribe(
        (response: any) => {

          let taskNo = response.data.taskUniqueId;
          Swal.fire({
            type: "success",
            title: taskNo + " updated successfully",
            showConfirmButton: false,
            timer: 2000,
            // position: 'top-end',
          });
          this.dialogRef.close({ task: response.data });
          this.isDisable = false;
          this.loading = false;
        },
        (error) => {

          this.isDisable = false;
          this.loading = false;
        }
      );
    }
  }
  imageRemove(event) {

    this.newImages.splice(event, 1);
    this.removeImageArray.push(this.newImages[event]);

  }
}
