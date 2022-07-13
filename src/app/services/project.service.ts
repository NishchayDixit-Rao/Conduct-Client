import { Injectable } from "@angular/core";
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { config } from "../config";
import * as _ from "lodash";
import { Observable, of, pipe } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { Globals } from "./globals";
import { computeStyle } from "@angular/animations/browser/src/util";

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  @Output() Updateproject = new EventEmitter();
  @Output() Deleteproject = new EventEmitter();
  @Output() UpdateDeveloper = new EventEmitter();
  @Output() AddTask = new EventEmitter();
  @Output() compledteSprint = new EventEmitter();
  @Output() fileNotDisplay = new EventEmitter();
  notification: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient, private global: Globals) {}

  getAllStatus() {
    return config.statuslist;
  }

  getAllProtity() {
    return config.priorityList;
  }

  getProjects() {
    return this.http.get(config.baseApiUrl + "project/all");
  }

  /**
   * Old one.
   */
  getAllDevelopers() {
    let curreneUser = JSON.parse(localStorage.getItem("currentUser") || "");
    let userEmail = {
      email: curreneUser.email,
    };
    //
    return this.http.get(config.baseApiUrl + "user/get-all-developers", {
      params: userEmail,
    });
  }

  /**
   *
   * @returns work-circle list.
   */
  getWorkCircleList() {
    let curreneUser = JSON.parse(localStorage.getItem("currentUser") || "");
    let userID = {
      email: curreneUser._id,
    };
    return this.http.get(
      `${config.baseApiUrl}user/getWorkCircle/${curreneUser._id}`
    );
  }

  getBranchUser(branchName) {
    return this.http.get(
      config.baseApiUrl + "user/getUserBranchWise?branch=" + branchName
    );
  }

  getAllProjectMngr() {
    return this.http.get(config.baseApiUrl + "user/get-all-project-manager");
  }
  getAllTeamOfManagerId(id) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": JSON.parse(localStorage.getItem("token")),
      }),
    };
    var userId = JSON.parse(localStorage.getItem("currentUser"))._id;

    return this.http.get(
      config.baseApiUrl + "project/projectByManagerId/" + id
    );
  }

  getProjectById(id) {
    return this.http.get(config.baseApiUrl + "project/get-project-by-id/" + id);
  }

  getDeveloperOfProject(id) {
    return this.http.get(
      config.baseApiUrl + "project/get-developer-of-project/" + id
    );
  }
  getAllMembers(projectId) {
    return this.http.get(
      config.baseApiUrl + "project/allMembersOfProject/" + projectId
    );
  }
  leavesById(email) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": JSON.parse(localStorage.getItem("token")),
      }),
    };
    // var email = JSON.parse(localStorage.getItem('currentUser')).email;
    return this.http.post(config.baseApiUrl + "leave/leavesByEmail", email);
  }

  addProject(body) {
    // const httpOptions = {
    // 	headers: new HttpHeaders({
    // 		'Content-Type': 'application/json',
    // 		'x-access-token': JSON.parse(localStorage.getItem('token'))
    // 	})
    // };
    return this.http.post(config.baseApiUrl + "project/add-project", body).pipe(
      map((res) => {
        this.Updateproject.emit("Updateproject");
      })
    );
  }
  fileNotSelect(data) {
    this.fileNotDisplay.emit(data);
  }

  addData(data, subUrl) {
    // data['operatorId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": JSON.parse(localStorage.getItem("token")),
      }),
    };
    return this.http.post(config.baseApiUrl + subUrl, data);
  }

  updateData(data, subUrl) {
    // data['operatorId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": JSON.parse(localStorage.getItem("token")),
      }),
    };
    return this.http.put(config.baseApiUrl + subUrl + data._id, data);
  }

  updateStatus(data) {
    return this.http.put(
      config.baseApiUrl + "tasks/update-task-status-by-id",
      data
    );
  }

  completeItem(data) {
    return this.http.put(
      config.baseApiUrl + "tasks/update-task-status-by-id",
      data
    );
  }

  getlogs(memberId) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": JSON.parse(localStorage.getItem("token")),
      }),
    };
    return this.http.get(config.baseApiUrl + "user/get-logs/" + memberId);
  }

  getAllDevelopersByProjectManager() {
    var body = {
      pmId: JSON.parse(localStorage.getItem("currentUser"))._id,
    };

    return this.http.post(
      config.baseApiUrl + "user/get-all-developers-by-project-manager",
      body
    );
  }
  uploadFiles(formData) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": JSON.parse(localStorage.getItem("token")),
      }),
    };
    return this.http.post(config.baseApiUrl + "project/upload-file", formData);
  }
  getLogs(developerId) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": JSON.parse(localStorage.getItem("token")),
      }),
    };
    return this.http.get(config.baseApiUrl + "user/get-logs/" + developerId);
  }
  getAllFilesInfolder(id) {
    var obj = { projectId: id };
    return this.http.post(config.baseApiUrl + "project/get-all-files", obj);
  }

  deleteSelectedFile(data) {
    return this.http.post(config.baseApiUrl + "project/delete-file", data);
  }

  updateProject(projectId, data) {
    return this.http
      .put(config.baseApiUrl + "project/update/" + projectId, data)
      .pipe(
        map((res) => {
          this.UpdateDeveloper.emit("UpdateDeveloper");
          return res;
        })
      );
  }
  getProjectByIdAndUserId(id) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": JSON.parse(localStorage.getItem("token")),
      }),
    };
    var userId = JSON.parse(localStorage.getItem("currentUser"))._id;

    return this.http.get(
      config.baseApiUrl +
        "project/get-project-by-id-and-by-userid/" +
        id +
        "/" +
        userId
    );
  }

  addNotice(data) {
    return this.http.post(config.baseApiUrl + "notice/add-notice", data);
  }

  getNotice() {
    let userEmail = JSON.parse(localStorage.getItem("currentUser") || "").email;
    return this.http.get(config.baseApiUrl + "notice/allnotice", {
      params: { email: userEmail },
    });
  }

  getNoticeById(noticeid) {
    return this.http.get(config.baseApiUrl + "notice/noticebyid/" + noticeid);
  }
  updateStatusOfNotice(obj) {
    return this.http.put(config.baseApiUrl + "notice/updateStatus", obj);
  }

  deleteProjectById(data) {
    return this.http.delete(config.baseApiUrl + "project/delete/" + data).pipe(
      map((res) => {
        this.Deleteproject.emit("Deleteproject");
      })
    );
  }

  getAllTasks() {
    return this.http.get(config.baseApiUrl + "tasks/all-task");
  }

  updateTask(id, task) {
    return this.http.put(
      config.baseApiUrl + "tasks/update-task-by-id/" + id,
      task
    );
  }

  updateNoticeWithFile(data, id) {
    return this.http.put(
      config.baseApiUrl + "notice/update-notice-by-id/" + id,
      data
    );
  }

  changeNoticePicture(files: any, data) {
    let formdata = new FormData();
    formdata.append("noticeid", data);
    formdata.append("profilePhoto", files[0]);

    return this.http.put(
      config.baseApiUrl + "notice/change-photo/" + data,
      formdata
    );
  }

  deleteNotice(id) {
    return this.http.delete(
      config.baseApiUrl + "notice/delete-notice-by-id/" + id
    );
  }

  addTask(data) {
    // const httpOptions = {
    // 	headers: new HttpHeaders({
    // 		'Content-Type': 'application/json',
    // 		'x-access-token': JSON.parse(localStorage.getItem('token'))
    // 	})
    // };
    return this.http.post(config.baseApiUrl + "tasks/add-task", data).pipe(
      map((res: any) => {
        let task = res.data.taskData;
        this.AddTask.emit(task);
        return res;
      })
    );
  }
  getTaskById(id) {
    var id = id;

    return this.http.get(config.baseApiUrl + "tasks/get-task-by-project/" + id);
  }

  getTeamByProjectId(id) {
    var projectId = id;
    return this.http.get(
      config.baseApiUrl + "project/get-developer-of-project/" + id
    );
  }
  getProjectSummary(id) {
    return this.http.get(config.baseApiUrl + "project/summary/" + id);
  }

  addUser_with_file(body, files: any) {
    let formdata = new FormData();
    formdata.append("fname", body.fname);
    formdata.append("lname", body.lname);
    formdata.append("email", body.email);
    formdata.append("userRole", body.userRole);
    formdata.append("password", body.password);
    formdata.append("joiningDate", body.date);
    formdata.append("phone", body.mobile);
    formdata.append("experience", body.experience);
    formdata.append("profilePhoto", files[0]);
    formdata.append("profilePhoto", files[1]);

    return this.http.post(config.baseApiUrl + "user/signup", formdata);
  }
  addProject_Without_file(body) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": JSON.parse(localStorage.getItem("token")),
      }),
    };
    return this.http.post(config.baseApiUrl + "user/signup_without_file", body);
  }
  deleteTaskById(data) {
    var taskId = data._id;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": JSON.parse(localStorage.getItem("token")),
      }),
    };
    return this.http.delete(
      config.baseApiUrl + "tasks/delete-task-by-id/" + taskId
    );
  }
  uploadFilesToFolder(data, file: FileList) {
    let formData = new FormData();
    formData.append("userId", data);
    formData.append("uploadFile", file[0]);
    return this.http.post(config.baseApiUrl + "project/upload-file", formData);
  }
  //update employee profile (allemployee.component.ts) -adminSide
  updateUserById(data) {
    var id = data._id;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": JSON.parse(localStorage.getItem("token")),
      }),
    };
    return this.http.put(config.baseApiUrl + "user/update-details/" + id, data);
  }

  getUsersNotInProject(id) {
    return this.http.get(
      config.baseApiUrl + "user/get-user-not-in-project-team/" + id
    );
  }

  // getAllProjectManagerNotInProject(id) {
  // 	return this.http.get(config.baseApiUrl + "user/get-project-mngr-not-in-project-team/" + id);
  // }

  deleteEmployeeById(userId) {
    var is;

    return this.http.put(config.baseApiUrl + "user/delete-user/" + userId, is);
  }

  addSprint(data) {
    return this.http.post(config.baseApiUrl + "sprint/add-sprint", data);
  }

  getSprint(projectId) {
    return this.http.get(
      config.baseApiUrl + "sprint/sprint-by-projects/" + projectId
    );
  }

  sprintById(sprintId) {
    return this.http.get(
      config.baseApiUrl + "sprint/sprint-by-sprint-id/" + sprintId
    );
  }
  updateSprint(sprint) {
    var sprintId = sprint._id;
    return this.http.put(
      config.baseApiUrl + "sprint/update-sprint-by-id/" + sprintId,
      sprint
    );
  }

  completeSprint(sprintId) {
    return this.http
      .get(config.baseApiUrl + "sprint/sprint-complete/" + sprintId)
      .pipe(
        map((res) => {
          this.compledteSprint.emit("compledteSprint");
        })
      );
  }
  startSprint(sprintdata) {
    return this.http.put(config.baseApiUrl + "sprint/start-sprint", sprintdata);
  }

  getProjectByPmanagerId(pmanagerId) {
    return this.http.get(
      config.baseApiUrl + "project/get-project-by-pmanagerId/" + pmanagerId
    );
  }

  addNotification(body) {
    let formdata = new FormData();
    formdata.append("pmanagerName", body.pmanagerName);
    formdata.append("projectId", body.projectId);
    formdata.append("subject", body.subject);
    formdata.append("content", body.content);
    formdata.append("sendTo", body.sendTo);
    return this.http.post(
      config.baseApiUrl + "sendNotification/addNotification",
      formdata
    );
  }
  getNotificationByUserId(currentUserId) {
    return this.http.get(
      config.baseApiUrl +
        "sendNotification/get-notification-By-Id/" +
        currentUserId
    );
  }

  // getUnreadNotification(currentUserId) {
  // 	return this.http.get(config.baseApiUrl + "sendNotification/get-unread-notification/" + currentUserId)
  // }

  deleteSprint(sprintId) {
    return this.http.delete(
      config.baseApiUrl + "sprint/delete-sprint-by-id/" + sprintId
    );
  }

  addTimeLog(data, user, projectId) {
    data["userId"] = user._id;
    data["projectId"] = projectId;

    return this.http.post(config.baseApiUrl + "timeLog/timeLog", data);
  }

  editTimeLog(data, details) {
    data["userId"] = details.currentUser;
    data["projectId"] = details.projectId;
    // data['editTask'] = details.timeLogId
    return this.http.put(
      config.baseApiUrl + "timeLog/editTimeLog/" + details.timeLogId,
      data
    );
  }
  getSingleDayLog(data) {
    return this.http.get(config.baseApiUrl + "timeLog/timeLog", {
      params: data,
    });
  }

  getTotalLogs(projectId) {
    return this.http.get(config.baseApiUrl + "timeLog/totalTime/" + projectId);
  }

  verifyLogs(data, details) {
    data["timelogId"] = details.timeLogId;
    data["userId"] = details.currentUser;

    return this.http.post(config.baseApiUrl + "timeLog/verifyLogs", data);
  }

  editVerifyLogs(data, details) {
    data["timelogId"] = details.timeLogId;
    data["userId"] = details.currentUser;

    return this.http.put(
      config.baseApiUrl + "timeLog/verifyLogs/" + details.verifyId,
      data
    );
  }

  getVerifyLogs(id) {
    return this.http.get(config.baseApiUrl + "timeLog/verifyLogs/" + id);
  }

  getTotalLogsOfAllUser(date) {
    return this.http.get(config.baseApiUrl + "timeLog/allLogs", {
      params: date,
    });
  }

  getLogsWithDetails(data?) {
    return this.http.get(config.baseApiUrl + "timeLog/user-all-logs", {
      params: data,
    });
  }

  changeAvatar(files: any, data) {
    let formdata = new FormData();
    formdata.append("projectId", data);
    formdata.append("avatar", files[0]);

    return this.http.put(
      config.baseApiUrl + "project/change-avatar/" + data,
      formdata
    );
  }

  // Notification routes

  getNotificationOftask() {
    return this.http.get(config.baseApiUrl + "sendNotification/task");
    // .pipe(map((notification: any) => {
    //
    // 	this.notification.emit(notification)
    // }))
  }

  changeStatusOfNotification(data) {
    return this.http.put(
      config.baseApiUrl + "sendNotification/notificationStatus",
      data
    );
  }

  totalTime(projectId) {
    return this.http.get(
      config.baseApiUrl + "tasks/activatedTaskTime/" + projectId
    );
  }
  getTaskOfUser(data) {
    return this.http.put(config.baseApiUrl + "tasks/getUserTasks", data);
  }

  // AddNewDiscussion
  addDiscussion(data) {
    return this.http.post(config.baseApiUrl + "discussion/", data);
  }

  /**
   * @param projectId {Project Id}
   * Get discussion list
   */
  getAllDiscussion(projectId) {
    return this.http.get(config.baseApiUrl + "discussion/" + projectId);
  }

  /**
   * @param id {Disussion Id}
   */
  getDetailsOfDiscussion(discussinId) {
    return this.http.get(
      config.baseApiUrl + "discussion/discussion/" + discussinId
    );
  }
  updateDiscussion(data) {
    return this.http.put(config.baseApiUrl + "discussion/", data);
  }

  /**
   * Update notify list
   */

  updateNotifyList(data) {
    return this.http.put(config.baseApiUrl + "discussion/updateNotify", data);
  }

  updateProjectWorkFlow(data) {
    return this.http.put(
      config.baseApiUrl + "project/updateProjectWorkFlow",
      data
    );
  }
}
