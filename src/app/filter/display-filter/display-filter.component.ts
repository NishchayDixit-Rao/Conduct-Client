import {
  Component,
  OnInit,
  SimpleChanges,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from "@angular/core";
import { MatMenu, MatMenuTrigger } from "@angular/material/menu";
import { DeveloperFilterComponent } from "../developer-filter/developer-filter.component";

@Component({
  selector: "app-display-filter",
  templateUrl: "./display-filter.component.html",
  styleUrls: ["./display-filter.component.css"],
})
export class DisplayFilterComponent implements OnInit {
  @Input("developer") listOfDeveloper;
  @Input("filter") displayFilter;
  @Input("taskType") type;
  @Input("taskPriority") priority;
  @Input("resetFilter") filterReset;
  @Input("roleList") userRole;
  @Input("projectList") allProjectList;
  @Output() selectedDate: EventEmitter<any> = new EventEmitter();
  @Output() developerList: EventEmitter<any> = new EventEmitter();
  @Output() managerList: EventEmitter<any> = new EventEmitter();
  @Output() typeSelected: EventEmitter<any> = new EventEmitter();
  @Output() prioritySelected: EventEmitter<any> = new EventEmitter();
  @Output() roleSelected: EventEmitter<any> = new EventEmitter();
  @Output() projectSelected: EventEmitter<any> = new EventEmitter();
  @Output() developerProjects: EventEmitter<any> = new EventEmitter();
  totalDeveloper = [];
  displayMenu = [];
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  isDisplay = false;
  dynamicIndex = 0;
  developerSelected = [];
  managerSelected = [];
  resetFilterDeveloper;
  displayName = "Choose";
  displayType;
  displayPriority;
  selectedType;
  selectedPriority;
  userRoleList = [];
  selectedRole;
  totalProjects = [];
  selectedProjects;
  resetDate;
  constructor() {}

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  ngOnInit() {}

  // @ViewChild('menu') public menu;

  @ViewChild(DeveloperFilterComponent)
  childComponentMenu: DeveloperFilterComponent;
  ngOnChanges(changes: SimpleChanges) {
    if (changes.listOfDeveloper && changes.listOfDeveloper.currentValue) {
      this.totalDeveloper = changes.listOfDeveloper.currentValue;
    }
    if (changes.displayFilter && changes.displayFilter.currentValue) {
      console.log("display menuu : ", this.displayMenu);
      console.log("display menuu : ", changes.displayFilter.currentValue);
      this.displayMenu = changes.displayFilter.currentValue;
    }
    if (changes.filterReset && changes.filterReset.currentValue) {
      this.resetFilterDeveloper = changes.filterReset.currentValue;
      this.resetDate = changes.filterReset.currentValue;
      this.developerSelected = [];
      this.managerSelected = [];
      this.selectedType = [];
      this.selectedPriority = [];
      this.selectedRole = [];
      this.selectedProjects = [];
      this.displayName = "Choose";
    }
    if (changes.type && changes.type.currentValue) {
      this.displayType = changes.type.currentValue;
    }
    if (changes.priority && changes.priority.currentValue) {
      this.displayPriority = changes.priority.currentValue;
    }
    if (changes.userRole && changes.userRole.currentValue) {
      this.userRoleList = changes.userRole.currentValue;
    }
    if (changes.allProjectList && changes.allProjectList.currentValue) {
      this.totalProjects = changes.allProjectList.currentValue;
    }
    //
  }

  mouserOverEvent($event, i) {}

  selectItem(menu) {
    if (menu == "vertebrates") {
      return "vertebrates";
      // this.isDisplay = true
    }
  }

  mouseoverData(i) {
    this.dynamicIndex = i;
  }

  menuClosed(event) {
    //
    //
    // if ((this.developerSelected && this.developerSelected.length) && (this.selectedProjects == undefined || (this.selectedProjects && this.selectedProjects.length == 0))) {
    //
    //   this.developerList.emit(this.developerSelected)
    //   this.displayName = 'Developer'
    // }
    // if (this.selectedType && this.selectedType.length) {
    //   this.typeSelected.emit(this.selectedType)
    //   this.displayName = 'Task Type'
    // }
    // if (this.selectedPriority && this.selectedPriority.length) {
    //   this.prioritySelected.emit(this.selectedPriority)
    //   this.displayName = 'Priority'
    // }
    // if (this.selectedRole && this.selectedRole.length) {
    //   this.roleSelected.emit(this.selectedRole)
    //   this.displayName = 'UserRole'
    // }
    // if ((this.selectedProjects && this.selectedProjects.length) && this.developerSelected.length == 0) {
    //
    //   this.projectSelected.emit(this.selectedProjects)
    //   this.displayName = 'Projects'
    // }
    // if ((this.selectedProjects && this.selectedProjects.length) && (this.developerSelected && this.developerSelected.length > 0)) {
    //
    //   let obj = {
    //     projectArray: this.selectedProjects,
    //     developerArray: this.developerSelected
    //   }
    //
    //   this.developerProjects.emit(obj)
    //   this.displayName = 'Developer - project'
    // }
  }
  dueDate(event) {
    this.resetDate = false;
    this.selectedDate.emit(event);
    this.displayName = "Due Date";
    this.trigger.closeMenu();
  }

  selectedDeveloper(event) {
    this.resetFilterDeveloper = false;
    this.developerSelected = event;
    console.log("developerSelected : ", this.developerSelected);
    if (
      this.developerSelected &&
      this.developerSelected.length &&
      (this.selectedProjects == undefined ||
        (this.selectedProjects && this.selectedProjects.length == 0))
    ) {
      this.developerList.emit(this.developerSelected);
      this.displayName = "Team Member";
    } else if (
      this.selectedProjects == undefined ||
      (this.selectedProjects && this.selectedProjects.length == 0)
    ) {
      this.developerList.emit(this.developerSelected);
    }

    if (
      this.selectedProjects &&
      this.selectedProjects.length &&
      this.developerSelected &&
      this.developerSelected.length > 0
    ) {
      let obj = {
        projectArray: this.selectedProjects,
        developerArray: this.developerSelected,
      };

      this.developerProjects.emit(obj);
      this.displayName = "Developer - project";
    }
  }

  selectedManager(event) {
    console.log("selectedManager called..");
    this.resetFilterDeveloper = false;
    this.managerSelected = event;
    if (
      this.managerSelected &&
      this.managerSelected.length &&
      (this.selectedProjects == undefined ||
        (this.selectedProjects && this.selectedProjects.length == 0))
    ) {
      this.managerList.emit(this.managerSelected);
      this.displayName = "Manager";
    } else if (
      this.selectedProjects == undefined ||
      (this.selectedProjects && this.selectedProjects.length == 0)
    ) {
      this.managerList.emit(this.managerSelected);
    }
  }

  taskTypeSelected(event) {
    if (this.selectedType && this.selectedType.length) {
      this.typeSelected.emit(this.selectedType);
      this.displayName = "Task Type";
    } else {
      this.typeSelected.emit(this.selectedType);
    }
  }
  taskPriority(event) {
    if (this.selectedPriority && this.selectedPriority.length) {
      this.prioritySelected.emit(this.selectedPriority);
      this.displayName = "Priority";
    } else {
      this.prioritySelected.emit(this.selectedPriority);
    }
  }

  userRoleSelect(event) {
    if (this.selectedRole && this.selectedRole.length) {
      this.roleSelected.emit(this.selectedRole);
      this.displayName = "UserRole";
    } else {
      this.roleSelected.emit(this.selectedRole);
    }
  }

  selectProject(event) {
    if (
      this.selectedProjects &&
      this.selectedProjects.length &&
      this.developerSelected.length == 0
    ) {
      this.projectSelected.emit(this.selectedProjects);
      this.displayName = "Projects";
    } else if (this.developerSelected.length == 0) {
      this.projectSelected.emit(this.selectedProjects);
    }

    if (
      this.selectedProjects &&
      this.selectedProjects.length &&
      this.developerSelected &&
      this.developerSelected.length > 0
    ) {
      let obj = {
        projectArray: this.selectedProjects,
        developerArray: this.developerSelected,
      };

      this.developerProjects.emit(obj);
      this.displayName = "Developer - project";
    }
  }

  getUserRole(role) {
    switch (role) {
      case "Manager":
        return "Project Manager";
        break;
      default:
        return role;
        break;
    }
  }
}
