import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FroalaEditorModule, FroalaViewModule } from "angular-froala-wysiwyg";
import { ToastrModule } from "ngx-toastr";

//import { FlexLayoutModule } from "@angular/flex-layout";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { ViewProjectComponent } from "./new-view-project/view-project/view-project.component";
import { HeaderComponent } from "./header/header.component";
// import { CreateProjectComponent } from "./create-project/create-project.component";
// import { EditProjectComponent } from "./edit-project/edit-project.component";
// import { EditTeamComponent } from "./edit-team/edit-team.component";
// import { MainTableViewComponent } from "./main-table-view/main-table-view.component";
// import { IssueComponent } from "./issue/issue.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { ProjectDetailComponent } from "./project-detail/project-detail.component";

import { MatFormFieldModule } from "@angular/material/form-field";

import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatCardModule } from "@angular/material/card";
//import { MatIconModule } from "@angular/material/icon";

import { HomeComponent } from "./home/home.component";
import { RegisterComponent } from "./register/register.component";
import { AuthInterceptor } from "./services/auth.interceptor";
// import { FileUploadDndComponent } from './file-upload-dnd/file-upload-dnd.component';

// import { LogsComponent } from './logs/logs.component';

// import { FileListComponent } from "./file-list/file-list.component";
//import { DndModule } from 'ngx-drag-drop';
// import { NgxEditorModule } from "ngx-editor";
// import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { TimeAgoPipe } from "time-ago-pipe";
// import { UpdateUserComponent } from "./update-user/update-user.component";
import { AddNoticeComponent } from "./add-notice/add-notice.component";
import { NoticeboardComponent } from "./noticeboard/noticeboard.component";
import { SearchTaskPipe } from "./search-task.pipe";
// import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { AddEmployeeComponent } from "./add-employee/add-employee.component";
// import { UserprofileComponent } from "./userprofile/userprofile.component";
// import { ChildComponent } from "./child/child.component";
// import { LeaveComponent } from "./leave/leave.component";
// import { AllDeveloperComponent } from "./all-developer/all-developer.component";
// import { VisitUserProfileComponent } from "./visit-user-profile/visit-user-profile.component";
// import { AllLeaveAppComponent } from "./all-leave-app/all-leave-app.component";
import { AllEmployeeComponent } from "./all-employee/all-employee.component";
// import { SummaryComponent } from "./summary/summary.component";
import { PushNotificationService } from "ngx-push-notifications";
import { ImageViewerModule } from "ng2-image-viewer";

import { CommonModule } from "@angular/common";
import { CalendarModule, DateAdapter } from "angular-calendar";
// import { DemoUtilsModule } from "./demo-utils/module";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { MatDatepickerModule, MatNativeDateModule } from "@angular/material";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { DatePipe } from "@angular/common";

import { NgxPaginationModule } from "ngx-pagination";
import { DatepickerModule, BsDatepickerModule } from "ngx-bootstrap/datepicker";

//All component for firebase notification
import { AngularFireMessagingModule } from "@angular/fire/messaging";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireModule } from "@angular/fire";
import { ProjectService } from "./services/project.service";
import { MessagingService } from "./services/messaging.service";
import { LoginService } from "./services/login.service";
import { environment } from "../environments/environment";
import { AsyncPipe } from "../../node_modules/@angular/common";
import { firebaseConfig } from "./../environments/firebase.config";
import { EditprofileComponent } from "./editprofile/editprofile.component";
import { SelectDropDownModule } from "ngx-select-dropdown";
import { NgSelectModule } from "@ng-select/ng-select";
import { UserSummaryComponent } from "./user-summary/user-summary.component";
// import { ForgotpwdComponent } from "./forgotpwd/forgotpwd.component";
// import { MyleaveComponent } from "./myleave/myleave.component";
import { NotificationComponent } from "./notification/notification.component";
// import { BacklogComponent } from "./backlog/backlog.component";
// import { TimeLogComponent } from "./time-log/time-log.component";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FileUploadDndComponent } from "./file-upload-dnd/file-upload-dnd.component";

// import { DashboardComponent } from './Leave_module/dashboard/dashboard.component';
// import {leaveDas} from './Leave_module/leave-dashboard/leave-dashboard.component';
// import { LeaveFormComponent } from "./Leave_module/leave-form/leave-form.component";
// import { LeavesReportComponent } from "./Leave_module/leaves-report/leaves-report.component";
// import { AllLeaveApplicationComponent } from "./Leave_module/all-leave-application/all-leave-application.component";
// import { AllUserListComponent } from "./Leave_module/all-user-list/all-user-list.component";
// import { SingleUserLeaveComponent } from "./Leave_module/single-user-leave/single-user-leave.component";
import { Globals } from "./services/globals";
import { DiscussionComponent } from "./discussion-module/discussion/discussion.component";
import { DiscssionDetailsComponent } from "./discussion-module/discssion-details/discssion-details.component";
import { SingleFolderListComponent } from "./files/single-folder-list/single-folder-list.component";
import { ProjectFilesComponent } from "./files/project-files/project-files.component";
import { SingleImageDetailsComponent } from "./files/single-image-details/single-image-details.component";
import { DashboardComponent } from "./Dashboard-module/Dashboard/dashboard.component";

