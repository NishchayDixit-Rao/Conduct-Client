import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { ProjectService } from "../services/project.service";
import { LoginService } from "../services/login.service";
declare var $: any;
import Swal from "sweetalert2";

@Component({
  selector: "app-editprofile",
  templateUrl: "./editprofile.component.html",
  styleUrls: ["./editprofile.component.css"],
})
export class EditprofileComponent implements OnInit {
  editEmployeeForm: FormGroup;
  userId;
  files: Array<File> = [];
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  userDetails;
  developerId;
  date: any;
  loader: boolean = false;
  submitted = false;
  cvDetails;
  isDisable: boolean = false;
  constructor(
    private _loginService: LoginService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public _projectService: ProjectService
  ) {
    this.editEmployeeForm = new FormGroup({
      name: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
      ]),
      email: new FormControl("", [Validators.required, Validators.email]),
      phone: new FormControl("", [
        Validators.minLength(10),
        Validators.maxLength(10),
      ]),
      userRole: new FormControl("", [Validators.required]),
      experience: new FormControl(""),
      joiningDate: new FormControl(""),
      cv: new FormControl(""),
    });
  }

  ngOnInit() {
    this.route.params.subscribe((param) => {
      this.developerId = param.id;
      // 
      // this.getDetails(this.developerId);

      // $('.prefill').pickadate({
      // 	// value: this.userDetails.joiningDate
      // });
      $(".datepicker").pickadate({
        min: new Date(),
        onSet: function (context) {
          change();
        },
      });
      var change: any = () => {
        this.editEmployeeForm.controls.joiningDate.setValue(
          $(".datepicker").val()
        );
      };
    });
    this.getDetails();
  }
  addFile(event) {
    this.files = event.target.files;
    
  }
  get f() {
    return this.editEmployeeForm.controls;
  }

  updateProfile(editEmployeeForm) {
    
    this.submitted = true;
    if (this.editEmployeeForm.invalid) {
      return;
    }
    this.isDisable = true;
    if (this.currentUser.userRole == "admin") {
      
      
      // this.editEmployeeForm['userId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
      editEmployeeForm = {
        ...editEmployeeForm,
        name: this.userDetails.name,
        email: this.userDetails.email,
        phone: this.userDetails.phone,
        experience: this.userDetails.experience,
        joiningDate: this.userDetails.joiningDate,
      };
      this.editEmployeeForm["userId"] = this.userDetails._id;
      
      let data = new FormData();
      data.append("name", editEmployeeForm.name ? editEmployeeForm.name : "");
      data.append(
        "email",
        editEmployeeForm.email ? editEmployeeForm.email : ""
      );
      data.append(
        "phone",
        editEmployeeForm.phone ? editEmployeeForm.phone : ""
      );
      data.append(
        "experience",
        editEmployeeForm.experience ? editEmployeeForm.experience : ""
      );
      data.append(
        "joiningDate",
        editEmployeeForm.joiningDate ? editEmployeeForm.joiningDate : ""
      );
      data.append(
        "userRole",
        editEmployeeForm.userRole ? editEmployeeForm.userRole : ""
      );
      if (this.files && this.files.length) data.append("cv", this.files[0]);
      this._loginService
        .editUserProfileWithFile(data, this.developerId)
        .subscribe(
          (res: any) => {
            
            // localStorage.setItem('currentUser', JSON.stringify(res));
            Swal.fire({
              type: "success",
              title: "Profile Updated Successfully",
              showConfirmButton: false,
              timer: 2000,
            });
            this.isDisable = false;
          },
          (err) => {
            
            Swal.fire("Oops...", "Something went wrong!", "error");
            this.isDisable = false;
          }
        );
    } else if (
      this.currentUser.userRole == "Team Member" ||
      this.currentUser.userRole == "Manager"
    ) {
      // alert("Developer");
      // this.files = this.userDetails.CV;
      
      
      // this.editEmployeeForm['userId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
      this.editEmployeeForm["userId"] = this.userDetails._id;
      editEmployeeForm = {
        ...editEmployeeForm,
        userRole: this.userDetails.userRole,
        joiningDate: editEmployeeForm.joiningDate
          ? editEmployeeForm.joiningDate
          : this.userDetails.joiningDate,
      };
      
      let data = new FormData();
      data.append("name", editEmployeeForm.name ? editEmployeeForm.name : "");
      data.append(
        "email",
        editEmployeeForm.email ? editEmployeeForm.email : ""
      );
      data.append(
        "phone",
        editEmployeeForm.phone ? editEmployeeForm.phone : ""
      );
      data.append(
        "experience",
        editEmployeeForm.experience ? editEmployeeForm.experience : ""
      );
      data.append(
        "joiningDate",
        editEmployeeForm.joiningDate ? editEmployeeForm.joiningDate : ""
      );
      data.append("userRole", editEmployeeForm.userRole);
      if (this.files && this.files.length) data.append("cv", this.files[0]);
      // if(this.files == null && this.files.length){
      // 	this.files[0] = this.userDetails.CV;
      // 	data.append('cv', this.files[0]);
      // }
      // else{
      // 	data.append('cv', this.files[0]);
      // }

      this._loginService
        .editUserProfileWithFile(data, this.developerId)
        .subscribe(
          (res: any) => {
            
            // localStorage.setItem('currentUser', JSON.stringify(res));
            Swal.fire({
              type: "success",
              title: "Profile Updated Successfully",
              showConfirmButton: false,
              timer: 2000,
            });
            this.isDisable = false;
          },
          (err) => {
            
            Swal.fire("Oops...", "Something went wrong!", "error");
            this.isDisable = false;
          }
        );
    }
  }
  getDetails() {
    this.loader = true;
    // var id =  JSON.parse(localStorage.getItem('currentUser'))._id;
    var id = this.developerId;
    this._loginService.getUserById(id, this.currentUser.userRole).subscribe(
      (res: any) => {
        
        this.userDetails = res.data[0];
        this.loader = false;
        if (this.userDetails.CV) {
          // let cv = this.userDetails.CV
          // let split = cv.split('/')[1]
          this.cvDetails = this.userDetails.CV;
          
        }
        
        if (
          this.currentUser.userRole == "Team Member" ||
          this.currentUser.userRole == "Manager"
        ) {
          this.editEmployeeForm.controls["userRole"].disable();
          this.editEmployeeForm.controls["joiningDate"].disable();
        }
      },
      (err: any) => {
        
        this.loader = false;
      }
    );
  }

  // validatePhone(form) {
  // 	
  // 	var phoneno = /[0-9]/;
  // 	var message = document.getElementById('message');
  // 	if (!form.phone.match(phoneno)) {
  // 		
  // 		message.innerHTML = "Please enter only numbers"
  // 	} else {
  // 		message.innerHTML = "";
  // 	}
  // }
  validatePhone(form) {
    
    var field1 = (<HTMLInputElement>document.getElementById("mobile")).value;
    let message = document.getElementById("message3");
    
    if (/[a-zA-Z]/g.test(field1)) {
      message.innerHTML = "Please enter only numbers";
    } else if (!/[0-9]{10}/.test(field1)) {
      
      if (field1.length < 10) {
        message.innerHTML = "Please enter 10 digit number";
      }
    } else {
      message.innerHTML = "";
      
    }
  }
  validateName(form) {
    
    var nameInput = /[a-zA-Z ]/;
    var message1 = document.getElementById("message1");
    if (!form.name.match(nameInput)) {
      
      message1.innerHTML = "Name can not start with digit";
    } else {
      message1.innerHTML = "";
    }
  }
}
