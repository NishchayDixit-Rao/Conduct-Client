import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Subscription } from 'rxjs';
import { S3UploadService } from '../services/s3-upload.service';
// import { s3Config } from '../../dummy'

export enum FileQueueStatus {
  Pending,
  Success,
  Error,
  Progress
}

export class FileQueueObject {
  public file: any;
  public status: FileQueueStatus = FileQueueStatus.Pending;
  public progress: number = 0;
  public request: Subscription = null;
  public response: HttpResponse<any> | HttpErrorResponse = null;

  constructor(file: any) {
    this.file = file;
  }

  // actions
  public upload = () => { /* set in service */ };
  public cancel = () => { /* set in service */ };
  public remove = () => { /* set in service */ };

  // statuses
  public isPending = () => this.status === FileQueueStatus.Pending;
  public isSuccess = () => this.status === FileQueueStatus.Success;
  public isError = () => this.status === FileQueueStatus.Error;
  public inProgress = () => this.status === FileQueueStatus.Progress;
  public isUploadable = () => this.status === FileQueueStatus.Pending || this.status === FileQueueStatus.Error;

}


@Injectable({
  providedIn: 'root'
})
export class NewFileUploadService {
  public bodyData;


  public url: string;
  public myId: string;

  private _queue: BehaviorSubject<FileQueueObject[]>;
  private _files: FileQueueObject[] = [];
  private _data: any;
  sessionType: any;
  learnerId: any;

  constructor(public _s3UplodService: S3UploadService, private http: HttpClient,) {
    this._queue = <BehaviorSubject<FileQueueObject[]>>new BehaviorSubject(this._files);
  }

  // the queue
  public get queue() {
    return this._queue.asObservable();
  }

  // public events
  public onCompleteItem(queueObj: FileQueueObject, response: any, status: any): any {
    return { queueObj, response, status };
  }

  // public functions
  public addToQueue(data: any) {
    // add file to the queue
    _.each(data, (file: any) => this._addToQueue(file));
  }

  public setData(data: any) {
    
    this.bodyData = data;
  }

  public clearQueue() {
    // clear the queue
    this._files = [];
    this._queue.next(this._files);
  }

  public uploadAll() {
    
    // upload all except already successfull or in progress
    _.each(this._files, (queueObj: FileQueueObject) => {
      if (queueObj.isUploadable()) {
        this._upload(queueObj);
      }
    });
  }

  // private functions
  private _addToQueue(file: any) {
    const queueObj = new FileQueueObject(file);

    // set the individual object events
    queueObj.upload = () => this._upload(queueObj);
    queueObj.remove = () => this._removeFromQueue(queueObj);
    queueObj.cancel = () => this._cancel(queueObj);

    // push to the queue
    this._files.push(queueObj);
    this._queue.next(this._files);
  }

  private _removeFromQueue(queueObj: FileQueueObject) {
    
    _.remove(this._files, queueObj);
    this._queue.next(this._files);
  }

