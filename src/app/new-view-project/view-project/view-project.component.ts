import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ProjectService } from "../../services/project.service";
import { AlertService } from "../../services/alert.service";
import { LeaveService } from "../../services/leave.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
declare var $: any;
import * as _ from "lodash";
import { config } from "../../config";
import { MessagingService } from "../../services/messaging.service";
import { ToastrService } from "ngx-toastr";
import { Globals } from "../../services/globals";
import Swal from "sweetalert2";
import { SearchTaskPipe } from "../../search-task.pipe";
import { MatMenu, MatMenuTrigger } from "@angular/material/menu";
import { single } from "rxjs/operators";

import * as moment from "moment";

@Component({
  selector: "app-view-project",
  templateUrl: "./view-project.component.html",
  styleUrls: ["./view-project.component.css"],
})
export class ViewProjectComponent implements OnInit {
  currentEmployeeId = JSON.parse(localStorage.getItem("currentUser"))._id;
  currentUserName = JSON.parse(localStorage.getItem("currentUser")).name;
  checkInStatus = JSON.parse(localStorage.getItem("checkIn"));
  checkOutStatus = JSON.parse(localStorage.getItem("checkOut"));
  projects: any = [];

  projects1: any;

  projectTeam;
  addForm: FormGroup;
  files: Array<File>;
  url = "";
  pro;
  idet = [];
  pmt: any;
  developers: any;
  path = config.baseMediaUrl;
  loader: boolean = false;
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  message;
  tracks;
  projectId;
  project;
  demoprojects = [];
  timediff: any;
  attendence: any;
  idpmt: any;
  objectsArray: any;
  hoveredProject: any;
  teamproject: any;
  ary: any;
  optionsSelect: Array<any>;
  pmanagerId = JSON.parse(localStorage.getItem("currentUser"));
  flag: boolean = false;
  greet;
  projectManagerName: any;
  searchProject = [];
  searchText;
  @Output() Updateproject = new EventEmitter();
  selected;
  adminProject = [];
  totalUniqueProject;
  allDevelopers = [];
  adminUniqueProject = [];
  displayIndex;
  displayText = {
    text: "",
    id: "",
  };
  filterReset;
  noDataFound;
  projectsCopy = [];
  filterProjects = [];
  filterProjectsCopy = [];
  // searchText
  displayFilter = [
    {
      displayName: "Developer",
    },
    {
      displayName: "Manager",
    },
    {
      displayName: "Due Date",
    },

    // "Developer", "Due Date"
  ];
  sortingList = [
    {
      displayName: "Due Date",
    },
  ];
  displayReset = false;
  adminUniqueProjectCopy = [];
  filteredTeamMemberList = [];
  filteredManagerList = [];
  constructor(
    public _leaveService: LeaveService,
    public router: Router,
    public global: Globals,
    private messagingService: MessagingService,
    private activated: ActivatedRoute,
    public _projectService: ProjectService,
    public _alertService: AlertService,
    private toaster: ToastrService,
    public searchTextFilter: SearchTaskPipe
  ) { }

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  ngOnInit() {
    //
    if (this.checkInStatus == false) {
      $("#myModal").modal("show");
    } else {
      $("#myModal").modal("hide");
    }

    this.getProjects();
    if (this.currentUser.userRole == "admin") {
      this.getAllDeveloper();
    }
  }

