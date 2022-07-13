import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { ProjectService } from "../../services/project.service";
import { CommentService } from "../../services/comment.service";
import * as DecoupledEditor from "@ckeditor/ckeditor5-build-classic";
import { ChangeEvent } from "@ckeditor/ckeditor5-angular/ckeditor.component";
import { MatDialog } from "@angular/material";
import { AddNewDiscussionComponent } from "../add-new-discussion/add-new-discussion.component";
import { config } from "../../config";
import * as _ from "lodash";
import { Observable } from "rxjs";
import { S3UploadService } from "../../services/s3-upload.service";
declare var $: any;

@Component({
  selector: "app-discssion-details",
  templateUrl: "./discssion-details.component.html",
  styleUrls: ["./discssion-details.component.css"],
})
export class DiscssionDetailsComponent implements OnInit {
  @Output() courseIndex: EventEmitter<any> = new EventEmitter<any>();

  public model = {
    editorData: "",
  };
  allNotifyUser: any = [];
  allMembers: any = [];
  allProjectManagers: any = [];
  createDiscussionForm;
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  discussionId;
  discussionDetails;
  path = config.baseMediaUrl;
  files: Array<File> = [];
  url = [];
  comment;
  comments;
  isDisable: boolean = false;
  editDetails;
  submitted = false;
  projectId;
  commentData;
  loader: boolean = false;
  resetComment;
  displayData;
  sideMenuButton = true;

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public _projectService: ProjectService,
    public _commentService: CommentService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    public s3Service: S3UploadService
  ) {
    this.route.params.subscribe((param) => {
      this.discussionId = param.id;
    });
    this.discssionDetails(this.discussionId);
    this.createNewDiscussion();
  }
  createNewDiscussion() {
    this.createDiscussionForm = new FormGroup({
      title: new FormControl("", [Validators.required]),
      content: new FormControl("", [Validators.required]),
      projectId: new FormControl(this.projectId),
      notify: this.fb.array([]),
    });
  }
  ngOnInit() {}

  /**
   * Error message
   */
  get f() {
    return this.createDiscussionForm.controls;
  }

  /**
   * @param id {DiscussionId}
   * Get details id discussion
   */
  discssionDetails(id) {
    this.loader = true;
    this._projectService.getDetailsOfDiscussion(id).subscribe(
      (res: any) => {
        this.discussionDetails = res.data[0];
        localStorage.setItem("tempProject", this.discussionDetails.projectId);
        this.getAllCommentOfDiscussion(this.discussionId);

        this.displayData = this.sanitizer.bypassSecurityTrustHtml(
          this.discussionDetails.content
        );
        this.projectId = this.discussionDetails.projectId;
        this.getAllMembersOfProject(this.projectId);
        this.loader = false;
      },
      (err) => {
        this.loader = false;
      }
    );
  }

  /**
   * @param projectId
   * Get list of all developers and project manager
   */
  getAllMembersOfProject(projectId) {
    this._projectService.getAllMembers(projectId).subscribe(
      (res: any) => {
        this.allNotifyUser = [];
        this.allMembers = res.data[0].finalTeam;
        console.log("this.allMembers : ", this.allMembers);
        this.allMembers = this.allMembers.filter(
          (deve) => deve._id !== this.currentUser._id
        );
        console.log("this.allMembers After : ", this.allMembers);
        _.forEach(this.discussionDetails.notify, (alreadyNotify) => {
          let notifyUser = {
            _id: alreadyNotify._id,
          };
          this.allNotifyUser.push(notifyUser);

          _.forEach(this.allMembers, (singleMember, index) => {
            if (alreadyNotify._id == singleMember._id) {
              this.allMembers[index]["selected"] = "true";
            }
          });
        });
        console.log("allNotifyUser : ", this.allNotifyUser);
      },
      (error) => {}
    );
  }

  selectedUsers(isChecked, userId) {
    let notifyUser = {
      _id: userId,
    };
    if (isChecked == true && userId) {
      this.allNotifyUser.push(notifyUser);
    } else if (isChecked == false && userId) {
      this.allNotifyUser = this.allNotifyUser.filter(
        (item) => item._id !== userId
      );
      // const index: number = this.allNotifyUser.indexOf(userId);
      //
      // if (index !== -1) {
      //   this.allNotifyUser.splice(index, 1)
      // }
      // this.allNotifyUser.splice(this.allNotifyUser.indexOf(userId, 1))
    }
  }

  public Editor = DecoupledEditor;
  public configuration = { placeholder: "Enter Comment Text..." };
  public onReady(editor) {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
  }
  public onChange({ editor }: ChangeEvent) {
    var data = editor.getData();
    this.comment = data;
  }

  /**
   * @param event (fileSelected)
   * Select file from file component and store in file
   */
  changeFile(event) {
    if (event) {
      this.files = event;
    } else {
      this.url = [];
    }
  }

  /**
   * @param discssionId {DisucssionId}
   * Add new comment in discussion
   */
  sendComment(discssionId) {
    this.isDisable = true;
    var data: any;
    if (this.files.length > 0) {
      data = new FormData();
      data.append("description", this.comment ? this.comment : "");
      data.append("userId", this.currentUser._id);
      data.append("discussionId", discssionId);
      data.append("notify", JSON.stringify(this.allNotifyUser));
      for (var i = 0; i < this.files.length; i++)
        data.append("fileUpload", this.files[i]);
    } else {
      data = {
        description: this.comment,
        userId: this.currentUser._id,
        discussionId: discssionId,
        notify: JSON.stringify(this.allNotifyUser),
      };
    }

    this._commentService.addComment(data).subscribe(
      (res: any) => {
        this.resetComment = true;
        this.comment = "";
        this.model.editorData = "Enter comments here";
        this.files = [];
        this.isDisable = false;
        this.getAllCommentOfDiscussion(discssionId);
      },
      (err) => {
        console.error(err);
        this.isDisable = false;
      }
    );
  }

  commentDetails(event) {
    this.resetComment = false;
    let file = event.file;
    var data: any;
    let fileArray: any = [];
    let allNotifyUser = [];
    this.allMembers.forEach((user) => {
      allNotifyUser.push({
        _id: user._id,
      });
    });

    if (file.length > 0) {
      data = new FormData();
      data.append("description", event.comment ? event.comment : "");
      data.append("userId", this.currentUser._id);
      data.append("discussionId", this.discussionId);
      // data.append("notify", JSON.stringify(this.allNotifyUser))
      data.append("notify", JSON.stringify(allNotifyUser));
      let path = "Comments";

      // _.forEach(file, (singleFile) => {
      // this.s3Service.uploadFile(singleFile, path).subscribe((response: any) => {
      // if (response && response.Location) {
      //   let obj = {
      //     singleFile: response.Location
      //   }
      //   fileArray.push(obj)
      // if (fileArray.length == file.length) {
      //
      data.append("images", JSON.stringify(file));
      this._commentService.addComment(data).subscribe(
        (res: any) => {
          this.resetComment = true;
          this.getAllCommentOfDiscussion(this.discussionId);
        },
        (err) => {
          console.error(err);
          this.isDisable = false;
        }
      );
      // } else {
      //
      // }
      // }
      // }, error => {
      //

      // })
      // })
      // for (var i = 0; i < file.length; i++)
      //   data.append('fileUpload', file[i]);
    } else {
      data = {
        description: event.comment,
        userId: this.currentUser._id,
        discussionId: this.discussionId,
        notify: JSON.stringify(allNotifyUser),
      };

      this._commentService.addComment(data).subscribe(
        (res: any) => {
          this.resetComment = true;
          // this.comment = "";
          // this.model.editorData = 'Enter comments here';
          // this.files = [];
          // this.isDisable = false;
          this.getAllCommentOfDiscussion(this.discussionId);
        },
        (err) => {
          console.error(err);
          this.isDisable = false;
        }
      );
    }
  }

  selectedDeveloper(event) {
    let finalArray = [];
    _.forEach(event, (singleUser) => {
      let obj = {
        _id: singleUser._id,
      };
      finalArray.push(obj);
    });
    this.allNotifyUser = finalArray;

    let obj = {
      notifyList: JSON.stringify(this.allNotifyUser),
      discussionId: this.discussionId,
    };

    this._projectService.updateNotifyList(obj).subscribe(
      (response) => {},
      (error) => {}
    );
  }

  /**
   * @param discussionId
   * Get all Comments of discussion
   */
  getAllCommentOfDiscussion(discussionId) {
    this._commentService.getAllCommentsOfDiscussion(discussionId).subscribe(
      (res: any) => {
        this.comment = "";
        if (res.data && res.data.length) this.comments = res.data[0].comments;
        _.forEach(res.data[0], (comment) => {
          this.comments = comment;
        });
      },
      (err) => {
        console.error(err);
      }
    );
  }

  /**
   * @param name {name of created user}
   * Display name of created user of discussion
   */
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

  /**
   * @param data {Discussion details}
   * Edit discussion
   */
  editDiscussion(editDiscussion) {
    // $('#itemManipulationModel').modal('show');
    // this.editDetails = data

    let obj = {
      editDetails: editDiscussion,
      edit: true,
      notifyList: this.allMembers,
    };

    let data = obj;
    var taskDetails = this.openDialog(
      AddNewDiscussionComponent,
      data
    ).subscribe((response) => {
      if (response != undefined) {
        this.discssionDetails(response._id);
        // this.discussionList.push(response)
      }
    });
  }

  openDialog(someComponent, data = {}): Observable<any> {
    const dialogRef = this.dialog.open(someComponent, { data });
    return dialogRef.afterClosed();
  }

  /**
   * @param option {Index of image}
   * Remove image from image array
   */
  removeAlreadyUplodedFile(option) {
    this.discussionDetails.images.splice(option, 1);
  }

  /**
   * @param discussion {Discussion details}
   * Create new Discussion
   */
  saveTheData(discussion) {
    this.submitted = true;
    if (this.createDiscussionForm.invalid) {
      return;
    }

    let data = new FormData();
    data.append("discussionId", this.editDetails._id);
    data.append("title", discussion.title);
    data.append("content", discussion.content);
    data.append("projectId", this.projectId);
    data.append("notify", JSON.stringify(this.allNotifyUser));

    data.append("images", JSON.stringify(this.discussionDetails.images));

    if (this.files.length > 0) {
      for (var i = 0; i < this.files.length; i++) {
        data.append("fileUpload", this.files[i]);
      }
    }

    this._projectService.updateDiscussion(data).subscribe(
      (res: any) => {
        // this.discssionDetails(this.discussionId)
        this.files = [];
        this.url = [];
        $("#itemManipulationModel").modal("hide");
      },
      (err) => {}
    );
  }
  focusOnTextArea(comment) {
    $(".ck.ck-content.ck-editor__editable").focus();

    this.model.editorData =
      "<blockquote><q>" + comment.content + "</q></blockquote><p></p>";
  }
}
