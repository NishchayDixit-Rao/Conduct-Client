import { Component, OnInit, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadService } from '../../services/file-upload.service';
import { ProjectService } from '../../services/project.service';
import { config } from '../../config';
declare var $: any;
import { Observable } from 'rxjs';
import { of, pipe } from 'rxjs';
import { map } from 'rxjs/operators';

import { MatDialog } from '@angular/material';
import * as _ from 'lodash';
import { UploadFileComponent } from '../upload-file/upload-file.component';
import { CreateNewFolderComponent } from '../create-new-folder/create-new-folder.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-single-folder-list',
  templateUrl: './single-folder-list.component.html',
  styleUrls: ['./single-folder-list.component.css']
})
export class SingleFolderListComponent implements OnInit {
  state$: Observable<object>;
  loader: boolean = false
  projectId
  singleFolderId
  path = config.baseMediaUrl;
  files: Array<File> = [];
  url = [];
  fileName = []
  listOfImages = []
  @Output() fileProjectId
  allMembers: any = []
  allNotifyUser: any = []
  totalFolder = []
  allFolderList: any = []
  folderDetails
  currentUser = JSON.parse(localStorage.getItem('currentUser'));

  constructor(
    public fileUpload: FileUploadService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _projectService: ProjectService,
    public dialog: MatDialog,
  ) {
    this.activatedRoute.params.subscribe(param => {
      
      this.singleFolderId = param.folderId
      // this.projectId = param.projectId
      
      this.singleFolderDetails()
    })
  }

  ngOnInit() {
    // this.getAllMembersOfProject()
    this.state$ = this.activatedRoute.paramMap
      .pipe(map(() => window.history.state))
    let name = window.history.state
    
    if (!name) {
      let file = name.path.split('/')[1]
      this.fileName.push(file)
    }
  }

  singleFolderDetails() {
    this.allFolderList = []
    this.totalFolder = []
    this.listOfImages = []
    this.loader = true
    const listId = {
      folderId: this.singleFolderId,
      // projectId: this.projectId
    }
    this.fileUpload.generalList(listId).subscribe((res: any) => {
      
      this.loader = false
      // if (res && res.allImages.length) {
      let arrayDisplay = res.allImages[0]
      this.projectId = arrayDisplay.projectId
      
      this.fileName = arrayDisplay.path.split('/')[1]
      if (arrayDisplay.subFolders && arrayDisplay.subFolders.length) {
        this.allFolderList = arrayDisplay.subFolders
        _.forEach(this.allFolderList, (single) => {
          
          let folderDetails = {
            path: single.path.split('/')[1],
            name: single.createdBy.name,
            createdAt: single.createdAt,
            folderId: single._id
          }
          this.totalFolder.push(folderDetails)
        })
        if (arrayDisplay.files && arrayDisplay.files.length) {
          this.listOfImages = arrayDisplay.files
        }
      }
      // }
    }, err => {
      this.loader = false
      
    })
  }

  addFolder() {
    
    $('#itemManipulationModel').modal('show');
  }


  deleteFolder(event) {
    
    let index = event
    this.folderDetails = this.allFolderList[index]
    let path = this.folderDetails.path.split('/')[1]
    Swal.fire({
      html: "<span style=" + 'font-size:25px' + ">  Are you sure you want to remove <strong style=" + 'font-weight:bold' + ">" + " " + path,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Delete it!',
      showCloseButton: true
    }).then((result) => {
      if (result.value) {

        
        const listId = {
          folderId: this.folderDetails._id,
          projectId: this.projectId
        }
        
        this.fileUpload.deleteFolder(listId).subscribe((res: any) => {
          Swal.fire({ type: 'success', title: 'Folder Deleted Successfully', showConfirmButton: false, timer: 2000 })
          

          let index = this.allFolderList.findIndex(x => x._id == this.folderDetails._id);
          this.allFolderList.splice(index, 1);


          let index1 = this.totalFolder.findIndex(x => x.folderId == this.folderDetails._id)
          this.totalFolder.splice(index1, 1)

          // this.totalFolder = []
          // this.folderList(this.projectId)
        }, err => {
          
        })
      }
    })
  }


  uploadNewFile() {
    this.getAllMembersOfProject(this.projectId)
  }

