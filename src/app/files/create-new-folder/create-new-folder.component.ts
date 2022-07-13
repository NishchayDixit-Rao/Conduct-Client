import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validator, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectService } from '../../services/project.service';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-create-new-folder',
  templateUrl: './create-new-folder.component.html',
  styleUrls: ['./create-new-folder.component.css']
})
export class CreateNewFolderComponent implements OnInit {

  createFolderForm
  displayTitle
  isDisable = false
  projectId
  editFolder
  folderId
  mainFolderId
  loading = false
  constructor(
    public dialogRef: MatDialogRef<CreateNewFolderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public projectService: ProjectService,
    public fileUpload: FileUploadService
  ) {
    this.createFolder()
  }


  createFolder() {
    this.createFolderForm = new FormGroup({
      folderName: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      projectId: new FormControl(''),
    })
  }

  ngOnInit() {
    

    if (this.data && this.data.edit == true) {
      this.editFolder = this.data
      this.displayTitle = this.data.title,
        this.projectId = this.data.projectId,
        this.folderId = this.data.folderId
    } else {
      this.displayTitle = this.data.title
      this.projectId = this.data.projectId
      this.mainFolderId = this.data.mainFolderId
      this.createFolderForm.patchValue({
        projectId: this.projectId
      });
      this.createFolderForm.get('projectId').updateValueAndValidity();
    }
  }


  newFolderCreate() {
    
    
    this.isDisable = true
    this.loading = true
    let data = new FormData
    data.append('folderName', this.createFolderForm.value.folderName)
    data.append('description', this.createFolderForm.value.description)
    data.append('projectId', this.projectId)
    if (this.mainFolderId != undefined) {
      data.append('mainFolder', this.mainFolderId)
    }
    this.fileUpload.createNewFolder(data).subscribe((res: any) => {
      
      this.dialogRef.close(res.data)
      this.isDisable = false
      this.loading = false
    }, err => {
      // this.loader = false
      
      this.loading = true
      this.isDisable = false
    })
  }
  updateFolder() {
    
    this.isDisable = true
    this.loading = true
    let data = new FormData
    data.append('folderName', this.createFolderForm.value.folderName)
    data.append('description', this.createFolderForm.value.description)
    data.append('projectId', this.projectId)
    data.append('folderId', this.folderId)
    
    this.fileUpload.updateFolder(data).subscribe((response: any) => {
      
      // if(response && response.data)
      this.loading = false
      this.isDisable = false
      this.dialogRef.close(response.data)
    }, error => {
      this.loading = false
      
      this.isDisable = false
    })
  }


  closeModel() {
    this.dialogRef.close()
  }

}
