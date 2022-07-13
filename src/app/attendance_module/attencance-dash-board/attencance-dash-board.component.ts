import {
  Component,
  OnInit,
  Output,
  Input,
  ViewEncapsulation,
  ChangeDetectorRef,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NgxPaginationModule } from "ngx-pagination";
import { LoginService } from "../../services/login.service";
import { AttendanceService } from "../../services/attendance.service";
// import { FilterPipe } from '../filter.pipe';
import { EventEmitter } from "@angular/core";
import * as moment from "moment";
import Swal from "sweetalert2";
import { SearchTaskPipe } from "../../search-task.pipe";

declare var $;
interface window {
  RTCPeerConnection: any;
  mozRTCPeerConnection: any;
  webkitRTCPeerConnection: any;
}
@Component({
  selector: "app-attencance-dash-board",
  templateUrl: "./attencance-dash-board.component.html",
  styleUrls: ["./attencance-dash-board.component.css"],
})
export class AttencanceDashBoardComponent implements OnInit {
  modelValue: any;
  attendanceFlag: any;
  userInfo = JSON.parse(localStorage.getItem("currentUser"));
  // selectedBranch = localStorage.getItem('branchSelected');
  filledAttendanceLog;
  entry: any;
  exit: any;
  fiveDaysLogs: any = [];
  //admin variables
  todaysAttendance: any;
  filteredData = [];
  totalUsers: any;
  presentCount: any;
  p: number = 1;
  loginFlag;
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public _loginService: LoginService,
    public attendanceService: AttendanceService,
    public _change: ChangeDetectorRef,
    public searchTextFilter: SearchTaskPipe
  ) {}

  ngOnInit() {
    this.checkIp();
    var hello;
    var self = this;
    let branchName = localStorage.getItem("branchSelected");
    $(document).ready(function () {
      if (branchName == "Ahemdabad") {
        $("#ahemdabad").addClass("active");
        $("#rajkot").removeClass("active");
      } else if (branchName == "Rajkot") {
        
        $("#rajkot").addClass("active");
        $("#ahemdabad").removeClass("active");
      }
      if (!branchName) {
        $("#rajkot").addClass("active");
        $("#ahemdabad").removeClass("active");
      }
    });
    this.notifyParent.emit(this.userInfo);
    if (!this.userInfo) {
      this.router.navigate(["/login"]);
    }
    //admin functions
    if (this.userInfo.userRole == "admin") {
      this.getTodaysAttendance();
    }

    // employees functions
    if (this.userInfo.userRole != "admin") {
      this.getLastFiveDaysAttendance();
      this.getCurrentDateLogById();
    }
  }

  getCurrentDateLogById() {
    this.attendanceService.getCurrentDateLogById(this.userInfo._id).subscribe(
      (response: any) => {
        
        if (response.detailsOfAttendance.length) {
          
          this.filledAttendanceLog = this.properFormatDate(
            response.detailsOfAttendance
          );
          // this.filledAttendanceLog = this.
          // this.filledAttendanceLog = response;

          var timeLogLength = this.filledAttendanceLog[0].timeLog.length - 1;
          
          var lastRecord =
            this.filledAttendanceLog[0].timeLog[timeLogLength].out;
          if (lastRecord != "-") {
            
            this.exit = this.filledAttendanceLog[0].timeLog[timeLogLength].out;
            this.entry = false;
          } else {
            
            this.entry = this.filledAttendanceLog[0].timeLog[timeLogLength].in;
            this.exit = false;
          }
        }
      },
      (err) => {
        
      }
    );
  }
  checkIp() {
    this._loginService.getIpCliente().subscribe(
      (response) => {
        
      },
      (err) => {
        
        if (
          err.text == "119.160.195.171" ||
          err.text == "27.57.190.69" ||
          err.text == "27.54.180.182 " ||
          err.text == "122.170.44.56"
        ) {
          this.loginFlag = true;
          this.userInfo["loginFlag"] = true;
          localStorage.setItem("currentUser", JSON.stringify(this.userInfo));
          // alert(err.error.text + " --> Valid IP");
        } else {
          this.loginFlag = false;
          this.userInfo["loginFlag"] = false;
          localStorage.setItem("currentUser", JSON.stringify(this.userInfo));
          // alert(err.error.text + " ---> Invalid IP");
        }
      }
    );
  }
  fillAttendance() {
    if (JSON.parse(localStorage.getItem("currentUser")).loginFlag == false) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-default",
          cancelButton: "btn btn-delete",
        },
        buttonsStyling: false,
      });
      swalWithBootstrapButtons
        .fire({
          html:
            "<span style=" +
            "font-size:25px" +
            ">  Are you sure? <strong style=" +
            "font-weight:bold" +
            ">" +
            " " +
            " </strong> ",
          text: "Mark attendance from unauthorized IP address",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          showCloseButton: true,
          reverseButtons: true,
        })
        .then((result) => {
          if (result.value) {
            this.MarkAttendance();
          }
        });
    } else {
      this.MarkAttendance();
    }
  }
  MarkAttendance() {
    this.attendanceService.fillAttendance().subscribe(
      (response: any) => {
        
        this.filledAttendanceLog = this.properFormatDate(response.checkIn.data);
        this.filledAttendanceLog = this.filledAttendanceLog.reverse();
        
       
        var flag = 0;
        this._change.detectChanges();
        if (this.fiveDaysLogs) {
          
          this.fiveDaysLogs.filter((data) => {
            if (data.date == this.filledAttendanceLog[0].date) {
              
              flag = 1;
            }
          });
        }
        if (flag == 0 && this.fiveDaysLogs) {
          this.fiveDaysLogs.unshift(this.filledAttendanceLog[0]);
        } else {
          this.fiveDaysLogs[0] = this.filledAttendanceLog[0];
        }
        var timeLogLength = this.filledAttendanceLog[0].timeLog.length - 1;
        
        var lastRecord = this.filledAttendanceLog[0].timeLog[timeLogLength].out;
        if (lastRecord != "-") {
          this.exit = this.filledAttendanceLog[0].timeLog[timeLogLength].out;
          this.entry = false;
        } else {
          this.entry = this.filledAttendanceLog[0].timeLog[timeLogLength].in;
          this.exit = false;
        }
      },
      (err) => {
        
      }
    );
  }
  getLastFiveDaysAttendance() {
    var id = 0;
    this.attendanceService
      .getLastFiveDaysAttendance(id, this.userInfo._id)
      .subscribe(
        (response: any) => {
          
          if (
            response.detailsOfAttendance.message != "There is no logs found"
          ) {
            // this.fiveDaysLogs = response.detailsOfAttendance.foundLogs
            this.fiveDaysLogs = this.properFormatDate(
              response.detailsOfAttendance.foundLogs
            );
            this.fiveDaysLogs = this.fiveDaysLogs.reverse();
          }
          
          this._change.detectChanges();
          // this.fiveDaysLogs = response;
        },
        (err) => {
          
        }
      );
  }
  // logout() {
  //   
  //   this._loginService.logout();
  //   this.router.navigate(['login']);
  // }
  openModel(index) {
    
    if (
      !this.userInfo.userRole ||
      this.userInfo.userRole == "Team Member" ||
      this.userInfo.userRole == "Manager"
    )
      this.modelValue = this.fiveDaysLogs[index];
    else {
      
      this.modelValue = this.todaysAttendance[index];
    }
    
    $("#myModal").modal("show");
  }

  //admin functionalities
  getTodaysAttendance() {
    this.attendanceService.getTodaysAttendance().subscribe(
      (response: any) => {
        
        this.presentCount = response.presentCount;
        this.totalUsers = response.totalUser;
        this.todaysAttendance = this.properFormatDate(response.data);
        const data = JSON.stringify(this.todaysAttendance);
        this.filteredData = JSON.parse(data);
      },
      (err) => {
        
      }
    );
  }
  searchByName(items) {
    var field1 = (<HTMLInputElement>document.getElementById("nameSearch"))
      .value;
    
    this.todaysAttendance = this.searchTextFilter.transform3(items, field1);
  }

  getUserIP(onNewIP) {
    var myPeerConnection =
      (<any>window).RTCPeerConnection ||
      (<any>window).mozRTCPeerConnection ||
      (<any>window).webkitRTCPeerConnection;
    var pc = new myPeerConnection({
        iceServers: [],
      }),
      noop = function () {},
      localIPs = {},
      ipRegex =
        /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
      key;

    function iterateIP(ip) {
      if (!localIPs[ip]) onNewIP(ip);
      localIPs[ip] = true;
    }

    //create a bogus data channel
    pc.createDataChannel("");

    // create offer and set local description
    pc.createOffer(function (sdp) {
      sdp.sdp.split("\n").forEach(function (line) {
        if (line.indexOf("candidate") < 0) return;
        line.match(ipRegex).forEach(iterateIP);
      });

      pc.setLocalDescription(sdp, noop, noop);
    }, noop);

    //listen for candidate events
    pc.onicecandidate = function (ice) {
      if (
        !ice ||
        !ice.candidate ||
        !ice.candidate.candidate ||
        !ice.candidate.candidate.match(ipRegex)
      )
        return;
      ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
  }
  properFormatDate(data) {
    if (data) 
    return (data = data.filter((obj) => {
      
      return (obj.date = moment(obj.date).utc().format("DD/MM/YYYY"));
    }));
  }
  branchSelector(branchName) {
    
    localStorage.setItem("branchSelected", branchName);
    this.ngOnInit();
  }

  allUserList() {
    let branchName = localStorage.getItem("branchSelected");
    
    this.router.navigate(["./all-employee"], { state: { branch: branchName } });
  }
}
