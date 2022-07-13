import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../config';
import * as _ from 'lodash';


@Injectable({
	providedIn: 'root'
})
export class CommentService {

	constructor(private http: HttpClient) { }

	getAllComments(taskId) {
		return this.http.get(config.baseApiUrl + "comment/task/" + taskId);
	}
	getAllCommentsOfDiscussion(discussionId) {
		return this.http.get(config.baseApiUrl + "comment/discussion/" + discussionId)
	}

	getImageComment(listId) {
		return this.http.get(config.baseApiUrl + "comment/singleImage", { params: listId })
	}

	getsingleComment(commentId) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'x-access-token': JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.get(config.baseApiUrl + "comment/single-comment/" + commentId);
	}

	addComment(data) {
		
		return this.http.post(config.baseApiUrl + "comment/", data);
	}

	updateComment(data) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'x-access-token': JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.put(config.baseApiUrl + "comment/edit-comment/", data);
	}

	deleteComment(commentId) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'x-access-token': JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.delete(config.baseApiUrl + "comment/edit-comment/" + commentId);
	}
}
