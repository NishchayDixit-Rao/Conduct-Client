import { Component, OnInit, HostListener, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { ProjectService } from "../services/project.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { S3UploadService } from "../services/s3-upload.service";
import { config } from "../config";
import * as moment from "moment";
declare var $: any;
import * as _ from "lodash";
import Swal from "sweetalert2";
import { Observable } from "rxjs";
import { NewFileUploadComponent } from "../common-use/new-file-upload/new-file-upload.component";

@Component({
  selector: "app-add-notice",
  templateUrl: "./add-notice.component.html",
  styleUrls: ["./add-notice.component.css"],
})
export class AddNoticeComponent implements OnInit {
  // files:FileList;
  files: Array<File> = [];
  addForm: FormGroup;
  path = config.baseMediaUrl;
  submitted = false;
  isDisable: boolean = false;
  Name = "Notice Date";
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  editNotice;
  toggleName;
  published;
  deadlineDate;
  noticeName;
  imageArray: any = [];
  editImage;
  loading = false;
  uploadedFileArray = [];
  constructor(
    public router: Router,
    public _projectservice: ProjectService,
    public dialogRef: MatDialogRef<AddNoticeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public s3Service: S3UploadService
  ) {
    // this.dialogRef.disableClose = true;
    this.addForm = new FormGroup({
      title: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      description: new FormControl("", [
        Validators.required,
        Validators.maxLength(300),
      ]),
      // images: new FormControl(''),
      isPublished: new FormControl(""),
      noticeDate: new FormControl(""),
    });
  }

  ngOnInit() {
    // this.newDate()
    // function

    if (this.currentUser.userRole == "Manager") {
      this.addForm.controls["isPublished"].disable();
    }

    if (this.data && this.data.editNotice) {
      this.editNotice = this.data.editNotice;
      this.published = this.editNotice.isPublished;
      this.deadlineDate = this.editNotice.noticeDate;
      this.noticeName = "Edit Notice";

      this.imageArray = this.editNotice.images;
      this.editImage = true;
      this.addForm.patchValue({
        noticeDate: this.deadlineDate,
      });
      this.addForm.get("noticeDate").updateValueAndValidity();
    } else {
      this.noticeName = "Create Notice";
    }

    // this.getAllNotice();
    // $('.datepicker').pickadate({
    // 	min: new Date(),
    // })
  }
  newDate() {
    let d = new Date();
    let utc = d.getTime() + d.getTimezoneOffset() * 60000;
    let nd = new Date(utc + 3600000 * +5.5);
    var ist = nd.toLocaleString();

  }
  get f() {
    return this.addForm.controls;
  }

  uploadNewFile() {
    let obj = {
      // singleFile: true,
      // avtar: true,
      path: "Notices",
    };
    let data = obj;
    var taskDetails = this.openDialog(NewFileUploadComponent, data).subscribe(
      (response) => {


        if (response != undefined) {
          this.editImage = true;
          if (this.data && this.data.editNotice) {
            _.forEach(response, (singleFile) => {
              this.imageArray.push(singleFile.Location);
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

openDialog(someComponent, data = {}): Observable < any > {

  const dialogRef = this.dialog.open(someComponent, { data });
  return dialogRef.afterClosed();
}

addNotice(addForm) {
  this.submitted = true;
  this.loading = true;
  if (this.addForm.invalid) {
    return;
  }
  this.isDisable = true;
  if (!addForm.isPublished) {

    addForm["isPublished"] = "";
  }
  // addForm.noticeDate = $('#expireon').val();

  var data = new FormData();
  _.forOwn(addForm, function (value, key) {
    data.append(key, value);
  });
  // 
  let fileArray = [];
  let path = "Notices";
  if (this.uploadedFileArray && this.uploadedFileArray.length) {
    // for (var i = 0; i < this.files.length; i++) {
    // 	data.append('uploadfile', this.files[i]);
    // }
    // _.forEach(this.files, (singleFile) => {
    // this.s3Service.uploadFile(singleFile, path).subscribe((response: any) => {
    // if (response && response.Location) {
    // 	let obj = {
    // 		singleFile: response.Location
    // 	}
    // 	fileArray.push(obj)
    // this.imageArray.push(response.Location)
    // if (fileArray.length == this.files.length) {

    data.append("images", JSON.stringify(this.uploadedFileArray));
    this._projectservice.addNotice(data).subscribe(
      (res: any) => {

        if (res && res.data) {
          Swal.fire({
            type: "success",
            title: "Notice Added Successfully",
            text: res.data.title,
            showConfirmButton: false,
            timer: 2000,
          });
        } else {
          Swal.fire({
            type: "success",
            title: "Notice Added Successfully",
            // text: res.data.title,
            showConfirmButton: false,
            timer: 2000,
          });
        }
        // this.router.navigate(['./noticeboard']);

        if (res && res.data) {
          this.dialogRef.close(res.data);
        } else {
          this.dialogRef.close();
        }
        this.isDisable = false;
        this.loading = false;
      },
      (err) => {

        Swal.fire("Oops...", "Something went wrong!", "error");
        this.isDisable = false;
        this.loading = false;
      }
    );
    // } else {
    // 	
    // }
    // }
    // }, error => {
    // 	

    // })
    // })
  } else {
    // data.append('createdBy', this.currentUser._id);

    this._projectservice.addNotice(data).subscribe(
      (res: any) => {


        if (res && res.data) {
          Swal.fire({
            type: "success",
            title: "Notice Added Successfully",
            text: res.data.title,
            showConfirmButton: false,
            timer: 2000,
          });
        } else {
          Swal.fire({
            type: "success",
            title: "Notice Added Successfully",
            // text: res.data.title,
            showConfirmButton: false,
            timer: 2000,
          });
        }
        // this.router.navigate(['./noticeboard']);

        if (res && res.data) {
          this.dialogRef.close(res.data);
        } else {
          this.dialogRef.close();
        }
        this.isDisable = false;
        this.loading = false;
      },
      (err) => {

        Swal.fire("Oops...", "Something went wrong!", "error");
        this.isDisable = false;
        this.loading = false;
      }
    );
  }
}

updateNotice(editNoticeForm) {
  this.isDisable = true;
  this.loading = true;
  // 


  if (!editNoticeForm.isPublished) {

    editNoticeForm["isPublished"] = this.addForm.controls.isPublished.value;
  }

  let data = new FormData();
  data.append("title", editNoticeForm.title);
  data.append("description", editNoticeForm.description);
  data.append("noticeDate", editNoticeForm.noticeDate);
  data.append("isPublished", editNoticeForm.isPublished);
  if (this.files && this.files.length > 0) {
    let path = "Notices";
    let fileArray = [];
    _.forEach(this.files, (singleFile) => {
      this.s3Service.uploadFile(singleFile, path).subscribe(
        (response: any) => {
          if (response && response.Location) {
            let obj = {
              singleFile: response.Location,
            };
            fileArray.push(obj);
            this.imageArray.push(response.Location);
            if (fileArray.length == this.files.length) {

              data.append("images", JSON.stringify(this.imageArray));
              this._projectservice
                .updateNoticeWithFile(data, this.editNotice._id)
                .subscribe(
                  (res: any) => {

                    Swal.fire({
                      type: "success",
                      title: "Notice Update Successfully",
                      text: res.data.title,
                      showConfirmButton: false,
                      timer: 2000,
                    });
                    this.dialogRef.close(res.data);
                    this.isDisable = false;
                    this.loading = false;
                  },
                  (err) => {

                    Swal.fire("Oops...", "Something went wrong!", "error");
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
    // 	data.append('images', this.files[i]);
    // }
  } else {
    data.append("images", JSON.stringify(this.imageArray));

    this._projectservice
      .updateNoticeWithFile(data, this.editNotice._id)
      .subscribe(
        (res: any) => {

          Swal.fire({
            type: "success",
            title: "Notice Update Successfully",
            text: res.data.title,
            showConfirmButton: false,
            timer: 2000,
          });
          this.dialogRef.close(res.data);
          this.isDisable = false;
          this.loading = false;
        },
        (err) => {

          Swal.fire("Oops...", "Something went wrong!", "error");
          this.isDisable = false;
          this.loading = false;
        }
      );
  }
}

imageRemove(event) {


  this.imageArray.splice(event, 1);
}

getAllNotice() {
  this._projectservice.getNotice().subscribe(
    (res: any) => {

    },
    (err) => {

    }
  );
}

changeFile(event) {

  this.files = event;
}

closeModel() {
  this.dialogRef.close();
}
getDate(event) {
  let selectedDueDate = moment(event).format("YYYY-MM-DD");
  this.addForm.patchValue({
    noticeDate: selectedDueDate,
  });
  this.addForm.get("noticeDate").updateValueAndValidity();
}

slideToggle(event) {

  if (event.checked) {
    this.published = true;
  } else {
    this.published = false;
  }
}
}
