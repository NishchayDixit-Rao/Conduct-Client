import { Component, EventEmitter, Inject, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig,
} from "@angular/material/dialog";

import { Router } from "@angular/router";
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { ChildComponent } from 'src/app/child/child.component';
import { ProjectService } from 'src/app/services/project.service';

import Swal from "sweetalert2";
import { AddTaskComponent } from '../add-task/add-task.component';


@Component({
  selector: 'app-move-copy-task',
  templateUrl: './move-copy-task.component.html',
  styleUrls: ['./move-copy-task.component.css']
})
export class MoveCopyTaskComponent implements OnInit {

  @Output() taskMove: EventEmitter<any> = new EventEmitter();

  @ViewChild('matSelect') matSelect: MatSelect;
  // taskAdded(data) :AddTaskComponent;
  dialogRef: MatDialogRef<any>;
  data;
  disableActions = false;
  hasProjects;
  displayTitle;
  displayData = true;
  currentProject;
  projects = [];
  isMoveTaskClicked;
  addTask1;

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
    this.isMoveTaskClicked = this.displayTitle === "Move Task";
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
    //

    // this.taskMove.emit(
    //   {
    //     id: 1,
    //     message: "Task Moved Sucessfully"
    //   });

    this.closeModel();
  }
  copyTask() {
    // this.taskMove.emit(
    //   {
    //     id: 1,
    //     message: "Task Copied Sucessfully"
    //   });
    this.addTask1 = new FormGroup({
      title: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      assignTo: new FormControl(""),
      taskPriority: new FormControl("", Validators.required),
      dueDate: new FormControl(""),
      estimatedTime: new FormControl("", [Validators.required]),
      status: new FormControl(
        { value: "To Do", disabled: true },
        Validators.required
      ),
      taskType: new FormControl(""),
    });
    console.log("Value ::", this.matSelect.value);
    console.log("this.data.task ::", this.data.task);
    let newTask = this.data.task;
    newTask.projectId = this.matSelect.value;
    
    // newTask._id = undefined;
    console.log("newTask ::", newTask);
    // taskAdded(newTask);
    // this.projects;
    // let data = new FormData();
    // _.forOwn(newTask, function (value, key) {
    //   data.append(key, value);
    // // });
    // let data = JSON.stringify(newTask);
    // console.log("JSON:", data);

    this.addTask(this.matSelect.value, newTask);
    this.closeModel();
  }

  addTask(projectId, task) {
    console.log("Task ===== ",task);
    // let data = JSON.stringify(task);
    let data = new FormData();
    _.forOwn(task, function (value, key) {
      data.append(key, value);
    });
    data.append("user", "");
    // let data = task;
    // console.log("JSON:", JSON.stringify(data, null, 4));
    let flag = true;
    this.projectService.getProjectById(projectId).subscribe(
      (response: any) => {
        let pro = response.data;
        console.log("Pro :: ", pro);
        let arr = [];
        pro.workFlow[0].tracks.forEach(track => {
          console.log(track);
          if (track.isTaskAllowLimit)
            arr.push(track.taskAllowValue);
          else
            arr.push(Number.MAX_SAFE_INTEGER);
        });
        this.projectService.getAllTasks().subscribe(
          (response: any) => {
            let tasks = response.data.taskList;

            let i = 0;
            tasks.forEach(track => {
              if (track.projectId === projectId) {
                if (track.status === "To Do") {
                  i++;
                }
              }
            });
            if (i >= arr[0]) {
              // Swal.fire("Oops...", `Cannot add more than ${i} tasks`, "error");
              flag = false;
            }
            console.log("Array:", arr);
            if (flag) {
              console.log("copy Data ::", data);
              for (var key in data) {
                console.log(key, data[key]);
              }
              // this.projectService.copyTask(JSON.stringify(data, null, 4)).subscribe(
              this.projectService.copyTask(data).subscribe(
                (response: any) => {
                  if (response) {
                    console.log("addTask ::", data);
                    if (response.data.taskData.assignTo) {
                      let name = response.data.taskData.assignTo.name;
                      if (name) {
                        Swal.fire({
                          type: "success",
                          title: "Task Copied Created For",
                          text: name,
                          showConfirmButton: false,
                          timer: 2000,
                        });
                      }
                    } else {
                      Swal.fire({
                        type: "success",
                        title: "Task Copied Successfully",
                        // text: name,
                        showConfirmButton: false,
                        timer: 2000,
                      });
                    }

                  }
                });
            }
          });
      });
  }

  createProject() {
    this.router.navigate(['/add-project']);
    this.closeModel();
  }

  closeModel() {

    this.dialogRef.close();
  }
}