  getSelectedDate(event) {
    this.trigger.closeMenu();
  }
  dueDateSelected(event) {
    this.displayReset = true;
    this.filterReset = false;
    if (this.currentUser.userRole == "admin") {
      this.adminUniqueProject = this.adminUniqueProjectCopy;

      let selectedMembers;
      if (event.startDate.getTime() == event.endDate.getTime()) {
        selectedMembers = this.adminUniqueProject.filter(
          (m) =>
            moment(m.deadline).format("YYYY-MM-DD") ==
            moment(event.startDate).format("YYYY-MM-DD")
        );
      } else {
        selectedMembers = this.adminUniqueProject.filter(
          (m) =>
            new Date(m.deadline) >= new Date(event.startDate) &&
            new Date(m.deadline) <= new Date(event.endDate)
        );
      }

      if (selectedMembers && selectedMembers.length) {
        this.adminUniqueProject = selectedMembers;
        this.displayIndex = 1;
      } else {
        this.displayIndex = 2;
        this.noDataFound = {
          img: "abc",
          text: "No Project With This Due Date",
        };
      }
    } else {
      this.projects = this.projectsCopy;

      let selectedMembers;
      if (event.startDate.getTime() == event.endDate.getTime()) {
        selectedMembers = this.projects.filter(
          (m) =>
            moment(m.deadline).format("YYYY-MM-DD") ==
            moment(event.startDate).format("YYYY-MM-DD")
        );
      } else {
        selectedMembers = this.projects.filter(
          (m) =>
            new Date(m.deadline) >= new Date(event.startDate) &&
            new Date(m.deadline) <= new Date(event.endDate)
        );
      }

      if (selectedMembers && selectedMembers.length) {
        this.projects = selectedMembers;
        // this.displayIndex = 1
      } else {
        this.displayIndex = 2;
        this.noDataFound = {
          img: "assets/no-project.gif",
          text: "No Project With This Due Date",
        };
      }
    }
  }

  /**
   *
   * @param manager Chacked Manager list from the project filter drop-down
   * @param teamMember Checked Team-Member list from the project filter drop-down
   *
   * And this function will return fitered projects list with Manager and Team-Member combinations.
   */
  getFilteredCombination(manager, teamMember) {
    let filteredProjectWithManagers = [];
    let filteredProjects = [];

    /**
     * First it will filters the projectes with the Manager
     */
    if (teamMember.length === 0) {
      return this.filterUniqueProjectForManager(
        this.adminUniqueProjectCopy,
        manager
      );
    }

    /**
     * First it will filters the projectes with the Member
     */
    if (manager.length == 0) {
      console.log("manager is empty : ", manager);
      return this.filterUniqueProjectForMember(
        this.adminUniqueProjectCopy,
        teamMember
      );
    }

    this.adminUniqueProjectCopy.filter((singleProject) => {
      let isManagersAvaliable = manager.every((m) =>
        singleProject.projectManager[0].some((manager) => manager._id == m._id)
      );
      if (isManagersAvaliable) {
        filteredProjectWithManagers.push(singleProject);
      }
    });

    /**
     * And projects that is filtered with Manager, it is going to filters with Team-Members.
     */
    filteredProjectWithManagers.filter((singleProject) => {
      let isMemberAvailable = teamMember.every((t) =>
        singleProject.teamMembers[0].some((member) => member._id == t._id)
      );
      if (isMemberAvailable) {
        filteredProjects.push(singleProject);
      }
    });
    console.log("Final filtered projectes : ", filteredProjects);

    return filteredProjects;
  }

  filterOnManager(event) {
    let finalList = event;
    let sortedList = [];
    this.displayReset = true;
    this.filterReset = false;
    this.filteredManagerList = event;
    if (event && event.length) {
      /**
       * This is for filtering the projects with combinations of Managers list and Memner list.
       */
      if (
        this.filteredManagerList.length !== 0 &&
        this.filteredTeamMemberList.length !== 0
      ) {
        console.log("Custome function will be here");
        sortedList = this.getFilteredCombination(
          this.filteredManagerList,
          this.filteredTeamMemberList
        );
      } else {
        /**
         * This is the normal filter with the Manager only.
         */
        this.adminUniqueProject = this.adminUniqueProjectCopy;
        // finalList.forEach((a) => (selected[a._id] = true));
        sortedList = this.filterUniqueProjectForManager(
          this.adminUniqueProject,
          finalList
        );
      }
      console.log("Sorted list : ", sortedList);
      if (sortedList && sortedList.length) {
        this.adminUniqueProject = sortedList;
        this.displayIndex = 1;
      } else {
        this.displayIndex = 2;
        this.noDataFound = {
          img: "assets/no_project.gif",
          text: "No Project With This Users",
        };
      }
    } else {
      if (this.filteredTeamMemberList.length !== 0) {
        let sortedList = this.getFilteredCombination(
          this.filteredManagerList,
          this.filteredTeamMemberList
        );
        console.log("sortedList of unique manager: ", sortedList);
        if (sortedList && sortedList.length) {
          this.projects = sortedList;
          this.displayIndex = 3;
        } else {
          this.displayIndex = 2;
          this.noDataFound = {
            img: "assets/no_project.gif",
            text: "No Project With This Users",
          };
        }
      } else {
        this.resetFilter();
      }
    }
  }