  getAllMembersOfProject(projectId) {
    this._projectService.getAllMembers(projectId).subscribe((res: any) => {
      this.allMembers = res.data[0].finalTeam
      
      this.allMembers = this.allMembers.filter(deve => deve._id !== this.currentUser._id)

      let obj = {
        projectId: this.projectId,
        teamMembers: this.allMembers,
        folderId: this.singleFolderId
      }
      let data = obj
      var timelog = this.openDialog(UploadFileComponent, data).subscribe((response) => {
        
        if (response != undefined) {
          this.listOfImages.push(response.files)
        }
      })
    }, error => {
      
    })
  }


  deleteImage(imageDetails) {
    
    const listId = {
      folderId: imageDetails.folderId,
      projectId: imageDetails.projectId,
      imageId: imageDetails._id
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-default',
        cancelButton: 'btn btn-delete'
      },
      buttonsStyling: false,
    })
    swalWithBootstrapButtons.fire({
      html: "<span style=" + 'font-size:25px' + ">  Are you sure you want to remove <strong style=" + 'font-weight:bold' + ">",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      showCloseButton: true,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        
        this.fileUpload.deleteImage(listId).subscribe((res: any) => {
          let index = this.listOfImages.findIndex(x => x._id == imageDetails._id)
          
          this.listOfImages.splice(index, 1);
          


          // this.generalImageList(listId)
          // 
        }, err => {
          
        })
      }
    })
  }


  addFolderNew(title?) {

    let obj = {
      title: 'Add Folder',
      projectId: this.projectId,
      mainFolderId: this.singleFolderId
    }
    let data = obj
    var timelog = this.openDialog(CreateNewFolderComponent, data).subscribe((response) => {
      
      if (response != undefined) {
        this.allFolderList.push(response)
        let folderDetails = {
          path: response.path.split('/')[1],
          name: response.createdBy.name,
          createdAt: response.createdAt,
          folderId: response._id
        }
        this.totalFolder.push(folderDetails)
      }
    })


  }



  openDialog(someComponent, data = {}): Observable<any> {
    
    const dialogRef = this.dialog.open(someComponent, { data });
    return dialogRef.afterClosed();
  }

  saveFile() {
    let data = new FormData()
    if (this.files.length > 0) {
      for (var i = 0; i < this.files.length; i++) {
        data.append('fileUpload', this.files[i]);
      }
    }

    const listId = {
      folderId: this.singleFolderId,
      projectId: this.projectId,
      notify: JSON.stringify(this.allNotifyUser)
    }
    this.fileUpload.saveFile(data, listId).subscribe((res: any) => {
      
      $('#itemManipulationModel1').modal('hide');
      this.singleFolderDetails()
    }, err => {
      
    })
  }

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

  /**
   * @param id {ImageId}
   * Navigate to single image details page
   */
  imageDetails(id) {
    this.router.navigate(['./singleImage/', id]);

    // this.router.navigate(['./singleImage/', id, this.folderId, this.projectId]);
  }



  selectedUsers(isChecked, userId) {
    let notifyUser = {
      _id: userId
    }
    if (isChecked == true && userId) {
      this.allNotifyUser.push(notifyUser)
    } else if (isChecked == false && userId) {
      this.allNotifyUser.splice(this.allNotifyUser.indexOf(userId), 1)
    }
    
  }


  newEditFolder(event) {
    

    // 
    let list = event.details
    let index = event.index
    let folderId = this.allFolderList[index]
    
    let obj = {
      folderName: list.path,
      description: folderId.description,
      projectId: this.projectId,
      folderId: folderId._id,
      title: 'Edit Folder',
      edit: true
    }

    let data = obj
    var timelog = this.openDialog(CreateNewFolderComponent, data).subscribe((response) => {
      if (response != undefined) {
        
        let index = this.allFolderList.findIndex(x => x._id == response._id);
        this.allFolderList[index] = response

        let index1 = this.totalFolder.findIndex(x => x.folderId == response._id)
        
        let obj = {
          path: response.path.split('/')[1],
          name: response.createdBy.name,
          createdAt: response.createdAt,
          folderId: response._id
        }
        this.totalFolder[index1] = obj
        


      }
    })

  }



}
