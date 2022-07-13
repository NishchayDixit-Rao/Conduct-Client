import { Pipe, PipeTransform, Injectable } from "@angular/core";
import * as _ from "lodash";

@Pipe({
  name: "searchTask",
  // pure: false
})
@Injectable({
  providedIn: "root",
})
export class SearchTaskPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    // return null;
    var task: any = [];
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();

    task = items.filter((it) => {
      // if(it.assignTo.name){
      if (
        it.title.toLowerCase().includes(searchText) ||
        (it.assignTo.name
          ? it.assignTo && it.assignTo.name.toLowerCase().includes(searchText)
          : "") ||
        it.taskUniqueId.toLowerCase().includes(searchText) ||
        it.description.toLowerCase().includes(searchText)
      ) {
        return it;
        // }
      }
    });
    // for(var i=0;i<items.length;i++){
    // }
    return task;
  }

  transform1(items: any[], searchText: string): any[] {
    var developer: any = [];
    if (!items) return [];
    if (!searchText) return items[0];
    searchText = searchText.toLowerCase();

    developer = items[0].filter((it) => {
      // if (it.name) {

      if (
        it.name.toLowerCase().includes(searchText) ||
        it.userRole.toLowerCase().includes(searchText)
      ) {
        return it;
      }
      // }
    });
    return developer;
  }
  transform2(items: any[], searchText: string): any[] {
    var leave: any = [];
    if (!items) return [];
    if (!searchText) return items[0];
    searchText = searchText.toLowerCase();

    leave = items[0].filter((it) => {
      //

      if (it.name) {
        if (
          it.name.toLowerCase().includes(searchText) ||
          it.typeOfLeave.toLowerCase().includes(searchText)
        ) {
          return it;
        }
      }
    });
    return leave;
  }

  transform3(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();

    return items.filter((it) => {
      if (it.user) return it.user[0].name.toLowerCase().includes(searchText);
      else return it.name.toLowerCase().includes(searchText);
    });
  }

  transform4(items: any[], searchText: string): any[] {
    var projects: any = [];
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();

    projects = items.filter((it) => {
      // if (it.name) {
      // let PM = it.projectManager.filter(pmName => {
      //
      // 	if (pmName.name.toLowerCase().includes(searchText)) {
      //
      // 		return it;
      // 	}
      // })

      //
      if (
        it.title.toLowerCase().includes(searchText) ||
        it.description.toLowerCase().includes(searchText)
      ) {
        return it;
      }
      // }
    });
    return projects;
  }

  transform5(items: any[], searchText: string): any[] {
    var projects: any = [];
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();

    projects = items.filter((it) => {
      // if (it.name) {
      // let PM = it.projectManager.filter(pmName => {
      //
      // 	if (pmName.name.toLowerCase().includes(searchText)) {
      //
      // 		return it;
      // 	}
      // })

      //
      if (
        it.title.toLowerCase().includes(searchText) ||
        it.taskUniqueId.toLowerCase().includes(searchText)
      ) {
        //
        return it;
      }
      // }
    });
    return projects;
  }
  transform6(items: any[], searchText: string): any[] {
    var projects: any = [];
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();

    projects = items.filter((it) => {
      //
      if (
        it.taskId.title.toLowerCase().includes(searchText) ||
        it.taskId.taskUniqueId.toLowerCase().includes(searchText) ||
        it.userId.name.toLowerCase().includes(searchText)
      ) {
        //
        return it;
      }
      // }
    });
    return projects;
  }

  transform8(items: any[], searchText: string): any[] {
    var projects: any = [];
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();

    projects = items.filter((it) => {
      //
      //
      if (
        it.taskId.title.toLowerCase().includes(searchText) ||
        it.taskId.taskUniqueId.toLowerCase().includes(searchText) ||
        it.userId.name.toLowerCase().includes(searchText)
      ) {
        //
        return it;
      }
      // }
    });
    return projects;
  }

  transform7(items: any[], searchText: string): any[] {
    var projects: any = [];
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();

    projects = items.filter((it) => {
      // if (it.name) {
      // let PM = it.projectManager.filter(pmName => {
      //
      // 	if (pmName.name.toLowerCase().includes(searchText)) {
      //
      // 		return it;
      // 	}
      // })

      //
      if (it.name.toLowerCase().includes(searchText)) {
        //
        return it;
      }
      // }
    });
    return projects;
  }
}
