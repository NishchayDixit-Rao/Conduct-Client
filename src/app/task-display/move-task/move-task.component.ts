import { Component, EventEmitter, Inject, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig,
} from "@angular/material/dialog";
import { MatSelect } from '@angular/material';
import { Router } from "@angular/router";
import { Observable } from 'rxjs';
import { ProjectService } from 'src/app/services/project.service';

import Swal from "sweetalert2";


@Component({
  selector: 'app-move-task',
  templateUrl: './move-task.component.html',
  styleUrls: ['./move-task.component.css']
})
export class MoveTaskComponent implements OnInit {

  @ViewChild('matSelect') matSelect: MatSelect;

  dialogRef: MatDialogRef<any>;
  data;
  disableActions = false;
  hasProjects;
  displayTitle;
  displayData = true;
  currentProject;
  projects = [];

  constructor(

    public dialog: MatDialog,
    public projectService: ProjectService,
    public router: Router,
    private injector: Injector,

  ) {

    this.data = this.injector.get(MAT_DIALOG_DATA);
    this.dialogRef = this.injector.get(MatDialogRef);
    console.log("Data: ", this.data);

  }

  ngOnInit() {
    // if (this.data) {
    //   this.displayTitle = this.data.displayTitle;
    // }

    this.getProjects();
    this.displayTitle = this.data.displayTitle;
    this.currentProject = this.data.currentProject.data;
    if (!this.hasProjects) {
      this.disableActions = true;
    }
  }
  getProjects() {
    this.hasProjects = false;
    this.projectService.getProjects().subscribe(
      (response: any) => {
        console.log("project list resposne : ", response);
        response.data.projects.forEach((project) => {
          if (project._id != this.currentProject._id) {
            this.projects.push(project);
            this.hasProjects = true;
            this.disableActions = false;
          }
        });
      }
    );
  }

  moveTask() {
    this.projectService.getProjects().subscribe(
      (response: any) => {
        console.log("Response::", response);
        console.log("Current_id::", this.currentProject._id);
        response.data.projects.forEach((project) => {
          console.log("response_id:: ", project._id);
          if (project._id === this.currentProject._id) {
            console.log("Current Task:: ", this.data.task);
          }
        });
        console.log("to Project:: ", this.matSelect.value);
      }
    );
  }

  // getToProjectId(event: any) : any {
  //   console.log("event::", event);
  //   console.log("To Project:: ", event.source.value);

  // }

  createProject() {
    this.router.navigate(['/add-project']);
    this.closeModel();
  }

  closeModel() {

    this.dialogRef.close();
  }
}
