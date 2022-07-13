import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../config';
import { ActivatedRoute, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AttendanceService {


  currentUser = JSON.parse(localStorage.getItem('currentUser'))
  constructor(private http: HttpClient, public router: Router) { }



  fillAttendance() {
    var body = {
      userId: this.currentUser._id,
      loginFlag: this.currentUser.loginFlag
    }
    
    return this.http.post(config.baseApiUrl + "attendance/fill-attendance", body)
  }

  getLastFiveDaysAttendance(id, userId) {
    if (id == 0) {
      var body = {
        userId: userId,
        days: '5'
      }
    } else {
      var body = {
        userId: userId,
        days: '5'
      }
    }
    
    return this.http.post(config.baseApiUrl + "attendance/get-last-five-days-logs", body);
  }

  getCurrentDateLogById(userId) {
    var body = {
      userId: userId
    }
    return this.http.post(config.baseApiUrl + "attendance/get-attendance-by-id", body)
  }
  getTodaysAttendance() {
    var body = {
      "branch": localStorage.getItem('branchSelected')
    }
    
    if (body.branch == null) {
      body['branch'] = 'Rajkot'
      localStorage.setItem('branchSelected', 'Rajkot')
    }
    return this.http.post(config.baseApiUrl + "attendance/get-todays-day-logs", body)
  }


  getLogsReportById(body) {
    
    return this.http.post(config.baseApiUrl + "attendance/get-report-by-id", body);
  }
  getReportFlagWise(data) {
    
    data['branch'] = localStorage.getItem('branchSelected');
    return this.http.post(config.baseApiUrl + "attendance/get-report-by-flag", data)
  }

  getLogsByMonthDefaultByPage(body) {
    if (JSON.parse(localStorage.getItem('currentUser')).userRole) {
      body['userRole'] = this.currentUser.userRole;
    }
    body['userId'] = this.currentUser._id;
    return this.http.post(config.baseApiUrl + "attendance/get-current-month-logs-by-page", body);
  }


  getLogsBySingleDate(data) {
    
    data['branch'] = localStorage.getItem('branchSelected');
    return this.http.post(config.baseApiUrl + "attendance/get-logs-by-single-date", data);
  }
}