  /**
   *
   * @param projectList list of projects.
   * @param selected will have the selected Managers list.
   * @returns Unique projectes of selected Managers.
   */
  filterUniqueProjectForManager(projectList, finalList) {
    let sortedList = [];
    let selected = Object.create(null);
    finalList.forEach((a) => (selected[a._id] = true));
    projectList.filter((a) => {
      a.projectManager[0].forEach((member) => {
        console.log("Manager : ", member);
        if (selected[member._id]) {
          let isProjectInclude = sortedList.filter((e) => e._id === a._id);
          if (!isProjectInclude.length) {
            sortedList.push(a);
          }
        }
      });
    });

    return sortedList;
  }

  /**
   *
   * @param projectList list of projects.
   * @param finalList will have the selected Member list.
   * @returns Unique projectes of selected Member.
   */
  filterUniqueProjectForMember(projectList, finalList) {
    let sortedList = [];
    let selected = Object.create(null);
    finalList.forEach((a) => (selected[a._id] = true));
    projectList.filter((a) =>
      a.teamMembers[0].forEach((member) => {
        if (selected[member._id]) {
          let isProjectInclude = sortedList.filter((e) => e._id === a._id);
          if (!isProjectInclude.length) {
            sortedList.push(a);
          }
        }
      })
    );

    return sortedList;
  }

  filterOnDeveloper(event) {
    console.log("developer filter event : ", event);
    this.displayReset = true;
    this.filterReset = false;
    this.filteredTeamMemberList = event;
    if (event && event.length) {
      if (this.currentUser.userRole == "admin") {
        let finalList = event;
        let sortedList = [];

        /**
         * This is for filtering the projects with combinations of Managers list and Memner list.
         */
        if (
          this.filteredManagerList.length !== 0 &&
          this.filteredTeamMemberList.length !== 0
        ) {
          console.log("Custome function will be here");
          sortedList = this.getFilteredCombination(
            this.filteredManagerList,
            this.filteredTeamMemberList
          );
        } else {
          /**
           * This is the normal filter with the Team-Memner list only.
           */
          this.adminUniqueProject = this.adminUniqueProjectCopy;
          let selected = Object.create(null);
          finalList.forEach((a) => (selected[a._id] = true));
          sortedList = this.filterUniqueProjectForMember(
            this.adminUniqueProject,
            finalList
          );
        }
        console.log("Sorted list : ", sortedList);
        if (sortedList && sortedList.length) {
          this.adminUniqueProject = sortedList;
          this.displayIndex = 1;
        } else {
          this.displayIndex = 2;
          this.noDataFound = {
            img: "assets/no_project.gif",
            text: "No Project With This Users",
          };
        }
      } else {
        this.projects = this.projectsCopy;
        let finalList = event;
        let sortedList;
        let selected = Object.create(null);
        finalList.forEach((a) => (selected[a._id] = true));
        sortedList = this.projects.filter(
          (a) =>
            a.teamMembers.some((b) => selected[b._id]) ||
            a.projectManager.some((b) => selected[b._id])
        );

        if (sortedList && sortedList.length) {
          this.projects = sortedList;
          this.displayIndex = 3;
        } else {
          this.displayIndex = 2;
          this.noDataFound = {
            img: "assets/no_project.gif",
            text: "No Project With This Users",
          };
        }
      }
    } else {
      if (this.filteredManagerList.length !== 0) {
        let sortedList = this.getFilteredCombination(
          this.filteredManagerList,
          this.filteredTeamMemberList
        );
        console.log("sortedList of unique manager: ", sortedList);
        if (sortedList && sortedList.length) {
          this.projects = sortedList;
          this.displayIndex = 3;
        } else {
          this.displayIndex = 2;
          this.noDataFound = {
            img: "assets/no_project.gif",
            text: "No Project With This Users",
          };
        }
      } else {
        this.resetFilter();
      }
    }
  }