// import { AttencanceDashBoardComponent } from "./attendance_module/attencance-dash-board/attencance-dash-board.component";
// import { UserReportComponent } from "./attendance_module/user-report/user-report.component";
// import { LogsSummaryComponent } from "./attendance_module/logs-summary/logs-summary.component";
// import { UploadFilesProjectComponent } from "./files/upload-files-project/upload-files-project.component";

// Angular material
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { MatSliderModule } from "@angular/material/slider";
// import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from "@angular/material/input";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatRippleModule } from "@angular/material/core";
import { MatBadgeModule } from "@angular/material/badge";
import { MatDividerModule } from "@angular/material/divider";
import { MatMenuModule } from "@angular/material/menu";
import { MatListModule } from "@angular/material/list";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatRadioModule } from "@angular/material/radio";
import { MatSnackBarModule } from "@angular/material/snack-bar";

import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
// import { MatDialogRef } from '@angular/material/dialog'

import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";
// import { DemoUtilsModule } from './demo-utils/module';
import { QuillModule } from "ngx-quill";

import { CreateNewProjectComponent } from "./new-project-create/create-new-project/create-new-project.component";
import { SelectAvatarComponent } from "./new-project-create/select-avatar/select-avatar.component";
import { MateDatePickerComponent } from "./mate-date-picker/mate-date-picker.component";
import { SingleEmployeeCardComponent } from "./single-employee-card/single-employee-card.component";
import { SingleProjectCardComponent } from "./new-view-project/single-project-card/single-project-card.component";
import { SingleProjectDetailsComponent } from "./task-display/single-project-details/single-project-details.component";
import { TaskCardComponent } from "./task-display/task-card/task-card.component";
import { SingleTaskDetailsComponent } from "./task-display/single-task-details/single-task-details.component";
import { CommentBoxComponent } from "./comment-box/comment-box.component";
import { UserComponent } from "./user/user.component";
import { AddTaskComponent } from "./task-display/add-task/add-task.component";
import { ImageDisplayComponent } from "./image-display/image-display.component";
import { NewEmployeeAddComponent } from "./new-employee-add/new-employee-add.component";
import { DisplayFilterComponent } from "./filter/display-filter/display-filter.component";
import { DeveloperFilterComponent } from "./filter/developer-filter/developer-filter.component";
import { DateRangePickerComponent } from "./filter/date-range-picker/date-range-picker.component";
import { NoDataFoundComponent } from "./filter/no-data-found/no-data-found.component";
import { DisplaySortingComponent } from "./sorting/display-sorting/display-sorting.component";
import { NewUserProfileComponent } from "./new-user-profile/new-user-profile.component";
import { NewResetPasswordComponent } from "./new-reset-password/new-reset-password.component";
import { MainTimeLogComponent } from "./Time-Log-Module/main-time-log/main-time-log.component";
import { AddTimelogModelComponent } from "./Time-Log-Module/add-timelog-model/add-timelog-model.component";
import { TotalTimeLogsComponent } from "./Time-Log-Module/total-time-logs/total-time-logs.component";
import { ApproveLogsModelComponent } from "./Time-Log-Module/approve-logs-model/approve-logs-model.component";
import { AllUsersLogsComponent } from "./Time-Log-Module/all-users-logs/all-users-logs.component";
import { UserLogsDetailsComponent } from "./Time-Log-Module/user-logs-details/user-logs-details.component";
import { AddNewDiscussionComponent } from "./discussion-module/add-new-discussion/add-new-discussion.component";
import { NotifyUserListComponent } from "./discussion-module/notify-user-list/notify-user-list.component";
import { CreateNewFolderComponent } from "./files/create-new-folder/create-new-folder.component";
import { UploadFileComponent } from "./files/upload-file/upload-file.component";
import { FolderTileComponent } from "./files/folder-tile/folder-tile.component";
import { FileTileComponent } from "./files/file-tile/file-tile.component";
import { ProjectSummaryComponent } from "./new-view-project/project-summary/project-summary.component";
import { TextEditorComponent } from "./common-use/text-editor/text-editor.component";
import { NewFileUploadComponent } from "./common-use/new-file-upload/new-file-upload.component";
import { InvitationLinkComponent } from "./new-project-create/invitation-link/invitation-link.component";
import { FeedbackComponent } from "./feedback/feedback.component";
import { ProjectWorkFlowComponent } from "./project-work-flow/project-work-flow.component";
import { UserToDoTasksListComponent } from "./Dashboard-module/user-to-do-tasks-list/user-to-do-tasks-list.component";
import { MoveCopyTaskComponent } from './task-display/move-copy-task/move-copy-task.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ViewProjectComponent,
    // CreateProjectComponent,
    // EditProjectComponent,
    // EditTeamComponent,
    // MainTableViewComponent,
    HeaderComponent,
    // IssueComponent,
    ProjectDetailComponent,
    HomeComponent,
    RegisterComponent,
    // LogsComponent,
    // FileListComponent,
    TimeAgoPipe,
    // UpdateUserComponent,
    SearchTaskPipe,
    // ResetPasswordComponent,
    // AddEmployeeComponent,
    // ChildComponent,
    AddNoticeComponent,
    NoticeboardComponent,
    // UserprofileComponent,
    // LeaveComponent,
    // AllDeveloperComponent,
    // VisitUserProfileComponent,
    // AllLeaveAppComponent,
    AllEmployeeComponent,
    // SummaryComponent,
    EditprofileComponent,
    UserSummaryComponent,
    // ForgotpwdComponent,
    // MyleaveComponent,
    NotificationComponent,
    // BacklogComponent,
    // TimeLogComponent,
    FileUploadDndComponent,
    DashboardComponent,
    // LeaveFormComponent,
    // LeavesReportComponent,
    // AllLeaveApplicationComponent,
    // AllUserListComponent,
    // SingleUserLeaveComponent,
    DiscussionComponent,
    DiscssionDetailsComponent,
    SingleFolderListComponent,
    ProjectFilesComponent,
    SingleImageDetailsComponent,
    // AttencanceDashBoardComponent,
    // UserReportComponent,
    // LogsSummaryComponent,
    // UploadFilesProjectComponent,
    CreateNewProjectComponent,
    SelectAvatarComponent,
    MateDatePickerComponent,
    SingleEmployeeCardComponent,
    SingleProjectCardComponent,
    SingleProjectDetailsComponent,
    TaskCardComponent,
    SingleTaskDetailsComponent,
    CommentBoxComponent,
    UserComponent,
    AddTaskComponent,
    ImageDisplayComponent,
    NewEmployeeAddComponent,
    DisplayFilterComponent,
    DeveloperFilterComponent,
    DateRangePickerComponent,
    NoDataFoundComponent,
    DisplaySortingComponent,
    NewUserProfileComponent,
    NewResetPasswordComponent,
    MainTimeLogComponent,
    AddTimelogModelComponent,
    TotalTimeLogsComponent,
    ApproveLogsModelComponent,
    AllUsersLogsComponent,
    UserLogsDetailsComponent,
    AddNewDiscussionComponent,
    NotifyUserListComponent,
    CreateNewFolderComponent,
    UploadFileComponent,
    FolderTileComponent,
    FileTileComponent,
    ProjectSummaryComponent,
    TextEditorComponent,
    NewFileUploadComponent,
    InvitationLinkComponent,
    FeedbackComponent,
    ProjectWorkFlowComponent,
    UserToDoTasksListComponent,
    MoveCopyTaskComponent,
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: "never" }),
    FormsModule,
    HttpClientModule,
    NgbModule,
    MatFormFieldModule,
    DragDropModule,
    MatCardModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    // NgxEditorModule,
    // CKEditorModule,
    Ng2SearchPipeModule,
    // <----- this module will be deprecated in the future version.
    MatDatepickerModule, // <----- import(must)
    MatNativeDateModule, // <----- import for date formating(optional)

    // DemoUtilsModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase),
    SelectDropDownModule,
    NgSelectModule,
    ImageViewerModule,
    ToastrModule.forRoot(),
    CommonModule,
    NgxPaginationModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    DatepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgxDaterangepickerMd.forRoot(),
    MatSliderModule,
    MatInputModule,
    MatExpansionModule,
    MatButtonModule,
    MatSelectModule,
    MatRippleModule,
    MatDialogModule,
    MatBadgeModule,
    MatDividerModule,
    MatMenuModule,
    MatListModule,
    MatToolbarModule,
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatSnackBarModule,
    QuillModule.forRoot(),
  ],
  providers: [
    LoginService,
    ProjectService,
    Globals,
    MessagingService,
    AsyncPipe,
    {
      provide: MatDialogRef,
      useValue: {},
    },
    {
      provide: MAT_DIALOG_DATA,
      useValue: {},
    },
    PushNotificationService,
    NoticeboardComponent,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    DatePipe,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  entryComponents: [
    InvitationLinkComponent,
    SelectAvatarComponent,
    SingleTaskDetailsComponent,
    AddTaskComponent,
    NewEmployeeAddComponent,
    NewResetPasswordComponent,
    AddTimelogModelComponent,
    ApproveLogsModelComponent,
    AddNoticeComponent,
    AddNewDiscussionComponent,
    CreateNewFolderComponent,
    UploadFileComponent,
    NewFileUploadComponent,
    FeedbackComponent,
  ],
})
export class AppModule { }
