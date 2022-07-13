import { Component, OnInit } from '@angular/core';
import {LeaveService} from '../../services/leave.service';
import {ProjectService} from '../../services/project.service';
@Component({
  selector: 'app-all-user-list',
  templateUrl: './all-user-list.component.html',
  styleUrls: ['./all-user-list.component.css']
})
export class AllUserListComponent implements OnInit {
  allUser;
  constructor( private leaveService:LeaveService, private projectService:ProjectService) { }

  ngOnInit() {
    this.getAllUser()
  }

  /**
   * get all user
   */
  getAllUser() {
    // this.loading = true;
    this.projectService.getAllDevelopers().subscribe((res: any) => {
      
      this.allUser = res;
      // this.loading = false;
    }, err => {
      
      // this.loading = false;
    })
  }
}
