import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ProjectService } from "../../services/project.service";
import * as moment from "moment";
import * as _ from "lodash";
import { SearchTaskPipe } from "../../search-task.pipe";

import { MatSort, MatTableDataSource, MatPaginator } from "@angular/material";
import * as xlsx from "xlsx";

@Component({
  selector: "app-all-users-logs",
  templateUrl: "./all-users-logs.component.html",
  styleUrls: ["./all-users-logs.component.css"],
})
export class AllUsersLogsComponent implements OnInit {
  @ViewChild("epltable") epltable: ElementRef;

  p: number = 1;
  Name = "Select Date";
  searchText;
  dateSelected;
  displayDate;
  totalLogs = [];
  searchLogs = [];
  totalLogsCopy = [];
  adminDate;
  displayReset = false;
  filterReset;
  isDisplay;
  displayFilter = [
    {
      displayName: "UserRole",
    },
  ];
  userRoleList = [
    {
      name: "Team Member",
    },
    {
      name: "Manager",
    },
  ];
  loader = false;
  displayIndex = 0;
  displayCalander = false;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ["users", "time"];
  sort: MatSort;
  paginator: MatPaginator;
  pageSizeOptions: number[] = [10, 25, 100];
  displayName = [];
  allDisplayDate = [];
  displayTable = false;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  constructor(
    public projetService: ProjectService,
    public searchTextFilter: SearchTaskPipe
  ) {
    this.dataSource = new MatTableDataSource(this.totalLogs);
  }

  ngOnInit() {
    this.dateSelected = moment(new Date()).format("YYYY-MM-DD");
    this.displayDate = this.dateSelected;
    this.getTotalLogs(this.displayDate);
  }
  clubs = [
    {
      position: 1,
      name: "Liverpool",
      played: 20,
      won: 19,
      drawn: 1,
      lost: 0,
      points: 58,
    },
    {
      position: 2,
      name: "Leicester City",
      played: 21,
      won: 14,
      drawn: 3,
      lost: 4,
      points: 45,
    },
    {
      position: 3,
      name: "Manchester City",
      played: 21,
      won: 14,
      drawn: 2,
      lost: 5,
      points: 44,
    },
    {
      position: 4,
      name: "Chelsea",
      played: 21,
      won: 11,
      drawn: 3,
      lost: 7,
      points: 36,
    },
    {
      position: 5,
      name: "Manchester United",
      played: 21,
      won: 8,
      drawn: 7,
      lost: 6,
      points: 31,
    },
  ];

  exportToExcel() {
    const ws: xlsx.WorkSheet = xlsx.utils.table_to_sheet(
      this.epltable.nativeElement
    );
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
    xlsx.writeFile(wb, "epltable.xlsx");
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    // this.dataSource = new MatTableDataSource(this.totalLogs);
    this.dataSource.sort = this.sort;
  }

  getTotalLogs(date) {
    this.loader = true;
    this.adminDate = true;
    
    let obj = {
      singleDate: date,
    };
    this.projetService.getTotalLogsOfAllUser(obj).subscribe(
      (response: any) => {
        
        this.totalLogs = response;
        this.searchLogs = response;
        this.totalLogsCopy = response;
        this.getFormateTime();
        this.loader = false;
      },
      (error) => {
        
        this.loader = false;
      }
    );
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // if (this.dataSource)
    this.dataSource.sort = this.sort;
  }

  getFormateTime() {
    let fromHour;
    let fromMinute;
    let finalFromTime;
    this.updateData(this.totalLogs);
    _.forEach(this.totalLogs, (singleLogs) => {
      let test = singleLogs.userTime.split(":");
      if (test[0] && test[0].length == 1) {
        fromHour = this.zeroPad(test[0], 2);
        // 
      } else {
        // 
        fromHour = test[0];
      }

      if (test[1] && test[1].length == 1) {
        fromMinute = this.zeroPad(test[1], 2);
        // 
      } else {
        // 
        fromMinute = test[1];
      }

      finalFromTime = fromHour + ":" + fromMinute;
      singleLogs["userTime"] = finalFromTime;
      // singleLogs['redirect'] = false
    });
  }

