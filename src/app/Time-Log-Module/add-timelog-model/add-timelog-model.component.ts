import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validator, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectService } from '../../services/project.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { SearchTaskPipe } from '../../search-task.pipe';
@Component({
  selector: 'app-add-timelog-model',
  templateUrl: './add-timelog-model.component.html',
  styleUrls: ['./add-timelog-model.component.css']
})
export class AddTimelogModelComponent implements OnInit {

  displayList = []
  displayListCopy = []
  searchList = []
  Name = 'Task Date';
  addTimeLog: FormGroup;
  dateSelected
  timeSelected
  totalHours = []
  totalMinutes = []
  fromHour
  fromMinute
  fromFormate
  toHour
  toMinute
  toFormate
  currentUser
  projectId
  editTask
  disableDate
  timeValidation = []
  displayTitle
  selected
  selected0
  selected1
  selected2
  selected3
  selected4
  selected5
  isIndex
  displayHour = false
  displayMinute = false
  displayFormate = false
  displayToHour = false
  displayToMinute = false
  displayToFormate = false
  selectedToFormate
  isDisable = false
  minDate
  timerDisplay = true
  errorMessage
  loading = false
  constructor(
    public dialogRef: MatDialogRef<AddTimelogModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public projectService: ProjectService,
    public searchTextFilter: SearchTaskPipe,
  ) {
    // this.dialogRef.disableClose = true;


    this.addTimeLog = new FormGroup({
      taskId: new FormControl('', [Validators.required]),
      timeDate: new FormControl(''),
      fromTime: new FormControl('', [Validators.required]),
      endTime: new FormControl(''),
      workedHours: new FormControl(''),
      description: new FormControl('')
    })
  }

  ngOnInit() {
    
    this.timeValidation = this.data.timeValidation
    this.checkActiveTaskOrNot(this.timeValidation)
    this.minDate = this.data.projectDate
    if (this.data.taskList && this.data.taskList.length) {
      this.displayList = this.data.taskList
      this.isIndex = 1
    } else {
      this.isIndex = 0
      this.errorMessage = "Sorry, You have no task"
    }
    if (this.data && this.data.addTime == true) {
      
      let taskId = localStorage.getItem('currentTask')
      
      if (taskId != null) {
        this.isIndex = 0
        this.errorMessage = "Please stop the previous time log!"
      }
    }

    if (this.data && this.data.noTimer == false) {
      
      this.timerDisplay = false
    }
    this.displayListCopy = this.data.taskList
    this.searchList = this.data.taskList
    this.currentUser = this.data.user
    this.projectId = this.data.projectId
    this.displayTitle = 'Add TimeLog'
    this.displayHour = true
    if (this.data && this.data.selectedDate) {
      this.dateSelected = this.data.selectedDate
      this.addTimeLog.patchValue({
        timeDate: this.dateSelected
      });
      this.addTimeLog.get('timeDate').updateValueAndValidity();
    }
    if (this.data && this.data.selectedTime) {
      let tempDate = this.data.selectedTime.split(':')
      
      this.fromHour = tempDate[0]
      this.fromMinute = tempDate[1]
      this.fromFormate = tempDate[2]

      let startTime = this.fromHour + ":" + this.fromMinute + " " + this.fromFormate
      

      this.addTimeLog.patchValue({
        fromTime: startTime
      });
      this.addTimeLog.get('fromTime').updateValueAndValidity();
      this.displayMinute = true
      this.displayFormate = true
      this.displayToHour = true
    }

    if (this.data && this.data.edit == true) {
      
      this.displayTitle = 'Edit TimeLog'
      this.editTask = this.data.task
      this.dateSelected = this.editTask.timeDate
      this.addTimeLog.patchValue({
        timeDate: this.dateSelected
      });
      this.addTimeLog.get('timeDate').updateValueAndValidity();
      this.displayMinute = true
      this.displayFormate = true
      this.displayToHour = true
      this.displayToFormate = true
      this.displayToMinute = true

      // this.addTimeLog.controls['taskId'].disable()
      // this.disableDate = true

      // this.addTimeLog.controls['timeDate'].disable()
      let tempDate = this.editTask.fromTime.split(':')
      // 
      this.fromHour = tempDate[0]
      let tempFormate = tempDate[1].split(' ')
      this.fromMinute = tempFormate[0]
      this.fromFormate = tempFormate[1]

      let startTime = this.fromHour + ":" + this.fromMinute + " " + this.fromFormate
      

      this.addTimeLog.patchValue({
        fromTime: startTime
      });
      this.addTimeLog.get('fromTime').updateValueAndValidity();
      

      if (this.editTask.endTime) {

        let tempEndDate = this.editTask.endTime.split(':')
        this.toHour = tempEndDate[0]
        let tempEndFormate = tempEndDate[1].split(' ')
        this.toMinute = tempEndFormate[0]
        this.toFormate = tempEndFormate[1]

        let finalEndTime = this.toHour + ":" + this.toMinute + " " + this.toFormate

        this.addTimeLog.patchValue({
          endTime: finalEndTime
        });
        this.addTimeLog.get('endTime').updateValueAndValidity();
      }


    }

    this.getTotalHours(1, 13)
    this.getTotalMinutes(0, 60)
    // let hours = _.range(1, 13);
    // 
    // this.totalHours = hours
    // let minutes = _.range(0, 60)
    // 
    // this.totalMinutes = minutes
  }

