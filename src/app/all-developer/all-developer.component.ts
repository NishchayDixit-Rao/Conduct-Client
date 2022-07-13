/*this componant is created for all team member of project*/

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../services/login.service';
import { ProjectService } from '../services/project.service';
import { AlertService } from '../services/alert.service';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import {SearchTaskPipe} from '../search-task.pipe';
import {config} from '../config';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import * as _ from 'lodash';
declare var $ : any;
import Swal from 'sweetalert2';

@Component({
	selector: 'app-all-developer',
	templateUrl: './all-developer.component.html',
	styleUrls: ['./all-developer.component.css']
})
export class AllDeveloperComponent implements OnInit {
	developers: any;
	userId;
	availableDevelopers = [];
	path = config.baseMediaUrl;
	currentUser = JSON.parse(localStorage.getItem('currentUser'));
	Teams :any = [];
	projectId;
	loader:boolean = false;
	pro;
	dteam: any;
	searchText;
	developerId;
	pmanagerId = [];
	

	constructor(private route: ActivatedRoute,
		private router: Router, public _projectService: ProjectService,
		public _alertService: AlertService, private _loginService: LoginService, public searchTextFilter: SearchTaskPipe) { }

	ngOnInit() {
		this.route.params.subscribe(param=>{
			this.projectId = param.id;
			this.getProject(this.projectId);
		});

	}
	getProject(id){
		this.loader = true;
		
		setTimeout(()=>{
			this._projectService.getProjectById(id).subscribe((res:any)=>{
				this.pro = res;
				
				
				this.pmanagerId = this.pro.pmanagerId;
				
				this.pro.pmanagerId.sort(function(a, b){
					var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
					if (nameA < nameB) //sort string ascending
						return -1 
					if (nameA > nameB)
						return 1
					return 0 //default return value (no sorting)
					
					setTimeout(()=>{
						
						$('a.rotate-btn').click(function () {
							$(this).parents(".card-rotating").toggleClass('flipped');
						});
					},2000);
				})
				this._projectService.getTeamByProjectId(id).subscribe((res:any)=>{
					
					this.Teams = res.Teams;
					this.Teams.sort(function(a, b){
						var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
						if (nameA < nameB) //sort string ascending
							return -1 
						if (nameA > nameB)
							return 1
						return 0 //default return value (no sorting)
						this.projectTeam.push
						
						setTimeout(()=>{
							
							$('a.rotate-btn').click(function () {
								$(this).parents(".card-rotating").toggleClass('flipped');
							});
						},2000);
					})
				},(err:any)=>{
					
				});
				this.loader = false;
			},err=>{
				
				this.loader = false;
			})
		},1000);
		
	}


	onKey(searchText){
		
		
		var dataToBeFiltered = [this.Teams];
		var team = this.searchTextFilter.transform(dataToBeFiltered, searchText);
		
		// 
		// this.getEmptyTracks();
		_.forEach(team, (content)=>{
			_.forEach(this.Teams, (team)=>{
				team.Teams.push(content);
			});
		});
	}

	
	deleteDeveloper(event){
		
		const swalWithBootstrapButtons = Swal.mixin({
			customClass: {
			  confirmButton: 'btn btn-default',
			  cancelButton: 'btn btn-delete'
			},
			buttonsStyling: false,
		  })
		  swalWithBootstrapButtons.fire({
			html: "<span style="+'font-size:25px'+">  Are you sure you want to remove <strong style="+'font-weight:bold'+">" + " " + event.name + " </strong> " + " from  <strong style="+'font-weight:bold'+">" + " "+ this.pro.title + "</strong> ? </span>",
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Delete',
			showCloseButton: true,
			reverseButtons: true
		}).then((result) => {
			if (result.value) {
				var body;
				this.Teams.splice(_.findIndex(this.Teams, event), 1);
				Swal.fire({type: 'success',title: 'Deleted Successfully',showConfirmButton:false,timer: 2000})
				
				
				this.pro.Teams = this.Teams;	
				
				this._projectService.updateProject(this.pro._id,this.pro).subscribe((res:any)=>{
					
				},(err:any)=>{
					
					Swal.fire('Oops...', 'Something went wrong!', 'error')
				});
			}
		})
	}
	deleteProjectManager(event){
		
		const swalWithBootstrapButtons = Swal.mixin({
			customClass: {
			  confirmButton: 'btn btn-default',
			  cancelButton: 'btn btn-delete'
			},
			buttonsStyling: false,
		  })
		  swalWithBootstrapButtons.fire({
			html: "<span style="+'font-size:25px'+">  Are you sure you want to remove <strong style="+'font-weight:bold'+">" + " " + event.name + " </strong> " + " from  <strong style="+'font-weight:bold'+">" + " "+ this.pro.title + "</strong> ? </span>",
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Delete',
			showCloseButton: true,
			reverseButtons: true
		}).then((result) => {
			if (result.value) {
				var body;
				this.pmanagerId.splice(_.findIndex(this.pmanagerId, event), 1);
				Swal.fire({type: 'success',title: 'Deleted Successfully',showConfirmButton:false,timer: 2000})
				
				
				this.pro.pmanagerId = this.pmanagerId;	
				
				this._projectService.updateProject(this.pro._id,this.pro).subscribe((res:any)=>{
					
				},(err:any)=>{
					
					Swal.fire('Oops...', 'Something went wrong!', 'error')
				});
			}
		})
	}
}





