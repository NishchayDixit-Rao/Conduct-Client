import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { SearchTaskPipe } from '../../search-task.pipe';
import { SingleTaskDetailsComponent } from '../../task-display/single-task-details/single-task-details.component';
import { ApproveLogsModelComponent } from '../approve-logs-model/approve-logs-model.component';
import * as _ from 'lodash';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
@Component({
  selector: 'app-total-time-logs',
  templateUrl: './total-time-logs.component.html',
  styleUrls: ['./total-time-logs.component.css']
})
export class TotalTimeLogsComponent implements OnInit {

  projectId
  totalTimeLogs = []
  totalTimeLogsCopy = []
  diffHours = []
  diffMinutes = []
  totalHours
  totalMinutes
  teamMembers = []
  filterReset
  displayFilter = [
    {
      displayName: 'Developer',

    },
    {
      displayName: 'Due Date',
    }
  ]
  displayReset = false
  isDisplay = 0
  noDataFound
  searchText
  searchLogs = []
  loader = false
  selectedUserList = []
  sort: MatSort
  dataSource: MatTableDataSource<any>;
  paginator: MatPaginator;
  pageSizeOptions: number[] = [10, 25, 100];
  sideMenuButton = true
  displayedColumns: string[] = ['date', 'users', 'taskTitle', 'estimated', 'difference', 'from', 'end', 'verifyLogs'];
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  constructor(
    public activated: ActivatedRoute,
    public projectService: ProjectService,
    public searchTextFilter: SearchTaskPipe,
    public dialog: MatDialog,
  ) {

    this.activated.params.subscribe(param => {
      this.projectId = param.id
      
      this.getTotalLogs(this.projectId)
      // this.getTaskById(this.projectId)
      // this.getTotalHoursOfSingleDay(this.projectId)
    })

    this.dataSource = new MatTableDataSource(this.totalTimeLogs);
  }

  ngOnInit() {

    localStorage.removeItem('tempProject')
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    // this.dataSource = new MatTableDataSource(this.totalLogs);
    this.dataSource.sort = this.sort;

  }

  getTotalLogs(projectId) {
    this.loader = true
    this.projectService.getTotalLogs(projectId).subscribe((response: any) => {
      
      if (response.timeLogs && response.timeLogs.length) {

        this.totalTimeLogs = response.timeLogs
        this.totalTimeLogsCopy = response.timeLogs
        this.searchLogs = response.timeLogs
        let teamArray = response.team
        _.forEach(teamArray, (singleMember) => {
          delete singleMember.update;
          this.teamMembers.push(singleMember)
        })

        // this.teamMembers = response.team
        this.displayData()
        // this.isDisplay = 0
      } else {
        this.isDisplay = 1
        this.noDataFound = {
          text: 'There is no logs of this project'
        }
        this.totalHours = '0'
        this.totalMinutes = '0'
      }
      this.loader = false
      // let temp =
    }, error => {
      this.loader = false
      

    })
  }


  displayData() {
    this.isDisplay = 0
    let totalTime = []
    this.diffHours = []
    this.diffMinutes = []
    let fromHour
    let fromMinute
    let finalFromTime
    this.updateData(this.totalTimeLogs)
    _.forEach(this.totalTimeLogs, (singleTime) => {
      // 

      if (singleTime && singleTime.fromTime) {
        let test = singleTime.fromTime.split(':')
        // let startHours = test[0]
        // 

        let test2 = test[1].split(' ')
        // let startMinutes = test2[0]
        // let ampm = test2[1]

        if (test[0] && test[0].length == 1) {
          fromHour = this.zeroPad(test[0], 2)
          // 
        } else {
          // 
          fromHour = test[0]
        }

        if (test2[0] && test2[0].length == 1) {
          fromMinute = this.zeroPad(test2[0], 2)
          // 
        } else {
          // 
          fromMinute = test2[0]
        }

        finalFromTime = fromHour + ":" + fromMinute + " " + test2[1]
        // 
        singleTime['fromTime'] = finalFromTime
      }

      if (singleTime && singleTime.endTime) {
        let test = singleTime.endTime.split(':')
        // let startHours = test[0]
        // 

        let test2 = test[1].split(' ')
        // let startMinutes = test2[0]
        // let ampm = test2[1]

        if (test[0] && test[0].length == 1) {
          fromHour = this.zeroPad(test[0], 2)
          // 
        } else {
          // 
          fromHour = test[0]
        }

        if (test2[0] && test2[0].length == 1) {
          fromMinute = this.zeroPad(test2[0], 2)
          // 
        } else {
          // 
          fromMinute = test2[0]
        }

        finalFromTime = fromHour + ":" + fromMinute + " " + test2[1]
        // 
        singleTime['endTime'] = finalFromTime
      }
      // let finalTime = singleTime.difference.split(':')
      // this.diffHours.push(finalTime[0])
      // this.diffMinutes.push(finalTime[1])
      let tempTime = singleTime.difference.split(':')
      let totalMili = Number(Number(tempTime[0]) * (60000 * 60)) + Number(Number(tempTime[1]) * 60000)
      // 
      totalTime.push(totalMili)
      if (singleTime.verifyLogs) {
        let verifyTime = Number(Number(singleTime.verifyLogs.hours) * (60000 * 60)) + Number(Number(singleTime.verifyLogs.minutes) * 60000)
        // 
        if (totalMili == verifyTime) {
          // 
          singleTime['isverify'] = true
        } else {
          // 
          singleTime['isverify'] = false
        }
      }

    })
    // 

    let finalSum = totalTime.reduce((a, b) => a + b, 0)
    // 
    // let minutes = Math.floor((finalSum / (1000 * 60)) % 60)
    // let hours = Math.floor((finalSum / (1000 * 60 * 60)) % 24);
    // let totalTimeLog = hours + ":" + minutes
    // 

    let finalData = this.msToTime(finalSum)
    this.totalHours = finalData.split(':')[0]
    this.totalMinutes = finalData.split(':')[1]
    // 

  }

