import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import{LeaveService} from '../../services/leave.service';
declare var $: any;

@Component({
  selector: 'app-single-user-leave',
  templateUrl: './single-user-leave.component.html',
  styleUrls: ['./single-user-leave.component.css']
})
export class SingleUserLeaveComponent implements OnInit {
  userId;
  userLeaves
  leaves;
  constructor(private leaveService:LeaveService, private route:ActivatedRoute) { }

  ngOnInit() {

    this.route.params.subscribe(param => {
      
      this.userId = param.id;
      
      // this.getUserById(this.userId);
      this.getLeaveByUserId(this.userId);
    });
  }

  getLeaveByUserId(id){
    
    this.leaveService.getLeaveByUserId(id).subscribe((res: any) => {
      this.userLeaves = res.data;
      
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
