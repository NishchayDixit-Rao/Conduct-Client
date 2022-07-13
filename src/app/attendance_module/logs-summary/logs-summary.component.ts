import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { AttendanceService } from '../../services/attendance.service';
import { SearchTaskPipe } from '../../search-task.pipe';
import { NgxPaginationModule } from 'ngx-pagination';

declare var $;

@Component({
  selector: 'app-logs-summary',
  templateUrl: './logs-summary.component.html',
  styleUrls: ['./logs-summary.component.css']
})
export class LogsSummaryComponent implements OnInit {
  userInfo = JSON.parse(localStorage.getItem("currentUser"));
  searchData: any;
  currentMonthLogs;
  currentMonthLogsCount = [];
  modelValue: any;
  p: number = 1;

  //imported
  data = {
    firstDate: "",
    secondDate: "",
    name: ""
  };
  previousData: any;
  logs: any;
  flag = false;
  getLogsBySingleDate = false;
  getLogsBetweenDates = false;
  search: any;
  totalHoursToWork: any;
  totalHoursWorked: any;
  constructor(
    public attenDanceService: AttendanceService,
    private router: Router,
    public searchTextFilter: SearchTaskPipe,
    public _change: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // var branchName = localStorage.getItem('branchSelected');
    var self = this;
    $(document).ready(function () {

      let branchName = localStorage.getItem('branchSelected')

      // $(document).ready(function () {
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
      // })
      $(function () {

        var start = moment().subtract(29, 'days');
        var end = moment();

        function cb(start, end) {
          if (self.userInfo.userRole != 'admin')
            self.getRangeDate(start, end);
        }

        $('#reportrange').daterangepicker({
          startDate: start,
          endDate: end,
          ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
          }
        }, cb);

        cb(start, end);

      });
      $('[data-toggle="tooltip"]').tooltip();


    });
    // this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
    // this.getLogsCountByMonthDefault();
    if (this.userInfo.userRole == 'admin') {
      this.getTodaysAttendance();
      this.search = false;
      // this.page(1);
    }
  }

  // getLogsCountByMonthDefault() {
  //   this.attenDanceService.getLogsCountByMonthDefault().subscribe((response: any) => {
  //     // this.currentMonthLogs = response;
  //     
  //     let count = 1;
  //     while (response['length'] >= 1) {
  //       response['length'] = response['length'] / 5;
  //       this.currentMonthLogsCount.push(count);
  //       count++;
  //     }
  //     if (count != 2)
  //       this.currentMonthLogsCount.push(count)
  //     
  //   }, (err) => {
  //     
  //   });
  // }
  openModel(index) {
    
    if (!this.search) {
      this.modelValue = this.logs[index];
      
    } else {
      this.modelValue = this.logs[index];
    }
    $('#myModal').modal('show');
  }
  logout() {
    
    // this.attenDanceService.logout();
    this.router.navigate(['login']);
  }
  getRecord() {
    this.flag = true;
    
    this.previousData = this.data;
    //find only first date . 
    if (this.data.firstDate) {
      
      this.previousData = this.data;
      this.attenDanceService.getLogsBySingleDate(this.data).subscribe((res: any) => {
        
        this.logs = res.detailsOfDate
        this.searchData = res.detailsOfDate
        this.flag = false;
        
      }, err => {
        
        this.flag = false;
      });
    }
  }
  getTodaysAttendance() {
    this.attenDanceService.getTodaysAttendance().subscribe((response: any) => {
      
      this.logs = response.data;
      this.searchData = response.data;
      // this.currentMonthLogs = this.properFormatDate(response.data);
      // this.searchData = response.data;

    }, (err) => {
      
    })
  }
  searchByName(items) {
    var field1 = (<HTMLInputElement>document.getElementById("searchName")).value;
    

    this.logs = this.searchTextFilter.transform3(items, field1);
    
  }
  resetForm() {
    this.search = false;
    this.calculateTotalDuration(this.currentMonthLogs, 5, moment(), moment().subtract(6, 'days'));
    (<HTMLInputElement>document.getElementById("reportrange")).value = "";
  }
  getRangeDate(start, end) {
    
    // if (this.currentMonthLogs) {
    
    var increseStartDate: any = moment(start._d).add(1, 'days');
    var body = {
      userId: this.userInfo._id,
      startDate: new Date(increseStartDate).toISOString(),
      endDate: new Date(end._d).toISOString()
    }
    
    this.search = true;
    this.attenDanceService.getLogsReportById(body).subscribe((res: any) => {
      
      if (res.foundLogs) {
        this.logs = res.foundLogs
        // this.logs = this.properFormatDate(res.foundLogs);
        this.totalHoursToWork = res.TotalHoursToComplete;
        this.totalHoursWorked = res.TotalHoursCompleted;
        
        
        this._change.detectChanges();
      }

    }, (err) => {
      
    });
    // }
  }
  calculateTotalDuration(array, resultHours, start, end) {
    var workingHours = 0;
    var totalHours = 0;
    // 
    
    if (resultHours < 1)
      resultHours = 1
    for (var i = 0; i < Math.ceil(resultHours); i++) {
      
      var local: any = moment(start._d).subtract(i, 'days');
      local = moment(local._d, "YYYY-MM-DD HH:mm:ss").format('dddd');
      // 
      if (local.toString() != "Sunday")
        totalHours = totalHours + 30600;
    }
    array.forEach((obj) => {
      // 
      if (obj.diffrence) {
        workingHours = workingHours + moment.duration(obj.diffrence).asSeconds();
        
      }
    });
    //calculate total working hours 
    var minutes = Math.floor(totalHours / 60);
    totalHours = totalHours % 60;
    var hours = Math.floor(minutes / 60)
    minutes = minutes % 60;
    
    this.totalHoursToWork = hours + ":" + minutes + ":" + "00";
    //calculate hours worked 

    var minutes = Math.floor(workingHours / 60);
    workingHours = workingHours % 60;
    var hours = Math.floor(minutes / 60)
    minutes = minutes % 60;
    this.totalHoursWorked = hours + ":" + minutes + ":" + "00";
    
    

  }

  // searchByName(items){
  // 	var field1 = (<HTMLInputElement>document.getElementById("nameSearch")).value;
  // 	this.filteredData = this._filterPipe.transform(items, field1);
  // }
  properFormatDate(data) {
    
    return data = data.filter((obj) => {
      return obj.date = moment(obj.date).utc().format("DD/MM/YYYY");
    });
  }
  branchSelector(branchName) {
    
    localStorage.setItem('branchSelected', branchName);
    this.currentMonthLogs = null;
    this.ngOnInit();
    // 
  }

  getBackGroundColorForAdmin() {
    if (this.userInfo.userRole == 'admin') {
      return 'adminHeader'
    } else {
      return 'userHeader';
    }
  }

  getColorForUser() {
    if (this.userInfo.userRole == 'admin') {
      return 'adminHeader'
    } else {
      return 'adminHeader';
    }
  }

}
