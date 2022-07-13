import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validator, Validators } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
@Component({
  selector: 'app-approve-logs-model',
  templateUrl: './approve-logs-model.component.html',
  styleUrls: ['./approve-logs-model.component.css']
})
export class ApproveLogsModelComponent implements OnInit {


  approvedLogs: FormGroup;
  displyLogs
  isDisplay = true
  isDisable = false
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  displayData
  displayTitle
  loading = false
  constructor(

    public dialogRef: MatDialogRef<ApproveLogsModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public projectService: ProjectService,
  ) {

    // this.dialogRef.disableClose = true;
    this.approvedLogs = new FormGroup({
      // taskId: new FormControl('', [Validators.required]),
      // timeDate: new FormControl(''),
      hours: new FormControl('', [Validators.required]),
      minutes: new FormControl('', [Validators.required]),
      // workedHours: new FormControl(''),
      reason: new FormControl('')
    })
  }

  ngOnInit() {
    
    this.displayData = this.data
    if (this.displayData && this.displayData.edit) {
      this.displayTitle = 'Edit Verify Log'
    } else {
      this.displayTitle = 'Add Verify Log'
    }
    // this.getVerifyDetails(this.displyLogs._id)

  }

  // getVerifyDetails(id) {
  //   this.projectService.getVerifyLogs(id).subscribe((response: any) => {
  //     if (response.logs) {
  //       
  //       this.displayData = {
  //         taskTitle: this.displyLogs.taskId.title,
  //         difference: this.displyLogs.difference,
  //         taskDescription: this.displyLogs.taskId.description,
  //         timeDescription: this.displyLogs.description,
  //         hours: response.hours,
  //         minutes: response.minutes,
  //         reason: response.reason
  //       }
  //     } else {
  //       

  //       this.displayData = {
  //         taskTitle: this.displyLogs.taskId.title,
  //         difference: this.displyLogs.difference,
  //         taskDescription: this.displyLogs.taskId.description,
  //         timeDescription: this.displyLogs.description,
  //         // hours: response.hours,
  //         // minutes: response.minutes,
  //         // reason: response.reason
  //       }
  //     }
  //   }, error => {
  //     

  //   })
  // }


  approveLogs() {
    this.isDisable = true
    this.loading = true
    
    let obj = {
      currentUser: this.currentUser._id,
      timeLogId: this.displayData.timeLogId
    }
    this.projectService.verifyLogs(this.approvedLogs.value, obj).subscribe((response) => {
      
      this.dialogRef.close(response);
      this.isDisable = false
      this.loading = false
    }, error => {
      
      this.isDisable = false
      this.loading = false
    })
  }
  closeModel() {

    this.dialogRef.close();
  }
  editApproveLogs() {

    this.isDisable = true
    this.loading = true
    
    let obj = {
      currentUser: this.currentUser._id,
      timeLogId: this.displayData.timeLogId,
      verifyId: this.displayData.verifyId
    }
    this.projectService.editVerifyLogs(this.approvedLogs.value, obj).subscribe((response) => {
      
      this.isDisable = false
      this.loading = false
      this.dialogRef.close(response);
    }, error => {
      
      this.isDisable = false
      this.loading = false
    })
  }
}