  getTotalHours(from, to) {
    this.totalHours = _.range(from, to)
  }

  getTotalMinutes(from, to) {
    this.totalMinutes = _.range(from, to)
  }

  checkActiveTaskOrNot(data) {

  }



  onHour(event) {
    
    this.displayMinute = true

  }

  onMinute(event) {
    
    this.displayFormate = true
  }
  onFormate(event) {
    
    this.displayToHour = true
    let startTime = this.fromHour + ":" + this.fromMinute + " " + this.fromFormate
    
    // let finalStart
    this.addTimeLog.patchValue({
      fromTime: startTime
    });
    this.addTimeLog.get('fromTime').updateValueAndValidity();
  }



  convertDate(date, newTime) {
    var time = newTime;
    var startTime = new Date(date);
    var parts = time.match(/(\d+):(\d+) (AM|PM)/);
    if (parts) {
      var hours = parseInt(parts[1]),
        minutes = parseInt(parts[2]),
        tt = parts[3];
      if (tt === 'PM' && hours < 12) hours += 12;
      startTime.setHours(hours, minutes, 0, 0);
    }
    // alert(startTime);
    // 
    return startTime
  }


  onToHour(event) {
    // 
    this.displayToMinute = true
    

  }

  onToMinute(event) {
    this.displayToFormate = true
    this.selectedToFormate = ''
    // 

    // 


    if (this.fromFormate == 'AM') {
      
      

      if (parseInt(this.fromHour) > parseInt(this.toHour)) {
        this.selectedToFormate = this.fromFormate
      }
      else {

      }


    }
    else if (this.fromFormate == 'PM') {
      
      
      if (parseInt(this.fromHour) > parseInt(this.toHour)) {
        // this.selectedToFormate = "PM"
        // this.selectedToFormate = "AM"
        this.displayToFormate = true
        this.selectedToFormate = "AM"
      } else {
        this.selectedToFormate = "AM"
      }
    }


  }

  onToFormate(event) {

    let finalEndTime = this.toHour + ":" + this.toMinute + " " + this.toFormate

    this.addTimeLog.patchValue({
      endTime: finalEndTime
    });
    this.addTimeLog.get('fromTime').updateValueAndValidity();
  }


  onKey(searchText) {
    

    var dataToBeFiltered = this.searchList;
    var task = this.searchTextFilter.transform(dataToBeFiltered, searchText);
    this.displayList = []
    if (task.length > 0) {
      this.displayList = task
    } else {
      

    }

  }


  getDate(event) {
    

    let selectedDueDate = moment(event).format('YYYY-MM-DD')
    this.addTimeLog.patchValue({
      timeDate: selectedDueDate
    });
    this.addTimeLog.get('timeDate').updateValueAndValidity();
  }

