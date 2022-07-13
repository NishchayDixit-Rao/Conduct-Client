import { Component, OnInit, Inject } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  FormBuilder,
} from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ProjectService } from "../services/project.service";
import { LoginService } from "../services/login.service";
import Swal from "sweetalert2";
import * as _ from "lodash";
import { Buffer } from "buffer";
import * as moment from "moment";
import { Router, ActivatedRoute } from "@angular/router";
declare var $: any;
@Component({
  selector: "app-new-employee-add",
  templateUrl: "./new-employee-add.component.html",
  styleUrls: ["./new-employee-add.component.css"],
})
export class NewEmployeeAddComponent implements OnInit {
  addEmployeeForm: FormGroup;
  show: boolean;
  pwd: boolean;
  show1: boolean;
  pwd1: boolean;
  Name = "Joining Date";
  files: Array<File> = [];
  isDisable = false;
  joiningDate;
  match: boolean;
  selected1;
  selected;
  editProfile;
  deadlineDate;
  displayButton;
  displayTitle;
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  disableDate;
  addUser = true;
  loading = false;
  // selected1
  // selected
  constructor(
    public dialogRef: MatDialogRef<NewEmployeeAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public loginService: LoginService,
    public dialog: MatDialog,
    public _projectService: ProjectService,
    private router: Router
  ) {
    // this.dialogRef.disableClose = true
    this.addEmployeeForm = this.formBuilder.group({
      name: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/[!^\w\s]$/),
      ]),
      password: new FormControl("", [
        Validators.minLength(6),
        Validators.maxLength(20),
      ]),
      confirmPassword: new FormControl(""),
      // isDelete: new FormControl('false', [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      date: new FormControl("", [Validators.required]),
      phone: new FormControl("", [
        // Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern("[6-9]\\d{9}"),
      ]),
      userRole: new FormControl("", []),
      experienceYear: new FormControl(""),
      experienceMonth: new FormControl(""),
      profile: new FormControl(""),
      cv: new FormControl(""),
      branch: new FormControl("", []),
    });
  }

  ngOnInit() {
    let temp = Object.keys(this.data).length;
    
    if (temp != 0) {
      this.editProfile = this.data;
      this.deadlineDate = moment(this.data.date).format("YYYY-MM-DD");
      
      this.addEmployeeForm.get("password").clearValidators();
      this.addEmployeeForm.get("password").updateValueAndValidity();
      this.addEmployeeForm.controls.date.setValue(this.deadlineDate);
      this.displayButton = "Edit Employee";
      this.displayTitle = "Edit Employee";
      

      if (
        this.currentUser.userRole == "Team Member" ||
        this.currentUser.userRole == "Manager"
      ) {
        this.addEmployeeForm.controls["userRole"].disable();
        this.addEmployeeForm.controls["date"].disable();
        this.addEmployeeForm.controls["experienceYear"].disable();
        this.addEmployeeForm.controls["experienceMonth"].disable();
        this.addEmployeeForm.controls["branch"].disable();
        this.disableDate = true;
      }
    } else {
      this.displayButton = "Add Employee";
      this.displayTitle = "Add Employee";
    }

    $(".toggle-password").click(function () {
      $(this).toggleClass("fa-eye fa-eye-slash");
    });
  }

  password() {
    this.show = !this.show;
    this.pwd = !this.pwd;
  }

  confirmPassword() {
    this.show1 = !this.show1;
    this.pwd1 = !this.pwd1;
  }

  comparePassword(form) {
    

    if (form.value.password === form.value.confirmPassword) {
      
      this.match = true;
    } else {
      this.addEmployeeForm.controls.confirmPassword.setErrors({
        inValid: true,
      });
      this.match = false;
    }
  }

  monthValidation(event) {
    
    if (event.target.value > 11) {
      
      this.addEmployeeForm.controls.experienceMonth.setErrors({
        inValid: true,
      });
    }
  }
  yearValidation(event) {
    // 
    // let year = event.target.value
    // let yearNumber = /(?:(?:19|20)[0-9]{2})/;
    // if (!year.match(yearNumber)) {
    //   
    //   this.addEmployeeForm.controls.experienceYear.setErrors({
    //     inValid: true
    //   })
    // } else {
    //   
    // }
  }

  getDate(event) {
    this.joiningDate = moment(event).format("YYYY-MM-DD");
    

    this.addEmployeeForm.patchValue({
      date: this.joiningDate,
    });
    this.addEmployeeForm.get("date").updateValueAndValidity();
  }

  /**
   * @param event {Profile photo upload}
   * Upload user ptofile photo
   */
  addProfile(event) {
    
    _.forEach(event.target.files, (file: any) => {
      
      if (
        file.type == "image/jpeg" ||
        file.type == "image/jpg" ||
        file.type == "image/png"
      ) {
        this.files.push(file);
      } else {
        Swal.fire({
          title: "Error",
          text: "You can upload pdf file only",
          type: "warning",
        });
      }
    });
  }

  /**
   * @param event {CV Upload}
   * Upload user CV
   */
  addFile(event) {
    
    _.forEach(event.target.files, (file: any) => {
      
      if (file.type == "application/pdf") {
        this.files.push(file);
      } else {
        Swal.fire({
          title: "Error",
          text: "You can upload pdf file only",
          type: "warning",
        });
      }
    });
  }
  addEmployee(data) {
    this.isDisable = true;
    this.loading = true;
    let password = this.addEmployeeForm.controls.password.value;
    
    let string = String(password);
    let encrypted = Buffer.from(string).toString("base64");
    
    this.loginService
      .addUser_with_file(this.addEmployeeForm.value, encrypted, this.files)
      .subscribe(
        (res: any) => {
          
          this.isDisable = false;
          this.loading = false;
          let user = res.data.data;
          Swal.fire({
            type: "success",
            title: "Employee Added Successfully",
            text: user.name,
            showConfirmButton: false,
            timer: 2000,
          });
          let obj = {
            _id: user._id,
            name: user.name,
            userRole: user.userRole,
            profilePhoto: user.profilePhoto,
            joiningDate: user.joiningDate,
            email: user.email,
            phone: user.phone,
            branch: user.branch,
            totalProjects: 0,
          };
          this.dialogRef.close(obj);
        },
        (error) => {
          
          this.isDisable = false;
          this.loading = false;
        }
      );
  }

  editEmployee(data) {
    this.isDisable = true;
    this.loading = true;
    
    this.loginService
      .editUserProfileWithFile(this.addEmployeeForm.value, this.editProfile._id)
      .subscribe(
        (userEdit: any) => {
          
          let user = userEdit.data.data;
          Swal.fire({
            type: "success",
            title: "Employee Update Successfully",
            text: user.name,
            showConfirmButton: false,
            timer: 2000,
          });
          this.isDisable = false;
          this.loading = false;
          this.dialogRef.close(userEdit);
        },
        (error) => {
          
          this.isDisable = false;
          this.loading = false;
        }
      );
  }

  deleteEmployee(developerid) {
    
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
          developerid.name +
          " </strong> ",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes,Delete it!",
        showCloseButton: true,
      })
      .then((result) => {
        
        if (result.value) {
          this.loading = true;
          var body;
          this._projectService.deleteEmployeeById(developerid._id).subscribe(
            (res) => {
              
              Swal.fire({
                type: "success",
                title: "Employee remove Successfully",
                showConfirmButton: false,
                timer: 2000,
              });
              // this.getAllDevelopers();
              this.dialogRef.close();
              this.loading = false;
              this.router.navigate(["./employees"]);
            },
            (err) => {
              
              Swal.fire("Oops...", "Something went wrong!", "error");
              this.loading = false;
            }
          );
        }
      });
  }

  closeModel() {
    this.dialogRef.close();
  }
  _keyPress(event: any) {
    

    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
