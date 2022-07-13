import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { FormControl, FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import * as _ from "lodash";
declare var $: any;
import { config } from '../config';
import Swal from 'sweetalert2';
import { ConcatSource } from 'webpack-sources';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'app-edit-project',
	templateUrl: './edit-project.component.html',
	styleUrls: ['./edit-project.component.css']
})

export class EditProjectComponent implements OnInit {
	@ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
	availableDevelopers: any = [];
	projectTeam: any = [];
	projectMngrTeam: any = [];
	availableProjectMngr = [];
	projects;
	editAvail;
	projectId;
	leavescount: any;
	dteam: any = [];
	pmTeam = [];
	updateForm: FormGroup;
	availData;
	developerShow = false;
	allDevelopers;
	availDevelopers;
	teamMemberId: any = [];
	projectManagerId: any = [];
	loader: boolean = false;
	showDeveloper: boolean = false;
	basMediaUrl = config.baseMediaUrl;
	developers;
	projectMngr;
	files: Array<File> = [];
	ProjectId;
	url = '';
	devId;
	submitted = false;
	editFormValueChanges: string;
	projectAvatar = JSON.parse(localStorage.getItem('currentUser'));
	isDisable: boolean = false;
	currentUser = JSON.parse(localStorage.getItem('currentUser'));
	pmArray = [];
	developerArray = [];
	isSelectFile: boolean = false;
	changeAvatar;
	constructor(public router: Router, public _projectService: ProjectService, public route: ActivatedRoute, public _change: ChangeDetectorRef) {
		this.updateForm = new FormGroup({
			title: new FormControl('', [Validators.required, Validators.maxLength(60)]),
			description: new FormControl('', [Validators.required, Validators.maxLength(300)]),
			taskAlias: new FormControl(''),
			deadline: new FormControl(''),
			avatar: new FormControl(''),
			projectManager: new FormControl([]),
			teamMembers: new FormControl([])
		});
		this.route.params.subscribe(params => {
			this.ProjectId = params.id;
			
			this.getEditprojectDetails(this.ProjectId);
			this.getUsersNotInProject(this.ProjectId);
		})

	}

	ngViewAfterChecked() {
		this._change.detectChanges();
	}
	ngOnDestroy() {
		this._change.detach();
	}

	ngOnInit() {
	}

	openDate() {
		
		$('#date-picker1').pickadate({
			min: new Date(),
			onSet: function (context) {
				
				setDate(context);
				change();
			}
		});
		var change: any = () => {
			this.updateForm.controls.deadline.setValue($('.date-picker1').val());
		}

		var setDate = (context) => {
			this.timePicked();
		}
	}

	timePicked() {
		this.updateForm.controls.deadline.setValue($('#date-picker1').val())
		this.availData.deadline.setValue(this.updateForm.controls.deadline.setValue($('#date-picker1').val()))
		
	}

	get f() { return this.updateForm.controls; }

	getEditprojectDetails(id) {
		this.loader = false;
		
		this._projectService.getProjectById(id).subscribe((res: any) => {
			
			this.availData = res.data
			localStorage.setItem("teams", JSON.stringify(this.availData))
			this.availData['add'] = [];
			this.availData['delete'] = [];
			this.availData['pmAdd'] = [];
			this.availData['pmRemove'] = [];
			this.url = this.basMediaUrl + this.availData.avatar;
			
			this.loader = false;
			this.projectTeam = this.availData.teamMembers;
			localStorage.setItem('teams', JSON.stringify(this.projectTeam))
			
			_.forEach(this.projectTeam, (member) => {
				
				this.teamMemberId.push(member._id);
			})
			this.projectMngrTeam = this.availData.projectManager;
			_.forEach(this.projectMngrTeam, (pm1) => {
				
				this.projectManagerId.push(pm1._id)
			})
			
		}, err => {
			
			this.loader = false;
		})
	}

	getUsersNotInProject(projectId) {
		this._projectService.getUsersNotInProject(projectId).subscribe((response: any) => {
			
			this.availableDevelopers = response.teamMembers
			
			this.dteam = [];
			_.forEach(this.availableDevelopers[0], (developer) => {
				
				this.dteam.push(developer);
			})
			this.pmTeam = [];
			this.availableProjectMngr = response.projectManager
			_.forEach(this.availableProjectMngr[0], (projectManager) => {
				
				this.pmTeam.push(projectManager);
			})
			
			
		}, error => {
			console.error("error of not getting users", error)
		})
	}


