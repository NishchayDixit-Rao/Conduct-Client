import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { LoginService } from "../services/login.service";
import { config } from "../config";
import { MatDialog } from "@angular/material";
import { NewEmployeeAddComponent } from "../new-employee-add/new-employee-add.component";
import { NewResetPasswordComponent } from "../new-reset-password/new-reset-password.component";
import Swal from "sweetalert2";
import { S3UploadService } from "../services/s3-upload.service";
import { NewFileUploadComponent } from "../common-use/new-file-upload/new-file-upload.component";
@Component({
  selector: "app-new-user-profile",
  templateUrl: "./new-user-profile.component.html",
  styleUrls: ["./new-user-profile.component.css"],
})
export class NewUserProfileComponent implements OnInit {
  userId;
  state$: Observable<object>;
  userRole;
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  userDetails;
  path = config.baseMediaUrl;
  loader = false;
  files;
  displayPhoto;
  totalProject = [];
  isAdmin: boolean = true;
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public loginService: LoginService,
    public dialog: MatDialog,
    public s3Service: S3UploadService,
    public _change: ChangeDetectorRef
  ) {
    // this.route.params.subscribe((param) => {
    //   
    //   this.userId = param.id;
    //   if (this.currentUser._id !== this.userId) {
    //     this.isAdmin = !this.isAdmin;
    //     
    //   } else {
    //     
    //   }
    // });
    // this.state$ = this.route.paramMap.pipe(map(() => window.history.state));
    // 
    // if (window.history.state.userRole) {
    //   
    //   this.userRole = window.history.state.userRole;
    // } else {
    //   this.userRole = this.currentUser.userRole;
    // }
    // this.getUserDetails();
  }

  ngOnInit() {
    this.route.params.subscribe((param) => {
      
      this.userId = param.id;
      if (this.currentUser._id !== this.userId) {
        this.isAdmin = false;
        
      } else {
        this.isAdmin = true;
        
      }
      this.getUserDetails();
      this._change.detectChanges();
    });
    this.state$ = this.route.paramMap.pipe(map(() => window.history.state));
    
    if (window.history.state.userRole) {
      
      this.userRole = window.history.state.userRole;
    } else {
      this.userRole = this.currentUser.userRole;
    }
  }

  getUserDetails() {
    this.loader = true;
    this.loginService.getUserById(this.userId, this.currentUser._id).subscribe(
      (response: any) => {
        this.userDetails = response.data[0];
        this.displayPhoto = this.userDetails.profilePhoto;
        if (this.userDetails && this.userDetails.project) {
          this.totalProject = this.userDetails.project;
        }
        
        // if (this.userDetails.userRole == "Team Member") {
        //   this.displayPhoto = this.userDetails.profilePhoto;
        //   if (this.userDetails && this.userDetails.project) {
        //     this.totalProject = this.userDetails.project[0];
        //   }
        // } else {
        //   this.displayPhoto = this.userDetails.profilePhoto;

        //   if (this.userDetails && this.userDetails.project) {
        //     this.totalProject = this.userDetails.project;
        //   }
        // }
        

        this.loader = false;
      },
      (error) => {
        this.loader = false;
        
      }
    );
  }
  editProfile() {
    let data = this.userDetails;
    var addBank = this.openDialog(NewEmployeeAddComponent, data).subscribe(
      (response) => {
        
        if (response != undefined) {
          let temp = response.data.data;
          let exTemp = response.data.experience;
          temp["date"] = temp.joiningDate;
          temp["totalExperience"] = exTemp.total;
          temp["firmExperience"] = exTemp.firmEx;
          this.userDetails = temp;
        }
      }
    );
  }
  openDialog(someComponent, data = {}): Observable<any> {
    
    const dialogRef = this.dialog.open(someComponent, { data });
    return dialogRef.afterClosed();
  }

  // resetPassword() {
  //   let data;
  //   var addBank = this.openDialog(NewResetPasswordComponent, data).subscribe(
  //     (response) => {
  //       
  //       if (response != undefined) {
  //         // response['date'] = response.joiningDate
  //         // this.userDetails = response
  //       }
  //     }
  //   );
  // }

  uploadFile() {
    // 
    if (
      this.currentUser._id == this.userDetails._id ||
      this.currentUser.userRole == "admin"
    ) {
      // this.files = e.target.files;
      // let path = "Employees"

      let obj = {
        singleFile: true,
        // avtar: true,
        path: "Employees",
      };
      let data = obj;
      var taskDetails = this.openDialog(NewFileUploadComponent, data).subscribe(
        (response) => {
          
     
          if (response != undefined) {
            let path = response[0].Location;
            this.loginService
              .changeProfilePicture(path, this.userDetails._id)
              .subscribe(
                (res: any) => {
                  
                  Swal.fire({
                    type: "success",
                    title: "profile Picture Updated Successfully",
                    showConfirmButton: false,
                    timer: 2000,
                  });
                  this.displayPhoto = res.data.profilePhoto;
                },
                (error) => {
                  
                  //   Swal.fire('Oops...', 'Something went wrong!', 'error')
                }
              );
            // this.editImage = true
            // if (this.data.task && this.data.task.edited == true) {
            //   _.forEach(response, (singleFile) => {
            //     this.newImages.push(singleFile.Location)
            //   })
            // } else {
            // _.forEach(response, (singleFile) => {
            //   let obj = {
            //     singleFile: singleFile.Location
            //   }
            //   this.uploadedFileArray.push(obj)
            // })
            // 
            // }
          }
        }
      );

      // let uploadFile = this.s3Service.uploadFile(this.files[0], path, this.userDetails._id)
      // 
      // this.s3Service.uploadFile(this.files[0], path).subscribe((response: any) => {

      //   if (response && response.Location) {
      //     
      //     let path = response.Location
      //     this.loginService.changeProfilePicture(path, this.userDetails._id).subscribe((res: any) => {
      //       
      //       Swal.fire({ type: 'success', title: 'profile Picture Updated Successfully', showConfirmButton: false, timer: 2000 })
      //       this.displayPhoto = res.data.profilePhoto
      //     }, error => {
      //       
      //       //   Swal.fire('Oops...', 'Something went wrong!', 'error')
      //     });
      //   }
      // }, error => {
      //   

      // })
    } else {
      Swal.fire("Sorry", "You do not upload profile-photo ", "error");
    }
  }

  projectDetails(project) {
    
    if (this.currentUser.userRole == "admin") {
      this.router.navigate(["/user-logs"], {
        queryParams: { user: this.userDetails._id, projects: project._id },
      });
    } else {
      this.router.navigate(["./task-list/", project._id]);
    }
  }

  singleUserLogs() {
    this.router.navigate(["/user-logs"], {
      queryParams: { user: this.userDetails._id },
    });
  }

  getUserRole(role) {
    switch (role) {
      case "Manager":
        return "Project Manager";
        break;
      default:
        return role;
        break;
    }
  }
}
