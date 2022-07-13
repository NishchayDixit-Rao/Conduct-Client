import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../config';
import * as _ from 'lodash';
import { Observable, throwError } from 'rxjs';


@Injectable({
	providedIn: 'root'
})
export class LeaveService {

	monthLeaveReport;
	yearLeaveReport;
	todayNotPresent;
	totalApprovedLeaves;
	totalPendingLeaves;
	allUsersList;
	singleUserLeave;
	userMonthReport;
	userYearReport;
	constructor(private http: HttpClient) { }


	addLeave(form, files: any) {
		
		
		let formData = new FormData();
		formData.append('id', form.id)
		formData.append('name', form.name);
		formData.append('email', form.email);
		formData.append('endingDate', form.endingDate);

		formData.append('leaveDuration', form.leaveDuration);

		formData.append('noOfDays', form.noOfDays);

		formData.append('reasonForLeave', form.reasonForLeave);

		formData.append('singleDate', form.singleDate);

		formData.append('startingDate', form.startingDate);

		formData.append('typeOfLeave', form.typeOfLeave);
		for (var i = 0; i < files.length; i++) {
			formData.append('attechment', files[i]);
		}
		return this.http.post(config.baseApiUrl + "leave/add-leave", formData);
	}


	pendingLeaves() {
		// 
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'x-access-token': JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.get(config.baseApiUrl + "leave/get-pendingLeave");
	}