	addDeveloper(event) {
		
		if (event) {
			let developer = {
				_id: event._id,
				name: event.name,
				userRole: event.userRole,
				profilePhoto: event.profilePhoto
			}
			this.projectTeam.push(developer);
			this.availData.add.push(event._id);
		}
		this.dteam = this.dteam.filter(deve => deve._id !== event._id)
		
		

	}

	removeDeveloper(event) {
		
		const swalWithBootstrapButtons = Swal.mixin({
			customClass: {
				confirmButton: 'btn btn-default',
				cancelButton: 'btn btn-delete'
			},
			buttonsStyling: false,
		})
		swalWithBootstrapButtons.fire({
			html: "<span style=" + 'font-size:20px' + ">  Are you sure you want to remove <strong style=" + 'font-weight:bold' + ">" + " " + event.name + " </strong> " + " from  <strong style=" + 'font-weight:bold' + ">" + " " + this.availData.title + "</strong> ? </span>",
			type: 'warning',
			showCancelButton: true,
			// confirmButtonColor: '#3085d6',
			// cancelButtonColor: '#d33',
			confirmButtonText: 'Delete',
			showCloseButton: true
		}).then((result) => {
			
			if (result.value) {
				var body;
				this.projectTeam.splice(_.findIndex(this.projectTeam, event), 1);
				
				if (_.findIndex(this.dteam, { _id: event._id }) == -1) {
					this.teamMemberId.splice(this.teamMemberId.indexOf(event._id), 1);
					
					this.availData.delete.push(event);
					this.availData.add.splice(this.availData.add.indexOf(event._id), 1)
					this.ngSelectComponent.handleClearClick();
					this.dteam = this.availableDevelopers[0]
					
				}
			}
			

		})
	}



	addProjectManager(event) {
		
		if (event) {
			let projectManagers = {
				_id: event._id,
				name: event.name,
				userRole: event.userRole,
				profilePhoto: event.profilePhoto
			}
			this.projectMngrTeam.push(projectManagers);
			this.availData.pmAdd.push(event._id);
		}
		this.pmTeam = this.pmTeam.filter(deve => deve._id !== event._id)
		// this.ngSelectComponent.handleClearClick();
	}

	removeProjectManager(event) {
		Swal.fire({
			html: "<span style=" + 'font-size:25px' + ">  Are you sure you want to remove <strong style=" + 'font-weight:bold' + ">" + " " + event.name + " </strong> " + " from  <strong style=" + 'font-weight:bold' + ">" + " " + this.availData.title + "</strong> ? </span>",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#181123',
			cancelButtonColor: '#f44336',
			confirmButtonText: 'Delete',
			showCloseButton: true
		}).then((result) => {
			if (result.value) {
				var body;
				this.projectMngrTeam.splice(_.findIndex(this.projectMngrTeam, event), 1);
				if (_.findIndex(this.pmTeam, { _id: event._id }) == -1) {
					this.projectManagerId.splice(this.projectManagerId.indexOf(event._id), 1);
					this.availData.pmRemove.push(event)
					this.availData.pmAdd.splice(this.availData.pmAdd.indexOf(event._id), 1)
					this.ngSelectComponent.handleClearClick();
					this.pmTeam = this.availableProjectMngr[0]
				}
				
			}
		})
	}
	updateProject(updateForm) {
		
		this.submitted = true;
		if (this.updateForm.invalid) {
			return;
		}
		this.isDisable = true;

		updateForm.teamMembers = [];
		_.forEach(this.availData.teamMembers, dev => {
			
			let developerid = {
				_id: dev._id
			}
			updateForm.teamMembers.push(developerid);
		})
		updateForm.projectManager = [];
		_.forEach(this.availData.projectManager, pm => {
			let projectManagerId = {
				_id: pm._id
			}
			updateForm.projectManager.push(projectManagerId)
		})
		updateForm.delete = [];
		_.forEach(this.availData.delete, (removeDeve) => {
			
			let removeId = {
				_id: removeDeve._id
			}
			updateForm.delete.push(removeId)
		})
		updateForm.add = [];
		_.forEach(this.availData.add, (singleDeve) => {
			
			let teamId = {
				_id: singleDeve
			}
			updateForm.add.push(teamId)
		})
		updateForm.pmAdd = [];
		_.forEach(this.availData.pmAdd, (singlePm) => {
			
			let pmId = {
				_id: singlePm
			}
			updateForm.pmAdd.push(pmId)
		})
		updateForm.pmRemove = []
		_.forEach(this.availData.pmRemove, (removePm) => {
			
			let removePmId = {
				_id: removePm._id
			}
			updateForm.pmRemove.push(removePmId)
		})

		updateForm.taskAlias = this.availData.taskAlias;
		updateForm.avatar = this.availData.avatar;
		updateForm._id = this.availData._id;
		updateForm.deadline = this.availData.deadline;
		updateForm.deadline = $("#date-picker1").val();
		const data = new FormData();
		data.append('title', updateForm.title);
		data.append('description', updateForm.description);
		data.append('taskAlias', updateForm.taskAlias);
		data.append('deadline', updateForm.deadline);
		data.append('add', JSON.stringify(updateForm.add))
		data.append('delete', JSON.stringify(updateForm.delete))
		data.append('pmAdd', JSON.stringify(updateForm.pmAdd))
		data.append('pmRemove', JSON.stringify(updateForm.pmRemove))
		if (this.files && this.files.length > 0) {
			data.append('upload', this.files[0]);
		}
		if (this.changeAvatar) {
			data.append('avatar', this.changeAvatar)
		}
		else if (updateForm.avatar) {
			data.append('avatar', updateForm.avatar)
		}
		$('.selectedDeveloper').css('display', 'none')
		
		this._projectService.updateProject(updateForm._id, data).subscribe((response: any) => {
			this.loader = false;
			this.availableDevelopers = []
			this.dteam = []
			this.teamMemberId = []
			this.ngSelectComponent.handleClearClick();
			Swal.fire({ type: 'success', title: 'Project Updated Successfully', showConfirmButton: false, timer: 3000 })
			this.getEditprojectDetails(this.ProjectId)
			this.getUsersNotInProject(this.ProjectId);
			this.url = '';
			this.isDisable = false;
			// this.clearSelection(event)
		}, error => {
			Swal.fire('Oops...', 'Something went wrong!', 'error')
			this.isDisable = false;
		})
	}