  saveTimeLog() {

    this.isDisable = true
    
    this.loading = true

    if (!this.addTimeLog.controls.endTime.value && this.timeSelected == undefined) {
      if (this.fromMinute >= 55) {
        // 
        let endHour = Number(this.fromHour) + Number(1)
        // 
        if (endHour >= 13) {
          // 
          this.toHour = Number(endHour) - Number(12)
        } else {
          this.toHour = endHour
        }
        let endMinute = Number(this.fromMinute) + Number(5)
        // 
        if (endMinute >= 60) {
          // 
          this.toMinute = Number(endMinute) - Number(60)
        } else {
          this.toMinute = endMinute
        }
        if (this.fromHour == 11) {
          // 
          if (this.fromFormate == 'AM') {
            this.toFormate = 'PM'
          } else {
            this.toFormate = 'AM'
          }
        }
        let finalEndTime = this.toHour + ":" + this.toMinute + " " + this.toFormate
        this.addTimeLog.patchValue({
          endTime: finalEndTime
        });
        this.addTimeLog.get('fromTime').updateValueAndValidity();
      } else {
        // 
        this.toHour = this.fromHour
        this.toMinute = Number(this.fromMinute) + Number(5)
        this.toFormate = this.fromFormate
        let finalEndTime = this.toHour + ":" + this.toMinute + " " + this.toFormate
        this.addTimeLog.patchValue({
          endTime: finalEndTime
        });
        this.addTimeLog.get('fromTime').updateValueAndValidity();
      }
    } else {
      

    }
    // 
    
    this.projectService.addTimeLog(this.addTimeLog.value, this.currentUser, this.projectId).subscribe((response: any) => {
      
      if (response.data.endTime == '') {
        
        localStorage.setItem('currentTask', response.data._id)
      }
      this.isDisable = false
      this.loading = false
      this.dialogRef.close(response.data)
    }, error => {
      this.isDisable = false
      
      this.loading = false
    })

  }

  editTimeLog() {
    // );
    this.isDisable = true
    this.loading = true
    let startTime = this.fromHour + ":" + this.fromMinute + " " + this.fromFormate
    

    this.addTimeLog.patchValue({
      fromTime: startTime
    });
    this.addTimeLog.get('fromTime').updateValueAndValidity();

    let finalEndTime = this.toHour + ":" + this.toMinute + " " + this.toFormate

    this.addTimeLog.patchValue({
      endTime: finalEndTime
    });
    this.addTimeLog.get('endTime').updateValueAndValidity();
    
    let obj = {
      currentUser: this.currentUser._id,
      projectId: this.projectId,
      timeLogId: this.editTask._id
    }
    this.projectService.editTimeLog(this.addTimeLog.value, obj).subscribe((response: any) => {
      
      localStorage.removeItem('currentTask')
      this.isDisable = false
      this.loading = false
      this.dialogRef.close(response)
    }, error => {
      
      this.isDisable = false
      this.loading = false
    })

  }


  closeModel() {
    this.dialogRef.close();
  }


  selectedtTime(event) {


    if (this.timeSelected == 'startTime') {
      
      let startTime = moment(new Date()).format('h m A').split(' ')
      this.fromHour = startTime[0]
      this.fromMinute = startTime[1]
      this.fromFormate = startTime[2]
      this.displayHour = false
      this.displayMinute = false
      this.displayFormate = false
      this.displayToHour = false
      
      let finalStartTime = this.fromHour + ":" + this.fromMinute + " " + this.fromFormate
      

      this.addTimeLog.patchValue({
        fromTime: finalStartTime
      });
      this.addTimeLog.get('fromTime').updateValueAndValidity();





    }
    if (this.timeSelected == 'endTime') {
      let endTime = moment(new Date()).format('h m A').split(' ')
      this.toHour = endTime[0]
      this.toMinute = endTime[1]
      this.toFormate = endTime[2]
      this.displayHour = false
      this.displayMinute = false
      this.displayFormate = false
      this.displayToHour = false
      this.displayToMinute = false
      this.displayToFormate = false


      let finalEndTime = this.toHour + ":" + this.toMinute + " " + this.toFormate
      // 

      this.addTimeLog.patchValue({
        endTime: finalEndTime
      });
      this.addTimeLog.get('endTime').updateValueAndValidity();
    }
    if (this.timeSelected == 'completedTime') {
      

      let endTime = moment(new Date()).format('h m A').split(' ')
      this.toHour = endTime[0]
      this.toMinute = endTime[1]
      this.toFormate = endTime[2]
      this.displayHour = true
      this.displayMinute = true
      this.displayFormate = true
      this.displayToHour = true
      this.displayToMinute = true
      this.displayToFormate = true
    }


  }


}
