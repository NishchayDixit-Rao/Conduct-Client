import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
} from "@angular/core";

import { config } from "../../config";
import { SingleTaskDetailsComponent } from "../single-task-details/single-task-details.component";
import { MatDialog } from "@angular/material";
import * as _ from "lodash";
import { Observable } from "rxjs";
import { CommentService } from "../../services/comment.service";
import { ProjectService } from "../../services/project.service";
import { Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: "app-task-card",
  templateUrl: "./task-card.component.html",
  styleUrls: [
    "./task-card.component.css",
    "../single-project-details/single-project-details.component.css",
  ],
})
export class TaskCardComponent implements OnInit {
  @Input("task") taskList;
  @Input("track") tracks;
  @Input("newTask") taskAdded;
  @Input("team") teamMember;
  @Input("dueDateSorting") dueDate;
  @Input("taskPriority") priority;
  @Input("taskSorting") taskUnique;
  @Input("allItem") itemListPage;
  @Output() trackDrop: EventEmitter<any> = new EventEmitter();
  @Output() talkDrop: EventEmitter<any> = new EventEmitter();
  @Output() statusChange: EventEmitter<any> = new EventEmitter();

  // @Output() deleteTask: EventEmitter<any> = new EventEmitter();
  // tracks: any
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  path = config.baseMediaUrl;
  totalList = [];
  panelOpenState = false;
  selected;
  comments: any = [];
  projectId;
  finalTeam: any = [];
  updateTask;
  trackCopy = [];
  pdfFilePath = "";

  // just declared for the testing porpose.
  tempPDFURL = "https://www.clickdimensions.com/links/TestPDFfile.pdf";
  tempImageURL =
    "https://www.thedesignwork.com/wp-content/uploads/2011/10/Random-Pictures-of-Conceptual-and-Creative-Ideas-02.jpg";

  notAssign = {
    name: "Unassigned",
  };

