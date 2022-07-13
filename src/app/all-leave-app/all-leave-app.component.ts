import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import {ProjectService} from '../services/project.service';
import { LeaveService } from '../services/leave.service';
import { ImageViewerModule } from 'ng2-image-viewer';
import { AlertService } from '../services/alert.service';
import * as moment from 'moment';
import * as _ from 'lodash';
declare var $: any;
import Swal from 'sweetalert2';
import { config } from '../config';
import { Chart } from 'chart.js';
import { SearchTaskPipe } from '../search-task.pipe';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
// import { ToastrService } from 'ngx-toastr';
// import { MessagingService } from "../services/messaging.service";

@Component({
  selector: 'app-all-leave-app',
  templateUrl: './all-leave-app.component.html',
  styleUrls: ['./all-leave-app.component.css']
})
export class AllLeaveAppComponent implements OnInit {
  @Output() leaveEmit: EventEmitter<any> = new EventEmitter();
  allLeaves;
  allAproveLeaves;
  leaves;
  leaveApp;
  pendingLeaves;
  acceptedLeave;
  rejectedLeave;
  developers;
  developer;
  developerId;
  leavescount: any;
  leavesToDisplay = false;
  approvedLeaves;
  rejectedLeaves;
  appLeaves;
  rejeLeaves;
  comments;
  singleleave: any;
  flag;
  fileUrl;
  loader: boolean = false;
  filteredLeaves = [];
  withoutLeave = [];
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  selectedDeveloperId = "all";
  selectedStatus: any;
  comment;
  leaveid;
  path = config.baseMediaUrl;
  pLeave: boolean = false;
  aLeave: boolean = false;
  rLeave: boolean = false;
  title;
  approvedLeavesCount;
  pendingLeavesCount;

  rejectedLeavesCount;
  pendingLeave = [];
  public myChart: Chart;
  public myChart1: Chart;
  pending_leaves = [];
  approved_leaves = [];
  rejected_leaves = [];
  total;
  round;
  total1;
  round1;
  total2;
  round2;
  availableLeaves;
  pendingFlag: boolean = false;
  approvedFlag: boolean = false;
  rejectedFlag: boolean = false;
  searchResult: boolean = false;
  message;
  constructor(public router: Router, public _leaveService: LeaveService,
    public _alertService: AlertService, private route: ActivatedRoute, public searchTextFilter: SearchTaskPipe) {

  }
  getEmptytracks() {
    
    this.leavescount = [
      {
        "typeOfLeave": "Sick_Leave",
        "leavesTaken": 0
      },
      {
        "typeOfLeave": "Personal_Leave",
        "leavesTaken": 0
      },
      {
        "typeOfLeave": "Leave_WithoutPay",
        "leavesTaken": 0
      },
      {
        "typeOfLeave": "Emergency_Leave",
        "leavesTaken": 0
      },
      {
        "leavesPerYear": 18,
        "leavesLeft": 18
      }
    ]
    
  }
  ngOnInit() {
    // this.getLeaves();
    // this.getApprovedLeaves();
    this.leavesByUserId();
    this.getAllDevelopers(Option);
    this.getAllLeaves();
    this.getApprovedLeaves(Option);
    this.getRejectedLeaves(Option);
    this.getLeaves(Option);
    // this. getAllLeave();

    // this.getRejectedLeaves();

    // this.route.params.subscribe(param=>{
    //   this.developerId = param.id;
    //   this.leavesByUserId(this.developerId);
    // })
    // this.filterTracks(developerId);

    // }

    // getApprovedLeaves(){
    //   this._leaveService.approvedLeaves().subscribe(res=>{
    //     
    //     this.leaveApp = res;
    //     $('#statusAction').hide();
    //     _.map(this.leaveApp, leave=>{
    //       _.forEach(this.developers, dev=>{
    //         if(leave.email == dev.email){
    //           leave['dev']= dev;
    //         }

    // this.filterTracks(developerId);
    $("body").click((event) => {
      event.stopPropagation();
      $(".search").removeClass("open");
    });
    $('#centralModalInfo').on('hidden.bs.modal', function () {
      $('.modal-body').find('textarea').val('');
    });


  }


