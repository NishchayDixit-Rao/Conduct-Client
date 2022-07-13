import { Component, OnInit, Inject, Output, EventEmitter, Injector, HostListener, Input, ViewChild, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewFileUploadService, FileQueueObject } from '../../services/new-file-upload.service';
// import { MatSnackBar } from '@angular/material';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { Observable } from 'rxjs';
@Component({
  selector: 'app-new-file-upload',
  templateUrl: './new-file-upload.component.html',
  styleUrls: ['./new-file-upload.component.css']
})
export class NewFileUploadComponent implements OnInit {


  @Output() onCompleteItem = new EventEmitter();
  @Output() evidences: EventEmitter<any> = new EventEmitter<any>();
  @Output() fileInQueue: EventEmitter<any> = new EventEmitter<any>();
  @Output() uploadedArray: EventEmitter<any> = new EventEmitter<any>();
  @Input('showFields') showFields;
  @Input('singleFileModule') singleFile

  @ViewChild('fileInput') fileInput;
  // @ViewChild('appDragDrop') dragInput
  queue: Observable<FileQueueObject[]>;
  uploadedFiles = [];
  uploadedFilesCount = 0
  queueCount = 0
  uploadStatus = true
  filesArray: any = [];
  uploadedCount: number = 0;
  displaySingle
  dialogRef: MatDialogRef<any>;
  data: any;
  displayFileModule = false
  displayIndex = 0
  dragAreaClass: string = 'hidden';
  dragAreaContent: string = 'Files drop zone';
  constructor(
    public uploader: NewFileUploadService,
    public _snackbar: MatSnackBarModule,
    public dialog: MatDialog,
    private injector: Injector,
    // public dialogRef: MatDialogRef<any>,
    // @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // this.dialogRef.disableClose = true;

    this.data = this.injector.get(MAT_DIALOG_DATA)
    this.dialogRef = this.injector.get(MatDialogRef)
    this.dialogRef.disableClose = true
  }

  ngOnInit() {
    
    // 
    if (this.data && !this.data.projectId) {
      if (this.showFields) {
        this.data['isEvidence'] = true
      }
      // if(this.data && this.data.session){
      //   this.showUploads = false;
      //   // this.createSessionForm()
      // }
      if (this.data && this.data.singleFile) {
        
        this.displayIndex = 1
        // this.displaySingle = true
        // this.displayFileModule = false
      } else if (this.data && this.data.fileModule) {
        this.displayIndex = 3
      } else {
        
        this.displayIndex = 0
        // this.displaySingle = false
        // this.displayFileModule = false
      }


      

      this.queue = this.uploader.queue;
      this.queueCount = 0;
      // this.queueCount = this.queue.source['_value'].length || 0
      this.uploader.bodyData = this.data;
      this.uploader.onCompleteItem = this.completeItem;
      this.uploader.clearQueue()
    }
  }
  @HostListener('dragover', ['$event']) onDragOver(event) {
    this.dragAreaClass = "dragarea droparea";
    this.dragAreaContent = "Drop your file here.";
    event.preventDefault();
  }

  @HostListener('dragenter', ['$event']) onDragEnter(event) {
    this.dragAreaClass = "dragarea droparea";
    this.dragAreaContent = "Drop your file here.";
    event.preventDefault();
  }

  @HostListener('dragend', ['$event']) onDragEnd(event) {
    this.dragAreaClass = "hidden";
    this.dragAreaContent = "Files drop zone"
    event.preventDefault();
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event) {
    this.dragAreaClass = "hidden";
    this.dragAreaContent = "Files drop zone"
    event.preventDefault();
  }

  @HostListener('drop', ['$event']) onDrop(event) {
    this.dragAreaClass = "dragarea";
    this.dragAreaContent = "Files drop zone"
    event.preventDefault();
    event.stopPropagation();
    var fileList = [];
    for (var i = 0; i < event.dataTransfer.files.length; i++) {
      fileList[i] = event.dataTransfer.files[i];
    }
    
    this.dragQueue(fileList)
    // this.doProcess(fileList);
  }

  ngOnChanges(changes: SimpleChanges) {
    

    if (changes.singleFile && changes.singleFile.currentValue) {
      // this.displayFileModule = true
      // this.displaySingle = false
      this.displayIndex = 2
      
      this.queue = this.uploader.queue;
      this.queueCount = 0;
      // this.queueCount = this.queue.source['_value'].length || 0
      this.uploader.bodyData = this.data;
      this.uploader.onCompleteItem = this.completeItem;
      this.uploader.clearQueue()
    } else {
      // this.displayFileModule = false
    }
  }

  completeItem = (item: FileQueueObject, response: any, status) => {
    

    if (response.body) {
      this.data = response.body.data;
      if (this.uploader.bodyData.competenciesId) {
        this.uploadedFiles.push(response.body)
      }
      else {
        if (this.uploadStatus) {
          this.uploadStatus = false
        } else {
          this.uploadedFilesCount++
        }
        
        this.uploadedFiles.push(response.body.data.file[0])
        
        this.queueCount = this.queue.source['_value'].length || 0
        
        
      }
    }
    else {
      this.uploadedCount += 1
      
      this.filesArray.push(response)
      if (this.uploadedCount == this.queueCount) {
        
        if (this.data.isEvidence && !this.data.isErPhnCall) {
          
          this.evidences.emit({ files: this.filesArray })
        }
        else {
          
          if (this.displayIndex == 0 || this.displayIndex == 1 || this.displayIndex == 3) {
            
            this.dialogRef.close(this.filesArray)
          } else {
            this.uploadedArray.emit(this.filesArray)
          }
        }
      }
      else {
        // 
        // if (this.displayIndex == 0 || this.displayIndex == 1 || this.displayIndex == 3) {
        //   this.dialogRef.close(this.filesArray)
        // } else {
        //   this.uploadedArray.emit(this.filesArray)
        // }
      }
    }
  }

  addToQueue() {
    
    if (this.displayIndex == 1 || this.displayIndex == 3) {
      

      if (this.queue.source['_value'].length) {
        this.uploader.clearQueue()

        this.uploadSingleFile()
      } else {
        this.uploadSingleFile()
      }
    } else if (this.displayIndex == 2) {
      

      if (this.queue.source['_value'].length) {
        this.uploader.clearQueue()
        this.uploadSingleFile()
      } else {
        this.uploadSingleFile()
      }
    }
    else {
      

      this.uploadSingleFile()
    }
  }
  uploadSingleFile() {
    if (this.displayIndex == 0 || this.displayIndex == 1) {
      this.uploader.setData(this.data.path)
    } else {
      let path = "Files"
      this.uploader.setData(path)
    }
    const fileBrowser = this.fileInput.nativeElement;
    this.uploader.addToQueue(fileBrowser.files);
    
    this.queueCount = this.queue.source['_value'].length
    

    this.fileInQueue.emit({ queCount: this.queueCount })
  }

  dragQueue(event) {
    

    this.uploader.addToQueue(event);
    
    this.queueCount = this.queue.source['_value'].length
    

    this.fileInQueue.emit({ queCount: this.queueCount })
  }
  upload() {
    let close

    if (this.uploadStatus && this.uploadedFilesCount == 0) {
      this.uploadedFilesCount++

      let temp = this.uploader.uploadAll()
      
      
      



    }

  }
  close() {
    this.dialogRef.close(this.uploadedFiles)
  }
}





