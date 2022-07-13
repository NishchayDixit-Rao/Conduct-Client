import { Component, OnInit, HostListener, EventEmitter } from "@angular/core";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { ProjectService } from "../services/project.service";
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import * as DecoupledEditor from "@ckeditor/ckeditor5-build-classic";
import { ChangeEvent } from "@ckeditor/ckeditor5-angular/ckeditor.component";
import { SearchTaskPipe } from "../search-task.pipe";
import { ChildComponent } from "../child/child.component";
import { config } from "../config";
declare var $: any;
import * as _ from "lodash";
import { Chart } from "chart.js";
import Swal from "sweetalert2";
import * as moment from "moment";
import { ChangeDetectorRef } from "@angular/core";

@Component({
  selector: "app-backlog",
  templateUrl: "./backlog.component.html",
  styleUrls: ["./backlog.component.css"],
})
export class BacklogComponent implements OnInit {
  projectOne;
  sprintTrack;
  project;
  sprints: any;
  projectId;
  addForm: FormGroup;
  editSprintForm: FormGroup;
  singlesprint: any;
  startsprintId;
  sprintData = {
    startDate: "",
    endDate: "",
  };
  Active;
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  tracks;
  allSprints = [];
  totalSDuration: number = 0;
  pdealine;
  prdead;
  pstart;
  pduration: number = 0;
  remainingLimit: number = 0;
  pDuration;
  currentdate = moment().format("YYYY-MM-DD");
  activeSprint;
  projectDealine;
  submitted: boolean = false;
  newsprint;
  addSprintres;
  isDisable: boolean = false;
  constructor(
    public _projectService: ProjectService,
    private route: ActivatedRoute,
    private change: ChangeDetectorRef
  ) {
    this.route.params.subscribe((param) => {
      this.projectId = param.id;
    });
    this.addForm = new FormGroup({
      title: new FormControl("", Validators.required),
      goal: new FormControl("", Validators.required),
      startDate: new FormControl("", Validators.required),
      endDate: new FormControl("", Validators.required),
    });

    this.getProject(this.projectId);
    this.createEditSprintForm();
    this.getTaskbyProject(this.projectId);
  }

  ngOnInit() {
    this.getSprint(this.projectId);
    this.projectDealine = JSON.parse(localStorage.getItem("projectdeadline"));
    
    this.change.detectChanges();

    var from_input = $("#addStartDate").pickadate({
        min: new Date(),
      }),
      from_picker = from_input.pickadate("picker");

    var to_input = $("#addEndDate").pickadate({
        min: new Date(),
      }),
      to_picker = to_input.pickadate("picker");

    // var from_input_edit = $('#editstartDate').pickadate(),
    // from_picker = from_input_edit.pickadate('picker')

    // var to_input_edit = $('#editendDate').pickadate(),
    // to_picker = to_input_edit.pickadate('picker')

    if (from_picker.get("value")) {
      
      to_picker.set("min", from_picker.get("select"));
    }
    if (to_picker.get("value")) {
      from_picker.set("max", to_picker.get("select"));
    }
    from_picker.on("set", function (event) {
      if (event.select) {
        
        local();
        // setStart;
        to_picker.set("min", from_picker.get("select"));
      } else if ("clear" in event) {
        to_picker.set("min", false);
      }
    });
    to_picker.on("set", function (event) {
      if (event.select) {
        from_picker.set("max", to_picker.get("select")) + 1;
        local();
      } else if ("clear" in event) {
        from_picker.set("max", false);
      }
    });
    var local = () => {
      this.setStartFunc();
    };
    // Date Picker Valadation End Here
  }
  setStartFunc() {
    
    if ($("#addStartDate").val())
      this.addForm.controls.startDate.setValue($("#addStartDate").val());
    if ($("#addEndDate").val())
      this.addForm.controls.endDate.setValue($("#addEndDate").val());
  }
  refresh(): void {
    window.location.reload();
  }

  getEmptyTracks() {
    
    if (
      this.currentUser.userRole == "Manager" ||
      this.currentUser.userRole == "admin"
    ) {
      this.tracks = [
        {
          title: "Todo",
          id: "to do",
          class: "primary",
          tasks: [],
        },
        {
          title: "In Progress",
          id: "in progress",
          class: "info",
          tasks: [],
        },
        {
          title: "Testing",
          id: "testing",
          class: "warning",
          tasks: [],
        },
        {
          title: "Done",
          id: "complete",
          class: "success",
          tasks: [],
        },
      ];
      
    } else {
      this.tracks = [
        {
          title: "Todo",
          id: "to do",
          class: "primary",
          tasks: [],
        },
        {
          title: "In Progress",
          id: "in progress",
          class: "info",
          tasks: [],
        },
        {
          title: "Testing",
          id: "testing",
          class: "warning",
          tasks: [],
        },
      ];
      
    }
  }

