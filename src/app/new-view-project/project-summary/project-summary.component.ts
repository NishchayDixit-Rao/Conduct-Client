import { Component, OnInit } from "@angular/core";
// import { KeyValue } from "@angular/common";

import { ActivatedRoute } from "@angular/router";
import { ProjectService } from "../../services/project.service";
import { DomSanitizer } from "@angular/platform-browser";
import { config } from "../../config";
@Component({
  selector: "app-project-summary",
  templateUrl: "./project-summary.component.html",
  styleUrls: ["./project-summary.component.css"],
})
export class ProjectSummaryComponent implements OnInit {
  projectId;
  projectDetails;
  path = config.baseMediaUrl;
  userList = [];
  loader = false;
  sideMenuButton = true;
  displayContent;
  taskCount = [];
  constructor(
    private route: ActivatedRoute,
    public projectService: ProjectService,
    private sanitizer: DomSanitizer
  ) {
    this.route.params.subscribe((param) => {
      this.projectId = param.id;

      this.getProjectSummary(this.projectId);
    });
  }

  /**
   * keyvalue Pipe.
   * @returns This function will returned 'Task-counts' object without sorting a key.
   */
  returnZero() {
    return 0;
  }

  ngOnInit() {
    localStorage.removeItem("tempProject");
  }

  getProjectSummary(projectId) {
    this.loader = true;
    this.projectService.getProjectSummary(projectId).subscribe(
      (response: any) => {
        this.projectDetails = response.data;
        console.log("getProjectSummary response : ", this.projectDetails);

        // let bug = this.projectDetails.bugType;
        // let task = this.projectDetails.taskType;
        // let isuee = this.projectDetails.issueType;

        // Object.keys(bug).forEach((val) => {
        //   console.log("Bug key value : ", val);
        //   let obj = {
        //     status: val,

        //   }
        // });

        this.displayContent = this.sanitizer.bypassSecurityTrustHtml(
          this.projectDetails.description
        );
        this.userList = response.data.userTask;
        console.log("userList : ", this.userList);
        this.loader = false;
      },
      (error) => {
        this.loader = false;
      }
    );
  }

  zeroPad(num, numZeros) {
    //

    var n = Math.abs(num);
    //

    var zeros = Math.max(0, numZeros - Math.floor(n).toString().length);
    //

    var zeroString = Math.pow(10, zeros).toString().substr(1);
    //

    if (num < 0) {
      zeroString = "-" + zeroString;
    }

    return zeroString + n;
  }
}
