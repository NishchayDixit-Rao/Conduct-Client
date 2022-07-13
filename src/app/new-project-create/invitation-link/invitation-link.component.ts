import { Component, OnInit, Inject, SimpleChanges } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ProjectService } from "../../services/project.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-invitation-link",
  templateUrl: "./invitation-link.component.html",
  styleUrls: [
    "./invitation-link.component.css",
    "../../create-project/create-project.component.css",
  ],
})
export class InvitationLinkComponent implements OnInit {
  userEmail: FormGroup;
  workCircleUser: FormGroup;
  projectList: any = [];
  selectedProject;
  selectedUserRole;
  loading = false;
  userRoles: string[] = ["Manager", "Team Member"];
  constructor(
    public _projectService: ProjectService,
    public dialogRef: MatDialogRef<InvitationLinkComponent>,
    @Inject(MAT_DIALOG_DATA) public userRole: any
  ) {
    this.userEmail = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("changes :: ", changes);
  }

  ngOnInit() {
    /**
     * User comes from the work-circle component.
     */
    if (!this.userRole.length) {
      console.log("user from Workcircle component");
      this.workCircleUser = new FormGroup({
        email: new FormControl("", [Validators.required, Validators.email]),
        userRole: new FormControl("", [Validators.required]),
      });
      this.getProjetsList();
    }
  }
  selectUserRole(userRole) {
    console.log("setUserRole called : ", userRole.target.defaultValue);
    this.selectedUserRole = userRole.target.defaultValue;
  }

  getProjetsList() {
    this.loading = true;
    this._projectService.getProjects().subscribe(
      (res: any) => {
        this.loading = false;
        res.data.projects.forEach((singleProject) => {
          this.projectList.push(singleProject);
        });
      },
      (err) => {
        console.log("err in getting project list : ", err);
        Swal.fire("Oops...", "Something went wrong!", "error");
        this.loading = false;
      }
    );
  }

  onClearProject() {
    console.log("onClearProject called");
    this.selectedProject = undefined;
  }

  projectSelected(event) {
    console.log("selectd project before : ", this.selectedProject);
    console.log("project event : ", event);
    this.selectedProject = event;
  }

  closeModel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.selectedProject) {
      this.loading = true;
      let isEmailUnique = true;
      let userEmail = this.workCircleUser.controls.email.value;
      /**
       * Checking if user is already there in the work-circle
       */
      this.userRole.workCircle.forEach((dev) => {
        if (dev.email == userEmail) {
          console.log("email is already there");
          Swal.fire(
            "Oops...",
            "This user is already in your Work Circle",
            "error"
          );
          this.loading = false;
          isEmailUnique = false;
          this.workCircleUser.reset();
        }
      });

      if (isEmailUnique) {
        let invitationObj = [
          {
            userRole: this.workCircleUser.controls.userRole.value,
            email: this.workCircleUser.controls.email.value,
          },
        ];
        console.log("invitationObj : ", invitationObj);
        const data = new FormData();
        data.append("title", this.selectedProject.title);
        data.append("description", this.selectedProject.description);
        data.append("deadline", this.selectedProject.deadline);
        data.append("technology", this.selectedProject.technology);
        data.append("inviteMembers", JSON.stringify(invitationObj));

        this._projectService
          .updateProject(this.selectedProject._id, data)
          .subscribe(
            (response: any) => {
              console.log("what is in response of edit project", response);
              // this.ngSelectComponent.handleClearClick();
              this.loading = false;
              Swal.fire({
                type: "success",
                title: "Invitation send successfully",
                showConfirmButton: false,
                timer: 3000,
              });
              this.dialogRef.close({});
            },
            (error) => {
              Swal.fire("Oops...", "Something went wrong!", "error");
              this.loading = false;
              this.dialogRef.close({});
            }
          );
      }
    } else {
      console.log("Form group value in modal : ", this.userEmail.value);
      this.dialogRef.close(this.userEmail.value);
    }
  }
}