	deleteProject(projectId) {
		
		if (projectId.tasks) {
			Swal.fire({
				title: 'You can not delete this project!',
				html: "Number of team-members : <strong style=" + 'font-weight:bold' + ">" + projectId.teamMembers.length +
					"</strong><br> Total number of tasks : <strong style=" + 'font-weight:bold' + ">" + projectId.tasks.length +
					"</strong> <br> <strong style=" + 'font-weight:bold' + ">Are you sure to delete? </strong> ",
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#181123',
				cancelButtonColor: '#f44336',
				confirmButtonText: 'Delete',
				showCloseButton: true
			}).then((result) => {
				if (result.value) {
					var body;
					
					
					
					this._projectService.deleteProjectById(projectId._id).subscribe((res: any) => {
						
						$("#projects,#item_list,#visit_team_members").addClass('disabled');
						this.projects = res;
						Swal.fire({ type: 'success', title: 'Project deleted Successfully', showConfirmButton: false, timer: 2000 })
						this.router.navigate(['./view-projects']);
					}, (err: any) => {
						
						Swal.fire('Oops...', 'Something went wrong!', 'error')
					});
				}
			})
		} else {
			this._projectService.deleteProjectById(projectId._id).subscribe((res: any) => {
				
				this.projects = res;
				Swal.fire({ type: 'success', title: 'Project deleted Successfully', showConfirmButton: false, timer: 2000 })
				this.router.navigate(['./view-projects']);
			}, (err: any) => {
				
				Swal.fire('Oops...', 'Something went wrong!', 'error')
			})
		}
	}
	clearManagerSelection(event) {
		
		this.projectMngrTeam = JSON.parse(localStorage.getItem('pmanagerteams'));
	}

	clearSelection(event) {
		
		// window.location.reload();
		// this.dteam = []
		// this.projectTeam = JSON.parse(localStorage.getItem('teams'));
	}
	openmodal() {
		$('#basicExampleModal').modal('show');
	}


	addIcon(value) {
		this.isSelectFile = true
		this._projectService.fileNotSelect(this.isSelectFile)
		
		this.updateForm.value['avatar'] = value;
		this.changeAvatar = value;
		
		this.url = this.basMediaUrl + this.updateForm.value['avatar'];
		
	}

	onSelectFile1(event) {
		
		this.files = event;
	}

	onSelectFile(event) {
		
		this.files = event.target.files;
		$('#basicExampleModal').modal('hide');
		if (event.target.files && event.target.files[0]) {
			var reader = new FileReader();
			reader.readAsDataURL(event.target.files[0]); // read file as data url
			reader.onload = (event: any) => { // called once readAsDataURL is completed
				this.url = event.target.result;
			}
		}
	}
	removeAvatar() {
		this.url = "";
		if (this.files && this.files.length)
			this.files = null;
	}
}