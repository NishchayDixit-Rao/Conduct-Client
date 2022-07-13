import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ProjectService } from "../services/project.service";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
} from "@angular/forms";
import Swal from "sweetalert2";
import { BooleanNullable } from "aws-sdk/clients/glue";
import { indexOf } from "lodash";

@Component({
  selector: "app-project-work-flow",
  templateUrl: "./project-work-flow.component.html",
  styleUrls: ["./project-work-flow.component.css"],
})
export class ProjectWorkFlowComponent implements OnInit {
  projectTracks;
  projectTracksCopy;
  workFlowId;
  projectData;
  taskList = [];
  isEditable = false;
  loader = false;
  sideMenuButton = true;
  constructor(public router: Router, public projectService: ProjectService) { }

  ngOnInit() {
    this.getProjectById(this.router.url.split("/")[2]);
    // this.getTasksById(this.router.url.split("/")[2]);
  }
  getTasksById(projectId) {
    this.projectService.getTaskById(projectId).subscribe(
      (tasksList: any) => {
        this.loader = false;
        console.log("tasksList :: ", tasksList);
        if (tasksList.data.response.length) {
          this.taskList = tasksList.data.response[0].tasks;
        }
        this.projectTracks.forEach((singleTrack) => {
          if (this.taskList.some((task) => task.status == singleTrack.track)) {
            singleTrack.isEditable = true;
          } else {
            singleTrack.isEditable = false;
          }
        });
      },
      (err) => {
        console.log("err : ", err);
      }
    );
  }

  /**
   * 
   * @param event 
   * @param index 
   */
  isTrackDisplayLimit(event: any, index: any) {
    this.projectTracks[index]["isTrackDisplayLimit"] = event.checked;
    // if (this.projectTracks[index].isTrackDisplayLimit == false) {
    //   delete (this.projectTracks[index].trackDisplayLimit);

    // }

  }

  isTaskAllowLimit(event: any, index: number) {
    this.projectTracks[index]["isTaskAllowLimit"] = event.checked;
    // if (this.projectTracks[index].isTaskAllowLimit == false) {
    // delete (this.projectTracks[index].taskAllowLimit);

    // }
  }

  onTrackDisplayLimitChange(event: any, index: any) {
    this.projectTracks[index]["trackDisplayValue"] = event.target.value;
    console.log(this.projectTracks)
  }

  onTaskAllowLimitChange(event: any, index: any) {
    this.projectTracks[index]["taskAllowValue"] = event.target.value;
    console.log(this.projectTracks);
  }

  getProjectById(projectId) {
    this.loader = true;
    this.projectService.getProjectById(projectId).subscribe(
      (project: any) => {
        this.projectData = project.data;
        this.projectTracks = this.projectData.workFlow[0].tracks;
        console.log("Is key available : ", this.projectTracks[0].isTrackDisplayLimit);
        this.projectTracksCopy = JSON.parse(JSON.stringify(this.projectTracks));
        this.workFlowId = project.data.workFlow[0]._id;
        this.getTasksById(this.router.url.split("/")[2]);
        console.log("projectTracks : ", this.projectTracks);
      },
      (err) => {
        console.log("Error while getting the projec : ", err);
      }
    );
  }

  addNewField() {
    let newField = {
      isRemoved: false,
      track: "",
    };
    this.projectTracks.splice(this.projectTracks.length - 1, 0, newField);
  }

  hasDuplicatesTracks() {
    let valueArr = this.projectTracks.map(function (item) {
      return item.track;
    });
    let isDuplicate = valueArr.some(function (item, idx) {
      return valueArr.indexOf(item) != idx;
    });

    return isDuplicate;
  }

  updateWorkFlow() {
    if (this.projectTracks.some((track) => track.track == "")) {
      this.projectTracks = this.projectTracksCopy;
      alert("Empty track is not allowed");
      return;
    }

    if (this.hasDuplicatesTracks()) {
      this.projectTracks = this.projectTracksCopy;
      alert("Please make sure all tracks has unique value.");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update the record?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "No, keep it",
    }).then((result: any) => {
      if (result.value) {
        // API call will be  here.
        let workFlowData = {
          workFlowId: this.projectData.workFlow[0]._id,
          tracks: this.projectTracks,
        };
        // console.log("JSON: ", JSON.stringify(this.projectTracks));

        this.projectService.updateProjectWorkFlow(workFlowData).subscribe(
          (workFlowResponse) => {
            Swal.fire({
              type: "success",
              title: "Tracks Updated Successfully!",
              showConfirmButton: false,
              timer: 3000,
            });
          },
          (err) => {
            Swal.fire({
              type: "warning",
              title: "Something went wrong, please try again!",
              showConfirmButton: false,
              timer: 3000,
            });
          }
        );
      }
    });
  }

  deleteTrack(trackName, index) {
    console.log("track Name : ", trackName, index);
    if (!this.taskList.some((task) => task.status == trackName)) {
      this.projectTracks.splice(index, 1);
    } else {
      alert("There is a task in this track! Please move that task/tasks");
    }
  }

  rearrengeTracks(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.projectTracks,
      event.previousIndex,
      event.currentIndex
    );
  }
}
