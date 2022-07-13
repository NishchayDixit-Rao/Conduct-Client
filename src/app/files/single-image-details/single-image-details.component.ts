import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadService } from '../../services/file-upload.service';
import { config } from '../../config';
import { ProjectService } from '../../services/project.service';
import { computeStyle } from '@angular/animations/browser/src/util';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { CommentService } from '../../services/comment.service';
import * as _ from 'lodash';
import { S3UploadService } from '../../services/s3-upload.service';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewFileUploadComponent } from '../../common-use/new-file-upload/new-file-upload.component';
import { Observable } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-single-image-details',
  templateUrl: './single-image-details.component.html',
  styleUrls: ['./single-image-details.component.css']
})
export class SingleImageDetailsComponent implements OnInit {



  public model = {
    editorData: ''
  };
  loader: boolean = false
  allNotifyUser: any = []
  allMembers: any = []
  folderId
  imageId
  projectId = localStorage.getItem('projectId')
  imageDetails
  path = config.baseMediaUrl
  comment;
  comments
  files: any = [];
  url = [];
  allVersionImageList = [];
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  isDisable: boolean = false;
  resetComment
  resetImage
  fileType
  sideMenuButton = true
  editImage
  loading = false
  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public fileUpload: FileUploadService,
    public _projectService: ProjectService,
    public _commentService: CommentService,
    public s3Service: S3UploadService,
    public dialog: MatDialog,
  ) {
    this.activatedRoute.params.subscribe(param => {
      
      // this.folderId = param.folderId
      // 
      this.imageId = param.imageId
      // this.projectId = param.projectId
      this.singleImageDetails(this.imageId)
    })
  }

  ngOnInit() {
    // this.allVersionImages()
  }


  uploadNewFile() {
    let obj = {
      // singleFile: true,
      // avtar: true,
      path: "Files",
      fileModule: true
    }
    let data = obj
    var taskDetails = this.openDialog(NewFileUploadComponent, data).subscribe((response) => {
      
      if (response != undefined) {
        this.editImage = true
        this.files = response
        //   if (this.data.task && this.data.task.edited == true) {
        //     _.forEach(response, (singleFile) => {
        //       this.newImages.push(singleFile.Location)
        //     })
        //   } else {
        //     _.forEach(response, (singleFile) => {
        //       let obj = {
        //         singleFile: singleFile.Location
        //       }
        //       this.uploadedFileArray.push(obj)
        //     })
        //     
        //   }
      }
    })
  }

  uploadedRemove(event) {
    
    this.files.splice(event, 1);
  }

  openDialog(someComponent, data = {}): Observable<any> {
    
    const dialogRef = this.dialog.open(someComponent, { data });
    return dialogRef.afterClosed();
  }
  /**
   * Ckeditor Functionality
   */
  // public Editor = DecoupledEditor;
  // public configuration = { placeholder: 'Enter Comment Text...' };
  // public onReady(editor) {
  //   editor.ui.getEditableElement().parentElement.insertBefore(
  //     editor.ui.view.toolbar.element,
  //     editor.ui.getEditableElement()
  //   );
  // }
  // public onChange({ editor }: ChangeEvent) {
  //   var data = editor.getData();
  //   this.comment = data;
  // }


  /**
   * @param imageId 
   * Get single image details
   */
  singleImageDetails(imageId) {
    this.loader = true
    this.fileUpload.singleImageDetails(imageId).subscribe((res: any) => {
      
      this.imageDetails = res.imageDetails[0]
      localStorage.setItem('tempProject', this.imageDetails.projectId)
      this.fileType = this.imageDetails.alias.split('.')[1]
      this.folderId = this.imageDetails.folderId
      if (this.imageDetails.oldFiles && this.imageDetails.oldFiles.length) {
        this.allVersionImageList = this.imageDetails.oldFiles
      }
      if (this.imageDetails.comments && this.imageDetails.comments.length) {
        this.comments = this.imageDetails.comments
      }
      this.getAllMembersOfProject(this.imageDetails.projectId)
      // this.getAllCommentOfImage()
      this.loader = false
    }, err => {
      this.loader = false
      
    })

  }


  /**
   * @param projectId 
   * Get list of all developers and project manager 
   */
  getAllMembersOfProject(projectId) {
    this._projectService.getAllMembers(projectId).subscribe((res: any) => {
      this.allNotifyUser = []
      this.allMembers = res.data[0].finalTeam
      

      // 
      this.allMembers = this.allMembers.filter(deve => deve._id !== this.currentUser._id)
      _.forEach(this.imageDetails.notify, (alreadyNotify) => {
        
        let notifyUser = {
          _id: alreadyNotify._id
        }
        this.allNotifyUser.push(notifyUser)
        
        _.forEach(this.allMembers, (singleMember, index) => {
          if (alreadyNotify._id == singleMember._id) {
            this.allMembers[index]['selected'] = 'true'
          }
        })
      })
    }, error => {
      
    })
  }

  // selectedUsers(isChecked, userId) {
  //   let notifyUser = {
  //     _id: userId
  //   }
  //   if (isChecked == true && userId) {
  //     this.allNotifyUser.push(notifyUser)
  //   } else if (isChecked == false && userId) {
  //     this.allNotifyUser.splice(this.allNotifyUser.indexOf(userId), 1)
  //   }
  //   
  // }

  /**
   * @param event (fileSelected)
   * Select file from file component and store in file 
   */
  changeFile(event) {
    
    if (event) {
      this.files = event;
    } else {
      this.url = []
      this.files = []
    }
  }

  selectedDeveloper(event) {
    
    let finalArray = []
    _.forEach(event, (singleUser) => {
      let obj = {
        _id: singleUser._id
      }
      finalArray.push(obj)
    })
    this.allNotifyUser = finalArray

    let obj = {
      notifyList: JSON.stringify(this.allNotifyUser),
      imageId: this.imageId
    }
    this.fileUpload.updateNotifyList(obj).subscribe((response) => {
      
    }, error => {
      

    })

  }



  commentDetails(event) {
    let file = event.file
    let data: any
    this.resetComment = false
    let fileArray: any = []
    // if (file.length > 0) {
    data = new FormData();
    data.append("description", event.comment ? event.comment : "");
    data.append("userId", this.currentUser._id);
    data.append("imageId", this.imageId);
    // data.append("projectId", this.projectId)
    data.append("folderId", this.folderId)
    data.append("notify", JSON.stringify(this.allNotifyUser))
    let path = "Comments"
    if (file && file.length) {
      data.append('images', JSON.stringify(file))
    }
    
    // _.forEach(file, (singleFile) => {
    // this.s3Service.uploadFile(singleFile, path).subscribe((response: any) => {
    // if (response && response.Location) {
    //   let obj = {
    //     singleFile: response.Location
    //   }
    // fileArray.push(obj)
    // if (fileArray.length == file.length) {
    // 
    // data.append('images', JSON.stringify(fileArray))
    this._commentService.addComment(data).subscribe((res: any) => {
      
      this.resetComment = true
      this.singleImageDetails(this.imageId)
    }, err => {
      console.error(err);
      // this.isDisable = false;
    });
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
    // } else {
    //   data = { description: event.comment, userId: this.currentUser._id, imageId: this.imageId, folderId: this.folderId, notify: JSON.stringify(this.allNotifyUser) };
    //   this._commentService.addComment(data).subscribe((res: any) => {
    //     
    //     this.resetComment = true
    //     this.singleImageDetails(this.imageId)
    //   }, err => {
    //     console.error(err);
    //     // this.isDisable = false;
    //   });
    // }

  }



  /**
  * save image which is not in any created folder
  */
  saveFile() {
    let data = new FormData()
    if (this.files.length > 0) {
      this.loading = true
      // for (var i = 0; i < this.files.length; i++) {
      //   data.append('fileUpload', this.files[i]);
      // }
      let path = "Files"
      let sizeArray = []
      // this.s3Service.uploadFile(this.files[0], path).subscribe((response: any) => {
      // 
      // if (response.loaded) {
      //   sizeArray.push(response.loaded)
      // }
      // if (response && response.Location) {

      // 
      // let finalSize = sizeArray[sizeArray.length - 1]
      // let fileName = this.files[0].name
      let finalSize = this.files[0].size
      let fileName = this.files[0].Key.split("/")
      let finalFileName = fileName[2]
      
      const listId = {
        folderId: this.folderId,
        imageId: this.imageId,
        // projectId: this.projectId,
        notify: JSON.stringify(this.allNotifyUser),
        fileName: this.files[0].Location,
        alias: finalFileName,
        size: finalSize
      }
      this.fileUpload.addVersion(data, listId).subscribe((res: any) => {
        
        this.resetImage = true
        this.files = []
        this.loading = false
        // $('#itemManipulationModel1').modal('hide');
        this.singleImageDetails(this.imageId)
      }, err => {
        
        this.loading = false
      })

    }
  }

  // allVersionImages() {
  //   const listId = {
  //     imageId: this.imageId,
  //     projectId: this.projectId
  //   }
  //   this.fileUpload.allVersionImages(listId).subscribe((res: any) => {
  //     

  //     if (res.allImageList && res.allImageList.length)
  //       this.allVersionImageList = res.allImageList[0].oldFiles
  //     
  //   }, err => {
  //     
  //   })
  // }
}
