import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
} from "@angular/forms";
import * as DecoupledEditor from "@ckeditor/ckeditor5-build-classic";
import { ChangeEvent } from "@ckeditor/ckeditor5-angular/ckeditor.component";
import { ProjectService } from "../../services/project.service";
import * as _ from "lodash";
import { S3UploadService } from "../../services/s3-upload.service";
import { NewFileUploadComponent } from "../../common-use/new-file-upload/new-file-upload.component";
import { Observable } from "rxjs";
// import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';

@Component({
  selector: "app-add-new-discussion",
  templateUrl: "./add-new-discussion.component.html",
  styleUrls: ["./add-new-discussion.component.css"],
})
export class AddNewDiscussionComponent implements OnInit {
  createDiscussionForm;
  projectId;
  displayTitle;
  isDisable = false;
  selectedOptions;
  developerName = [];
  redirect = false;
  files: Array<File> = [];
  editDiscussion;
  imageArray = [];
  editImage;
  imageType = ["JPG, JPEG, PNG"];
  allNotifyUser = [];
  imageConfig = {
    toolbar: {
      items: [
        "heading",
        "|",
        "bold",
        "italic",
        "|",
        "bulletedList",
        "numberedList",
        "|",
        "insertTable",
        "|",
        "undo",
        "redo",
      ],
    },
    image: {
      toolbar: [
        "imageStyle:full",
        "imageStyle:side",
        "|",
        "imageTextAlternative",
      ],
    },
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
    },
    language: "en",
  };
  loading = false;
  editDescription;
  uploadedFileArray = [];
  constructor(
    public dialogRef: MatDialogRef<AddNewDiscussionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public _projectService: ProjectService,
    public s3Service: S3UploadService
  ) {
    this.createNewDiscussion();

    // DecoupledEditor
    //   .create(document.querySelector('#editor'), {
    //     plugins: ['Image', 'ImageToolbar'],
    //     // image: {}
    //     // toolbar: ['imageUpload'],

    //     // Configure the endpoint. See the "Configuration" section above.
    //     // cloudServices: {
    //     //   tokenUrl: 'https://example.com/cs-token-endpoint',
    //     //   uploadUrl: 'https://your-organization-id.cke-cs.com/easyimage/upload/'
    //     // }
    //   })
    //   .then((image) => {
    //

    //   })
    //   .catch((error) => {
    //

    //   });
  }

  ngOnInit() {
    //
    console.log("data :: ", this.data);
    if (this.data && this.data.edit == true) {
      this.editDiscussion = this.data.editDetails;
      this.editDescription = this.editDiscussion.content;
      this.projectId = this.editDiscussion.projectId;
      this.imageArray = this.editDiscussion.images;
      this.editImage = true;
      this.allNotifyUser = this.data.notifyList;
      this.displayTitle = "Edit Discussion";
    } else {
      this.projectId = this.data.projectId;
      this.developerName = this.data.allMember;
      this.displayTitle = "Add Discussion";
    }
  }

  public Editor = DecoupledEditor;
  public configuration = { placeholder: "Enter Comment Text..." };
  // public Editor.removePlugins = 'image,pwimage';

  public onReady(editor) {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
    editor.removePlugins = "image,pwimage";
  }
  public onChange({ editor }: ChangeEvent) {
    const data = editor.getData();
    // this.comment = data;
  }

  createNewDiscussion() {
    this.createDiscussionForm = new FormGroup({
      title: new FormControl("", [Validators.required]),
      content: new FormControl("", [Validators.required]),
      projectId: new FormControl(this.projectId),
      notify: this.fb.array([]),
    });
  }

  uploadNewFile() {
    let obj = {
      // singleFile: true,
      // avtar: true,
      path: "Discussions",
    };
    let data = obj;
    var taskDetails = this.openDialog(NewFileUploadComponent, data).subscribe(
      (response) => {
        if (response != undefined) {
          this.editImage = true;
          if (this.data && this.data.edit == true) {
            _.forEach(response, (singleFile) => {
              this.imageArray.push(singleFile.Location);
            });
          } else {
            _.forEach(response, (singleFile) => {
              let obj = {
                singleFile: singleFile.Location,
              };
              this.uploadedFileArray.push(obj);
            });
          }
        }
      }
    );
  }

  uploadedRemove(event) {
    this.uploadedFileArray.splice(event, 1);
  }
  openDialog(someComponent, data = {}): Observable<any> {
    const dialogRef = this.dialog.open(someComponent, { data });
    return dialogRef.afterClosed();
  }

  contentData(event) {
    //
    if (event == null) {
      this.createDiscussionForm.controls["content"].setValue(null);
    } else {
      this.createDiscussionForm.controls["content"].setValue(event);
    }
  }

  addDiscussion(discussion) {
    this.loading = true;
    this.isDisable = true;

    let finalList = [];
    // _.forEach(this.selectedOptions, (singleUser) => {
    //   let notifyUser = {
    //     _id: singleUser._id,
    //   };
    //   finalList.push(notifyUser);
    // });

    _.forEach(this.developerName, (singleUser) => {
      let notifyUser = {
        _id: singleUser._id,
      };
      finalList.push(notifyUser);
    });

    console.log("finalList : ", finalList);

    let data = new FormData();
    data.append("title", discussion.title);
    data.append("content", discussion.content);
    data.append("projectId", this.projectId);
    data.append("notify", JSON.stringify(finalList));
    let fileArray: any = [];
    if (this.uploadedFileArray && this.uploadedFileArray.length) {
      let path = "Discussions";
      // _.forEach(this.files, (singleFile) => {
      // this.s3Service.uploadFile(singleFile, path).subscribe((response: any) => {
      // if (response && response.Location) {
      // let obj = {
      //   singleFile: response.Location
      // }
      // fileArray.push(obj)
      // if (fileArray.length == this.files.length) {

      data.append("images", JSON.stringify(this.uploadedFileArray));
      this._projectService.addDiscussion(data).subscribe(
        (res: any) => {
          this.dialogRef.close(res.data);
          this.isDisable = false;
          this.loading = false;
        },
        (err) => {
          // this.loader = false
          this.isDisable = false;
          this.loading = false;
        }
      );
      // } else {
      //
      // }
      // }
      // })
      // })
    } else {
      //
      this._projectService.addDiscussion(data).subscribe(
        (res: any) => {
          this.dialogRef.close(res.data);
          this.isDisable = false;
          this.loading = false;
        },
        (err) => {
          // this.loader = false
          this.isDisable = false;
          this.loading = false;
        }
      );
    }
  }

  updateDiscussion(discussion) {
    this.loading = true;
    this.isDisable = true;
    let finalList;
    let data = new FormData();
    data.append("discussionId", this.editDiscussion._id);
    data.append("title", discussion.title);
    data.append("content", discussion.content);
    data.append("projectId", this.projectId);
    console.log("this.allNotifyUser : ", this.allNotifyUser);
    // _.forEach(this.allNotifyUser, (singleUser) => {
    //   console.log("singleUser : ", singleUser);
    //   let notifyUser = {
    //     _id: singleUser._id,
    //   };
    //   finalList.push(notifyUser);
    // });
    data.append("notify", JSON.stringify(this.allNotifyUser));
    // console.log("finalList : ", finalList);
    if (this.files.length > 0) {
      // for (var i = 0; i < this.files.length; i++) {
      //   data.append('fileUpload', this.files[i]);
      // }
      let path = "Discussions";
      let fileArray = [];
      _.forEach(this.files, (singleFile) => {
        this.s3Service.uploadFile(singleFile, path).subscribe(
          (response: any) => {
            if (response && response.Location) {
              let obj = {
                singleFile: response.Location,
              };
              fileArray.push(obj);
              this.imageArray.push(response.Location);
              if (fileArray.length == this.files.length) {
                data.append("images", JSON.stringify(this.imageArray));
                this._projectService.updateDiscussion(data).subscribe(
                  (res: any) => {
                    this.dialogRef.close(res.data);
                    this.loading = false;
                    this.isDisable = false;
                    // this.discssionDetails(this.discussionId)
                    this.files = [];
                    // this.url = []
                    // $('#itemManipulationModel').modal('hide');
                  },
                  (err) => {
                    this.isDisable = false;
                    this.loading = false;
                  }
                );
              } else {
              }
            }
          },
          (error) => {}
        );
      });
    } else {
      data.append("images", JSON.stringify(this.imageArray));
      this._projectService.updateDiscussion(data).subscribe(
        (res: any) => {
          this.dialogRef.close(res.data);
          this.loading = false;
          this.isDisable = false;
          // this.discssionDetails(this.discussionId)
          this.files = [];
          // this.url = []
          // $('#itemManipulationModel').modal('hide');
        },
        (err) => {
          this.isDisable = false;
          this.loading = false;
        }
      );
    }
  }

  imageRemove(event) {
    this.imageArray.splice(event, 1);
  }

  /**
   * @param event (fileSelected)
   * Select file from file component and store in file
   */
  changeFile(event) {
    if (event) {
      this.files = event;
    } else {
      // this.url = []
    }
  }
  closeModel() {
    this.dialogRef.close();
  }
}
