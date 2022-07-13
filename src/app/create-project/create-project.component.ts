import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { ProjectService } from "../services/project.service";
import { AlertService } from "../services/alert.service";
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
} from "@angular/forms";
import { config } from "../config";
declare var $: any;
import * as _ from "lodash";
import Swal from "sweetalert2";
import { DatePipe } from "@angular/common";

const trimValidator: ValidatorFn = (control: FormControl) => {
  if (this.addForm.controls.taskAlias.value.startsWith(" ")) {
    return {
      trimError: { value: "control has leading whitespace" },
    };
  }
  if (this.addForm.controls.taskAlias.endsWith(" ")) {
    return {
      trimError: { value: "control has trailing whitespace" },
    };
  }

  return null;
};

@Component({
  selector: "app-create-project",
  templateUrl: "./create-project.component.html",
  styleUrls: ["./create-project.component.css"],
})
export class CreateProjectComponent implements OnInit {
  @Output() fileNotSelect = new EventEmitter();
  files: FileList;
  addForm: FormGroup;
  url = "";
  developers: any;
  config = {
    displayKey: "name", //if objects array passed which key to be displayed defaults to description
    search: true,
  };
  baseUrl = config.baseMediaUrl;
  objectsArray: any = [];
  setDate: any;
  submitted = false;
  isDisable: boolean = false;
  isAvatar: boolean = false;
  isSelectFile: boolean = false;
  isBanned: false;
  currentUser = JSON.parse(localStorage.getItem("currentUser"));

  constructor(
    public router: Router,
    public _projectservice: ProjectService,
    public _projectService: ProjectService,
    public _alertService: AlertService,
    private change: ChangeDetectorRef,
    private dateFilter: DatePipe
  ) {
    // $('.datepicker').pickadate();

    this.addForm = new FormGroup({
      title: new FormControl("", [
        Validators.required,
        Validators.maxLength(60),
      ]),
      avatar: new FormControl(""),
      description: new FormControl("", [
        Validators.required,
        Validators.maxLength(200),
      ]),
      deadline: new FormControl(""),
      taskAlias: new FormControl("", [
        Validators.required,
        Validators.maxLength(8),
      ]),
      // allDeveloper: new FormControl(''),
    });
  }

  ngOnInit() {
    // this.getAllDevelopers();
    $(".datepicker").pickadate({
      min: new Date(),
      onSet: function (context) {
        
        setDate(context);
      },
    });
    var setDate = (context) => {
      
      if (context && context.select)
        this.addForm.controls.deadline.setValue(
          this.dateFilter.transform(new Date(context.select), "yyyy-MM-dd")
        );
    };
  }

  get f() {
    return this.addForm.controls;
  }

  addProject(addForm) {
    
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    this.isDisable = true;
    

    var data = new FormData();
    _.forOwn(addForm, function (value, key) {
      data.append(key, value);
    });
    if (this.currentUser.userRole == "Manager") {
      const pmId = JSON.parse(localStorage.getItem("currentUser"))._id;
      const projectManager: any = {
        _id: pmId,
      };
      data.append("projectManager", JSON.stringify(projectManager));
    }
    if (this.files && this.files.length > 0) {
      for (var i = 0; i < this.files.length; i++) {
        data.append("uploadfile", this.files[i]);
      }
    }
    
    this._projectService.addProject(data).subscribe(
      (res: any) => {
        
        $("#projects,#item_list,#visit_team_members").removeClass("disabled");

        Swal.fire({
          type: "success",
          title: "Project Created Successfully",
          showConfirmButton: false,
          timer: 2000,
        });
        this.addForm.reset();
        this.url = "";
        this.router.navigate(["/view-projects"]);
        this.isDisable = false;
      },
      (err) => {
        
        Swal.fire({
          type: "error",
          title: err.message,
          showConfirmButton: false,
          timer: 2000,
        });
        this.isDisable = false;
      }
    );
  }

  timePicked() {
    
    
    this.addForm.controls.deadline.setValue($(".datepicker").val());
    
    // this.addForm.valid
  }

  addIcon(value) {
    this.isSelectFile = true;
    this._projectService.fileNotSelect(this.isSelectFile);
    
    this.addForm.value["avatar"] = value;
    
    this.url = this.baseUrl + this.addForm.value["avatar"];
    $("#basicExampleModal").modal("hide");
  }

  onSelectFile(event) {
    this.isAvatar = true;
    
    this.files = event;
    if (event == false) {
      this.isAvatar = false;
    }
  }

  getAllDevelopers() {
    this._projectService.getAllDevelopers().subscribe(
      (res) => {
        this.developers = res;
        this.developers.sort(function (a, b) {
          if (a.name && b.name) {
            var nameA = a.name.toLowerCase(),
              nameB = b.name.toLowerCase();
            if (nameA < nameB)
              //sort string ascending
              return -1;
            if (nameA > nameB) return 1;
            return 0; //default return value (no sorting)
          }
        });
        
      },
      (err) => {
        
        this._alertService.error(err);
      }
    );
  }

  removeAvatar() {
    this.isSelectFile = false;
    this._projectService.fileNotSelect(this.isSelectFile);
    this.url = "";
    if (this.files && this.files.length) this.files = null;
  }
}
