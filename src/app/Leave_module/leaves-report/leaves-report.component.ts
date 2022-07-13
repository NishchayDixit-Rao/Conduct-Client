import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { LeaveService } from "../../services/leave.service";
declare var $: any;
import * as _ from "lodash";
import * as moment from "moment";

@Component({
  selector: "app-leaves-report",
  templateUrl: "./leaves-report.component.html",
  styleUrls: ["./leaves-report.component.css"],
})
export class LeavesReportComponent implements OnInit {
  monthLeaveForm: FormGroup;
  yearLeaveForm: FormGroup;
  isVisible: boolean = false;
  monthlyLeaveOfUser: any = [];
  yearlyLeaveOfuser: any = [];
  isMonthLeave = 0;
  isYearLeave = 0;
  selectedMonth;
  leaves;
  displayMonth;
  displayYear;
  loading = false;
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  userRole = this.currentUser.userRole;
  constructor(private leaveService: LeaveService) {
    this.monthLeaveForm = new FormGroup({
      month: new FormControl("", [Validators.required]),
    });

    this.yearLeaveForm = new FormGroup({
      year: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit() {
    var monthDate = $("#date-picker").pickadate({
        min: new Date(),
      }),
      monthSingleDate = monthDate.pickadate("picker");
    // 
    monthSingleDate.on("set", (event) => {
      if (event.select) {
        
        let monthsingleDateValue = monthSingleDate.get("select");
        
        let months = moment(monthsingleDateValue.obj).format("MM-YYYY");
        
        const obj = {
          month: months.split("-")[0],
          year: months.split("-")[1],
        };
        
        this.displayMonth = months;
        let month = JSON.parse(JSON.stringify(obj));
        let monthLeave = this.monthLeaveForm.controls.month.setValue(obj);
        this.getMounthlyLeaveByUser(obj);
        this.yearLeaveForm.controls.year.setValue("");
        // this.displayYear.value('')
      }
    });

    var singleDayDate = $("#date-picker1").pickadate({
        min: new Date(),
      }),
      fromSingle = singleDayDate.pickadate("picker");

    fromSingle.on("set", (event) => {
      if (event.select) {
        
        let yearSelected = fromSingle.get("select");
        let years = moment(yearSelected).format("YYYY");
        
        const obj1 = {
          year: years,
        };
        this.displayYear = years;
        // let year = JSON.parse(JSON.stringify(obj));
        let yearLeave = this.yearLeaveForm.controls.year.setValue(obj1);
        this.getYearLeaveReport(obj1);
        this.monthLeaveForm.controls.month.setValue("");
      }
    });
  }

  /**
   * Get monthly leave history of user
   * @param {object} data
   */
  getMounthlyLeaveByUser(data) {
    
    this.yearlyLeaveOfuser = [];
    this.isVisible = true;
    
    if (this.userRole == "Manager" || this.userRole == "admin") {
      this.leaveService.getMonthLeaveReport(data).subscribe(
        (res: any) => {
          
          this.monthlyLeaveOfUser = res.data;
          if (res.data.length > 0) {
            this.isMonthLeave = 2;
          } else {
            this.isMonthLeave = 1;
            $(".no-leaves-of-month").css({ display: "block" });
          }
        },
        (err) => {
          
          this.isVisible = false;
        }
      );
    } else {
      this.leaveService.getMonthlyLeaveByUser(data).subscribe(
        (res: any) => {
          
          this.monthlyLeaveOfUser = res.data;
          if (res.data.length > 0) {
            this.isMonthLeave = 2;
          } else {
            this.isMonthLeave = 1;
            $(".no-leaves-of-month").css({ display: "block" });
          }
        },
        (err) => {
          
        }
      );
    }
  }

  /**
   * Get year leave report
   * @param {Object} data
   */
  getYearLeaveReport(data) {
    this.isVisible = true;
    $(".no-leaves-of-month").css({ display: "none" });
    this.monthlyLeaveOfUser = [];
    
    if (this.userRole == "Manager" || this.userRole == "admin") {
      this.leaveService.getYearLeaveReport(data).subscribe(
        (res: any) => {
          this.yearlyLeaveOfuser = res.data;
          
          this.isVisible = false;
          if (res.data.length > 0) {
            this.isYearLeave = 2;
          } else {
            this.isYearLeave = 1;
            // $('.no-leave-of-year').css({ 'display': 'block' })
          }
          this.yearLeaveForm.reset();
        },
        (err) => {
          
          this.isVisible = false;
        }
      );
    } else {
      this.leaveService.getYearlyLeaveByUser(data).subscribe(
        (res: any) => {
          
          this.yearlyLeaveOfuser = res.data;
          if (res.data.length > 0) {
            this.isYearLeave = 2;
          } else {
            this.isYearLeave = 1;
            $(".no-leave-of-year").css({ display: "block" });
          }
        },
        (err) => {
          
        }
      );
    }
  }
  getNoOfDays(days) {
    if (days.shortLeave) {
      if (days.shortLeave == 1) {
        return days.shortLeave + " hour";
      }
      return days.shortLeave + " hours";
    } else {
      if (days.noOfDays < 0) {
        return "You have no leaves..";
      } else {
        const noOfDays = Math.floor(days.noOfDays / 8);
        const noOfhours = days.noOfDays % 8;
        if (!noOfDays && noOfhours) {
          if (noOfhours > 1) {
            return noOfhours + " hours";
          } else {
            return noOfhours + " hour";
          }
        } else if (noOfDays && !noOfhours) {
          if (noOfDays > 1) {
            return noOfDays + " Days";
          } else {
            return noOfDays + " Day";
          }
        } else {
          if (noOfDays > 1 && noOfhours > 1) {
            return noOfDays + " Days " + noOfhours + " hours";
          } else if (noOfDays == 1 && noOfhours == 1) {
            return noOfDays + " Day " + noOfhours + " hour";
          } else if (noOfDays > 1 && noOfhours == 1) {
            return noOfDays + " Days " + noOfhours + " hour";
          } else {
            return noOfDays + " Day " + noOfhours + " hours";
          }
        }
      }
    }
  }
  openModal(data) {
    
    $("#myModal").modal("show");
    this.leaves = data;
    
  }
}