  msToTime(s) {
    let milliseconds
    let hours
    let minutes
    let seconds

    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return hrs + ':' + mins;

  }



  updateData(clients) {
    // 
    this.dataSource = new MatTableDataSource(clients);
    this.dataSource.paginator = this.paginator;
    // 
    this.dataSource.sortingDataAccessor = (item, property) => {
      // 

      // 
      switch (property) {
        case 'date': return item.timeDate;
        case 'users': return item.userId.name;
        case 'taskTitle': return item.taskId.title;
        case 'taskTitle': return item.taskId.taskUniqueId;
        case 'estimated': return item.taskId.estimatedTime;
        case 'difference': return item.difference;
        case 'from': return item.fromTime;
        case 'end': return item.endTime;
        // case 'location.title': return item.location.title;
        // case 'course.title': return item.course.title;
        default: return item[property];
      }
    };
    this.dataSource.sort = this.sort;
    // 

  }

  someMethod(event) {
    // 

  }
  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // if (this.dataSource)
    this.dataSource.sort = this.sort;
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
      zeroString = '-' + zeroString;
    }

    return zeroString + n;
  }

  filterOnDeveloper(event) {
    
    this.selectedUserList = event
    if (event && event.length) {
      this.totalTimeLogs = this.totalTimeLogsCopy
      let finalList = event
      this.displayReset = true
      // this.sortingReset = false
      this.filterReset = false
      let array = []
      var count;
      _.forEach(finalList, track => {
        count = (_.filter(this.totalTimeLogs, (o: any) => {
          if (o.userId._id == track._id)
            array.push(o)
          // return o
        }));
      });

      
      if (array && array.length) {
        this.totalTimeLogs = JSON.parse(JSON.stringify(array))
        this.displayData()
        this.isDisplay = 0
      } else {
        
        this.isDisplay = 1
        this.noDataFound = {
          text: 'There is no logs of this developer'
        }
        this.totalHours = '0'
        this.totalMinutes = '0'
      }
    } else {
      this.totalTimeLogs = this.totalTimeLogsCopy
      this.isDisplay = 0
      this.displayData()
    }


  }
  filterOnDueDate(event) {
    
    this.displayReset = true
    this.filterReset = false
    // this.sortingReset = false
    let selectedMembers
    if (this.selectedUserList && this.selectedUserList.length) {
      if (event.startDate.getTime() == event.endDate.getTime()) {
        
        selectedMembers = this.totalTimeLogs.filter(
          m => m.timeDate == moment(event.startDate).format("YYYY-MM-DD")
        )
        
      } else {
        
        selectedMembers = this.totalTimeLogs.filter(
          m => new Date(m.timeDate) >= new Date(event.startDate) && new Date(m.timeDate) <= new Date(event.endDate)
        );
      }
    } else {
      this.totalTimeLogs = this.totalTimeLogsCopy
      
      if (event.startDate.getTime() == event.endDate.getTime()) {
        
        selectedMembers = this.totalTimeLogs.filter(
          m => m.timeDate == moment(event.startDate).format("YYYY-MM-DD")
        )
        
      } else {
        
        selectedMembers = this.totalTimeLogs.filter(
          m => new Date(m.timeDate) >= new Date(event.startDate) && new Date(m.timeDate) <= new Date(event.endDate)
        );
      }
    }
    // Thu Jan 01 1970 05:30:02 GMT+0530 (India Standard Time)
    // Sun Jul 05 2020 00:00:00 GMT+0530 (India Standard Time)

    if (selectedMembers && selectedMembers.length) {
      // 
      this.totalTimeLogs = selectedMembers
      this.displayData()
    } else {
      this.isDisplay = 1
      this.noDataFound = {
        text: 'There is no logs between this dates'
      }

      this.totalHours = '0'
      this.totalMinutes = '0'
    }
  }
  resetFilter() {
    this.totalTimeLogs = JSON.parse(JSON.stringify(this.totalTimeLogsCopy))
    this.filterReset = true
    this.selectedUserList = []
    // this.sortingReset = true
    this.displayReset = false
    this.isDisplay = 0
    this.displayData()
    this.searchText = ''
    let message = document.getElementById('message')
    message.innerHTML = ""
  }


  onKey(searchText) {
    let message = document.getElementById('message')
    if (!this.totalTimeLogs) {
      
      // let message = document.getElementById('message')
      if (searchText) {
        message.innerHTML = "There is no search result"
      } else {
        message.innerHTML = ""
      }
    } else {
      var dataToBeFiltered = this.searchLogs;
      var task = this.searchTextFilter.transform6(dataToBeFiltered, searchText);
      
      this.totalTimeLogs = []
      if (task.length > 0) {
        let message = document.getElementById('message')
        message.innerHTML = ""
      }
      if (task.length > 0) {
        this.totalTimeLogs = task
        this.displayData()
      } else {
        message.innerHTML = "There is no search result"
        this.totalHours = "0"
        this.totalMinutes = "0"
        this.isDisplay = -1
      }
    }
  }

  openTaskModel(taskId) {
    
    let obj = {
      task: taskId,
      projectId: this.projectId,
      team: this.teamMembers,
      displayButton: false
    }
    let data = obj
    var taskDetails = this.openDialog(SingleTaskDetailsComponent, data).subscribe((response) => {
      
    })
  }

  openDialog(someComponent, data = {}): Observable<any> {
    
    const dialogRef = this.dialog.open(someComponent, { data });
    return dialogRef.afterClosed();
  }
  approveTime(log) {
    
    this.loader = true
    this.projectService.getVerifyLogs(log._id).subscribe((response: any) => {
      let displayData

      if (response.logs) {
        
        displayData = {
          taskTitle: log.taskId.title,
          difference: log.difference,
          taskDescription: log.taskId.description,
          timeDescription: log.description,
          hours: response.logs.hours,
          minutes: response.logs.minutes,
          reason: response.logs.reason,
          edit: true,
          verifyId: response.logs._id,
          timeLogId: log._id
        }
      } else {
        
        let tempDiff = log.difference.split(':')
        displayData = {
          taskTitle: log.taskId.title,
          difference: log.difference,
          taskDescription: log.taskId.description,
          timeDescription: log.description,
          timeLogId: log._id,
          hours: tempDiff[0],
          minutes: tempDiff[1],
          // reason: response.reason
        }
      }
      let data = displayData
      var taskDetails = this.openDialog(ApproveLogsModelComponent, data).subscribe((response) => {
        
        if (response != undefined) {

          let tempElement = this.totalTimeLogs.filter(x => x._id === response.timelogId);
          let index = this.totalTimeLogs.findIndex(x => x._id === response.timelogId);

          

          let tempTime = tempElement[0].difference.split(':')
          let totalMili = Number(Number(tempTime[0]) * (60000 * 60)) + Number(Number(tempTime[1]) * 60000)
          


          let verifyTime = Number(Number(response.hours) * (60000 * 60)) + Number(Number(response.minutes) * 60000)
          
          if (totalMili == verifyTime) {
            
            this.totalTimeLogs[index]['isverify'] = true
            this.totalTimeLogs[index]['verifyLogs'] = response
          } else {
            
            this.totalTimeLogs[index]['isverify'] = false
            this.totalTimeLogs[index]['verifyLogs'] = response
          }
        }
      })
      this.loader = false
    }, error => {
      this.loader = false
      
    })
  }

}
