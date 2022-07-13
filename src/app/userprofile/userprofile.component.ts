import { Component, OnInit, HostListener } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ProjectService } from "../services/project.service";
import { AlertService } from "../services/alert.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { LoginService } from "../services/login.service";
import * as _ from "lodash";
declare var $: any;
import { config } from "../config";
import * as moment from "moment";
import Swal from "sweetalert2";

@Component({
  selector: "app-userprofile",
  templateUrl: "./userprofile.component.html",
  styleUrls: ["./userprofile.component.css"],
})
export class UserprofileComponent implements OnInit {
  projects;
  developers;
  path = config.baseMediaUrl;
  userId;
  url = "";
  user;
  files;
  projectId;
  projectArr = [];
  finalArr = [];
  editTEmail;
  projectTeam;
  Teams;
  teams;
  all;
  item;
  total: any = [];
  task;
  uid;
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  baseMediaUrl = config.baseMediaUrl;
  pmanagerId = JSON.parse(localStorage.getItem("currentUser"));
  submitted = false;
  isDisable: boolean = false;
  profile;
  constructor(
    private route: ActivatedRoute,
    public _alertService: AlertService,
    private router: Router,
    public _projectservice: ProjectService,
    public _loginService: LoginService
  ) {}

  createEditEmail() {
    this.editTEmail = new FormGroup({
      subject: new FormControl("", Validators.required),
      content: new FormControl("", Validators.required),
      sendTo: new FormControl(["", Validators.required]),
      projectId: new FormControl(["", Validators.required]),
    });
  }

  ngOnInit() {
    

    // this.getAllProjects();
    this.route.params.subscribe((param) => {
      this.userId = param.id;
      this.projectId = param.id;
      this.uid = JSON.parse(localStorage.getItem("currentUser"))._id;
      
    });
    this.createEditEmail();
    this.getProjects();
  }
  get f() {
    return this.editTEmail.controls;
  }

  getProjects() {
    this._projectservice.getProjects().subscribe(
      (res: any) => {
        this.projects = res.data;
        
        // if (this.currentUser.userRole == 'Manager') {
        // 	this.projects = [];
        // 	
        // 	_.forEach(res, (project) => {
        // 		_.forEach(project.pmanagerId, (pid) => {
        // 			if (pid._id == this.currentUser._id) {
        // 				this.projects.push(project);
        // 			}
        // 		})
        // 	})
        // 	
        // }
        // else {
        // 	this.projects = [];
        // 	_.forEach(res, (p) => {
        // 		_.forEach(p.Teams, (user) => {
        // 			if (user._id == this.currentUser._id)
        // 				this.projects.push(p);
        // 		})
        // 	});
        // 	
        // }
      },
      (err) => {
        Swal.fire("Oops...", "Something went wrong!", "error");
      }
    );
  }

  // getDeveloperById(id){
  // 	this._loginService.getUserById(id).subscribe((res:any)=>{
  // 		this.currentUser = res;
  // 		
  // 		var userId = JSON.parse(localStorage.getItem('currentUser'))._id;
  // 		
  // 	},(err:any)=>{
  // 	})
  // }

  getAllDevelopers() {
    this._projectservice.getAllDevelopers().subscribe(
      (res) => {
        this.developers = res;
        
      },
      (err) => {
        
        this._alertService.error(err);
      }
    );
  }
  openModel(task) {
    $("#editEmailModel").modal("show");
    this.getProjectByPmanagerId();
  }
  projectSelected(item) {
    

    if (item && item._id) {
      _.forEach(item.teamMembers, (all) => {
        
        this.total.push(all._id);
      });
      this.teams = item.teamMembers;
      

      $(".progress").addClass("abc");
      setTimeout(() => {
        $(".progress").removeClass("abc");
        // this.task.projectId = item._id;
        this.developers =
          this.projects[_.findIndex(this.projects, { _id: item._id })].Teams;
        
      }, 3000);
    } else {
      this.editTEmail.reset();
    }
  }
  getProjectByPmanagerId() {
    this._projectservice
      .getProjectByPmanagerId(this.currentUser._id)
      .subscribe((res: any) => {
        this.currentUser = res;
        
      });
  }

  addNotification(editTEmail) {
    
    // this.submitted = true;
    // if (this.editTEmail.invalid) {
    // 	return;
    // }
    // 
    this.isDisable = true;
    editTEmail.value["pmanagerName"] = JSON.parse(
      localStorage.getItem("currentUser")
    ).name;
    

    this._projectservice
      .addNotification(editTEmail.value)
      .subscribe((res: any) => {
        
        Swal.fire({
          type: "success",
          title: "You Notified " + res.name + " of ",
          showConfirmButton: false,
          timer: 2000,
        });
        this.isDisable = false;
        this.editTEmail.reset();
        // this.notification = this.myObject;
        // 
      });
  }
  uploadFile(e) {
    
    var userId = JSON.parse(localStorage.getItem("currentUser"))._id;
    
    this.files = e.target.files;
    
    this._loginService.changeProfilePicture(this.files, userId).subscribe(
      (res: any) => {
        
        // this.profile = res.data
        Swal.fire({
          type: "success",
          title: "profile Picture Updated Successfully",
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(() => {
          this.currentUser = res.data;
          // 
          localStorage.setItem("currentUser", JSON.stringify(this.currentUser));
        }, 1000);
      },
      (error) => {
        
        Swal.fire("Oops...", "Something went wrong!", "error");
      }
    );
  }
}