  getProject(id) {
    this._projectService.getProjectById(id).subscribe(
      (res: any) => {
        
        this.projectOne = res;
        var pdealine = moment(this.projectOne.deadline);
        var pstart = moment(this.projectOne.createdAt);
        this.prdead = moment(this.projectOne.deadline).format("YYYY,M,DD");
        
        this.pduration = pdealine.diff(pstart, "days");
        
        localStorage.setItem("projectduration", JSON.stringify(this.pduration));
        localStorage.setItem("projectdeadline", JSON.stringify(this.prdead));
        var startpicker = $("#addStartDate").pickadate("picker");
        startpicker.set("max", new Date(this.prdead));
        var endpicker = $("#addEndDate").pickadate("picker");
        endpicker.set("max", new Date(this.prdead));

        endpicker.set("min", new Date(startpicker));
      },
      (err: any) => {
        
      }
    );
  }
  get f() {
    return this.addForm.controls;
  }

  addSprint(addForm) {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    this.isDisable = true;
    
    addForm.startDate = $("#addStartDate").val();
    // addForm.startDate = $('#startDate').val();
    
    addForm.endDate = $("#addEndDate").val();
    // addForm.duration = this.durationOfDate(addForm.startDate,addForm.endDate);
    addForm.projectId = this.projectId;
    

    this._projectService.addSprint(addForm).subscribe(
      (res: any) => {
        
        $("#addStartDate,#addEndDate").val("");
        // this.addForm.reset();
        this.addSprintres = res;
        $("#addsprint").modal("hide");
        Swal.fire({
          type: "success",
          title: "Sprint Created Successfully",
          showConfirmButton: false,
          timer: 2000,
        });
        this.addForm.reset();
        this.getSprint(this.projectId);
        this.isDisable = false;
      },
      (err: any) => {
        
        Swal.fire("Oops...", "Something went wrong!", "error");
        this.isDisable = false;
      }
    );
  }

  getSprint(projectId) {
    
    this._projectService.getSprint(this.projectId).subscribe(
      (res: any) => {
        
        
        this.sprints = res;
        _.forEach(this.sprints, (sprint) => {
          
          
          
          this.totalSDuration = this.totalSDuration + sprint.duration;
          
          if (sprint.status == "Active") {
            this.Active = true;
            this.activeSprint = sprint;
            var activeSprintEnd = moment(this.activeSprint.endDate).format(
              "YYYY,M,DD"
            );
            
            var startpicker = $("#addStartDate").pickadate("picker");
            
            startpicker.set("min", new Date(activeSprintEnd));
          }
        });
        
        this.pDuration = JSON.parse(localStorage.getItem("projectduration"));
        
        
        
        this.remainingLimit = this.pDuration - this.totalSDuration;
        
      },
      (err: any) => {
        
      }
    );
  }

  createEditSprintForm() {
    this.editSprintForm = new FormGroup({
      title: new FormControl("", Validators.required),
      goal: new FormControl("", Validators.required),
      startDate: new FormControl("", Validators.required),
      endDate: new FormControl("", Validators.required),
    });
  }

  updateSprint(sprint) {
    this.isDisable = true;
    
    sprint.startDate = moment(sprint.startDate).format("YYYY-MM-DD");
    
    
    sprint.duration = this.durationOfDate(sprint.startDate, sprint.endDate);
    
    

    if (sprint.duration > this.remainingLimit) {
      Swal.fire("Oops...", "Sprint Duration Over ProjectDueDate!", "error");
      this.isDisable = false;
    } else {
      this._projectService.updateSprint(sprint).subscribe(
        (res: any) => {
          $("#editmodel").modal("hide");
          Swal.fire({
            type: "success",
            title: "Sprint Updated Successfully",
            showConfirmButton: false,
            timer: 2000,
          });
          $("#editmodel").modal("hide");
          this.getSprint(this.projectId);
          this.isDisable = false;
          // this.editSprintForm.reset();
        },
        (err) => {
          
          Swal.fire("Oops...", "Something went wrong!", "error");
          this.isDisable = false;
        }
      );
    }
  }

