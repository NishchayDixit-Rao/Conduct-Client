// import { Component, OnInit } from '@angular/core';
import { Component, OnInit, Output, Input, EventEmitter, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { LeaveService } from '../services/leave.service';
import * as moment from 'moment';
import * as _ from 'lodash';
declare var $: any;
import { config } from '../config';
import { LoginService } from '../services/login.service';
import Swal from 'sweetalert2';
import { AlertService } from '../services/alert.service';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { AllLeaveAppComponent } from '../all-leave-app/all-leave-app.component';
import { MessagingService } from '../services/messaging.service';


@Component({
	selector: 'app-notification',
	templateUrl: './notification.component.html',
	styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
	@Input() acceptedLeave;

	userNotification: any;
	path = config.baseMediaUrl;
	currentUser = JSON.parse(localStorage.getItem('currentUser'));
	allLeaves;
	allAproveLeaves;
	leaves;
	projectId;
	leaveApp;
	rejectedLeave;
	developers;
	rejeLeaves;
	developer;
	projects;
	developerId;
	id;
	projectArr = [];
	finalArr = [];
	project;
	start;
	currentUserId;
	pmStatus;
	utc;
	leaveFlag = false;
	blankArry: any = [];
	allNotification: any = [];
	taskNotification: any = [];
	commentNotification: any = [];
	anotherNotification: any;
	discussionNotification: any = [];
	updateDiscussionNotification: any = [];
	newFileUploadNotification: any = [];
	loader = false;


	constructor(public _messagingservice: MessagingService, public route: ActivatedRoute, public router: Router,
		           public _projectservice: ProjectService, public _leaveService: LeaveService) {
		this._projectservice.notification.subscribe((data: any) => {
			
		});
	}

	ngOnInit() {
		this.get();
		this.getNotificationByUserId();
		
	}
	get() {
		let currentUser = JSON.parse(localStorage.getItem('currentUser'));
		
	}
	getNotificationByUserId() {
		this.loader = true;
		this._projectservice.getNotificationOftask().subscribe((res: any) => {
			this.loader = false;
			this.allNotification = res.allNotification;
			
			_.forEach(this.allNotification, (single) => {
				
				if (single.length) {
					this.blankArry.push(...single);
				}
			});
			

			this.blankArry = _.sortBy(this.blankArry, ['isUnread']);
			this.blankArry.sort(function(a, b) {
				if (a.time > b.time) {
					return -1;
				}
			});
			
			
			this.changeStatusOfNotification(this.allNotification);
		}, error => {
			
			this.loader = false;
		});
	}


	changeStatusOfNotification(allNotification) {
		this._projectservice.changeStatusOfNotification(allNotification).subscribe((res: any) => {
			
		}, error => {
			
		});

	}

	// changeColor(){
	// 	var text = document.getElementById("colorChange");
	// 	// text.classList.remove('hidden')
	// 	text.classList.add("chanegColor")
	// }

	// getNotificationByUserId(currentUserId) {
	// 	
	// 	this._projectservice.getNotificationByUserId(this.currentUser._id).subscribe((res: any) => {
	// 		
	// 		var loginUser = JSON.parse(localStorage.getItem('currentUser'));
	// 		
	// 		this.userNotification = res;
	// 		
	// 		let name = this.userNotification.name;
	// 		
	// 		this.userNotification.sort(custom_sort);
	// 		this.userNotification.reverse();
	// 		var start = new Date();
	// 		start.setTime(1532403882588);
	// 	})
	// 	function custom_sort(a, b) {
	// 		return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
	// 	}
	// }


	notificationType(type) {
		switch (type) {
			case 'task':
				return { class: 'task_span' };
				break;
			case 'discussion':
				return { class: 'task_span1' };
				break;
			case 'addInProject':
				return { class: 'task_span2' };
				break;
			case 'teamMember':
				return { class: 'task_span2' };
				break;
			case 'notice':
				return { class: 'task_span2' };
				break;

			case 'createProject':
				return { class: 'task_span2' };
				break;

			case 'file':
				return { class: 'task_span3' };
				break;

			case 'comment':
				return { class: 'task_span4' };
				break;
			default:
				return { class: 'task_span' };
				break;
		}
	}

	displayTaskType(type) {
		switch (type) {
			case 'task':
				return 'Task';
				break;
			case 'discussion':
				return 'Discussion';
				break;
			case 'file':
				return 'File';
				break;
			case 'comment':
				return 'Comment';
				break;
			default:
				return 'Other';
				break;
		}
	}



	displayLeaveEmit(leave) {
		
	}
	updateNotificationByStatus(leaveId, leaveStatus) {
		const swalWithBootstrapButtons = Swal.mixin({
			customClass: {
				confirmButton: 'btn btn-default',
				cancelButton: 'btn btn-delete'
			},
			buttonsStyling: false,
		});
		swalWithBootstrapButtons.fire({
			title: 'Are you sure?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes',
			cancelButtonText: 'No',
			reverseButtons: true
		})
			.then((result) => {
				this._leaveService.updateNotificationByStatus(leaveId, leaveStatus).subscribe((res: any) => {
					this.pmStatus = res.leaveStatus;
					
					let loginUserName = { name: JSON.parse(localStorage.getItem('currentUser')).name };
					
					for (let i = 0; i < res.pmStatus.length; i++) {
						if (res.pmStatus[i].leaveStatus == 'approved' || res.pmStatus[i].leaveStatus == 'rejected' && res.pmStatus[i].pmanagerId == loginUserName.name) {
							this.leaveFlag = true;
							$('.notification_button').css('cursor', 'auto');
						}
					}
					Swal.fire({
						title: 'Leave applied successfully',
						type: 'success',
						reverseButtons: true
					});
				}, err => {
					
					Swal.fire('Oops...', 'Something went wrong!', 'error');
				});
			});
	}
	redirectPage(link) {
		

		this.router.navigateByUrl(link);
	}
}