  updateData(clients) {
    
    this.dataSource = new MatTableDataSource(clients);
    this.dataSource.paginator = this.paginator;
    
    this.dataSource.sortingDataAccessor = (item, property) => {
      // 

      // 
      switch (property) {
        case "time":
          return item.userTime;
        case "users":
          return item.name;
        // case 'taskTitle': return item.taskId.title;
        // case 'estimated': return item.taskId.estimatedTime;
        // case 'difference': return item.difference;
        // case 'from': return item.fromTime;
        // case 'end': return item.endTime;
        // case 'location.title': return item.location.title;
        // case 'course.title': return item.course.title;
        default:
          return item[property];
      }
    };
    this.dataSource.sort = this.sort;
    // 
  }

  someMethod(event) {
    
  }

  getDate(event) {
    this.displayDate = moment(event).format("YYYY-MM-DD");
    
    this.getTotalLogs(this.displayDate);
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
      zeroString = "-" + zeroString;
    }

    return zeroString + n;
  }

  onKey(searchText) {
    let message = document.getElementById("message");
    if (!this.totalLogs) {
      
      // let message = document.getElementById('message')
      if (searchText) {
        message.innerHTML = "There is no search result";
      } else {
        message.innerHTML = "";
      }
    } else {
      var dataToBeFiltered = this.searchLogs;
      var task = this.searchTextFilter.transform7(dataToBeFiltered, searchText);
      
      this.totalLogs = [];
      if (task.length > 0) {
        let message = document.getElementById("message");
        message.innerHTML = "";
      }
      if (task.length > 0) {
        this.totalLogs = task;
        this.getFormateTime();
        this.displayIndex = 0;
      } else {
        this.displayIndex = 1;
        // this.totalLogs = []
        // this.updateData(this.totalLogs)
        
        // 
        message.innerHTML = "There is no search result";
      }
    }
  }

  selectedRole(event) {
    
    if (event && event.length) {
      this.totalLogs = this.totalLogsCopy;
      let finalList = event;
      this.displayReset = true;
      this.filterReset = false;
      let array = [];
      var count;
      _.forEach(finalList, (track) => {
        count = _.filter(this.totalLogs, (o: any) => {
          if (o.userRole == track.name) array.push(o);
          // return o
        });
      });
      

      if (array && array.length) {
        // this.isDisplay = 0
        this.totalLogs = JSON.parse(JSON.stringify(array));
        this.getFormateTime();
      } else {
        
        // this.taskList = []
        // this.isDisplay = 1
        // this.noDataFound = {
        //   text: 'There is no task of this developer'
        // }
      }
    } else {
      this.totalLogs = JSON.parse(JSON.stringify(this.totalLogsCopy));
      this.getFormateTime();
    }
  }

  resetFilter() {
    // 
    this.totalLogs = JSON.parse(JSON.stringify(this.totalLogsCopy));
    this.filterReset = true;
    // this.sortingReset = true
    this.displayReset = false;
    this.getFormateTime();
    // this.isDisplay = 0
  }

  exportPdf() {
    this.displayCalander = true;
  }
  dueDate(event) {
    
    this.loader = true;
    let obj = {
      startDate: moment(event.startDate).format("YYYY-MM-DD"),
      endDate: moment(event.endDate).format("YYYY-MM-DD"),
    };
    

    let allDates = this.getAllDates(
      new Date(obj.startDate),
      new Date(obj.endDate)
    );

    
    // this.allDisplayDate = allDates

    this.projetService.getTotalLogsOfAllUser(obj).subscribe(
      (response: any) => {
        
        this.displayName = response.userArray;
        this.allDisplayDate = response.dateArray;
        setTimeout(() => {
          const ws: xlsx.WorkSheet = xlsx.utils.table_to_sheet(
            this.epltable.nativeElement
          );
          const wb: xlsx.WorkBook = xlsx.utils.book_new();
          xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
          xlsx.writeFile(wb, "TimeSheet.xlsx");
        }, 1000);
        this.displayCalander = false;
        this.loader = false;
      },
      (error) => {
        
        this.loader = false;
      }
    );
  }
  getAllDates(startDate, endDate) {
    var dates = [],
      currentDate = startDate,
      addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
    while (currentDate <= endDate) {
      dates.push(currentDate);
      currentDate = addDays.call(currentDate, 1);
    }
    return dates;
  }
}