  resetFilter() {
    this.filterReset = true;
    this.displayReset = false;
    if (this.currentUser.userRole == "admin") {
      this.searchText = "";
      this.filteredManagerList = [];
      this.filteredTeamMemberList = [];
      let message = document.getElementById("message");
      message.innerHTML = "";
      this.activated.queryParams.subscribe((params) => {
        if (params.list == "list") {
          this.adminUniqueProject = this.adminUniqueProjectCopy;
          this.displayIndex = 0;
        } else {
          this.adminUniqueProject = this.adminUniqueProjectCopy;
          this.displayIndex = 1;
        }
      });
    } else {
      this.projects = this.projectsCopy;
      this.displayIndex = 3;
      this.searchText = "";
      let message = document.getElementById("message");
      message.innerHTML = "";
    }
  }

  getAllDeveloper() {
    this._projectService.getWorkCircleList().subscribe(
      (response: any) => {
        console.log("Work-circle list : ", response);
        let newArray = [];
        // _.forEach(response.data.participants, (singleUser) => {
        //   // if (singleUser.userRole != "admin") {
        //   //   singleUser["redirect"] = false;
        //   //   newArray.push(singleUser);
        //   // }
        //   singleUser["redirect"] = false;
        //   newArray.push(singleUser);
        if (response && response.data) {
          _.forEach(response.data.participants, (singleUser) => {
            // if (singleUser.userRole != "admin") {
            //   singleUser["redirect"] = false;
            //   newArray.push(singleUser);
            // }
            singleUser["redirect"] = false;
            newArray.push(singleUser);
          });
        } else {
          console.log("No participants found...", response);
        }

        let adminData = {
          email: this.currentUser.email,
          name: this.currentUser.name,
          _id: this.currentUser._id,
          redirect: false,
        };
        newArray.push(adminData);
        console.log("new Admin data : ", adminData);
        this.allDevelopers = newArray;
        console.log("All Developer list : ", this.allDevelopers);
      },
      (error) => { }
    );
  }

  // old function
  // getProjects() {
  //   this.loader = true;
  //   this._projectService.getProjects().subscribe(
  //     (res: any) => {
  //
  //       let userId = JSON.parse(localStorage.getItem("currentUser") || "")._id;
  //       this.loader = false;
  //       this.projects = res.data.projects;

