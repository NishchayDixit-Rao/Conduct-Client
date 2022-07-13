import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ProjectService } from "../services/project.service";
import { AlertService } from "../services/alert.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { config } from "../config";
declare var $: any;
import { LoginService } from "../services/login.service";
import Swal from "sweetalert2";
import { SearchTaskPipe } from "../search-task.pipe";
import * as _ from "lodash";
import { Observable } from "rxjs";
import { of, pipe } from "rxjs";
import { map } from "rxjs/operators";
import { NewEmployeeAddComponent } from "../new-employee-add/new-employee-add.component";
import { MatDialog } from "@angular/material";
import { InvitationLinkComponent } from "../new-project-create/invitation-link/invitation-link.component";

@Component({
  selector: "app-all-employee",
  templateUrl: "./all-employee.component.html",
  styleUrls: ["./all-employee.component.css"],
})
export class AllEmployeeComponent implements OnInit {
  state$: Observable<object>;
  searchFlag = false;
  filteredTeams;
  filteredDevelopers;
  tracks: any;
  Teams;
  tasks;
  developers: any = [];
  // developer;
  userId;
  filter;
  projectId;
  searchText;
  mergeArr = [];
  finalArray = [];
  loader: boolean = false;
  path = config.baseMediaUrl;
  addEmployeeForm;
  files: Array<File> = [];
  selectedProjectId: "all";
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  projects;

  constructor(
    private formBuilder: FormBuilder,
    private _loginService: LoginService,
    private route: ActivatedRoute,
    public _alertService: AlertService,
    private router: Router,
    public _projectService: ProjectService,
    public searchTextFilter: SearchTaskPipe,
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.state$ = this.activatedRoute.paramMap.pipe(
      map(() => window.history.state)
    );
    let name = window.history.state;

    if (name.branch) {
      this.getDeveloperBranchWise(name.branch);
    } else {
      this.getWorkCircleList();
    }
    // this.getAllProjects();
    this.loader = true;
    this.searchFlag = false;
    $(".datepicker").pickadate();
  }
  addFile(event) {
    this.files.push(event.target.files[0]);
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

  getDeveloperBranchWise(branchName) {
    this.loader = true;
    this._projectService.getBranchUser(branchName).subscribe(
      (res: any) => {
        this.developers = res.data;
        this.filteredDevelopers = res.data;

        this.loader = false;
      },
      (error) => {}
    );
  }

  getWorkCircleList() {
    this.loader = true;
    this._projectService.getWorkCircleList().subscribe(
      (res: any) => {
        if (Object.keys(res).length !== 0) {
          this.developers = res.data.participants;
          this.filteredDevelopers = res.data.participants;
          console.log("developers : ", this.developers);
        }
        this.loader = false;
      },
      (err) => {
        this.loader = false;

        this._alertService.error(err);
      }
    );
    setTimeout(() => {
      $("a.rotate-btn").click(function () {
        $(this).parents(".card-rotating").toggleClass("flipped");
      });
    }, 2000);
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
        confirmButtonText: "Delete",
        showCloseButton: true,
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          var body;
          this._projectService.deleteEmployeeById(developerid._id).subscribe(
            (res) => {
              Swal.fire({
                type: "success",
                title: "Employee remove Successfully",
                showConfirmButton: false,
                timer: 2000,
              });
              this.getWorkCircleList();
            },
            (err) => {
              Swal.fire("Oops...", "Something went wrong!", "error");
            }
          );
        }
      });
  }
  getAllProjects() {
    this._projectService.getProjects().subscribe(
      (res: any) => {
        this.projects = res.data.data;
      },
      (err) => {
        this._alertService.error(err);
      }
    );
  }
  getDeveloper(projectId) {
    this.selectedProjectId = projectId;

    if (projectId != "all") {
      this.developers = [];

      this._projectService
        .getTeamByProjectId(projectId)
        .subscribe((res: any) => {
          this.Teams = res.data;

          _.forEach(this.Teams, (content) => {
            _.forEach(content.teamMembers, (team) => {
              this.developers.push(team);
            });
            _.forEach(content.projectManager, (pmTeam) => {
              this.developers.push(pmTeam);
            });
          });
          this.filteredTeams = this.developers;
          if (this.filteredTeams.length == 0) {
            let message1 = document.getElementById("message1");
            message1.innerHTML = "There are no members in this project";
          }

          setTimeout(() => {
            $("a.rotate-btn").click(function () {
              $(this).parents(".card-rotating").toggleClass("flipped");
            });
          }, 2000);
        });
      this.searchFlag = true;
    } else {
      this.getWorkCircleList();
    }
  }
  onKey(searchText) {
    if (this.searchFlag == true) {
      var dataToBeFiltered = [this.filteredTeams];
    } else {
      var dataToBeFiltered = [this.filteredDevelopers];
    }

    var developer = this.searchTextFilter.transform1(
      dataToBeFiltered,
      searchText
    );

    this.developers = [];
    if (developer.length > 0) {
      let message = document.getElementById("message");
      message.innerHTML = "";
    }
    if (developer.length > 0) {
      if (this.selectedProjectId != "all") {
        _.forEach(developer, (content) => {
          this.developers.push(content);
        });
      } else {
        _.forEach(developer, (content) => {
          this.developers.push(content);
        });
      }
    } else {
      let message = document.getElementById("message");
      message.innerHTML = "Sorry there is no user of this name";
    }
  }

  singleDeveloper(developer) {
    let userRole = developer.userRole;

    this.router.navigate(["./user/", developer._id], {
      state: { userRole: userRole },
    });
  }

  editUser(developer) {
    this._loginService.getUserById(developer._id, developer.userRole).subscribe(
      (response) => {},
      (error) => {}
    );
  }

  addEmployee() {
    console.log("click to check ");
    var addBank = this.openDialog(InvitationLinkComponent, {
      workCircle: this.developers,
    }).subscribe((response) => {
      // if (response != undefined) {
      //   this.developers.push(response);
      // }
    });
  }
  openDialog(someComponent, data = {}): Observable<any> {
    const dialogRef = this.dialog.open(someComponent, { data });
    return dialogRef.afterClosed();
  }
  userBorder(userRole) {
    switch (userRole) {
      case "Manager":
        return { class: "pmBorder" };
        break;
      case "Team Member":
        return { class: "developerBorder" };
        break;
      case "admin":
        return { class: "adminBoder" };
        break;
    }
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
