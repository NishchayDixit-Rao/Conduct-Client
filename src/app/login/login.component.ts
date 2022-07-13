import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormsModule,
} from "@angular/forms";
import { first } from "rxjs/operators";
import { AlertService } from "../services/alert.service";
import { LoginService } from "../services/login.service";
import { ProjectService } from "../services/project.service";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../auth.service";

import { Buffer } from "buffer";
import Swal from "sweetalert2";
declare var $: any;

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  forgotPasswordForm: FormGroup;
  loader = false;
  show: boolean;
  pwd: boolean;
  err: any;
  error1Msg;
  errorMsg;
  inviteLink:any;
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  name;
  isDisable = false;
  invitationData;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _loginService: LoginService,
    private _alertService: AlertService,
    private toaster: ToastrService,
    private projectService: ProjectService,
    private authService: AuthService
  ) {
    localStorage.clear();
    this.route.params.subscribe((param) => {
      this.inviteLink = param.inviteLink;
      //
    });

    //
    // redirect to home if already logged in
    // if (this._loginService.currentUserValue) {
    //   this.router.navigate(['/']);
    //   this.show = false;
    //   this.pwd = false;
    // }
  }

  ngOnInit() {
    this.invitationData = window.location.search;
    this.loginForm = this.formBuilder.group({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: ["", Validators.required],
    });

    this.forgotPasswordForm = this.formBuilder.group({
      email: [""],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
    //
    $(".toggle-password").click(function () {
      $(this).toggleClass("fa-eye fa-eye-slash");
    });

    $("#modalForgotPasswordForm").click(function () {
      $(".reset_form")[0].reset();
    });
    $(".modal-content").click(function (event) {
      event.stopPropagation();
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }
  closeModel() {
    $("#modalForgotPasswordForm").modal("hide");
  }

  onSubmit() {
    let password = this.loginForm.controls.password.value;
    // //
    let string = String(password);
    let encrypted = Buffer.from(string).toString("base64");
    // //
    this.submitted = true;
    // this.loginForm.controls.password.setValue(encrypted);
    const data = new FormData();
    data.append("email", this.loginForm.controls.email.value);
    data.append("password", encrypted);
    if (this.loginForm.invalid) {
      return;
    }
    // //
    this.isDisable = true;
    this.loading = true;
    this._loginService
      .login(data)
      // .pipe(first())
      .subscribe(
        (data) => {
          // //
          // Swal.fire({type: 'success',title: 'Login Successfully', showConfirmButton:false, timer:2000});
          this.isDisable = false;
          this.getTodayDate();
          this.getCount();
          //
          this.router.navigate([this.returnUrl]);
        },
        (error) => {
          //
          // this._alertService.error(error);
          this.isDisable = false;
          this.submitted = true;
          this.loading = false;
        }
      );
  }

  getTodayDate() {
    this._loginService.getTodayDate().subscribe(
      (response) => {
        //
        localStorage.setItem("todayDate", JSON.stringify(response));
      },
      (error) => {
        //
      }
    );
  }

  getCount() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    //

    if (user != null) {
      this._loginService.getNotificationCount().subscribe(
        (response) => {
          //
        },
        (error) => {
          //
        }
      );
    }
  }

  showPassword() {
    // var pass = document.getElementById("FORMPASSWORD").setAttribute("type" , "text");
    var pass = document.getElementById("FORMPASSWORD").getAttribute("type");
    if (pass == "password") {
      document.getElementById("FORMPASSWORD").setAttribute("type", "text");
    } else {
      document.getElementById("FORMPASSWORD").setAttribute("type", "password");
    }
    // //
  }
  updatePassword() {
    this.loader = true;
    // this.isDisable = true;
    this._loginService.resetPwd(this.forgotPasswordForm.value).subscribe(
      (res) => {
        this.forgotPasswordForm.reset();
        //
        this.loader = false;
        Swal.fire("", "Reset password link sent on your email", "success");
        $("#modalForgotPasswordForm").modal("hide");
        // this.isDisable = false;
      },
      (error) => {
        $("#modalForgotPasswordForm").modal("hide");
        //
        this.forgotPasswordForm.reset();
        this.loginForm.reset();
        // this._alertService.error(error.error.message);
        // if (error.status == 404) {
        //   this.err = error;
        //   //
        //   this.error1Msg = this.err.error.errMsg;
        //   this.isDisable = false;
        // }
        this.loader = false;
      }
    );
  }

  password() {
    this.show = !this.show;
    this.pwd = !this.pwd;
  }
  loginWithGoogle() {
    //
    
    this._loginService.signinWithGoogle("google",this.inviteLink).then(
      (res) => {
        //
        this.isDisable = false;
        this.getTodayDate();
        this.getCount();
        //
        this.router.navigate([this.returnUrl]);
      },
      (err) => {
        //
        // this._alertService.error(error);
        this.isDisable = false;
        this.submitted = true;
        this.loading = false;
      }
    );
  }

  loginWithMicrosoft() {}

  loginWithFacebook() {}
}
