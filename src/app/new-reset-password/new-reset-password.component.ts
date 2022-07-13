import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginService } from '../services/login.service';
declare var $: any;
import { Buffer } from 'buffer';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-new-reset-password',
  templateUrl: './new-reset-password.component.html',
  styleUrls: ['./new-reset-password.component.css']
})
export class NewResetPasswordComponent implements OnInit {
  show: boolean;
  pwd: boolean;
  show1: boolean;
  pwd1: boolean;
  resetPasswordForm: FormGroup;
  isDisable = false

  match: boolean;
  submitted = false;
  loading = false
  constructor(
    public dialogRef: MatDialogRef<NewResetPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public loginService: LoginService
  ) {

    // this.dialogRef.disableClose = true
    this.resetPasswordForm = new FormGroup({
      // email: new FormControl('', [Validators.required, Validators.email]),
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      confirmPassword: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {

    $(".toggle-password").click(function () {
      $(this).toggleClass("fa-eye fa-eye-slash");
    });
  }



  password() {
    this.show = !this.show;
    this.pwd = !this.pwd;
  }

  confirmPassword() {
    this.show1 = !this.show1;
    this.pwd1 = !this.pwd1;
  }


  comparePassword(form) {
    

    if (form.value.newPassword === form.value.confirmPassword) {
      
      this.match = true;
    } else {
      this.resetPasswordForm.controls.confirmPassword.setErrors({
        inValid: true
      })
      this.match = false;
    }

  }
  resetPassword(data) {
    
    if (this.resetPasswordForm.invalid) {
      return;
    }
    
    this.isDisable = true;
    this.loading = true
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
    this.loginService.resetPassword(this.resetPasswordForm.value)
      // .pipe(first())
      .subscribe(data => {
        

        Swal.fire({ type: 'success', title: 'Password Change Successfully', showConfirmButton: false, timer: 2000 })
        this.isDisable = false;
        this.loading = false
        this.dialogRef.close(data)
        // this.router.navigate(['/login']);
      },
        error => {
          Swal.fire('Oops...', 'Something went wrong!', 'error')
          this.isDisable = false;
          this.loading = false
        });
  }



  closeModel() {
    this.dialogRef.close();
  }
}
