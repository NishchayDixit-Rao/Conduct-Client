import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AddNoticeComponent } from '../add-notice/add-notice.component';
import { MatDialog } from '@angular/material';
import { config } from '../config';
declare var $: any;
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-noticeboard',
  templateUrl: './noticeboard.component.html',
  styleUrls: ['./noticeboard.component.css']
})
export class NoticeboardComponent implements OnInit {

  constructor(
    public router: Router,
    public _projectservice: ProjectService,
    // private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
  ) { }
  allNotice: any = [];
  singlenotice: any;
  noticeImg: any;
  editNoticeForm;
  swal: any;
  expireon;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  // files: any;
  url = [];
  commentUrl = [];
  path = config.baseMediaUrl;
  noticeid;
  files: Array<File> = [];
  i = 0;
  newNotice = { title: '', description: '', isPublished: '', noticeDate: '', images: [] };
  submitted = false;
  isDisable: boolean = false;
  loader = false
  @Output() noticeUpdate = new EventEmitter();

  ngAfterContentChecked() {
    // this.cdr.detectChanges();
  }
  ngOnInit() {
    this.getAllNotice();
    this.createEditNoticeForm();
    // $(document).ready(function () {
    //   setTimeout(function () {
    //     $('.grid').masonry({
    //       itemSelector: '.grid-item'
    //     });
    //   }, 2000);
    // });
    // $('.datepicker').pickadate({
    //   min: new Date(),
    // })


    setInterval(() => {

      // this.cdr.detectChanges();
    }, 1000);
  }

  getAllNotice() {
    this.loader = true
    this._projectservice.getNotice().subscribe((res: any) => {
      this.loader = false
      
      this.allNotice = res.data;
      
      this.path = config.baseMediaUrl;
      
    }, err => {
      
      this.loader = false
    })
  }

  deleteNotice(id) {
    
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-default',
        cancelButton: 'btn btn-delete'
      },
      buttonsStyling: false,
    })
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      reverseButtons: true
    }).then((result) => {

      if (result.value) {

        this._projectservice.deleteNotice(id).subscribe((res: any) => {
          Swal.fire(
            'Deleted!',
            'Notice has been deleted.',
            'success'
          )
          // this.getAllNotice();
          let index = this.allNotice.findIndex(x => x._id == id);
          this.allNotice.splice(index, 1);
          
        }, err => {
          
          Swal.fire('Oops...', 'Something went wrong!', 'error')
        })

      }
    })
  }

  createEditNoticeForm() {
    this.editNoticeForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(300)]),
      isPublished: new FormControl(''),
      noticeDate: new FormControl('', [Validators.required]),
      images: new FormControl(''),
    })
  }
  get f() { return this.editNoticeForm.controls; }

  updateNotice(editNoticeForm, noticeId) {
    this.submitted = true;
    if (this.editNoticeForm.invalid) {
      return;
    }
    editNoticeForm.noticeDate = $('#expireon').val();
    this.isDisable = true;
    
    
    
    
    let data = new FormData();
    data.append('title', editNoticeForm.title);
    data.append('description', editNoticeForm.description);
    data.append('noticeDate', editNoticeForm.noticeDate);
    data.append('isPublished', editNoticeForm.isPublished);
    data.append('images', editNoticeForm.images);
    if (this.files && this.files.length > 0) {
      for (var i = 0; i < this.files.length; i++) {
        data.append('images', this.files[i]);
      }
    }
    
    this._projectservice.updateNoticeWithFile(data, noticeId).subscribe((res: any) => {
      $('#editmodel').modal('hide');
      this.noticeUpdate.emit('noticeUpdate');
      this.getAllNotice();
      Swal.fire({ type: 'success', title: 'Notice Updated Successfully', showConfirmButton: false, timer: 2000 });
      this.files = [];
      this.url = [];
      
      this.isDisable = false;
    }, err => {
      
      Swal.fire('Oops...', 'Something went wrong!', 'error');
      this.isDisable = false;
    })
  }

  uploadFile(e, noticeid) {
    _.forEach(e.target.files, (file: any) => {
      // 
      if (file.type == "image/png" || file.type == "image/jpeg" || file.type == "image/jpg") {
        this.files.push(file);
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e: any) => {
          this.url.push(e.target.result);
        }
        this._projectservice.changeNoticePicture(this.files, noticeid).subscribe((res: any) => {
          
          Swal.fire({ type: 'success', title: 'Notice Updated Successfully', showConfirmButton: false, timer: 2000 })
          this.getAllNotice();
        }, error => {
          
          Swal.fire('Oops...', 'Something went wrong!', 'error')
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: "You can upload images only",
          type: 'warning',
        })
      }
    })
  }

  noticeById(noticeid) {

    

    let notice = this.allNotice.filter(x => x._id == noticeid)
    
    this.singlenotice = notice[0]
    this.noticeImg = this.singlenotice.images
    this.path = config.baseMediaUrl;
    // this._projectservice.getNoticeById(noticeid).subscribe((res: any) => {
    //   
    //   this.singlenotice = res.data;
    //   
    //   
    //   this.noticeImg = this.singlenotice.images
    //   
    //   
    // }, err => {
    //   
    // })
  }

  changeFile(event) {
    
    this.files = event;
  }

  deleteNoticeImage(index) {
    this.newNotice.images.splice(index, 1);
  }

  addNotice() {
    // let data = obj
    let data
    var taskDetails = this.openDialog(AddNoticeComponent, data).subscribe((response) => {
      
      // 
      if (response != undefined) {
        // this.allNotice.push(response)
        this.allNotice = [...this.allNotice, response]
        
        // this._change.detectChanges()

        // this.singleTask = response.task
        // this.taskList.push(...this.taskList, response.task)
      }
    })
  }

  editNotice(notice) {
    

    let obj = {
      editNotice: notice
    }
    let data = obj
    var taskDetails = this.openDialog(AddNoticeComponent, data).subscribe((response) => {
      
      
      if (response != undefined) {
        let index = this.allNotice.findIndex(x => x._id === response._id);
        
        this.allNotice[index] = response

        



        // this.singleTask = response.task
        // this.taskList.push(...this.taskList, response.task)
      }
    })
  }



  openDialog(someComponent, data = {}): Observable<any> {
    
    const dialogRef = this.dialog.open(someComponent, { data });
    return dialogRef.afterClosed();
  }


  slideToggle(event, notice) {
    
    

    let obj = {
      isPublished: event.checked,
      noticeId: notice._id
    }
    this._projectservice.updateStatusOfNotice(obj).subscribe((response: any) => {
      
      let name
      if (response.data.isPublished == true) {
        name = response.data.title + " is published"
      } else {
        name = response.data.title + " is unPublished"
      }
      $('#basicExampleModal').modal('hide');
      // let name = response
      Swal.fire({
        type: 'success',
        title: name,
        // text: name,
        showConfirmButton: false,
        timer: 2000,
      });
      let index = this.allNotice.findIndex(x => x._id === response.data._id);
      this.allNotice[index] = response.data
      

    }, error => {
      

    })


  }

}

