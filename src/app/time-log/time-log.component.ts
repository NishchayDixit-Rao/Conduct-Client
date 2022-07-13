import { Component, OnInit } from "@angular/core";
import { ProjectService } from "../services/project.service";
import { AlertService } from "../services/alert.service";
import { ActivatedRoute } from "@angular/router";
import * as _ from "lodash";
import { config } from "../config";
import { single } from "rxjs/operators";

@Component({
  selector: "app-time-log",
  templateUrl: "./time-log.component.html",
  styleUrls: ["./time-log.component.css"],
})
export class TimeLogComponent implements OnInit {
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  projects;
  path = config.baseMediaUrl;
  baseMediaUrl = config.baseMediaUrl;
  projectTeam;
  tracks: any;
  projectId: any;
  project = [];
  tasks = [];
  displayTable: boolean = false;
  // totalTime: any = 0;
  diff1;
  diff2;
  userName;
  userTasks: any = [];
  isTask: boolean = false;
  displayFinalItem: { [x: string]: Pick<any, string | number | symbol>[] };
  keys: string[];
  tempArrayTrue = [];

  constructor(
    public _projectService: ProjectService,
    public _alertService: AlertService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((param) => {
      this.projectId = param.id;
      // this.getTeamByProjectId(this.projectId)
      this.totalTime(this.projectId);
    });
  }

  ngOnInit() {
    
    // this.getAllProjects();
    this.getEmptyTracks();
  }
  getEmptyTracks() {
    
    if (this.currentUser.userRole == "Manager") {
      this.tracks = [
        {
          title: "Todo",
          id: "to do",
          class: "primary",
          tasks: [],
        },
        {
          title: "In Progress",
          id: "in progress",
          class: "info",
          tasks: [],
        },
        {
          title: "Testing",
          id: "testing",
          class: "warning",
          tasks: [],
        },
        {
          title: "Done",
          id: "complete",
          class: "success",
          tasks: [],
        },
      ];
      
      
    } else {
      this.tracks = [
        {
          title: "Todo",
          id: "to do",
          class: "primary",
          tasks: [],
        },
        {
          title: "In Progress",
          id: "in progress",
          class: "info",
          tasks: [],
        },
        {
          title: "Testing",
          id: "testing",
          class: "warning",
          tasks: [],
        },
      ];
    }
  }

  totalTime(projectId) {
    
    this._projectService.totalTime(projectId).subscribe(
      (res: any) => {
        
        this.userName = res;
        // let tempArrayTrue = []
        // let tempArrayFalse = []
        this.userName.forEach((singleUser) => {
          if (singleUser.isTimer == true) {
            let index = _.findIndex(this.tempArrayTrue, function (o) {
              return o.assignDeveloper._id == singleUser.assignDeveloper._id;
            });
            if (index > -1) {
              if (this.tempArrayTrue[index].isTimer == false) {
                this.tempArrayTrue[index] = singleUser;
              }
            } else {
              this.tempArrayTrue.push(singleUser);
            }
          } else {
            let index = _.findIndex(this.tempArrayTrue, function (o) {
              return o.assignDeveloper._id == singleUser.assignDeveloper._id;
            });
            if (index > -1) {
            } else {
              this.tempArrayTrue.push(singleUser);
            }
          }
        });
        

        // 

        // var grouped = _.mapValues(_.groupBy(this.userName, 'assignDeveloper._id'),
        // 	clist => clist.map(car => _.omit(car, 'assignDeveloper._id')));
        // // this.displayFinalItem.push(grouped)
        // this.displayFinalItem = grouped
        // 
        // this.keys = Object.keys(this.displayFinalItem);
        // 

        // _.forEach(res, (name) => {
        // 	let user = name
        // 	

        // 	// _.forEach(user._id.name, (single) => {
        // 	// 	
        // 	// 	this.userName = single
        // 	// 	
        // 	// })
        // })
      },
      (err) => {
        
      }
    );
  }

  // getTeamByProjectId(id) {

  // 	
  // 	// 
  // 	// this.projectId = data._id;
  // 	
  // 	this._projectService.getTeamByProjectId(id).subscribe((res: any) => {
  // 		// res.Teams.push(this.pro.pmanagerId);
  // 		
  // 		this.projectTeam = res.data[0].teamMembers;
  // 		
  // 		// this.projectTeam.sort(function(a, b){
  // 		// 	if (a.name && b.name) {
  // 		// 		var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
  // 		// 		if (nameA < nameB) //sort string ascending
  // 		// 			return -1
  // 		// 		if (nameA > nameB)
  // 		// 			return 1
  // 		// 		return 0 //default return value (no sorting)
  // 		// 		// this.projectTeam.push
  // 		// 		
  // 		// 	}
  // 		// })

