import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { AttendanceService } from '../services/attendance.service';
import { AlertService } from '../services/alert.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import * as _ from 'lodash';
declare var $: any;
import { config } from '../config';
import { LeaveService } from '../services/leave.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { Chart } from 'chart.js';
import { Observable, concat } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { NewEmployeeAddComponent } from '../new-employee-add/new-employee-add.component';

@Component({
	selector: 'app-visit-user-profile',
	templateUrl: './visit-user-profile.component.html',
	styleUrls: ['./visit-user-profile.component.css']
})
export class VisitUserProfileComponent implements OnInit {
	state$: Observable<object>;
	userRole;
	projects;
	developers;
	path = config.baseMediaUrl;
	userId;
	url = '';
	user;
	files;
	developerId = JSON.parse(localStorage.getItem('currentUser'))._id;
	projectArr = [];
	finalArr = [];
	editTEmail;
	currentUser = JSON.parse(localStorage.getItem('currentUser'))._id;
	baseMediaUrl = config.baseMediaUrl;
	singleleave: any;
	loader: boolean = false;
	leaveApp: any;
	leaves: any;
	leavescount: any;
	approvedLeaves: any = [];
	Half_Day = [];
	Full_Day = [];
	More_Day = [];
	Personal_Leave: any = [];
	Sick_Leave: any = [];
	Emergency_Leave: any = [];
	Leave_WithoutPay: any = [];

	totalHoursToWork: any;
	totalHoursWorked: any;
	fiveDaysLogs: any = [];
	logs: any = [];
	search = false;
	modelValue
	p: number = 1;
	editUserDetails
	constructor(private route: ActivatedRoute,
		public _alertService: AlertService,
		private router: Router,
		public activatedRoute: ActivatedRoute,
		public _projectService: ProjectService,
		public _loginService: LoginService,
		public _leaveService: LeaveService,
		public attendanceService: AttendanceService,
		public _change: ChangeDetectorRef,
		public dialog: MatDialog,
	) {
	}

	getEmptytracks() {

		this.leavescount = [
			{
				"typeOfLeave": "Sick_Leave",
				"leavesTaken": Number()
			},
			{
				"typeOfLeave": "Personal_Leave",
				"leavesTaken": Number()
			},
			{
				"typeOfLeave": "Leave_WithoutPay",
				"leavesTaken": Number()
			},
			{
				"typeOfLeave": "Emergency_Leave",
				"leavesTaken": Number()
			},
			{
				"leavesPerYear": 18,
				"leavesLeft": 18
			}
		]
		
	}
	ngOnInit() {

		this.route.params.subscribe(param => {
			this.developerId = param.id;
			
			// this.getDeveloperById();
		});
		// this.getLastFiveDaysAttendance(this.developerId)
		this.state$ = this.activatedRoute.paramMap
			.pipe(map(() => window.history.state))
		this.userRole = window.history.state.userRole
		this.getDeveloperById(this.developerId, this.userRole)
		



		var self = this;

		$(document).ready(function () {
			setTimeout(function () {
				$(function () {
					var start = moment().subtract(5, 'days');
					var end = moment();

					function cb(start, end) {
						self.getRangeDate(start, end);
					}

					$('#reportrange').daterangepicker({
						startDate: start,
						endDate: end,
						ranges: {
							'Today': [moment()/*.add(1 , 'days')*/, moment()],
							'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
							'Last 7 Days': [moment().subtract(6, 'days'), moment()],
							'Last 30 Days': [moment().subtract(29, 'days'), moment()],
							'This Month': [moment().startOf('month'), moment().endOf('month')],
							'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
						}
					}, cb);

					cb(start, end);

				});
			}, 150);
			$('[data-toggle="tooltip"]').tooltip();
		});

	}
	getDeveloperById(id, userRole) {
		// 
		this.loader = true;
		// 
		this._loginService.getUserById(id, userRole).subscribe((res: any) => {
			
			this.currentUser = res.data[0]
			this.editUserDetails = res.data[0]
			this.userRole = this.currentUser.userrole
			if (this.currentUser.project) {
				let projectDetails = this.currentUser.project[0]
				this.projects = projectDetails[0]
			}
			this.loader = false
		}, (err: any) => {
			
		})

	}

