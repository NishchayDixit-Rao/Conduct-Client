import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
declare var $: any;
import { FileUploadService } from '../../services/file-upload.service';
import { ProjectService } from '../../services/project.service';
import { Observable } from 'rxjs';
import { of, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { config } from '../../config';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material';
import { CreateNewFolderComponent } from '../create-new-folder/create-new-folder.component';
import { UploadFileComponent } from '../upload-file/upload-file.component';


@Component({
  selector: 'app-project-files',
  templateUrl: './project-files.component.html',
  styleUrls: ['./project-files.component.css']
})
export class ProjectFilesComponent implements OnInit {
  @Output() fileProjectId: EventEmitter<any> = new EventEmitter();
  @Output() removeFile = new EventEmitter();
  state$: Observable<object>;
  createFolderForm;
  allNotifyUser: any = []
  allMembers: any = []
  allProjectManagers: any = []
  projectId;
  folderId
  isDisable: boolean = false;
  loader: boolean = false;
  submitted = false;
  totalFolder = []
  allFolderList: any = []
  files: Array<File> = [];
  url = [];
  listOfImages: any = []
  path = config.baseMediaUrl
  singleFolderDetails
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  modalTitle
  fileName
  singleFolderId
  navArray: any = []
  projectAlias
  sideMenuButton
  constructor(
    public fileUpload: FileUploadService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _projectService: ProjectService,
    public dialog: MatDialog,
  ) {
    this.activatedRoute.params.subscribe(param => {
      
      if (param.projectId) {
        this.projectId = param.projectId
        this.folderList(this.projectId)
        this.sideMenuButton = true
      }
      if (param.folderId) {
        this.singleFolderId = param.folderId
        this.folderData()
        this.sideMenuButton = true
      }
    })
    this.createFolder();
  }
  createFolder() {
    this.createFolderForm = new FormGroup({
      folderName: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      projectId: new FormControl(''),
    })
  }
  ngOnInit() {

    localStorage.removeItem('tempProject')
    this.state$ = this.activatedRoute.paramMap
      .pipe(map(() => window.history.state))
    let array = window.history.state
    // this.folderId = window.history.state.join()
    
    
  }
  get f() { return this.createFolderForm.controls; }


  addFolderNew(title) {
    
    let obj
    if (this.singleFolderId != undefined) {
      obj = {
        title: 'Add Folder',
        projectId: this.projectId,
        mainFolderId: this.singleFolderId
      }
    } else {
      obj = {
        title: 'Add Folder',
        projectId: this.projectId
      }
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


  folderDetails(event) {
    
    this.singleFolderId = event
    this.router.navigate(['./documents-folder/', this.singleFolderId])
    // this.folderData()
  }


  folderData() {
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
      this.projectAlias = arrayDisplay.projectId.taskAlias
      localStorage.setItem('tempProject', arrayDisplay.projectId._id)
      this.projectId = arrayDisplay.projectId._id
      // 
      this.fileName = arrayDisplay.path.split('/')[1]

      let newData = {
        folderId: arrayDisplay._id,
        title: this.fileName
      }
      // var temp = _.findIndex(this.selectedFoldersArray, function (o) {
      //   
      //   return o == event.data._id
      // })
      var index = _.findIndex(this.navArray, function (o: any) {
        return o.folderId == newData.folderId
      })
      if (index > -1) {
        let x = this.navArray.splice(index + 1, this.navArray.length - 1)
      } else {
        this.navArray.push(newData)
      }

      // this.navArray = this.navArray.preFolders.reverse();
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

      }

      if (arrayDisplay.files && arrayDisplay.files.length) {
        this.listOfImages = arrayDisplay.files
      }
      // 
      // }
    }, err => {
      this.loader = false
      
    })
  }





  uploadNewFile() {
    this.getAllMembersOfProject(this.projectId)
    

  }

  getAllMembersOfProject(projectId) {
    this._projectService.getAllMembers(projectId).subscribe((res: any) => {
      this.allMembers = res.data[0].finalTeam
      
      this.allMembers = this.allMembers.filter(deve => deve._id !== this.currentUser._id)

      let obj

      if (this.singleFolderId != undefined) {
        obj = {
          projectId: this.projectId,
          teamMembers: this.allMembers,
          folderId: this.singleFolderId
        }
      } else {
        obj = {
          projectId: this.projectId,
          teamMembers: this.allMembers,
          folderId: this.folderId
        }
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
  /**
   * @param event (fileSelected)
   * Select file from file component and store in file 
   */
  changeFile(event) {
    
    if (event) {
      this.files = event;
    } else {
      this.url = []
    }
  }


  /**
   * @param projectId 
   * Get all created folderList
   */
  folderList(projectId) {
    this.loader = true
    this.fileUpload.folderList(projectId).subscribe((res: any) => {
      
      let id = res.data[0]._id
      this.projectAlias = res.data[0].taskAlias
      // localStorage.setItem('projectId', id)
      this.folderId = res.data[0].dataSource[0]._id
      
      this.allFolderList = res.data[0].dataSource
      this.allFolderList.splice(0, 1);
      
      _.forEach(this.allFolderList, (single) => {
        
        let folderDetails = {
          path: single.path.split('/')[1],
          name: single.createdBy.name,
          createdAt: single.createdAt,
          folderId: single._id
        }
        this.totalFolder.push(folderDetails)
      })
      
      const listId = {
        folderId: this.folderId,
        projectId: this.projectId
      }
      this.generalImageList(listId)
      this.loader = false
    }, err => {
      this.loader = false
      
    })
  }

  /**
   * @param list
   * All Image list which are not in any folder  
   */
  generalImageList(list) {
    this.loader = true
    
    this.fileUpload.generalList(list).subscribe((res: any) => {
      
      this.listOfImages = res.allImages[0].files
      // let count = this.listOfImages.files.version
      // 
      this.loader = false
    }, err => {
      this.loader = false
      
    })
  }


  /**
   * @param id {ImageId}
   * Navigate to single image details page
   */
  imageDetails(id) {
    this.router.navigate(['./singleImage/', id]);

    // this.router.navigate(['./singleImage/', id, this.folderId, this.projectId]);
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



  deleteFolder(event) {
    
    let index = event
    this.singleFolderDetails = this.allFolderList[index]
    let path = this.singleFolderDetails.path.split('/')[1]
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-default',
        cancelButton: 'btn btn-delete'
      },
      buttonsStyling: false,
    })
    swalWithBootstrapButtons.fire({
      html: "<span style=" + 'font-size:25px' + ">  Are you sure you want to remove <strong style=" + 'font-weight:bold' + ">" + " " + path,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      showCloseButton: true,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        
        const listId = {
          folderId: this.singleFolderDetails._id,
          projectId: this.projectId
        }
        
        this.fileUpload.deleteFolder(listId).subscribe((res: any) => {
          Swal.fire({ type: 'success', title: 'Folder Deleted Successfully', showConfirmButton: false, timer: 2000 })
          

          let index = this.allFolderList.findIndex(x => x._id == this.singleFolderDetails._id);
          this.allFolderList.splice(index, 1);


          let index1 = this.totalFolder.findIndex(x => x.folderId == this.singleFolderDetails._id)
          this.totalFolder.splice(index1, 1)

          // this.totalFolder = []
          // this.folderList(this.projectId)
        }, err => {
          
        })
      }
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

}