  constructor(
    public dialog: MatDialog,
    public commentService: CommentService,
    private route: ActivatedRoute,
    public projectService: ProjectService,
    public router: Router
  ) {
    this.route.params.subscribe((param) => {
      this.projectId = param.id;
    });
    this.projectService.AddTask.subscribe((data) => {
      if (data) {
        this.newTaskAdded(data);
      }
    });
  }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tracks && changes.tracks.currentValue) {
      this.tracks = changes.tracks.currentValue;
    }
    if (changes.teamMember && changes.teamMember.currentValue) {
      this.finalTeam = changes.teamMember.currentValue;
    }
    if (changes.taskList && changes.taskList.currentValue) {
      console.log("changes.taskList : ", changes.taskList);
      this.totalList = changes.taskList.currentValue;
      this.displayTaskList(changes.taskList.currentValue);
    }
    if (changes.taskAdded && changes.taskAdded.currentValue) {
      this.newTaskAdded(changes.taskAdded.currentValue);
      // this.tracks.push(changes.taskAdded.currentValue)
    }
    if (changes.dueDate && changes.dueDate.currentValue) {
      this.sortTasksByDueDate(changes.dueDate.currentValue);
    }
    if (changes.priority && changes.priority.currentValue) {
      this.sortTasksByPriority(changes.priority.currentValue);
    }
    if (changes.taskUnique && changes.taskUnique.currentValue) {
      this.sortTasksByTaskName(changes.taskUnique.currentValue);
    }
    if (changes.itemListPage && changes.itemListPage.currentValue) {
    }
  }

  newTaskAdded(task) {
    _.forEach(this.tracks, (track) => {
      if (task.status == track.id) {
        track.tasks.push(task);
      }
    });
  }

  getEmptyTracks() {
    // console.log("userRole line 114", this.currentUser.userRole);
    if (
      this.currentUser.userRole == "Manager" ||
      this.currentUser.userRole == "admin"
    ) {
      this.tracks = [
        {
          title: "Todo",
          id: "To Do",
          class: "primary",
          tasks: [],
        },
        {
          title: "In Progress",
          id: "In Progress",
          class: "info",
          tasks: [],
        },
        {
          title: "Testing",
          id: "Testing",
          class: "warning",
          tasks: [],
        },
        {
          title: "Done",
          id: "Done",
          class: "success",
          tasks: [],
        },
      ];
      // console.log("Tracks : ", this.tracks)
    }
    // else {
    //   this.tracks = [
    //     {
    //       title: "Todo",
    //       id: "To Do",
    //       class: "primary",
    //       tasks: [],
    //     },
    //     {
    //       title: "In Progress",
    //       id: "In Progress",
    //       class: "info",
    //       tasks: [],
    //     },
    //     {
    //       title: "Testing",
    //       id: "Testing",
    //       class: "warning",
    //       tasks: [],
    //     },
    //   ];
    // }
  }
  displayTaskList(listOftask) {
    // this.getEmptyTracks();
    _.forEach(this.tracks, (track) => {
      track.tasks = [];
    });
    _.forEach(listOftask, (singleTask) => {
      _.forEach(this.tracks, (track) => {
        if (singleTask.status == track.id) {
          // this temp url is just for testing, here it will have a S3 bucket link..
          singleTask.mediaURL = this.tempPDFURL;
          if (singleTask.assignTo == undefined) singleTask.assignTo = {};
          track.tasks.push(singleTask);
        }
      });
    });
    this.trackCopy = this.tracks;
  }

  isDueDate(dueDate) {
    if (new Date(dueDate) <= new Date()) {
      return "#C10000";
    } else {
      return "#A0A2A5";
    }
  }

  getPriorityClass(priority) {
    switch (priority) {
      case "Low":
        return { class: "low", color: "#0060FF" };
        break;

      case "Medium":
        return { class: "medium", color: "#FFA200" };
        break;

      case "High":
        return { class: "high", color: "#FF5E00" };
        break;

      case "Highest":
        return { class: "highest", color: "#FF1500" };
        break;

      default:
        return "";
        break;
    }
  }

  getTitle(name) {
    if (name) {
      var str = name.split(" ");
      if (str.length > 1)
        return (
          str[0].charAt(0).toUpperCase() +
          str[0].slice(1) +
          " " +
          str[1].charAt(0).toUpperCase() +
          str[1].slice(1)
        );
      else return str[0].charAt(0).toUpperCase() + str[0].slice(1);
    } else {
      return "";
    }
  }
  sortTasksByDueDate(type) {
    this.tracks = this.trackCopy;
    _.forEach(this.tracks, (singelTrack) => {
      //
      if (type == "desc") {
        this.selected = 2;
        singelTrack.tasks.sort(custom_sort);
        singelTrack.tasks.reverse();
      } else {
        this.selected = 1;
        singelTrack.tasks.sort(custom_sort1);

        singelTrack.tasks.reverse();
      }
    });
    function custom_sort(a, b) {
      return (
        new Date(new Date(a.dueDate)).getTime() -
        new Date(new Date(b.dueDate)).getTime()
      );
    }

    function custom_sort1(a, b) {
      return (
        new Date(new Date(b.dueDate)).getTime() -
        new Date(new Date(a.dueDate)).getTime()
      );
    }
  }

  sortTasksByPriority(type) {
    this.tracks = this.trackCopy;
    _.forEach(this.tracks, (singelTrack) => {
      if (type == "desc") {
        this.selected = 4;
        singelTrack.tasks.sort(custom_sort);
        singelTrack.tasks.reverse();
        //
      } else {
        this.selected = 3;
        singelTrack.tasks.sort(custom_sort1);
        //
        singelTrack.tasks.reverse();
      }
    });
    function custom_sort(a, b) {
      //

      // return a.taskPriority - b.taskPriority
      return a.taskPriority.localeCompare(b.taskPriority);
    }

    function custom_sort1(a, b) {
      // return b.taskPriority - a.taskPriority

      return b.taskPriority.localeCompare(a.taskPriority);
    }
  }

  sortTasksByTaskName(type) {
    this.tracks = this.trackCopy;
    _.forEach(this.tracks, (singelTrack) => {
      //
      if (type == "desc") {
        this.selected = 6;
        singelTrack.tasks.sort(custom_sort);
        singelTrack.tasks.reverse();
      } else {
        this.selected = 5;
        singelTrack.tasks.sort(custom_sort1);

        singelTrack.tasks.reverse();
      }
    });
    function custom_sort(a, b) {
      return a.taskUniqueId.split("-")[1] - b.taskUniqueId.split("-")[1];
    }

    function custom_sort1(a, b) {
      return b.taskUniqueId.split("-")[1] - a.taskUniqueId.split("-")[1];
    }
  }
  sortTasksByDeveloper(type) {
    _.forEach(this.tracks, (singelTrack) => {
      //
      if (type == "desc") {
        singelTrack.tasks.sort(custom_sort);
        singelTrack.tasks.reverse();
      } else {
        singelTrack.tasks.sort(custom_sort1);

        singelTrack.tasks.reverse();
      }
    });
    function custom_sort(a, b) {
      return a.assignTo.name - b.assignTo.name;
    }
    function custom_sort1(a, b) {
      return b.assignTo.name - a.assignTo.name;
    }
  }

  onTrackDrop(event) {
    this.trackDrop.emit(event);
  }
  onTalkDrop(event) {
    this.talkDrop.emit(event);
  }

  get trackIds(): string[] {
    return this.tracks.map((track) => track.id);
  }

  displayTaskDetails(task) {
    let obj = {
      task: task,
      projectId: this.projectId,
      team: this.finalTeam,
    };
    let data = obj;

    if (this.projectId == undefined) {
      this.router.navigate(["/tasks"], {
        queryParams: { taskDetails: task._id },
      });
    } else {
      this.router.navigate(["/task-list/" + this.projectId], {
        queryParams: { taskDetails: task._id },
      });
    }
    // this.router.navigate(['/task-list/' + this.projectId], { queryParams: { taskDetails: task._id } });
    var taskDetails = this.openDialog(
      SingleTaskDetailsComponent,
      data
    ).subscribe((response) => {
      if (response == undefined) {
        if (this.projectId == undefined) {
          this.router.navigate(["/tasks"]);
        } else {
          this.router.navigate(["/task-list/" + this.projectId]);
        }
        // this.router.navigate(['/task-list/' + this.projectId]);
      } else {
        if (this.projectId == undefined) {
          this.router.navigate(["/tasks"]);
        } else {
          this.router.navigate(["/task-list/" + this.projectId]);
        }
        // this.router.navigate(['/task-list/' + this.projectId]);
        if (response && response.status) {
          this.statusChange.emit(response);
        }
        if (response && response.task) {
          this.updateTaskDetails(response.task);
        }
        if (response && response.deleteTask) {
          this.removeTask(response.deleteTask);
        }
      }
    });
  }

  openDialog(someComponent, data = {}): Observable<any> {
    const dialogRef = this.dialog.open(someComponent, { data });
    return dialogRef.afterClosed();
  }

  removeTask(deletTask) {
    this.projectService.deleteTaskById(deletTask).subscribe(
      (response) => {
        _.forEach(this.tracks, (singleTrack) => {
          if (singleTrack.id == deletTask.status) {
            let index = singleTrack.tasks.findIndex(
              (x) => x._id === deletTask._id
            );
            singleTrack.tasks.splice(index, 1);
          }
        });
      },
      (error) => { }
    );
  }

  updateTaskDetails(updateTask) {
    _.forEach(this.tracks, (singleTrack) => {
      if (singleTrack.id == updateTask.status) {
        let index = singleTrack.tasks.findIndex(
          (x) => x._id === updateTask._id
        );
        singleTrack.tasks[index] = updateTask;
      }
    });
  }
  getMediaURL(mediaURL: string) {
    if (mediaURL.match(/\.(jpeg|jpg|gif|png)$/) != null) {
      return "../../../assets/icons/image-thumbnail.png";
    } else {
      return "../../../assets/icons/document-thumbnail.png";
    }
    // return(mediaURL.match(/\.(jpeg|jpg|gif|png)$/) != null);
  }
}
