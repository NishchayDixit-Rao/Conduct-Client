import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../../services/attendance.service';
import { ProjectService } from '../../services/project.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormGroup, FormControl, Validators } from '@angular/forms';
declare var $;
import * as moment from 'moment';


@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrls: ['./user-report.component.css']
})
export class UserReportComponent implements OnInit {

  userInfo = JSON.parse(localStorage.getItem("currentUser"));
  // branchName = localStorage.getItem("branchSelected")
  logs: any;
  foundRecordUser: any = null;
  reportForm: FormGroup;
  developers: any;
  bsConfig: Partial<BsDatepickerConfig>
  myDateValue: Date;
  p: number = 1;
  searchRecordDate: any;
  timeToWork = 30600;
  totalHoursWorked: any;
  totalHoursToWork: any;
  fullTimeWorked: any;
  lessTimeWorked: any;
  isDisable: boolean = false; modelDate = '';
  allEmployeeSearch: boolean;
  allLogs: any;
  modelValue: any;
  modelMessage: any;
  monthDisplay: any;
  tableHeader = [];
  tableData = [];


  constructor(
    public attendanceService: AttendanceService,
    public _projectService: ProjectService
  ) {
    this.reportForm = new FormGroup({
      id: new FormControl(''),
      date: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {

    let branchName = localStorage.getItem('branchSelected')
    
    $(document).ready(function () {
      if (branchName == 'Ahemdabad') {
        $("#ahemdabad").addClass("active");
        $("#rajkot").removeClass("active");
      } else if (branchName == 'Rajkot') {
        
        $("#rajkot").addClass("active");
        $("#ahemdabad").removeClass("active");
      }
      if (!branchName) {
        $("#rajkot").addClass("active");
        $("#ahemdabad").removeClass("active");
      }
    })

    this.reportForm.reset();
    this.searchRecordDate = null;
    this.foundRecordUser = null;
    this.tableData = [];
    this.tableHeader = [];
    this.getDeveloperBranchWise();
    this.bsConfig = Object.assign({}, { containerClass: 'theme-green custom' });
    this.myDateValue = new Date();


  }
  get f() { return this.reportForm.controls; }


  getDeveloperBranchWise() {
    let branchName = localStorage.getItem("branchSelected")
    this._projectService.getBranchUser(branchName).subscribe((response: any) => {
      
      this.developers = response.data
    }, error => {
      
    })
  }


  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }

  getReport(value) {
    
    this.fullTimeWorked = 0;
    this.lessTimeWorked = 0;
    this.monthDisplay = moment(value.date).format('MMMM');
    var newDate: any = moment(value.date).add(1, 'days');
    value['startDate'] = new Date(newDate).toISOString();
    newDate = moment(newDate).endOf('month')
    value['endDate'] = new Date(newDate._d).toISOString();

    delete value['date'];
    
    if (value.id == null) {
      value.id = 'All';
    }
    this.attendanceService.getReportFlagWise(value).subscribe(async (res: any) => {
      
      this.isDisable = false;
      if (res.detailsOfUser.length == 0) {
        
        if (value.id != 'All') {
          this.allEmployeeSearch = false;
          
          this.developers.forEach((dev) => {
            if (dev._id == value.id) {
              this.searchRecordDate = moment(value.startDate).format('MMMM YYYY');
              this.foundRecordUser = dev;
            }
          });
          this.logs = [];
          this.totalHoursWorked = 0;
          this.totalHoursToWork = 0;
          this.tableHeader = [];
          this.tableData = [];
        }
        else {
          this.logs = [];
          this.tableHeader = [];
          this.totalHoursWorked = 0;
          this.tableData = [];
          this.totalHoursToWork = 0;
          this.allEmployeeSearch = true;
        }
      }
      else if (!res.detailsOfUser.foundLogs) {
        this.logs = null;

        this.searchRecordDate = null;
        this.allEmployeeSearch = true;
        this.allLogs = res.detailsOfUser;
        

        this.allLogs = await this.formatResponse(this.allLogs);
        this.tableData = [];
        this.tableHeader = [];
        for (let [key, value] of Object.entries(this.allLogs[0])) {
          this.tableHeader.push(key);
          this.tableData.push(value);
        }
        
        
      } else {
        this.allEmployeeSearch = false;
        res.detailsOfUser.foundLogs.forEach((data) => {
          if (data.diffrence != '-') {
            data['seconds'] = moment.duration(data.diffrence).asSeconds();

          } else {
            data['seconds'] = null
          }
        });
        res.detailsOfUser.foundLogs.forEach((data) => {
          if (data['seconds'] >= this.timeToWork) {
            this.fullTimeWorked++;
          } else {
            this.lessTimeWorked++;
          }

        });

        if (value.id != 'All') {
          if (res.detailsOfUser.foundLogs.length > 0) {
            this.developers.forEach((dev) => {
              
              if (dev._id == value.id) {
                this.foundRecordUser = dev;
              }
            });
          }

        } else {
          this.foundRecordUser = null;
        }
        this.searchRecordDate = moment(value.startDate).format('MMMM YYYY');
        this.allLogs = null;
        this.logs = res.detailsOfUser.foundLogs;
        this.totalHoursWorked = res.detailsOfUser.TotalHoursCompleted;
        this.totalHoursToWork = res.detailsOfUser.TotalHoursToComplete;
      }
      this.reportForm.reset();
    }, (err: any) => {
      this.reportForm.reset()
      this.isDisable = false;;
      
    });
  }

  async formatResponse(res1) {
    
    
    // 
    var obj = {
      absentCount: null,
      changed: null,
      date: null,
      day: null,
      diffrence: null,
      status: null,
      timeLog: null,
      user: [],
      userId: null,
      _id: null
    }

    for (let [key, value] of Object.entries(res1[0])) {
      var flag = 1;
      var responseValue: any = value;
      var responseKey: any = key;
      // 
      if (typeof responseValue != 'string') {
        this.developers.forEach((devData, index) => {
          responseValue.forEach((resData) => {
            if (devData._id == resData.user[0]._id) {
              flag = 0;
            }
          });
          if (flag == 1) {
            obj.user.push(devData);
            res1[0][key].push(obj);
          }
          flag = 1;
          obj = {
            absentCount: null,
            changed: null,
            date: null,
            day: null,
            diffrence: null,
            status: null,
            timeLog: null,
            user: [],
            userId: null,
            _id: null
          }
        });
      } else {
        var tempArr = [];
        tempArr.push(responseValue);
        res1[0][responseKey] = tempArr;
      }
    }
    // 
    

    for (let [key, value] of Object.entries(res1[0])) {
      // 
      if (value != 'string') {
        res1[0][key].sort(function (a, b) {
          var nameA = a.user[0].name.toLowerCase().split(" ")[0], nameB = b.user[0].name.toLowerCase().split(" ")[0]
          // 
          if (nameA < nameB) //sort string ascending
            return -1
          if (nameA > nameB)
            return 1
          return 0 //default return value (no sorting)
        });
      }
    }
    
    var temp = [];
    for (let [key, value] of Object.entries(res1[0])) {
      // 
      // value = await this.sortValue(value);
      temp.push(value);
    }
    temp.forEach((arrayData) => {
      // 
      if (arrayData.length > 1) {
        arrayData.forEach((objData) => {
          if (objData.diffrence == null) {
            objData['seconds'] = 'AB';
          }
          else if (objData.diffrence == '-') {
            objData['seconds'] = 'N/A';
          }
          else if (objData.diffrence != '-' || objData.diffrence != null) {
            objData['seconds'] = moment.duration(objData.diffrence).asSeconds();
          }
        });
      }
    });
    
    this.allLogs = res1;
    
    return res1;
  }

  getColor(value) {
    if (!isNaN(value)) {
      if (value < 30600) {
        return '#ff000066'
      } else if (value >= 34200) {
        return 'green'
      }
    } else {
      switch (value.toString()) {
        case "N/A":
          return 'black';
        case 'AB':
          return 'red';
        case 'Holiday or no working day':
          return 'black';
        case 'Sunday':
          return 'blue';
      }

    }
  }
  getBackGroundColor(value) {
    switch (value) {
      case "Holiday or no working day":
        return 'silver';
      case 'Sunday':
        return '#8c8cf366';
    }
  }

  getBackGroundColorSingleEmployee(value) {
    
    if (typeof value != 'string') {
      if (value < 30600) {
        return '#ff686810'
      } else {
        return '#00800010'
      }
    } else {
      if (value == 'Sunday') {
        return '#8c8cf366'
      } else {
        return 'silver'
      }
    }
  }
  getColorSingleEmployee(value) {
    if (typeof value != 'string') {
      if (value < 30600) {
        return 'red'
      } else {
        return 'green'
      }
    } else {
      if (value == 'Sunday') {
        return 'blue'
      } else {
        return 'black'
      }
    }
  }
  openModel(indexOfDate, indexOfDiffrence?) {
    // 
    if (this.allLogs != null) {
      this.modelMessage = null;
      
      
      this.modelValue = this.allLogs[0][indexOfDate][indexOfDiffrence];
      if (this.modelValue._id == null) {
        this.modelMessage = this.modelValue.user[0].name + " was absent or no logs found of that date";
      }
    } else if (this.logs != null) {
      
      this.modelValue = this.logs[indexOfDate]
    }
    $('#myModal').modal('show');
  }
  branchSelector(branchName) {
    
    localStorage.setItem('branchSelected', branchName);
    // if (branchName == 'Ahemdabad') {
    //   $("#rajkot").removeClass("active");
    //   $("#ahemdabad").addClass("active");
    // } else {
    //   
    //   $("#rajkot").addClass("active");
    //   $("#ahemdabad").removeClass("active");
    // }
    this.ngOnInit();
  }
}
