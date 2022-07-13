import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from '../services/alert.service';
import { first } from 'rxjs/operators';
import { LoginService } from '../services/login.service';
import Swal from 'sweetalert2';
import { Buffer } from 'buffer';
declare var $: any;

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
	ngOnInit() {
		
		$(".toggle-password").click(function () {
			$(this).toggleClass("fa-eye fa-eye-slash");
		});

	}


	resetPasswordForm: FormGroup;
	submitted = false;
	returnUrl: string;
	loader: boolean = false;
	match: boolean = false;
	isDisable: boolean = false;
	show: boolean;
	pwd: boolean;
	show1: boolean;
	pwd1: boolean;

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private _loginService: LoginService,
		private _alertService: AlertService) {
		if (this._loginService.currentUserValue) {
			
		}
		this.resetPasswordForm = new FormGroup({
			// email: new FormControl('', [Validators.required, Validators.email]),
			currentPassword: new FormControl('', [Validators.required]),
			newPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
			confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)])
		});
	}

	get f() { return this.resetPasswordForm.controls; }

	resetPassword() {
		
		this.submitted = true;
		if (this.resetPasswordForm.invalid) {
			return;
		}
		
		this.isDisable = true;
		const currentP = this.resetPasswordForm.controls.currentPassword.value
		let string1 = String(currentP);
		let encrypted1 = Buffer.from(string1).toString('base64');
		this.resetPasswordForm.controls.currentPassword.setValue(encrypted1);
		const newP = this.resetPasswordForm.controls.newPassword.value
		let string2 = String(newP);
		let encrypted2 = Buffer.from(string2).toString('base64');
		this.resetPasswordForm.controls.newPassword.setValue(encrypted2);
		delete this.resetPasswordForm.value['confirmPassword']
		// 
		this._loginService.resetPassword(this.resetPasswordForm.value)
			.pipe(first())
			.subscribe(data => {
				Swal.fire({ type: 'success', title: 'Password Change Successfully', showConfirmButton: false, timer: 2000 })
				this.isDisable = false;
				this.router.navigate(['/login']);
			},
				error => {
					Swal.fire('Oops...', 'Something went wrong!', 'error')
					this.isDisable = false;
				});
	}

	comparePassword(form) {
		
		if (form.value.newPassword === form.value.confirmPassword) {
			
			this.match = true;
		} else {
			this.match = false;
		}

	}
	password() {
		this.show = !this.show;
		this.pwd = !this.pwd;
	}
	confirmPassword() {
		this.show1 = !this.show1;
		this.pwd1 = !this.pwd1;
	}
}