	editUser() {
		
		let data = this.editUserDetails
		var addBank = this.openDialog(NewEmployeeAddComponent, data).subscribe((response) => {
			
			if (response != undefined) {
				this.currentUser = response
				// this.developers.push(response)
			}
		})
	}
	openDialog(someComponent, data = {}): Observable<any> {
		
		const dialogRef = this.dialog.open(someComponent, { data });
		return dialogRef.afterClosed();
	}

	resetForm() {
		var start = moment().subtract(5, 'days');
		var end = moment();
		this.getRangeDate(start, end);
		(<HTMLInputElement>document.getElementById("reportrange")).value = "";

	}

	openModel(index) {
		
		this.modelValue = this.logs[index];
		
		this._change.detectChanges();
		$('#myModal').modal('show');
	}


	// getRangeDate(start, end) {
	// 	
	// 	if (this.fiveDaysLogs) {
	// 		
	// 		var increseStartDate: any = moment(start._d).add(1, 'days');
	// 		// new Date(moment(start._d).add(1 , 'days')).toISOString()
	// 		var body = {
	// 			userId: this.currentUser._id,
	// 			startDate: new Date(increseStartDate).toISOString(),
	// 			endDate: new Date(end._d).toISOString()
	// 		}
	// 		
	// 		this.attendanceService.getLogsReportById(body).subscribe((res: any) => {
	// 			this.search = true;
	// 			
	// 			if (res.foundLogs) {
	// 				this.logs = res.foundLogs;
	// 			}
	// 			
	// 		}, (err) => {
	// 			
	// 		});
	// 	}
	// }
	getRangeDate(start, end) {
		

		
		var increseStartDate: any = moment(start._d).add(1, 'days');
		// new Date(moment(start._d).add(1 , 'days')).toISOString()
		var body = {
			userId: this.currentUser._id,
			startDate: new Date(increseStartDate).toISOString(),
			endDate: new Date(end._d).toISOString()
		}
		

		this.attendanceService.getLogsReportById(body).subscribe((res: any) => {
			
			if (res.foundLogs) {
				this.logs = res.foundLogs;
				this.totalHoursToWork = res.TotalHoursToComplete;
				this.totalHoursWorked = res.TotalHoursCompleted;
			}
			else {
				this.logs = res;
				this.totalHoursToWork = "No Log Found";

			}
			this._change.detectChanges();
			// this.calculateTotalDuration(this.logs , resultHours , start._d , end._d);
		}, (err) => {
			
		});

	}
	calculateTotalDuration(array, resultHours, start, end) {
		var workingHours = 0;
		var totalHours = 0;

		if (resultHours < 1)
			resultHours = 1
		for (var i = 0; i < Math.ceil(resultHours); i++) {
			
			var local: any = moment(start._d).subtract(i, 'days');
			local = moment(local._d, "YYYY-MM-DD HH:mm:ss").format('dddd');
			// 

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
	// leaveByUserId(id) {
	// 	this._loginService.getUserById(id).subscribe((res: any) => {
	// 		this.currentUser = res;
	// 		

	// 		
	// 		this._leaveService.leaveByUserId(this.currentUser.email).subscribe((res: any) => {
	// 			
	// 			this.leaveApp = res;
	// 			
	// 			this.leaves = this.leaveApp;
	// 		}, err => {
	// 			
	// 		})

	// 	})
	// }
	// getLeave(id) {
	// 	this._loginService.getUserById(id).subscribe((res: any) => {
	// 		this.currentUser = res;
	// 		

	// 		
	// 		this._leaveService.leaveByUserId(this.currentUser.email).subscribe((res: any) => {
	// 			
	// 			this.leaveApp = res;
	// 			
	// 			// var approvedLeaves:any = [];
	// 			_.forEach(this.leaveApp, (leave) => {
	// 				// 
	// 				if (leave.status == "approved") {
	// 					// 
	// 					this.approvedLeaves.push(leave)
	// 				}
	// 			});
	// 			
	// 			this.getEmptytracks();
	// 			var ctxP = document.getElementById("pieChart");
	// 			var myPieChart = new Chart(ctxP, {
	// 				type: 'pie',
	// 				data: {
	// 					labels: ["Personal Leave", "Sick leave(Illness or Injury)", "Emergency leave", "Leave without pay"],
	// 					datasets: [{
	// 						data: this.getLeaveCount(this.approvedLeaves),
	// 						backgroundColor: ["#181123", "#3998c5", "#91b9cc", "#cacbcc"],
	// 						hoverBackgroundColor: ["gray", "gray", "gray", "gray"]
	// 					}]
	// 				},
	// 				options: {
	// 					responsive: true,
	// 					legend: {
	// 						position: "right",
	// 						labels: {
	// 							boxWidth: 12
	// 						}
	// 					}
	// 				}
	// 			});
	// 			var ctxP = document.getElementById("pieChart1");
	// 			var myPieChart = new Chart(ctxP, {
	// 				type: 'pie',
	// 				data: {
	// 					labels: ["Half Day", "Full Day", "More Day"],
	// 					datasets: [{
	// 						data: this.getLeaveDuration(this.approvedLeaves),
	// 						backgroundColor: ["#181123", "#3998c5", "#91b9cc"],
	// 						hoverBackgroundColor: ["gray", "gray", "gray"]
	// 					}]
	// 				},
	// 				options: {
	// 					responsive: true,
	// 					legend: {
	// 						position: "right",
	// 						labels: {
	// 							boxWidth: 12,
	// 							// usePointStyle:true,
	// 						}
	// 					}
	// 				}
	// 			})
	// 			_.forEach(this.leaveApp, (leave) => {
	// 				_.forEach(this.leavescount, (count) => {
	// 					if (count.typeOfLeave == leave.typeOfLeave && leave.status == "approved") {
	// 						count.leavesTaken = count.leavesTaken + 1;
	// 					}
	// 				});
	// 			});
	// 			
	// 			

	// 		}, err => {
	// 			
	// 		})
	// 	})
	// }
	getLeaveCount(leaves) {
		
		// 
		_.forEach(leaves, (leave) => {
			switch (leave.typeOfLeave) {
				case "Personal_Leave":
					this.Personal_Leave.push(leave);
					break;
				case "Sick_Leave":
					this.Sick_Leave.push(leave);
					break;
				case "Emergency_Leave":
					this.Emergency_Leave.push(leave);
					break;
				case "Leave_WithoutPay":
					this.Leave_WithoutPay.push(leave);
					break;
			}
		});
		
		return [this.Personal_Leave.length, this.Sick_Leave.length, this.Emergency_Leave.length, this.Leave_WithoutPay.length];
	}
	getLeaveDuration(leaves) {
		
		// 

		_.forEach(leaves, (leave) => {
			switch (leave.leaveDuration) {
				case "0.5":
					this.Half_Day.push(leave);
					break;
				case "1":
					this.Full_Day.push(leave);
					break;
				default:
					this.More_Day.push(leave);
					break;
			}
		})
		
		return [this.Half_Day.length, this.Full_Day.length, this.More_Day.length];
	}

	leaveById(leaveid) {
		
		this._leaveService.getbyId(leaveid).subscribe((res: any) => {
			this.singleleave = res[0];
			
		}, err => {
			
		})

	}
}
// this Component is created for guest-user who can visit all team members profile....