  //       this.projects.forEach((pro) => {
  //
  //
  //         if (pro.admin._id == userId) {
  //           pro.userRole = "Admin";
  //         }
  //         if (pro.projectManager.some((e) => e._id == userId)) {
  //           pro.userRole = "Manager";
  //         }
  //         if (pro.teamMembers.some((e) => e._id == userId)) {
  //           pro.userRole = "Member";
  //         }
  //       });
  //       // $('.noProjects').css({'display' : 'none'})
  //       if (
  //         this.currentUser.userRole == "Manager" ||
  //         this.currentUser.userRole == "Team Member"
  //       ) {
  //         this.projects = res.data.projects;
  //         this.searchProject = res.data.projects;
  //         _.forEach(this.projects, (nameOfPm) => {
  //           this.projectManagerName = nameOfPm.projectManager[0];
  //           //
  //         });
  //         this.projectsCopy = res.data.projects;
  //
  //         this.displayIndex = 3;
  //         let listOfProjects = res.data.totalList;
  //         this.filterProjects = res.data.totalList;
  //         this.filterProjectsCopy = res.data.totalList;
  //         let newArray = [];
  //         _.forEach(listOfProjects, (singleProject) => {
  //
  //           _.forEach(singleProject.projectManager, (singlePm) => {
  //             let index = _.findIndex(newArray, function (o) {
  //               return o._id == singlePm._id;
  //             });
  //             if (index == -1) {
  //               singlePm["redirect"] = false;
  //               newArray.push(singlePm);
  //             }
  //           });
  //           _.forEach(singleProject.teamMembers, (singlePm) => {
  //             let index = _.findIndex(newArray, function (o) {
  //               return o._id == singlePm._id;
  //             });
  //             if (index == -1) {
  //               singlePm["redirect"] = false;
  //               newArray.push(singlePm);
  //             }
  //           });
  //         });
  //
  //         this.allDevelopers = newArray;
  //       } else {
  //         this.adminUniqueProject = res.data.totalList;
  //         this.adminUniqueProjectCopy = res.data.totalList;
  //
  //         let demoProject = res.data.data;
  //         _.forEach(demoProject, (singleProject) => {
  //           _.forEach(singleProject.project, (oneProject) => {
  //             let index = this.adminUniqueProject.find(
  //               (x) => x._id == oneProject.projectId
  //             );
  //             //
  //             oneProject["projectManager"] = index.projectManager;
  //           });
  //           this.adminProject.push(singleProject);
  //         });
  //         // this.adminProject = res.data.data
  //         this.displayIndex = 0;
  //         this.totalUniqueProject = res.data.count;
  //         this.displayText = {
  //           text: "Total Unique Project" + "-" + this.totalUniqueProject,
  //           id: "project",
  //         };

  //         this.searchProject = this.adminUniqueProject;
  //         this.router.navigate(["/projects"], {
  //           queryParams: { list: "list" },
  //         });
  //       }
  //     },
  //     (err) => {
  //       Swal.fire("Oops...", "Something went wrong!", "error");
  //       this.loader = false;
  //     }
  //   );
  // }

  // updated Function
  getProjects() {
    this.loader = true;
    this._projectService.getProjects().subscribe(
      (res: any) => {
        console.log("project list resposne : ", res);
        let userId = JSON.parse(localStorage.getItem("currentUser") || "")._id;
        this.loader = false;
        this.projects = res.data.projects;
        // $('.noProjects').css({'display' : 'none'})
        this.searchProject = res.data.projects;
        _.forEach(this.projects, (nameOfPm) => {
          this.projectManagerName = nameOfPm.projectManager[0];
          //
        });
        this.projectsCopy = res.data.projects;

        this.displayIndex = 3;
        let listOfProjects = res.data.totalList;
        this.filterProjects = res.data.totalList;
        this.filterProjectsCopy = res.data.totalList;
        let newArray = [];
        _.forEach(listOfProjects, (singleProject) => {
          _.forEach(singleProject.projectManager, (singlePm) => {
            let index = _.findIndex(newArray, function (o) {
              return o._id == singlePm._id;
            });
            if (index == -1) {
              singlePm["redirect"] = false;
              newArray.push(singlePm);
            }
          });
          _.forEach(singleProject.teamMembers, (singlePm) => {
            let index = _.findIndex(newArray, function (o) {
              return o._id == singlePm._id;
            });
            if (index == -1) {
              singlePm["redirect"] = false;
              newArray.push(singlePm);
            }
          });
        });

        this.allDevelopers = newArray;
        // this.adminUniqueProject = res.data.totalList;
        // this.adminUniqueProjectCopy = res.data.totalList;

        this.adminUniqueProject = res.data.projects;
        this.adminUniqueProjectCopy = res.data.projects;
        // this.filteredManagerList = res.data.projects;
        // this.filteredTeamMemberList = res.data.projects;
        // let demoProject = res.data.data;
        // _.forEach(demoProject, (singleProject) => {
        //   _.forEach(singleProject.project, (oneProject) => {
        //     let index = this.adminUniqueProject.find(
        //       (x) => x._id == oneProject.projectId
        //     );
        //     //
        //     oneProject["projectManager"] = index.projectManager;
        //   });
        //   this.adminProject.push(singleProject);
        // });
        // // this.adminProject = res.data.data
        // this.displayIndex = 0;
        // this.totalUniqueProject = res.data.count;
        // this.displayText = {
        //   text: "Total Unique Project" + "-" + this.totalUniqueProject,
        //   id: "project",
        // };

        // this.searchProject = this.adminUniqueProject;
        // this.router.navigate(["/projects"], {
        //   queryParams: { list: "list" },
        // });

        // if (
        //   this.currentUser.userRole == "Manager" ||
        //   this.currentUser.userRole == "Team Member"
        // ) {
        //   // Changes...
        // } else {

        // }
      },
      (err) => {
        Swal.fire("Oops...", "Something went wrong!", "error");
        this.loader = false;
      }
    );
  }

