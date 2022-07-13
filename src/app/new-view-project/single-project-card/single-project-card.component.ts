import { Component, OnInit, Input, SimpleChanges } from "@angular/core";
import * as _ from "lodash";
import { config } from "../../config";
import { Router } from "@angular/router";
import { LoginService } from "../../services/login.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-single-project-card",
  templateUrl: "./single-project-card.component.html",
  styleUrls: [
    "./single-project-card.component.css",
    "../view-project/view-project.component.css",
  ],
})
export class SingleProjectCardComponent implements OnInit {
  @Input("singleProject") projectDetails;
  project;
  hoveredProject: any;
  path = config.baseMediaUrl;
  currentUser: any = JSON.parse(localStorage.getItem("currentUser"));
  contentNew;
  finalOne;
  today = Date.now();
  displayBorder = false;
  sideMenuControl: boolean = true;
  teamList = [];
  userListToggle = false;
  constructor(
    public router: Router,
    public loginService: LoginService,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit() {
    let userID = this.currentUser._id;
    if (this.project.teamMembers) {
      this.project.teamMembers.forEach((memberList) => {
        memberList.forEach((member) => {
          let obj = {
            name: member.name,
            profilePhoto: member.profilePhoto,
          };
          this.teamList.push(obj);
          if (member._id === userID) {
            this.currentUser.userRole = "Team Member";
            this.sideMenuControl = false;
            console.log(this.sideMenuControl, "sidemenucontrol");
          }
        });
      });
    }

    if (this.project.projectManager) {
      this.project.projectManager.forEach((memberList) => {
        memberList.forEach((member) => {
          let obj = {
            name: member.name,
            profilePhoto: member.profilePhoto,
          };
          this.teamList.push(obj);
          if (member._id === userID) {
            this.currentUser.userRole = "Manager";
            this.sideMenuControl = false;
            console.log(this.sideMenuControl, "sidemenucontrol");
          }
        });
      });
    }
    this.sideMenuControl = true;
    console.log("this.teamList ::: ", this.teamList);
  }

  userBorder(userRole) {
    switch (userRole) {
      case "Manager":
        return { class: "pmBorder" };
        break;
      case "Team Member":
        return { class: "developerBorder" };
        break;
      case "Admin":
        return { class: "adminBoder" };
        break;
    }
  }

  expadProjectUsers(event) {
    this.userListToggle = !this.userListToggle;
    event.stopPropagation();
  }

  async ngOnChanges(changes: SimpleChanges) {
    //

    if (changes.projectDetails && changes.projectDetails.currentValue) {
      this.project = changes.projectDetails.currentValue;
      console.log("this.project : ", this.project);

      // this.contentNew = this.project.description
      this.contentNew = this.sanitizer.bypassSecurityTrustHtml(
        this.project.description
      );
      if (new Date(this.project.deadline) < new Date()) {
        this.displayBorder = true;
      } else {
        this.displayBorder = false;
      }
      // $(document).ready(() => {
      //   // Configure/customize these variables.
      //   var showChar = 1;  // How many characters are shown by default
      //   var ellipsestext = "";
      //   var moretext = "Read More";
      //   var lesstext = "Read Less";

      //   $('.more').each(() => {
      //     var content = this.contentNew;
      //     if (content.length > showChar) {
      //

      //       var c = content.substr(0, showChar);
      //

      //       var h = content.substr(showChar, content.length - showChar);
      //

      //       var html = c + '<span class="moreellipses">' + ellipsestext + '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';
      //       //
      //       this.finalOne = html
      //       $(this).html(html);
      //     }

      //   });

      //   $(".morelink").click(function () {
      //     if ($(this).hasClass("less")) {
      //       $(this).removeClass("less");
      //       $(this).html(moretext);
      //     } else {
      //       $(this).addClass("less");
      //       $(this).html(lesstext);
      //     }
      //     $(this).parent().prev().toggle();
      //     $(this).prev().toggle();
      //     return false;
      //   });
      // });
    }
  }

  addDiscussion(project) {
    if (project.projectId) {
      this.router.navigate(["/discussions/", project.projectId]);
    } else {
      this.router.navigate(["/discussions/", project._id]);
    }
  }

  singleProjectLogs(project) {
    if (project.projectId) {
      this.router.navigate(["/user-logs"], {
        queryParams: { projects: project.projectId },
      });
    } else {
      this.router.navigate(["/user-logs"], {
        queryParams: { projects: project._id },
      });
    }
  }

  displayUserProfile(user) {
    this.router.navigate(["./user/", user._id], {
      state: { userRole: user.userRole },
    });
  }

  getLength(project, opt) {
    //
    if (project.tasks && project.tasks.length)
      return _.filter(project.tasks, { taskType: opt }).length;
    else return 0;
  }

  getTechName(tech) {
    if (tech == "fa-react") return "React JS";
  }

  getInProcessTasksCount() {
    let inProcessTasks = 0;
    this.project.tasks.forEach((task) => {
      if (task.status !== "To Do" && task.status !== "Done") {
        inProcessTasks++;
      }
    });
    return inProcessTasks;
  }

  getTaskCount(status) {
    return _.filter(this.project.tasks, function (o) {
      if (o.status == status) return o;
    }).length;
  }

  mouseOver(project) {
    //
    this.hoveredProject = project;
  }

  projectFiles(project) {
    let folderId = project.dataSource[0]._id;
    if (project.projectId) {
      this.router.navigate(["/documents/", project.projectId], {
        state: folderId,
      });
    } else {
      this.router.navigate(["/documents/", project._id], { state: folderId });
    }
    //
    // this.router.navigate(['./projectFiles/', projectId], { state: folderId })
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

  singleProjectDetails(project) {
    if (project.projectId) {
      this.router.navigate(["./task-list/", project.projectId]);
    } else {
      this.router.navigate(["./task-list/", project._id]);
    }
  }
  verifyLogs(project) {
    if (project.projectId) {
      this.router.navigate(["./verify-log/", project.projectId]);
    } else {
      this.router.navigate(["./verify-log/", project._id]);
    }
  }

  totalLogs(project) {
    this.router.navigate(["./totalLogs"]);
  }

  displayTimeLog(project) {
    if (project.projectId) {
      this.router.navigate(["./time-log/", project.projectId]);
    } else {
      this.router.navigate(["./time-log/", project._id]);
    }
  }

  editProject(project) {
    if (project.projectId) {
      this.router.navigate(["./edit-project/", project.projectId]);
    } else {
      this.router.navigate(["./edit-project/", project._id]);
    }
  }
  projectSummary(project) {
    if (project.projectId) {
      this.router.navigate(["./project-summary/", project.projectId]);
    } else {
      this.router.navigate(["./project-summary/", project._id]);
    }
  }
  projectSettings(project) {
    if (project.projectId) {
      this.router.navigate(["./project-settings/", project.projectId]);
    } else {
      this.router.navigate(["./project-settings/", project._id]);
    }
  }
}
