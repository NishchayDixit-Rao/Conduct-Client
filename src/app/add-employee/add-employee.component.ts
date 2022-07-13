import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { LoginService } from '../services/login.service';
import { Buffer } from 'buffer';
declare var $: any;
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-add-employee',
	templateUrl: './add-employee.component.html',
	styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {

	addEmployeeForm: FormGroup;

	files: Array<File> = [];
	materialSelect;
	submitted = false;
	isDisable: boolean = false;
	show: boolean;
	pwd: boolean;
	phone;
	// phoneNumber = '^(\+\d{1,3}[- ]?)?\d{10}$';
	loader: boolean = false;

	constructor(public router: Router, public route: ActivatedRoute, private formBuilder: FormBuilder, public _projectservice: ProjectService, public _loginservice: LoginService, private dateFilter: DatePipe) {
		this.addEmployeeForm = this.formBuilder.group({
			name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern(/[!^\w\s]$/)]),
			password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
			isDelete: new FormControl('false', [Validators.required]),
			email: new FormControl('', [Validators.required, Validators.email]),
			date: new FormControl('', [Validators.required]),
			phone: new FormControl('', [Validators.minLength(10), Validators.maxLength(10)]),
			userRole: new FormControl('', [Validators.required]),
			experience: new FormControl(''),
			profile: new FormControl(''),
			cv: new FormControl(''),
			branch: new FormControl('', [Validators.required])
		});
	}
	ngOnInit() {


	}
	password() {
		this.show = !this.show;
		this.pwd = !this.pwd;
	}

	get f() { return this.addEmployeeForm.controls; }
	/**
	 * @param addEmployeeForm {Details of Employee}
	 * Add new Employee
	 */
	addEmployee(addEmployeeForm) {
		this.loader = true
		
		this.submitted = true;
		if (this.addEmployeeForm.invalid) {
			return;
		}

		let password = this.addEmployeeForm.controls.password.value
		
		let string = String(password)
		let encrypted = Buffer.from(string).toString('base64');
		const data = new FormData();
		this.isDisable = true;
		
		this._loginservice.addUser_with_file(this.addEmployeeForm.value, encrypted, this.files).subscribe((res: any) => {
			this.loader = false
			Swal.fire({ type: 'success', title: 'Employee Added Successfully', showConfirmButton: false, timer: 2000 })
			this.router.navigate(['./all-employee']);
			
			this.isDisable = false;
		}, err => {
			this.submitted = true
			this.isDisable = false
			
			this.loader = false
		})
	}

	/**
	 * @param event {CV Upload}
	 * Upload user CV 
	 */
	addFile(event) {
		
		_.forEach(event.target.files, (file: any) => {
			
			if (file.type == "application/pdf") {
				this.files.push(file);
			} else {
				Swal.fire({
					title: 'Error',
					text: "You can upload pdf file only",
					type: 'warning',
				})
			}
		})
	}



	/**
	 * @param event {Profile photo upload}
	 * Upload user ptofile photo 
	 */

	addProfile(event) {
		
		_.forEach(event.target.files, (file: any) => {
			
			if (file.type == "image/jpeg" || file.type == "image/jpg" || file.type == "image/png") {
				this.files.push(file);
			} else {
				Swal.fire({
					title: 'Error',
					text: "You can upload pdf file only",
					type: 'warning',
				})
			}
		})
	}

	/**
	 * @param form {phone no}
	 * Phone no validation 
	 */
	validatePhone(form) {
		
		var phoneno = /[0-9]/;
		var message = document.getElementById('message');
		if (!form.phone.match(phoneno)) {
			
			message.innerHTML = "Please enter only numbers"
		} else {
			message.innerHTML = "";
		}
	}

	/**
	 * @param form {user name}
	 * Validation of user 
	 */
	validateName(form) {
		
		var nameInput = /[a-zA-Z ]/;
		var message1 = document.getElementById('message1');
		if (!form.name.match(nameInput)) {
			
			message1.innerHTML = "Name can not start with digit"
		} else {
			message1.innerHTML = "";
		}
	}

	// validateEmail(form){
	// 	
	// 	let email = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	// 	var message2 = document.getElementById('message2');
	// 	if (!form.email.match(email)){
	// 		message2.innerHTML = "Enter valid email address"
	// 	} else{
	// 		message2.innerHTML = "";
	// 	}
	// }
}