  changetab(displayText) {
    if (displayText.id == "project") {
      this.displayText = {
        text: "All ProjectManager",
        id: "projectManger",
      };
      this.displayIndex = 1;

      this.router.navigate(["/projects"], { queryParams: { card: "card" } });
    } else {
      this.displayText = {
        text: "Total Unique Project" + "-" + this.totalUniqueProject,
        id: "project",
      };
      this.displayIndex = 0;

      this.router.navigate(["/projects"], { queryParams: { list: "list" } });
    }
  }

  getDate(date) {
    date = date.split("T");
    return date[0];
  }

  getTitle(name) {
    var str = name.split(" ");
    return (
      str[0].charAt(0).toUpperCase() +
      str[0].slice(1) +
      " " +
      str[1].charAt(0).toUpperCase() +
      str[1].slice(1)
    );
  }

  getInitialsOfName(name) {
    var str = name.split(" ")[0][0] + name.split(" ")[1][0];
    return str.toUpperCase();
    // return name.split(' ')[0][0]+name.split(' ')[1][0];
  }

  getTechName(tech) {
    if (tech == "fa-react") return "React JS";
  }

  getLength(project, opt) {
    //
    if (project.tasks && project.tasks.length)
      return _.filter(project.tasks, { taskType: opt }).length;
    else return 0;
  }

  removeAvatar() {
    this.url = "";
    this.addForm.value["avatar"] = "";
    this.files = [];
  }

  getTaskCount(status) {
    return _.filter(this.hoveredProject.tasks, function (o) {
      if (o.status == status) return o;
    }).length;
  }

  mouseOver(project) {
    //
    this.hoveredProject = project;
  }

  projectFiles(projectId, folderId) {
    this.router.navigate(["./projectFiles/", projectId], { state: folderId });
  }

  // onKey(search) {
  //
  //   if (search.length == 0) {
  //     this.activated.queryParams.subscribe((params) => {
  //       if (params.list == "list") {
  //
  //         this.displayIndex = 0;
  //         this.adminUniqueProject = this.adminUniqueProjectCopy;

  //         let message = document.getElementById("message");
  //         message.innerHTML = "";
  //       } else {
  //         this.displayIndex = 1;
  //         this.adminUniqueProject = this.adminUniqueProjectCopy;

