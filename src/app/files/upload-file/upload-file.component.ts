import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileUploadService } from '../../services/file-upload.service';
import { S3UploadService } from '../../services/s3-upload.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {

  selectedOptions
  developerName = []
  // files: Array<File> = [];
  projectId
  folderId
  isDisable = false
  loading = false
  fileModule = true
  files: any = []
  editImage
  constructor(

    public dialogRef: MatDialogRef<UploadFileComponent>,
    @Inject(MAT_DIALOG_DATA) public dataNew: any,
    public dialog: MatDialog,
    public fileUpload: FileUploadService,
    public s3Service: S3UploadService
  ) { }

  ngOnInit() {
    // 
    this.developerName = this.dataNew.teamMembers
    this.projectId = this.dataNew.projectId
    this.folderId = this.dataNew.folderId
  }

  fileUploaded(event) {
    this.editImage = true
    
    this.files = event

  }

  uploadedRemove(event) {
    
    this.files.splice(event, 1);
  }
  saveFile() {
    this.isDisable = true
    this.loading = true
    let finalList = []
    _.forEach(this.selectedOptions, (singleUser) => {
      let notifyUser = {
        _id: singleUser._id
      }
      finalList.push(notifyUser)
    })
    let data = new FormData()
    let sizeArray = []
    if (this.files.length > 0) {
      
      // let path = "Files"
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
        projectId: this.projectId,
        notify: JSON.stringify(finalList),
        fileName: this.files[0].Location,
        alias: finalFileName,
        size: finalSize
      }
      

      this.fileUpload.saveFile(data, listId).subscribe((res: any) => {
        
        this.dialogRef.close(res.data)
        this.loading = false
        this.isDisable = false
        // $('#itemManipulationModel1').modal('hide');

        // this.files = []
        // this.generalImageList(listId)
        // this.loader = false
      }, err => {
        this.loading = false
        this.isDisable = false
        // this.loader = false
        
      })
      // }
      // })

      // for (var i = 0; i < this.files.length; i++) {
      //   data.append('fileUpload', this.files[i]);
      // }


    }

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
    this.dialogRef.close()
  }

}