  openSearch() {
    $(".search .btn").parent(".search").toggleClass("open");
    $('.search').click((evt) => {
      evt.stopPropagation();

    });
  }
  getApprovedLeaves(option) {
    $("#target").val($("#target option:first").val());
    this.loader = true;
    this.withoutLeave = [];
    setTimeout(() => {
      this.title = option;
      this._leaveService.approvedLeaves().subscribe(res => {
        
        this.leaveApp = res;
        // 
        this.approvedLeavesCount = this.leaveApp.length;
        $('#statusAction').hide();
        _.map(this.leaveApp, leave => {
          _.forEach(this.developers, dev => {
            if (leave.email == dev.email) {
              leave['dev'] = dev;
            }
          })
        })
        _.forEach(this.leaveApp, (approved) => {
          approved.startingDate = moment(approved.startingDate).format('YYYY-MM-DD');
          approved.endingDate = moment(approved.endingDate).format('YYYY-MM-DD');
        })
        this.allAproveLeaves = this.leaveApp;
        
        
        this.getLeaveCount(this.allAproveLeaves);
        this.getLeaveDuration(this.allAproveLeaves);
        this.getEmptytracks();
        var datas = document.getElementById("barChart");
        if (datas) {
          if (this.myChart) this.myChart.destroy();
          this.myChart = new Chart(datas, {
            type: 'bar',
            data: {
              labels: ["Personal Leave", "Sick leave(Illness or Injury)", "Emergency leave", "Leave without pay"],
              datasets: [{
                label: 'Types of Leaves',
                data: this.getLeaveCount(this.allAproveLeaves),
                backgroundColor: ["#181123", "#3998c5", "#91b9cc", "#cacbcc"],
                hoverBackgroundColor: ["gray", "gray", "gray", "gray"]
              }]
            },
            options: {

              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }]
              }
            }
          });
        }
        if (this.myChart1) this.myChart1.destroy();
        var ctxP = document.getElementById("pieChart1");
        if (ctxP) {
          this.myChart1 = new Chart(ctxP, {
            type: 'pie',
            data: {
              labels: ["Half Day", "Full Day", "More Day"],
              datasets: [{
                data: this.getLeaveDuration(this.allAproveLeaves),
                backgroundColor: ["#181123", "#3998c5", "#91b9cc"],
                hoverBackgroundColor: ["gray", "gray", "gray"]
              }]
            },

            options: {
              responsive: true,
              legend: {
                position: "right",
                labels: {
                  boxWidth: 12,
                  // usePointStyle:true,
                }
              }
            }
          });
        }

        this.aLeave = true;
        this.pLeave = false;
        this.rLeave = false;
        // this.aLeave = false;

      })
      this.loader = false;
    }, 3000);
  }
  getRejectedLeaves(option) {
    $("#target").val($("#target option:first").val());
    this.loader = true;
    this.withoutLeave = [];
    setTimeout(() => {
      this.title = option;
      this._leaveService.rejectedLeaves().subscribe(res => {
        
        this.leaveApp = res;
        this.rejectedLeavesCount = this.leaveApp.length;
        // this.getApprovedLeaves(option)
        // this.getPendingLeavs(option)
        // 
        $('#statusAction').hide();
        _.map(this.leaveApp, leave => {
          _.forEach(this.developers, dev => {
            if (leave.email == dev.email) {
              leave['dev'] = dev;
            }
          })
        })
        _.forEach(this.leaveApp, (rejected) => {
          rejected.startingDate = moment(rejected.startingDate).format('YYYY-MM-DD');
          rejected.endingDate = moment(rejected.endingDate).format('YYYY-MM-DD');
        })
        this.rejeLeaves = this.leaveApp;
        
        this.getLeaveCount(this.leaveApp);
        this.getLeaveDuration(this.leaveApp);
        this.getEmptytracks();
        var datas = document.getElementById("barChart");
        if (this.myChart) this.myChart.destroy();
        if (datas) {
          this.myChart = new Chart(datas, {
            type: 'bar',
            data: {
              labels: ["Personal Leave", "Sick leave(Illness or Injury)", "Emergency leave", "Leave without pay"],
              datasets: [{
                label: 'Types of Leaves',
                data: this.getLeaveCount(this.leaveApp),
                backgroundColor: ["#181123", "#3998c5", "#91b9cc", "#cacbcc"],
                hoverBackgroundColor: ["gray", "gray", "gray", "gray"]
              }]
            },
            options: {

              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }]
              }
            }
          });
        }

        var ctxP = document.getElementById("pieChart1");
        if (this.myChart1) this.myChart1.destroy();
        if (ctxP) {
          this.myChart1 = new Chart(ctxP, {
            type: 'pie',
            data: {
              labels: ["Half Day", "Full Day", "More Day"],
              datasets: [{
                data: this.getLeaveDuration(this.leaveApp),
                backgroundColor: ["#181123", "#3998c5", "#91b9cc"],
                hoverBackgroundColor: ["gray", "gray", "gray"]
              }]
            },

            options: {
              responsive: true,
              legend: {
                position: "right",
                labels: {
                  boxWidth: 12,
                  // usePointStyle:true,
                }
              }
            }
          });
        }

        this.rLeave = true;
        this.aLeave = false;
        this.pLeave = false;
      }, err => {
        
      })
      this.loader = false;
    }, 1000);
    // this.aLeave = false;
  }

  getLeaves(option) {
    
    $("#target").val($("#target option:first").val());
    this.loader = true;
    this.withoutLeave = [];
    setTimeout(() => {
      this.title = option;
      this._leaveService.pendingLeaves().subscribe(res => {
        this.leaveApp = res;
        this.pendingLeavesCount = this.leaveApp.length;
        // this.getApprovedLeaves(option)
        // this.getRejectedLeaves(option);
        $('#pending').css('background-image', 'linear-gradient(#e6a6318f,#f3820f)');
        
        $('#statusAction').show();
        _.map(this.leaveApp, leave => {
          _.forEach(this.developers, dev => {
            if (leave.email == dev.email) {
              leave['dev'] = dev;
            }

          })
        })
        _.map(this.leaveApp, leave => {
          var attach = [];
          _.map(leave.attechment, att => {
            attach.push(this.path + att);
          })
          leave.attechment = attach;
        })
        
        _.forEach(this.leaveApp, (leave) => {
          leave.startingDate = moment(leave.startingDate).format('YYYY-MM-DD');
          leave.endingDate = moment(leave.endingDate).format('YYYY-MM-DD');
        });

        this.pendingLeaves = this.leaveApp;
        
        this.getLeaveCount(this.leaveApp);
        this.getLeaveDuration(this.leaveApp);
        this.getEmptytracks();
        var datas = document.getElementById("barChart");
        if (this.myChart) this.myChart.destroy();
        if (datas) {
          this.myChart = new Chart(datas, {
            type: 'bar',
            data: {
              labels: ["Personal Leave", "Sick leave(Illness or Injury)", "Emergency leave", "Leave without pay"],
              datasets: [{
                label: 'Types of Leaves',
                data: this.getLeaveCount(this.leaveApp),
                backgroundColor: ["#181123", "#3998c5", "#91b9cc", "#cacbcc"],
                hoverBackgroundColor: ["gray", "gray", "gray", "gray"]
              }]
            },
            options: {

              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }]
              }
            }
          });
        }

        var ctxP = document.getElementById("pieChart1");
        if (this.myChart1) this.myChart1.destroy();
        if (ctxP) {
          this.myChart1 = new Chart(ctxP, {
            type: 'pie',
            data: {
              labels: ["Half Day", "Full Day", "More Day"],
              datasets: [{
                data: this.getLeaveDuration(this.leaveApp),
                backgroundColor: ["#181123", "#3998c5", "#91b9cc"],
                hoverBackgroundColor: ["gray", "gray", "gray"]
              }]
            },

            options: {
              responsive: true,
              legend: {
                position: "right",
                labels: {
                  boxWidth: 12,
                  // usePointStyle:true,
                }
              }
            }
          });
        }

        this.pLeave = true;
        this.aLeave = false;
        this.rLeave = false;
      }, err => {
        
      });
      this.loader = false;
    }, 1000);
  }
  getAllLeaves() {
    this.leavesToDisplay = true
    this._leaveService.getAllLeaves().subscribe(res => {
      
      this.allLeaves = res;
      
      $('#statusAction').show();
      _.map(this.allLeaves, leave => {
        _.forEach(this.developers, dev => {
          if (leave.email == dev.email) {
            leave['dev'] = dev;
          }

        })
      })
      _.forEach(this.allLeaves, (leave) => {
        leave.startingDate = moment(leave.startingDate).format('YYYY-MM-DD');
        leave.endingDate = moment(leave.endingDate).format('YYYY-MM-DD');
      });
      this.getLeaveType(this.allLeaves);
      this.getEmptytracks();
      var leaves = this.getPendingLeavs("pending");
      
      var projectLength = this.allLeaves.length;
      
      var allcompleteproject = leaves * 100 / projectLength;
      
      this.total = allcompleteproject;
      
      this.round = Math.round(this.total);
      

      var leaves1 = this.getPendingLeavs("approved");
      
      var allcompleteproject1 = leaves1 * 100 / projectLength;
      
      this.total1 = allcompleteproject1;
      
      this.round1 = Math.round(this.total1);
      

      var leaves2 = this.getPendingLeavs("rejected");
      
      var allcompleteproject2 = leaves2 * 100 / projectLength
      
      this.total2 = allcompleteproject2;
      
      this.round2 = Math.round(this.total2);
      

      $(function () {
        $('.min-chart#chart-sales').easyPieChart({
          barColor: "#3998c5",
          onStep: function (from, to, percent) {
            $(this.el).find('.percent').text(Math.round(percent));
          }
        });
      });
      var ctxP = document.getElementById("pieChart");
      var myPieChart = new Chart(ctxP, {
        type: 'doughnut',
        data: {
          labels: ["Personal Leave", "Sick leave(Illness or Injury)", "Emergency leave", "Leave without pay"],
          datasets: [{
            label: 'Types of Leaves',
            data: this.getLeaveCount(this.allLeaves),
            backgroundColor: ["#181123", "#3998c5", "#91b9cc", "#cacbcc"],
            hoverBackgroundColor: ["gray", "gray", "gray", "gray"]
          }]
        },
        options: {
          responsive: true,
          legend: {
            position: "right",
            labels: {
              boxWidth: 12
            }
          }
        }
      });

      var ctxP = document.getElementById("pieChart2");
      var myPieChart1 = new Chart(ctxP, {
        type: 'pie',
        data: {
          labels: ["Half Day", "Full Day", "More Day"],
          datasets: [{
            label: 'Duration of Leaves',
            data: this.getLeaveDuration(this.allLeaves),
            backgroundColor: ["#181123", "#3998c5", "#91b9cc"],
            hoverBackgroundColor: ["gray", "gray", "gray"]
          }]
        },

        options: {
          responsive: true,
          legend: {
            position: "top",
            labels: {
              boxWidth: 12,
              // usePointStyle:true,
            }
          }
        }
      });
      this.pLeave = true;
      this.aLeave = true;
      this.rLeave = true;

    }, err => {
      

    });
  }
  getPendingLeavs(status) {
    return _.filter(this.allLeaves, function (o) { if (o.status == status) return o }).length;
  }


  getLeaveCount(leaves) {
    // 
    // 
    var Personal_Leave: any = [];
    var Sick_Leave: any = [];
    var Emergency_Leave: any = [];
    var Leave_WithoutPay: any = [];
    _.forEach(leaves, (leave) => {
      switch (leave.typeOfLeave) {
        case "Personal_Leave":
          Personal_Leave.push(leave);
          break;
        case "Sick_Leave":
          Sick_Leave.push(leave);
          break;
        case "Emergency_Leave":
          Emergency_Leave.push(leave);
          break;
        case "Leave_WithoutPay":
          Leave_WithoutPay.push(leave);
          break;
      }
    });
    
    return [Personal_Leave.length, Sick_Leave.length, Emergency_Leave.length, Leave_WithoutPay.length];
  }


  getLeaveDuration(leaves) {
    // 
    // 
    var Half_Day = [];
    var Full_Day = [];
    var More_Day = [];
    _.forEach(leaves, (leave) => {
      switch (leave.leaveDuration) {
        case "0.5":
          Half_Day.push(leave);
          break;
        case "1":
          Full_Day.push(leave);
          break;
        default:
          More_Day.push(leave);
          break;
      }
    })
    
    return [Half_Day.length, Full_Day.length, More_Day.length];
  }

  getLeaveType(leaves) {
    this.pending_leaves = [];
    this.approved_leaves = [];
    this.rejected_leaves = [];
    _.forEach(leaves, (leave) => {
      switch (leave.status) {
        case "pending":
          this.pending_leaves.push(leave);
          break;
        case "approved":
          this.approved_leaves.push(leave);
          break;
        case "rejected":
          this.rejected_leaves.push(leave);
          break;
      }
    })
    
    return [this.pending_leaves.length, this.approved_leaves.length, this.rejected_leaves.length];

  }

  getFilteredLeaves() {
    $('.total_leave').css('display', 'none')
    this.isFromSelect = false;
    switch (this.selectedStatus) {
      case "pending":
        this.getLeaves('Pending');
        this.pendingFlag = true;
        this.approvedFlag = false;
        this.rejectedFlag = false;
        break;
      case "approved":
        this.getApprovedLeaves('Approved');
        this.approvedFlag = true;
        this.pendingFlag = false;
        this.rejectedFlag = false;
        break;
      case "rejected":
        this.getRejectedLeaves('Rejected');
        this.rejectedFlag = true;
        this.approvedFlag = false;
        this.pendingFlag = false;
        break;
      default:
        
        break;
    }
  }

  getAllDevelopers(option) {
    // this.title='Application';
    this._leaveService.getAllDevelopers().subscribe(res => {
      
      this.developers = res;
      // this.developers.sort(function(a, b){
      //     var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
      //     if (nameA < nameB) //sort string ascending
      //       return -1 
      //     if (nameA > nameB)
      //       return 1
      //     return 0 
      //   })


      _.map(this.leaveApp, leave => {
        _.forEach(this.developers, dev => {
          if (leave.email == dev.email) {
            leave['dev'] = dev;
          }
        })
      })
      
    }, err => {
      
      this._alertService.error(err);
    })
  }


  leaveAccepted(req) {
    this.leaveById(req);
    var body;
    
    
    
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-default',
        cancelButton: 'btn btn-delete'
      },
      buttonsStyling: false,
    })
    setTimeout(() => {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-default',
          cancelButton: 'btn btn-delete'
        },
        buttonsStyling: false,
      })
      swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "Leaves Left: " + this.availableLeaves,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#181123',
        cancelButtonColor: '#f44336',
        confirmButtonText: 'Approve',
        cancelButtonText: 'Cancle',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
          var body;
          
          _.forEach(this.leaveApp, (apply) => {
            if (apply._id == req) {
              body = apply;
              body.status = "approved";
            }
          })
          
          var dev = req.email;
          
          this._leaveService.leaveApproval(req, body).subscribe((res: any) => {
            
            this._leaveService.approvedLeaves().subscribe((response: any) => {
              
              this.approvedLeavesCount = response.length
            })
            let name = res.name;
            // moment(leave.startingDate).format('YYYY-MM-DD');
            let date = moment(res.startingDate).format('YYYY-MM-DD')
            

            Swal.fire(
              'Approve!',
              "Leave of " + name + " from " + date + " is approved successfully",
              'success'
            )
            body.status = "approved";
            
            
            this.acceptedLeave = res;
            
            // this.leaveEmit.emit(this.acceptedLeave);
            // this.getLeaves(Option);
            this.getLeaves(this.title);
            
            // this.filterTracks(dev);
          }, (err: any) => {
            
            Swal.fire('Oops...', 'Something went wrong!', 'error')
          });
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          Swal.fire(
            'Cancled',
            'Leave is not approved.',
            'error'
          )
        }
      })


    }, 80);

  }

  leaveRejected(req) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-default',
        cancelButton: 'btn btn-delete'
      },
      buttonsStyling: false,
    })
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      reverseButtons:true
    }).then((result) => {
      if (result.value) {
        var body;
        
        
        _.forEach(this.leaveApp, (apply) => {
          if (apply._id == req) {
            body = apply;
            body.status = "rejected";
          }
        })
        
        var dev = req.email;
        
        this._leaveService.leaveApproval(req, body).subscribe((res: any) => {
          Swal.fire(
            'Rejected!',
            'Your Leave has been Rejected.',
            'success'
          )
          this._leaveService.rejectedLeaves().subscribe((res: any) => {
            
            this.rejectedLeavesCount = res.length
          })
          body.status = "rejected";
          
          
          this.rejectedLeave = res;
          
          this.getLeaves(this.title);
          
          // this.filterTracks(dev);
        }, (err: any) => {
          
          Swal.fire('Oops...', 'Something went wrong!', 'error')
        })
      }
    })
  }
  isFromSelect: boolean = false;

  filterTracks(developerId) {
    this.isFromSelect = true;
    this.loader = true;
    this.withoutLeave = [];
    setTimeout(() => {
      this.getEmptytracks();
      var obj = { email: developerId };
      
      this._leaveService.leavesById(obj).subscribe((res: any) => {
        
        this.leaves = res;
        _.forEach(this.leaves, (leave) => {
          $('#statusAction').hide();
          _.map(this.leaves, leave => {
            _.forEach(this.developers, dev => {
              if (leave.email == dev.email) {
                leave['dev'] = dev;
              }
            })
          })
          var name = leave.name
          this.title = name;
          
          leave.startingDate = moment(leave.startingDate).format('YYYY-MM-DD');
          leave.endingDate = moment(leave.endingDate).format('YYYY-MM-DD');
        })
        
        if (developerId != 'all') {
          this.leaveApp = [];
          $('.unselected').css('display', 'block');
          $('.selected').css('display', 'none');
          
          _.forEach(this.leaves, (leave) => {
            
            if (developerId == leave.email) {
              if (leave.status) {
                
                $('.unselected').css('display', 'none');
                $('.selected').css('display', 'block');
                this.leaveApp.push(leave);
                
              } else {
                this.withoutLeave.push(leave)
              }


            }
          });
        } else {
          
        }

      }, err => {
        
      })
      this.loader = false;
    }, 1000);
  }


  sortLeavesByFromDate(type) {
    
    this.leaveApp.sort(custom_sort);
    if (type == 'desc') {
      this.leaveApp.reverse();
    }
    
    function custom_sort(a, b) {
      return new Date(new Date(a.startingDate)).getTime() - new Date(new Date(b.startingDate)).getTime();
    }
  }

  onKey(searchText) {
    if (this.pLeave == true) {
      
      var dataToBeFiltered = [this.pendingLeaves];
    } else if (this.aLeave == true) {
      
      var dataToBeFiltered = [this.allAproveLeaves];
    } else if (this.rLeave == true) {
      
      var dataToBeFiltered = [this.rejeLeaves];
    }
    var leave = this.searchTextFilter.transform2(dataToBeFiltered, searchText);
    
    // if (leave.length > 0) {
      this.searchResult = false;
      this.leaveApp = [];
      _.forEach(leave, (content) => {
        this.leaveApp.push(content);
      });
      if(!leave.length){
        
        this.searchResult = true;
      }
    // }
  }


  leavesByUserId() {
    var obj = { email: JSON.parse(localStorage.getItem('currentUser')).email };
    
    this._leaveService.leavesById(obj).subscribe((res: any) => {
      
      this.leaves = res;
      _.forEach(this.leaves, (leave) => {
        leave.startingDate = moment(leave.startingDate).format('YYYY-MM-DD');
        leave.endingDate = moment(leave.endingDate).format('YYYY-MM-DD');
      })
      
    }, err => {
      
    })
  }
  leaveById(leaveid, option?) {
    
    this._leaveService.getbyId(leaveid).subscribe((res: any) => {
      this.singleleave = res[0];
      var obj = this.singleleave.email;
      
      this._leaveService.leaveByUserId(obj).subscribe((res: any) => {
        
        this.leaves = res;
        this.getEmptytracks();
        _.forEach(this.leaves, (leave) => {
          
          _.forEach(this.leavescount, (count) => {
            if (count.typeOfLeave == leave.typeOfLeave && leave.status == "approved") {
              
              count.leavesTaken = count.leavesTaken + 1;
            }
          });
        });

        
        
        this.availableLeaves = this.leavescount[4].leavesLeft;
        
        if (option) {

          option == 'view' ? $("#viewMore").modal('show') : $("#centralModalInfo").modal('show');
        }
      }, err => {
        
      })
    })

  }





  submitComment(leaveid, comment) {
    
    
    var data = {
      leaveId: leaveid,
      comment: comment
    }
    
    this._leaveService.addComments(data).subscribe((res: any) => {
      // if(this.comment == ""){
      //   Swal.fire('Oops...', 'Please enter some text !', 'error')
      // }
      res['comment'] = true;
      
      Swal.fire({ type: 'success', title: 'Comment Added Successfully', showConfirmButton: false, timer: 2000 })
      $('#centralModalInfo').modal('hide');

      this.comment = "";
    }, err => {
      
      Swal.fire('Oops...', 'Something went wrong!', 'error')
    })
  }

  gotAttachment = [];
  sendAttachment(attechment) {
    
    this.gotAttachment = attechment;
    $('#veiwAttach').modal('show')
    
  }
  cancel() {
    this.comment = "";
  }

}