  // 		_.map(this.projectTeam, (user) => {
  // 			
  // 			user['tasks'] = [];
  // 			// user['totalTime'] = 0;
  // 			this._projectService.getTaskById(this.projectId).subscribe((res: any) => {
  // 				
  // 				this.getEmptyTracks();
  // 				this.project = res.data.response[0].tasks;
  // 				
  // 				_.forEach(this.project, (task) => {
  // 					// _.forEach(task.assignTo, (assign) => {
  // 					
  // 					if (task.status == "Testing" && task.assignTo._id == user._id) {
  // 						
  // 						user.tasks.push(task);
  // 					}
  // 					// })
  // 					
  // 				})

  // 				this._projectService.totalTime(this.projectId).subscribe((res: any) => {
  // 					
  // 				}, err => {
  // 					
  // 				})
  // 				
  // 				// this.totalTime = 0;
  // 				_.forEach(user.tasks, (task) => {
  // 					// 
  // 					// this.totalTime = +this.totalTime + +this.getHHMMTime(task.timelog1.difference);
  // 					
  // 					var sum = 0
  // 					sum = sum + + task.taskTimelog.taskTimelog

  // 					// user['totalTime'] = this.addTimes(this.totalTime, this.getHHMMTime(task.taskTimelog.taskTimelog), user.name)
  // 					

  // 				})

  // 			})
  // 		})

  // 	}, (err: any) => {
  // 		
  // 	});
  // }

  getTaskOfDeveloper(data) {
    this.displayTable = false;
    
    let userDetails = {
      userId: data.assignDeveloper._id,
      projectId: this.projectId,
    };
    

    this._projectService.getTaskOfUser(userDetails).subscribe(
      (res: any) => {
        
        this.userTasks = res.data;
        this.displayTable = true;
        // if (res.status == 'Done' || res.status == 'Testing') {

        // } else {
        // 	this.isTask = true
        // }
      },
      (err) => {
        
      }
    );
    // 
    // if (data != 'all') {
    // 	this.tasks = [];
    // 	// this.totalTime = 0
    // 	
    // 	this.displayTable = true;
    // 	this._projectService.getTaskById(this.projectId).subscribe((res: any) => {
    // 		
    // 		
    // 		this.getEmptyTracks();
    // 		this.project = res;
    // 		
    // 		
    // 		_.forEach(this.project, (task) => {
    // 			if (task.status == 'complete' && task.assignTo && task.assignTo._id == data._id) {
    // 				
    // 				this.tasks.push(task);
    // 			}
    // 		})
    // 		
    // 		// _.forEach(this.tasks,(task)=>{
    // 		// 	
    // 		// 	// this.totalTime = +this.totalTime + +this.getHHMMTime(task.timelog1.difference);
    // 		// 	this.addTimes(this.totalTime,this.getHHMMTime(task.timelog1.difference))
    // 		// 	// 

    // 		// })
    // 	})
    // }
  }

  getHHMMTime(difference) {
    
    // 
    // if(difference != '00:00'){
    // 	difference = difference.split("T");
    // 	difference = difference[1];
    // 	difference = difference.split(".");
    // 	difference = difference[0];
    // 	difference = difference.split(":");
    // 	var diff1 = difference[0];
    // 	// 
    // 	var diff2 = difference[1];
    // 	difference = diff1 +":"+diff2;
    // 	return difference;
    // }
    // return '00:00';
    var milliseconds = (difference % 1000) / 100,
      seconds = Math.floor((difference / 1000) % 60),
      minutes = Math.floor((difference / (1000 * 60)) % 60),
      hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    
    return hours + ":" + minutes + ":" + seconds;
    // return difference
  }
  addTimes(startTime, endTime, userId?) {
    
    var times = [0, 0];
    var max = times.length;
    var a = (startTime || "").split(":");
    
    // var b = (endTime || '').split('.');
    var b = endTime;
    
    for (var i = 0; i < max; i++) {
      a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i]);

      b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i]);
      
    }
    for (var i = 0; i < max; i++) {
      times[i] = a[i] + b[i];
      
    }
    var hours = times[0];
    var minutes = times[1];
    if (minutes >= 60) {
      var h = (minutes / 60) << 0;
      hours += h;
      minutes -= 60 * h;
    }
    // this.totalTime = ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2);
    
    return this.totalTime;
  }
}
