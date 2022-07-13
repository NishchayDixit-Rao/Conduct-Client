import { Component, OnInit } from '@angular/core';
import { LeaveService } from '../../services/leave.service';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-all-leave-application',
  templateUrl: './all-leave-application.component.html',
  styleUrls: ['./all-leave-application.component.css']
})
export class AllLeaveApplicationComponent implements OnInit {
  PendingLeaves: any = []
  pendingLeavesCount;
  leaves;
  constructor(private leaveService: LeaveService) { }

  ngOnInit() {
    this.getPendingLeaves()
  }
  /**
     * Get Pending Leave Application
     */
  getPendingLeaves() {
    // this.loading = true;
    this.leaveService.getPendingLeaves().subscribe((res: any) => {
      
      this.PendingLeaves = res.data;
      this.pendingLeavesCount = res.data.length;
      
      // this.loading = false;
    }, err => {
      
      // this.loading = false;
    })
  }

  /**
   * Leave Approval
   * @param {String} id 
   */
  leaveApproval(id, status) {
    
    const obj = {
      leaveId: id,
      status: status
    }
    this.leaveService.leaveApprovalBy(obj)
    .subscribe((res: any) => {
      
      if (status == 'Approved') {
        Swal.fire({ type: 'success', title: 'Leave Approved', showConfirmButton: false, timer: 2000 })
      } else {
        Swal.fire({ type: 'success', title: 'Leave Rejected', showConfirmButton: false, timer: 2000 })
      }
      
      this.getPendingLeaves();
    }, err => {
      
    })
  }
  getNoOfDays(days) {
    // 
    if (days.shortLeave) {
      if (days.shortLeave == 1) {
        return days.shortLeave + ' hour';
      }
      return days.shortLeave + ' hours';
    } else {
      if (days.noOfDays < 0) {
        return 'You have no leaves..'
      } else {
        const noOfDays = Math.floor(days.noOfDays / 8)
        // 
        const noOfhours = days.noOfDays % 8;
        // 
        if (!noOfDays && noOfhours) {
          if (noOfhours > 1) {
            return noOfhours + ' hours'
          } else {
            return noOfhours + ' hour'
          }
        } else if (noOfDays && !noOfhours) {
          if (noOfDays > 1) {
            return noOfDays + ' Days'
          } else {
            return noOfDays + ' Day'
          }
        } else {
          if (noOfDays > 1 && noOfhours > 1) {
            return noOfDays + ' Days ' + noOfhours + ' hours';
          } else if (noOfDays == 1 && noOfhours == 1) {
            return noOfDays + ' Day ' + noOfhours + ' hour';
          } else if (noOfDays > 1 && noOfhours == 1) {
            return noOfDays + ' Days ' + noOfhours + ' hour';
          } else {
            return noOfDays + ' Day ' + noOfhours + ' hours';
          }

        }
      }
    }
  }
  openModal(data) {
    
    $('#myModal').modal('show')
    this.leaves = data;
    
  }
}