  deleteSprint(sprintid) {
    
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-default",
        cancelButton: "btn btn-delete",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          this._projectService.deleteSprint(sprintid).subscribe(
            (res: any) => {
              Swal.fire("Deleted!", "Your Sprint has been deleted.", "success");
              this.getSprint(this.projectId);
            },
            (err) => {
              
              Swal.fire("Oops...", "Something went wrong!", "error");
            }
          );
        }
      });
  }

  sprintById(sprintid) {
    this._projectService.sprintById(sprintid).subscribe(
      (res: any) => {
        
        this.singlesprint = res[0];
        
      },
      (err) => {
        
      }
    );
  }

  startSprint(sprint) {
    this.isDisable = true;
    
    sprint.startDate = moment($("#startDate").val()).format("YYYY-MM-DD");
    sprint.endDate = moment($("#endDate").val()).format("YYYY-MM-DD");
    
    sprint.endDate = moment($("#endDate").val()).format("YYYY-MM-DD");
    
    sprint.duration = this.durationOfDate(sprint.startDate, sprint.endDate);
    
 
    if (sprint.startDate == this.currentdate) {
      
      
      if (sprint.duration > this.pDuration) {
        
        
        
        this.remainingLimit = this.pDuration - this.totalSDuration;
        
 
        Swal.fire("Oops...", "Sprint Duration Over ProjectDueDate!", "error");
        this.isDisable = false;
      } else {
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: "btn btn-default",
            cancelButton: "btn btn-delete",
          },
          buttonsStyling: false,
        });
        swalWithBootstrapButtons
          .fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: false,
            confirmButtonText: "Start",
            reverseButtons: true,
          })
          .then((result) => {
            
            setTimeout(() => {
              if (result.value) {
                this._projectService.startSprint(sprint).subscribe(
                  (res: any) => {
                    Swal.fire(
                      "Started!",
                      "Your Sprint has been Started.",
                      "success"
                    );
                    $("#startmodel").modal("hide");
                    this.addForm.reset();
                    this.getSprint(this.projectId);
                    // window.location.reload();
                    this.isDisable = false;
                  },
                  (err) => {
                    
                    Swal.fire("Oops...", "Something went wrong!", "error");
                    this.isDisable = false;
                  }
                );
              }
            }, 1000);
          });
      }
    } else {
      Swal.fire("Oops...", "Start Date Must be CurrentDate!", "error");
    }
  }

  getTaskbyProject(projectId) {
    this._projectService.getTaskById(projectId).subscribe(
      (res: any) => {
        
        this.getEmptyTracks();
        this.project = res;
        
      },
      (err) => {
        
      }
    );
  }

  getTaskCount(sprintId, status) {
    return _.filter(this.project, function (o) {
      if (o.sprint._id == sprintId && o.status == status) {
        return o;
      }
    }).length;
  }

  durationOfDate(startDate, endDate) {
    var startLimit = moment(startDate);
    var endLimit = moment(endDate);
    var duration;
    return (duration = endLimit.diff(startLimit, "days"));
  }

  completeSprint(sprintId) {
    
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-default",
        cancelButton: "btn btn-delete",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Complete",
        reverseButtons: true,
      })
      .then((result) => {
        setTimeout(() => {
          if (result.value) {
            this._projectService.completeSprint(sprintId).subscribe(
              (res: any) => {
                Swal.fire(
                  "Complete!",
                  "Your Sprint has been Completed.",
                  "success"
                );
                
                this.Active = false;
                // window.location.reload();
                this.getSprint(this.projectId);
              },
              (err) => {
                
                Swal.fire("Oops...", "Something went wrong!", "error");
              }
            );
          }
        }, 1000);
      });
  }

  editSprintData(data) {
    
    this.newsprint = data;
    
    setTimeout(() => {
      $("#startDate, #editstartDate").pickadate({
        min: new Date(),
        max: new Date(this.prdead),
        format: " mm/dd/yyyy",
        formatSubmit: "mm/dd/yyyy",
        onSet: function (date) {
          var date1 = new Date(date.select).toISOString();
          
          updateDates("startDate", date1);
        },
      });
      $("#endDate, #editendDate").pickadate({
        min: new Date(),
        max: new Date(this.prdead),
        format: " mm/dd/yyyy",
        formatSubmit: "mm/dd/yyyy",
        onSet: function (date) {
          var date1 = new Date(date.select).toISOString();
          
          updateDates("endDate", date1);
        },
      });
    }, 500);

    let updateDates = (key, val) => {
      
      this.newsprint[key] = val;
      // this.sprintData={
      // 	key: val
      // }
      
    };
  }
}
