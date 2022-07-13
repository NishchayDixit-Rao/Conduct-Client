import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { S3UploadService } from "../services/s3-upload.service";
import Swal from "sweetalert2";

// import { UtilityService } from "../../services/utility.service";
// import { feedbackCategory } from "../../_models/staticArray";
@Component({
  selector: "app-feedback",
  templateUrl: "./feedback.component.html",
  styleUrls: ["./feedback.component.css"],
})
export class FeedbackComponent implements OnInit {
  feedbackForm: FormGroup;
  files = [];
  isFileUploaded: boolean = false;
  isLoading: boolean = false;
  isFileUploadLoading: boolean = false;
  // categoryList = ["Bug", "Issue", "Suggesstion"];
  categoryList = [{ name: "Bug" }, { name: "Issue" }, { name: "Suggesstion" }];

  isView: boolean = true;
  constructor(
    // public utilityService: UtilityService,
    public _s3Service: S3UploadService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    console.log("what is the data to be open", this.data);
    if (this.data && this.data.isModel) this.isView = false;
    else this.isView = true;

    this.createForm();
  }

  createForm() {
    this.feedbackForm = new FormGroup({
      category: new FormControl("", Validators.required),
      name: new FormControl("", Validators.required),
      email: new FormControl("", Validators.required),
      feedback: new FormControl("", Validators.required),
      contactNo: new FormControl(""),
    });
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
    return true;
  }

  selectFile(event) {
    console.log("Event : ", event);
    this.isFileUploadLoading = true;
    this.isFileUploaded = true;
    // console.log("File length : ", event.target.files.length);
    if (event.target.files && event.target.files.length) {
      let tempFileArray = [];
      for (let i = 0; i < event.target.files.length; i++)
        tempFileArray.push(event.target.files[i]);

      console.log("tempFileArray : ", tempFileArray);
      let path = "feedback";
      for (let j = 0; j < tempFileArray.length; j++) {
        this._s3Service
          .uploadFile(tempFileArray[j], "", path)
          .subscribe((res) => {
            console.log("S3 response : ", res);
            if (res.Location) {
              this.files.push(res);
              this.isFileUploaded = false;
            }
            // if (res == undefined) return;
            // else this.files.push(res), (this.isFileUploaded = false);
            this.isFileUploadLoading = false;
          });
      }
    }
  }

  deleteFile(file) {
    const index = this.files.indexOf(file);
    if (index > -1) this.files.splice(index, 1);
  }

  close() {
    this.dialogRef.close();
  }

  confirm(value) {
    // this.loading = true
    console.log("fins refrance =====>", this.dialogRef);
    // console.log('value', value);
    this.isView = true;
    this.dialogRef.close(value);
  }

  // API CALL

  onSubmit() {
    this.isLoading = true;
    if (this.feedbackForm.valid) {
      let fileLocation = [];
      this.files.forEach((singleFile) => {
        fileLocation.push(singleFile.Location);
      });

      let data = {
        name: this.feedbackForm.value.name,
        contactNo: this.feedbackForm.value.contactNo,
        email: this.feedbackForm.value.email,
        feedback: this.feedbackForm.value.feedback,
        files: fileLocation,
        category: this.feedbackForm.value.category,
      };
      console.log("Final feedback data : ", data);

      this._s3Service.addFeedBack({ data: data }).subscribe(
        (res) => {
          Swal.fire({
            type: "success",
            title: "Your feedback has been submited.",
            showConfirmButton: false,
            timer: 2000,
          });
          this.dialogRef.close();
          this.isLoading = false;
        },
        (err) => {
          Swal.fire({
            type: "error",
            title: "Something went wrong!",
            showConfirmButton: false,
            timer: 2000,
          });
          this.dialogRef.close();
          this.isLoading = false;
        }
      );

      // this._s3Service.addFeedBack({ data: data }).subscribe(
      //   (res) => {
      //     if (res) {
      //       this.dialogRef.close();
      //     this.isLoading = false;
      //   },
      //   (err) => {
      //     this.isLoading = false;
      //   }
      // );
    }
  }
}
