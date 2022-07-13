import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { ProjectService } from '../../services/project.service';
import { MatDialog } from '@angular/material';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { AddNewDiscussionComponent } from '../add-new-discussion/add-new-discussion.component';
import Swal from 'sweetalert2';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.css']
})
export class DiscussionComponent implements OnInit {

  // @Output() courseIndex;


  createDiscussionForm;
  allMembers: any = []
  allProjectManagers: any = []
  projectId
  loader: boolean = false
  isDisable: boolean = false;
  submitted = false
  files: Array<File> = [];
  url = [];
  discussionList
  allNotifyUser: any = []
  currentUser = JSON.parse(localStorage.getItem('currentUser'));

  sort: MatSort
  dataSource: MatTableDataSource<any>;
  paginator: MatPaginator;
  pageSizeOptions: number[] = [10, 25, 100];

  displayedColumns: string[] = ['title', 'comment'];
  sideMenuButton = true
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public _projectService: ProjectService,
    public dialog: MatDialog,
  ) {
    this.route.params.subscribe(param => {
      
      this.projectId = param.projectId
      
    })
    this.getAllDiscussion(this.projectId)
    this.createNewDiscussion()
    this.dataSource = new MatTableDataSource(this.discussionList);

  }

  createNewDiscussion() {
    this.createDiscussionForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required]),
      projectId: new FormControl(this.projectId),
      notify: this.fb.array([]),
    })
  }



  ngOnInit() {

    localStorage.removeItem('tempProject')
    // $(document).ready(function () {
    //   $('.mdb-select').materialSelect();
    // });
    // 
  }



  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    // this.dataSource = new MatTableDataSource(this.totalLogs);
    this.dataSource.sort = this.sort;

  }

  public Editor = DecoupledEditor;
  public configuration = { placeholder: 'Enter Comment Text...' };
  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }
  public onChange({ editor }: ChangeEvent) {
    const data = editor.getData();
    // this.comment = data;
  }
  get f() { return this.createDiscussionForm.controls; }


  /**
   * Create new discussion modal open
   */
  addDiscussion() {
    // $('#itemManipulationModel').modal('show');
    // this.allNotifyUser = []
    let totaluser = this.getAllMembersOfProject(this.projectId)
    

    // 
    // let obj = {
    //   task: taskId,
    //   projectId: this.projectId,
    //   team: this.teamMembers
    // }




  }



  openDialog(someComponent, data = {}): Observable<any> {
    
    const dialogRef = this.dialog.open(someComponent, { data });
    return dialogRef.afterClosed();
  }


  getAllMembersOfProject(projectId) {
    this._projectService.getAllMembers(projectId).subscribe((res: any) => {
      this.allMembers = res.data[0].finalTeam
      
      this.allMembers = this.allMembers.filter(deve => deve._id !== this.currentUser._id)
      let obj = {
        allMember: this.allMembers,
        projectId: this.projectId
      }


      let data = obj
      var taskDetails = this.openDialog(AddNewDiscussionComponent, data).subscribe((response) => {
        
        if (response != undefined) {
          this.discussionList.push(response)
          this.updateData(this.discussionList)
        }
      })

    }, error => {
      
    })
  }

  reditection(row) {
    
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

  // selectedPmUsers(isChecked, userId) {
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
    }
  }

  // /**
  //  * @param discussion {Discussion details}
  //  * Create new Discussion
  //  */
  // saveTheData(discussion) {
  //   this.loader = true
  //   
  //   this.submitted = true;
  //   if (this.createDiscussionForm.invalid) {
  //     return;
  //   }
  //   // this.allNotifyUser = <FormArray>this.createDiscussionForm.controls.notify
  //   let data = new FormData();
  //   data.append('title', discussion.title)
  //   data.append('content', discussion.content)
  //   data.append('projectId', this.projectId)
  //   data.append('notify', JSON.stringify(this.allNotifyUser))
  //   if (this.files.length > 0) {
  //     for (var i = 0; i < this.files.length; i++) {
  //       data.append('fileUpload', this.files[i]);
  //     }
  //   }
  //   
  //   this._projectService.addDiscussion(data).subscribe((res: any) => {
  //     
  //     $('#itemManipulationModel').modal('hide');
  //     this.getAllDiscussion(this.projectId)
  //     this.createDiscussionForm.reset()
  //     this.loader = false
  //   }, err => {
  //     this.loader = false
  //     
  //   })
  // }

  /**
   * @param projectId {ProjectId}
   * Get all list of discussion
   */
  getAllDiscussion(projectId) {
    this.loader = true
    this._projectService.getAllDiscussion(projectId).subscribe((res: any) => {
      
      this.discussionList = res.data
      this.updateData(this.discussionList)
      this.loader = false
    }, err => {
      this.loader = false
      
    })
  }


  updateData(clients) {
    
    this.dataSource = new MatTableDataSource(clients);
    this.dataSource.paginator = this.paginator;
    
    this.dataSource.sortingDataAccessor = (item, property) => {
      // 

      // 
      switch (property) {
        case 'date': return item.timeDate;
        // case 'users': return item.userId.name;
        // case 'taskTitle': return item.taskId.title;
        // case 'estimated': return item.taskId.estimatedTime;
        // case 'difference': return item.difference;
        // case 'from': return item.fromTime;
        // case 'end': return item.endTime;
        // case 'location.title': return item.location.title;
        // case 'course.title': return item.course.title;
        default: return item[property];
      }
    };
    this.dataSource.sort = this.sort;
    // 

  }


  /**
   * @param id {DiscussionId}
   * get details of discussion
   */
  detailsOfDisussion(id) {
    
    this.router.navigate(['./discussion/', id]);
  }
}
