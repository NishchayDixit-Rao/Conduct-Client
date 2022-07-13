import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { config } from '../config';
import { of, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  projectId: EventEmitter<any> = new EventEmitter();
  imageDetails: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient, public router: Router) { }

  projectIdForFolder(projectId) {
    
    this.projectId.emit(projectId)
  }
  createNewFolder(data) {
    
    return this.http.post(config.baseApiUrl + "project/CreateFolder", data)
  }

  updateFolder(data) {
    return this.http.put(config.baseApiUrl + "project/updateFolder", data)
  }


  saveFile(data, list) {
    
    return this.http.post(config.baseApiUrl + "project/uploadInFolder", data, { params: list })
  }

  folderList(projectId) {
    return this.http.get(config.baseApiUrl + "project/folderList/" + projectId)
    // .pipe(map((project: any) => {
    //   
    //   this.projectId.emit(project.data[0]._id)
    // }));
  }
  singleFolderDetails(folderId) {
    
    return this.http.get(config.baseApiUrl + "project/singleFolderDetails/" + folderId)
  }
  generalList(list) {
    
    return this.http.get(config.baseApiUrl + "project/generalListOfImages", { params: list })
  }

  singleImageDetails(imageId) {
    const id = {
      image: imageId,
      // project: projectId,
      // folderId: folderId
    }
    return this.http.get(config.baseApiUrl + "project/singleImageDetails", { params: id })
  }

  addVersion(data, list) {
    return this.http.post(config.baseApiUrl + "project/AddVersion", data, { params: list })
  }
  allVersionImages(list) {
    return this.http.get(config.baseApiUrl + "project/AllVersionImages", { params: list })
  }
  deleteFolder(list) {
    return this.http.delete(config.baseApiUrl + "project/deleteFolder", { params: list })
  }
  deleteImage(list) {
    return this.http.delete(config.baseApiUrl + "project/deleteImage", { params: list })
  }
  updateNotifyList(obj) {
    return this.http.put(config.baseApiUrl + "project/updateNotifyList", obj)
  }


}