  //         let message = document.getElementById("message");
  //         message.innerHTML = "";
  //       }
  //     });
  //     if (
  //       this.currentUser.userRole == "Manager" ||
  //       this.currentUser.userRole == "Team Member"
  //     ) {
  //       this.projects = this.projectsCopy;
  //       this.displayIndex = 3;
  //     }
  //   } else {
  //     var dataToBeFiltered = this.searchProject;
  //
  //     var project = this.searchTextFilter.transform4(dataToBeFiltered, search);
  //
  //     if (
  //       this.currentUser.userRole == "Manager" ||
  //       this.currentUser.userRole == "Team Member"
  //     ) {
  //       this.projects = [];
  //       if (project.length > 0) {
  //         let message = document.getElementById("message");
  //         message.innerHTML = "";
  //       }
  //       if (project.length > 0) {
  //         project.forEach((sigleProject) => {
  //           this.projects.push(sigleProject);
  //         });
  //       } else {
  //         let message = document.getElementById("message");
  //         message.innerHTML = "Sorry there is no project of this title";
  //       }
  //     }
  //     if (this.currentUser.userRole == "admin") {
  //       if (this.displayIndex == 0) {
  //
  //         this.adminUniqueProject = [];
  //         if (project.length > 0) {
  //           let message = document.getElementById("message");
  //           message.innerHTML = "";
  //         }
  //         if (project.length > 0) {
  //           this.displayIndex = 1;
  //           project.forEach((sigleProject) => {
  //             this.adminUniqueProject.push(sigleProject);
  //           });
  //         } else {
  //           let message = document.getElementById("message");
  //           message.innerHTML = "Sorry there is no project of this title";
  //         }
  //       }
  //       if (this.displayIndex == 1) {
  //
  //         this.adminUniqueProject = [];
  //         if (project.length > 0) {
  //           let message = document.getElementById("message");
  //           message.innerHTML = "";
  //         }
  //         if (project.length > 0) {
  //           project.forEach((sigleProject) => {
  //             this.adminUniqueProject.push(sigleProject);
  //           });
  //         } else {
  //           let message = document.getElementById("message");
  //           message.innerHTML = "Sorry there is no project of this title";
  //         }
  //       }
  //       // if()
  //     }
  //   }
  // }

  /**
   *
   * @param search Latest Funciton with Search functionality
   */
  onKey(search) {
    console.log("search : ", search);
    if (search.length == 0) {
      this.activated.queryParams.subscribe((params) => {
        console.log("params : ", params);
        if (params.list == "list") {
          this.displayIndex = 0;
          this.adminUniqueProject = this.adminUniqueProjectCopy;

          let message = document.getElementById("message");
          message.innerHTML = "";
        } else {
          this.displayIndex = 1;
          this.adminUniqueProject = this.adminUniqueProjectCopy;

          let message = document.getElementById("message");
          message.innerHTML = "";
        }
      });
      this.projects = this.projectsCopy;
    } else {
      var dataToBeFiltered = this.searchProject;
      var project = this.searchTextFilter.transform4(dataToBeFiltered, search);
      this.displayIndex = 3;
      this.projects = [];
      if (project.length > 0) {
        let message = document.getElementById("message");
        message.innerHTML = "";
      }
      if (project.length > 0) {
        project.forEach((sigleProject) => {
          this.projects.push(sigleProject);
        });
      } else {
        let message = document.getElementById("message");
        message.innerHTML = "Sorry there is no project of this title";
      }
    }
  }

  sortTasksByDueDate(type) {
    // _.forEach(this.projects, function (track) {
    //
    if (type == "desc") {
      this.selected = 2;
      this.projects.sort(custom_sort);
      this.projects.reverse();
    } else {
      this.projects.sort(custom_sort1);
      this.projects.reverse();
      this.selected = 1;
    }
    //
    // });

    function custom_sort(a, b) {
      return (
        new Date(new Date(a.deadline)).getTime() -
        new Date(new Date(b.deadline)).getTime()
      );
    }

    function custom_sort1(a, b) {
      return (
        new Date(new Date(b.deadline)).getTime() -
        new Date(new Date(a.deadline)).getTime()
      );
    }
  }
}