	leavesById(email) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'x-access-token': JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.post(config.baseApiUrl + "leave/leavesByEmail", email);
	}

	leaveByUserId(useremail) {
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'x-access-token': JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.get(config.baseApiUrl + "leave/leavesByUserId/" + useremail);

	}
	leaveApproval(req, body) {
		var body = body;
		var id = req;
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'x-access-token': JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.put(config.baseApiUrl + "leave/update-status-by-id/" + id, body);
	}


	approvedLeaves() {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'x-access-token': JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.get(config.baseApiUrl + "leave/approvedLeaves");

	}
	rejectedLeaves() {
		const httoOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'x-access-token': JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.get(config.baseApiUrl + "leave/rejectedLeaves");
	}



	getAllDevelopers() {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'x-access-token': JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.get(config.baseApiUrl + "user/get-all-developers");
	}

	addComments(data) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'x-access-token': JSON.parse(localStorage.getItem('token'))
			})

		}
		return this.http.put(config.baseApiUrl + "leave/addComments", data);

	}

	getbyId(leaveid) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'x-access-token': JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.get(config.baseApiUrl + "leave/leaveid" + leaveid);
	}

	getAllLeaves() {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'x-access-token': JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.get(config.baseApiUrl + "leave/list-of-all-leaves-app");
	}




	// Attendence service


	checkIn(Data) {
		var obj = { userId: Data };
		
		const httpOptions = {
			headers: new HttpHeaders({
				'content-Type': 'application/json',
				'x-access-token': JSON.parse(localStorage.getItem('token'))
			})
		};

		return this.http.post(config.baseApiUrl + "attendence/emp-attendence", obj);
	}
	checkOut(Data) {
		var obj = { userId: Data };
		
		const httpOption = {
			headers: new HttpHeaders({
				'content-type': 'application/json',
				'x-access-token': JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.post(config.baseApiUrl + "attendence/emp-attendence", obj);
	}

	empAttendence(date) {
		var obj = {
			date: date,
			user_Id: JSON.parse(localStorage.getItem("currentUser"))._id,
		};
		
		return this.http.post(config.baseApiUrl + "attendence/get-attendence-by-get-and-id", obj);
	}
	getUserById(date) {

		var obj = { date: date };
		

		return this.http.post(config.baseApiUrl + "attendence/AllemployeeAttendenceByDate", obj);

	}

	getUserByDate(datedata1, datedata2) {
		

		var obj = { fromDate: datedata1, toDate: datedata2 };
		

		return this.http.post(config.baseApiUrl + "attendence/getAttendenceInInterval", obj);

	}


	updateNotificationByStatus(leaveId, leaveStatus) {
		
		
		return this.http.get(config.baseApiUrl + "sendNotification/get-pm-notification/" + leaveId + "/" + leaveStatus);

	}

	getDetails(date) {

		var obj = { date: date };
		

		return this.http.post(config.baseApiUrl + "attendence/getDetailByMail", obj);



	}


	// New LeaveApplication module Api call


	applyLeave(data) {
		return this.http.post(config.baseApiUrl + "leave/add-leave", data);
	}
	getMonthLeaveReport(data) {
		
		return this.http.post(config.baseApiUrl + "leave/get-monthly-report", data)
	}

	getYearLeaveReport(data) {
		return this.http.post(config.baseApiUrl + "leave/get-yearly-report", data)
	}

	getMonthlyLeaveByUser(data) {
		return this.http.post(config.baseApiUrl + "leave/get-leave-by-month", data);

	}
	getYearlyLeaveByUser(data) {
		return this.http.post(config.baseApiUrl + "leave/get-leave-by-year", data)
	}
	todayNotPresentUser() {
		return this.http.get(config.baseApiUrl + "leave/get-today-not-present-users")
	}
	getApprovedLeaves() {
		return this.http.get(config.baseApiUrl + "leave/get-approved-leaves")
	}
	getPendingLeaves() {
		return this.http.get(config.baseApiUrl + "leave/get-pending-leaves");

	}
	getAllUser() {
		return new Observable(observer => {
			this.allUsersList = [
				{
					"_id": "5d6fb94db7e263622aa9b1bd",
					"email":

						"foramtrada232@gmail.com",
					"name": "Foram Trada",
					"phone": 9878456512,
					"designation": "Developer",
					"location": "Rajkot",
					"dateOfJoining": "2019-02-03T18:30:00.000Z",
					"dob": "2019-08-29T18:30:00.000Z",
					"total_leave": -76,
					"profilePhoto": "profilePhoto_1568209606671"
				},
				{
					"_id": "5d70adbf5136db24095f169a",
					"email": "komalsakhiya21@gmail.com",
					"name": "Komal Sakhiya",
					"phone": 9662645121,
					"designation": "Developer",
					"location": "Rajkot",
					"dateOfJoining": "2019-02-03T18:30:00.000Z",
					"dob": "1998-07-20T18:30:00.000Z",
					"total_leave": 25,
					"profilePhoto": "profilePhoto_1568209769081"
				},
				{
					"_id": "5d70ae0d5136db24095f169b",
					"email": "bhavikkalariya103@gmail.com",
					"name": "Bhavik Kalariya",
					"phone": 9409378451,
					"designation": "Developer",
					"location": "Rajkot",
					"dateOfJoining": "2019-01-27T18:30:00.000Z",
					"dob": "1997-10-09T18:30:00.000Z",
					"total_leave": 25,
					"profilePhoto": ""
				},
				{
					"_id": "5d70ae7d5136db24095f169d",
					"email": "happybhalodiya98@gmail.com",
					"name": "Happy Bhalodiya",
					"phone": 9409378451,
					"designation": "Developer",
					"location": "Rajkot",
					"dateOfJoining": "2019-02-03T18:30:00.000Z",
					"dob": "1998-02-10T18:30:00.000Z",
					"total_leave": 25,
					"profilePhoto": ""
				},
				{
					"_id": "5d70af5e5136db24095f169e",
					"email": "akshitakaretiya@gmail.com",
					"name": "Akshita Karetiya",
					"phone": 9409378451,
					"designation": "admin",
					"location": "Rajkot",
					"dateOfJoining": "2019-02-03T18:30:00.000Z",
					"dob": "1996-03-10T18:30:00.000Z",
					"total_leave": 25,
					"profilePhoto": ""
				},
				{
					"_id": "5d8868e7a3b5e717a0f3d527",
					"profilePhoto": "profilePhoto_1571122582336",
					"designation": "Admin",
					"total_leave": 25,
					"name": "ADMIn",
					"email": "admin@gmail.com",
					"dob": "2018-09-19T18:30:00.000Z",
					"location": "Rajkot",
					"dateOfJoining": "2014-08-06T18:30:00.000Z",
					"phone": 7845123265
				},
				{
					"_id": "5d886944a3b5e717a0f3d528",
					"profilePhoto": "",
					"designation": "Developer",
					"total_leave": 25,
					"name": "ADMIn",
					"email": "admin1@gmail.com",
					"dob": "2018-09-19T18:30:00.000Z",
					"location": "Rajkot",
					"dateOfJoining": "2014-08-06T18:30:00.000Z",
					"phone": 7845123265
				},
				{
					"_id": "5d88b15aca250859878a3904",
					"profilePhoto": "",
					"designation": "Developer",
					"total_leave": 24,
					"name": "Foram Trada",
					"email": "foramtrada@gmail.com",
					"dob": "2018-09-19T18:30:00.000Z",
					"location": "Rajkot",
					"dateOfJoining": "2014-08-06T18:30:00.000Z",
					"phone": 7845123265
				},
			]
			observer.next(this.allUsersList);
			observer.complete();
		});
	}

	getLeaveByUserId(id) {
		return this.http.get(config.baseApiUrl + "leave/get-leave-by-userId/" + id)
	}
	leaveApprovalBy(data) {
		return this.http.put(config.baseApiUrl + "leave/leave-update-by-status", data)
	}

}
