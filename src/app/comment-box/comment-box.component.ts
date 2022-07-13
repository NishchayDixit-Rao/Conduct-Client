import {
  Component,
  OnInit,
  Input,
  SimpleChange,
  SimpleChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import { config } from "../config";
import * as DecoupledEditor from "@ckeditor/ckeditor5-build-classic";
import { ChangeEvent } from "@ckeditor/ckeditor5-angular/ckeditor.component";
import { DomSanitizer } from "@angular/platform-browser";
import { NewFileUploadComponent } from "../common-use/new-file-upload/new-file-upload.component";
import * as _ from "lodash";
import { Observable } from "rxjs";
import { MatDialog } from "@angular/material";
// import { EventEmitter } from 'protractor';
@Component({
  selector: "app-comment-box",
  templateUrl: "./comment-box.component.html",
  styleUrls: [
    "../task-display/single-project-details/single-project-details.component.css",
  ],
})
export class CommentBoxComponent implements OnInit {
  public model = {
    editorData: "",
  };
  @Input("comment") commentDetails;
  @Input("commentReset") resetComment;
  @Output() commentData: EventEmitter<any> = new EventEmitter();
  path = config.baseMediaUrl;
  comments: any = [];
  addComment;
  files: Array<File> = [];
  isDisable = false;
  displayContent;
  loading = false;
  resetImage = false;
  resetValue;
  editImage;
  uploadedFileArray = [];
  constructor(private sanitizer: DomSanitizer, public dialog: MatDialog) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {

    //

    if (changes.commentDetails && changes.commentDetails.currentValue) {
      this.displayComment(changes.commentDetails.currentValue);
      // this.comments = changes.commentDetails.currentValue
      // this.displayContent = this.sanitizer.bypassSecurityTrustHtml(this.comments.description);
    }
    //
    // //
    if (changes.resetComment && changes.resetComment.currentValue == true) {
      this.addComment = "";
      this.model.editorData = "Enter comments here";
      this.files = [];
      this.addComment = "";
      this.loading = false;
      this.resetImage = true;
      this.resetValue = true;
      this.uploadedFileArray = [];
    } else {
      this.resetImage = false;
    }
    // else {
    //   this.loading = false
    //   this.files = []
    //   this.resetImage = true
    // }
  }
  displayComment(data) {
    this.comments = [];
    //
    _.forEach(data, (singleData) => {
      //
      let displayData = this.sanitizer.bypassSecurityTrustHtml(
        singleData.description
      );
      singleData["description"] = displayData;
      //
      this.comments.push(singleData);
    });
  }

  uploadNewFile() {
    let obj = {
      // singleFile: true,
      // avtar: true,
      path: "Comments",
    };
    let data = obj;
    var taskDetails = this.openDialog(NewFileUploadComponent, data).subscribe(
      (response) => {
        //
    
        if (response != undefined) {
          this.editImage = true;
          // if (this.data.task && this.data.task.edited == true) {
          //   _.forEach(response, (singleFile) => {
          //     this.newImages.push(singleFile.Location)
          //   })
          // } else {
          _.forEach(response, (singleFile) => {
            let obj = {
              singleFile: singleFile.Location,
            };
            this.uploadedFileArray.push(obj);
          });
          //
          // }
        }
      }
    );
  }

  openDialog(someComponent, data = {}): Observable<any> {
    //
    const dialogRef = this.dialog.open(someComponent, { data });
    return dialogRef.afterClosed();
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

  public Editor = DecoupledEditor;
  public configuration = { placeholder: "Enter Comment Text..." };
  public onReady(editor) {
    // //
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
  }
  public onChange({ editor }: ChangeEvent) {
    const data = editor.getData();
    this.addComment = data;
  }

  uploadedRemove(event) {
    //
    this.uploadedFileArray.splice(event, 1);
  }

  sendComment() {
    //
    let obj = {
      comment: this.addComment,
      file: this.uploadedFileArray,
    };
    //
    this.addComment = "";

    // var data: any;
    // if (this.files.length > 0) {
    //   data = new FormData();
    //   // data.append("Images",this.images);
    //   for (var i = 0; i < this.files.length; i++) {
    //     data.append('fileUpload', this.files[i]);
    //   }
    //   data.append("description", this.addComment ? this.addComment : "");
    // } else {
    //   data = new FormData();
    //   data.append("description", this.addComment ? this.addComment : "");
    // }
    this.loading = true;
    this.resetValue = false;
    this.commentData.emit(obj);
  }

  changeFile(event) {
    this.files = event;
    //
  }

  contentData(event) {
    //
    if (event == null) {
      this.addComment = "";
    } else {
      this.addComment = event;
    }
  }
}
