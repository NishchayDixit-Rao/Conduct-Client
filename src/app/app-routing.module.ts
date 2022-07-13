import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard, ProjectManagerGuard, LoginGuard } from "./auth.guard";
import { LoginComponent } from "./login/login.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";

import { ViewProjectComponent } from "./new-view-project/view-project/view-project.component";
import { EditProjectComponent } from "./edit-project/edit-project.component";
import { MainTableViewComponent } from "./main-table-view/main-table-view.component";
import { IssueComponent } from "./issue/issue.component";
import { ProjectDetailComponent } from "./project-detail/project-detail.component";
import { HomeComponent } from "./home/home.component";
import { RegisterComponent } from "./register/register.component";
import { AddEmployeeComponent } from "./add-employee/add-employee.component";
import { UpdateUserComponent } from "./update-user/update-user.component";
import { AddNoticeComponent } from "./add-notice/add-notice.component";
import { NoticeboardComponent } from "./noticeboard/noticeboard.component";
import { UserprofileComponent } from "./userprofile/userprofile.component";
import { LeaveComponent } from "./leave/leave.component";
import { AllDeveloperComponent } from "./all-developer/all-developer.component";
import { VisitUserProfileComponent } from "./visit-user-profile/visit-user-profile.component";
import { AllLeaveAppComponent } from "./all-leave-app/all-leave-app.component";
import { AllEmployeeComponent } from "./all-employee/all-employee.component";
import { SummaryComponent } from "./summary/summary.component";
import { EditprofileComponent } from "./editprofile/editprofile.component";
import { UserSummaryComponent } from "./user-summary/user-summary.component";
import { ForgotpwdComponent } from "./forgotpwd/forgotpwd.component";
import { MyleaveComponent } from "./myleave/myleave.component";
import { NotificationComponent } from "./notification/notification.component";
import { BacklogComponent } from "./backlog/backlog.component";
import { TimeLogComponent } from "./time-log/time-log.component";
// import { DashboardComponent } from './Leave_module/dashboard/dashboard.component';
import { AllLeaveApplicationComponent } from "./Leave_module/all-leave-application/all-leave-application.component";
import { LeaveFormComponent } from "./Leave_module/leave-form/leave-form.component";
import { LeavesReportComponent } from "./Leave_module/leaves-report/leaves-report.component";
import { AllUserListComponent } from "./Leave_module/all-user-list/all-user-list.component";
import { SingleUserLeaveComponent } from "./Leave_module/single-user-leave/single-user-leave.component";
import { DiscussionComponent } from "./discussion-module/discussion/discussion.component";
import { DiscssionDetailsComponent } from "./discussion-module/discssion-details/discssion-details.component";
import { FileUploadDndComponent } from "./file-upload-dnd/file-upload-dnd.component";
import { ProjectFilesComponent } from "./files/project-files/project-files.component";
import { SingleFolderListComponent } from "./files/single-folder-list/single-folder-list.component";
import { SingleImageDetailsComponent } from "./files/single-image-details/single-image-details.component";
import { DashboardComponent } from "./Dashboard-module/Dashboard/dashboard.component";

import { AttencanceDashBoardComponent } from "./attendance_module/attencance-dash-board/attencance-dash-board.component";
import { UserReportComponent } from "./attendance_module/user-report/user-report.component";
import { LogsSummaryComponent } from "./attendance_module/logs-summary/logs-summary.component";
import { from } from "rxjs";

// Import new component

import { CreateNewProjectComponent } from "./new-project-create/create-new-project/create-new-project.component";
import { SingleProjectDetailsComponent } from "./task-display/single-project-details/single-project-details.component";
import { MoveTaskComponent } from "./task-display/move-task/move-task.component";
import { NewUserProfileComponent } from "./new-user-profile/new-user-profile.component";
import { MainTimeLogComponent } from "./Time-Log-Module/main-time-log/main-time-log.component";
import { TotalTimeLogsComponent } from "./Time-Log-Module/total-time-logs/total-time-logs.component";
import { AllUsersLogsComponent } from "./Time-Log-Module/all-users-logs/all-users-logs.component";
import { UserLogsDetailsComponent } from "./Time-Log-Module/user-logs-details/user-logs-details.component";
import { ProjectSummaryComponent } from "./new-view-project/project-summary/project-summary.component";
import { ProjectWorkFlowComponent } from "./project-work-flow/project-work-flow.component";
const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "invite/:inviteLink",
    component: LoginComponent,
  },
  // {
  //   path: "forgot-password/:token",
  //   component: ForgotpwdComponent,
  // },
  {
    path: "",
    component: HomeComponent,
    canActivate: [LoginGuard],
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: "dashboard",
      },
      {
        path: "dashboard",
        component: DashboardComponent,
      },
      // {
      //   path: "notices",
      //   component: NoticeboardComponent,
      // },
      {
        path: "projects",
        component: ViewProjectComponent,
      },
      {
        path: "workCircleList",
        component: AllEmployeeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "notifications",
        // tslint:disable-next-line:indent
        component: NotificationComponent,
      },
      {
        path: "discussions/:projectId",
        component: DiscussionComponent,
      },
      {
        path: "discussion/:id",
        component: DiscssionDetailsComponent,
      },
      // FileUpload
      {
        path: "documents/:projectId",
        component: ProjectFilesComponent,
      },
      {
        path: "documents-folder/:folderId",
        component: ProjectFilesComponent,
      },
      {
        path: "document-file/:imageId",
        component: SingleImageDetailsComponent,
      },

      // NewRoutesOfCode

      {
        path: "add-project",
        component: CreateNewProjectComponent,
      },
      {
        path: "edit-project/:id",
        component: CreateNewProjectComponent,
      },
      {
        path: "project-summary/:id",
        component: ProjectSummaryComponent,
      },
      // project-details
      {
        path: "task-list/:id",
        component: SingleProjectDetailsComponent,
      },
      {
        path: "tasks",
        component: SingleProjectDetailsComponent,
      },
      {
        path: "move-task",
        component: MoveTaskComponent,
      },
      {
        path: "user/:id",
        component: NewUserProfileComponent,
        runGuardsAndResolvers: "paramsOrQueryParamsChange",
      },
      {
        path: "time-log/:id",
        component: MainTimeLogComponent,
      },
      {
        path: "verify-log/:id",
        component: TotalTimeLogsComponent,
      },
      {
        path: "project-settings/:id",
        component: ProjectWorkFlowComponent,
      },
      // {
      //   path: "total-logs",
      //   component: AllUsersLogsComponent,
      // },
      {
        path: "user-logs",
        component: UserLogsDetailsComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