  private _upload(queueObj: FileQueueObject) {

    

    const formData = new FormData();


    // If Folder File
    // if (this.bodyData.folderId) {
    //   // formData.set('folderId', this.bodyData.folderId);
    //   // this.url = config.baseApiUrl + "folder/files"
    //   this.myId = this.bodyData.folderId;
    // } else if (this.bodyData.allotmentId) {
    //   // formData.set('allotmentId', this.bodyData.allotmentId);
    //   // formData.set('status', this.bodyData.status);
    //   // this.url = config.baseApiUrl + "learners/submission"
    //   this.myId = this.bodyData.allotmentId;
    // } else if (this.bodyData.tempKey && !this.bodyData.sessionType) {
    //   // formData.set('materialId', this.bodyData.materialId);
    //   // this.url = config.baseApiUrl + "materials/files"
    //   this.myId = this.bodyData.tempKey;
    // } ///file
    // else if (this.bodyData.competenciesId) {
    //   // this.url = config.baseApiUrl + "competencies/file"
    //   this.myId = this.bodyData.competenciesId;
    // } else if (this.bodyData.tempKey && !this.bodyData.learnerId) {
    //   // this.url = config.baseApiUrl + "session/files"
    //   this.myId = this.bodyData.tempKey;
    //   this.sessionType = this.bodyData.sessionType
    // } else if (this.bodyData.tempKey && this.bodyData.learnerId) {
    //   // learner - portfolio
    //   // this.url = config.baseApiUrl + "learner-portfolio/submission"
    //   this.myId = this.bodyData.tempKey;
    //   this.sessionType = this.bodyData.sessionType
    //   this.learnerId = this.bodyData.learnerId
    // }


    // create form data for file


    formData.append('file', queueObj.file, queueObj.file.name);

    
    
    this._s3UplodService.uploadFile(queueObj.file, queueObj.file.name, this.bodyData).subscribe((event) => {
      
      

      if (event.type === 'progress') {
        this._uploadProgress(queueObj, event);
      }

      if (event.part) {
        this._partProgress(queueObj, event);
      }

      if (event.Location) {
        if (!this.bodyData.isEvidence && !this.bodyData.isQuestionImg && !this.bodyData.isAppearQuiz) {
          

          event.myId = this.myId;
          // delete event.myId
          // if (this.sessionType) {
          //   
          //   event.sessionType = this.sessionType
          // }
          // if (this.learnerId) {
          //   
          //   event['learnerId'] = this.learnerId
          // }
          event.size = queueObj.file.size;
          
          if (this.bodyData.status) { event.status = this.bodyData.status }
          const req = new HttpRequest('POST', this.url, event, {
            reportProgress: true,
          });
          

          // Node Server File Upload progress
          // queueObj.request = this.http.request(req).subscribe(
          //   (event: any) => {
          //     
          //     if (event instanceof HttpResponse) {
          this._uploadComplete(queueObj, event);
          //     }
          //     // else{
          //     //   
          //     // }
          //   }, (err) => {
          //     
          //   })
        }
        else {
          
          this._uploadComplete(queueObj, event);
        }
      }




    }, err => {
      if (err.error instanceof Error) {
        // A client-side or network error occurred. Handle it accordingly.
        this._uploadFailed(queueObj, err);
      } else {
        // The backend returned an unsuccessful response code.
        this._uploadFailed(queueObj, err);
      }
    })

    // upload file and report progress

  }

  private _cancel(queueObj: FileQueueObject) {
    
    // update the FileQueueObject as cancelled
    queueObj.request.unsubscribe();
    queueObj.progress = 0;
    queueObj.status = FileQueueStatus.Pending;
    this._queue.next(this._files);
  }

  private _uploadProgress(queueObj: FileQueueObject, event: any) {
    // update the FileQueueObject with the current progress
    
    const progress = Math.round(100 * event.loaded / event.total);
    queueObj.progress = progress;
    queueObj.status = FileQueueStatus.Progress;
    this._queue.next(this._files);
  }

  private _uploadComplete(queueObj: FileQueueObject, response: HttpResponse<any>) {
    // update the FileQueueObject as completed
    queueObj.progress = 100;
    queueObj.status = FileQueueStatus.Success;
    queueObj.response = response;
    this._queue.next(this._files);
    
    if (this._queue.next(this._files) == undefined) this.onCompleteItem(queueObj, response, 'finished')
    else this.onCompleteItem(queueObj, response, 'inprogress')
  }

  private _uploadFailed(queueObj: FileQueueObject, response: HttpErrorResponse) {
    // update the FileQueueObject as errored
    queueObj.progress = 0;
    queueObj.status = FileQueueStatus.Error;
    queueObj.response = response;
    this._queue.next(this._files);
  }

  private _partProgress(queueObj: FileQueueObject, event: any) {
    // update the FileQueueObject with the current progress
    
    const progress = 68;
    queueObj.progress = progress;
    queueObj.status = FileQueueStatus.Progress;
    this._queue.next(this._files);
  }
}
