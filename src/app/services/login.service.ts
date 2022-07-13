import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { config } from "../config";
import { of, pipe } from "rxjs";
import { map } from "rxjs/operators";
import { Globals } from "./globals";
import { Buffer } from "buffer";
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from "firebase";
import { reject } from "lodash";
import { MessagingService } from "../services/messaging.service";
import { AngularFireMessaging } from "@angular/fire/messaging";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  @Output() ProfilePicture = new EventEmitter();
  UserDetails;
  @Output() loginUserDetails = new EventEmitter();

  @Output() notificationCount = new EventEmitter();
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private subject = new Subject<any>();
  private sideSubject = new Subject<any>();
  constructor(
    private http: HttpClient,
    private global: Globals,
    private afAuth: AngularFireAuth,
    private toaster: ToastrService,
    private angularFireMessaging: AngularFireMessaging // private messageService: MessagingService
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(userCredentials) {
    return this.http
      .post<any>(config.baseApiUrl + "user/login", userCredentials)
      .pipe(
        map((user: any) => {
          // this.global.role = user.data;

          // login successful if there's a jwt token in the response
          if (user && user.data && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem("currentUser", JSON.stringify(user.data));
            localStorage.setItem("token", JSON.stringify(user.token));
            this.currentUserSubject.next(user);
          }
          return user;
        })
      );
  }

  returnMenu(data) {
    this.subject.next({ id: data });
    return true;
  }

  getObservableResponse() {
    return this.subject.asObservable();
  }

  sideMenu(data) {
    this.sideSubject.next({ id: data });
    return true;
  }
  getSideMenu() {
    return this.sideSubject.asObservable();
  }

  register(user) {
    return this.http.post(config.baseApiUrl + "user/signup", user);
  }
  resetPassword(data) {
    const userData = {
      data: data,
    };
    return this.http.put(config.baseApiUrl + "user/reset-password", userData);
  }

  getUserById(id, adminUserID) {
    var id = id;
    const details = {
      id: id,
      adminUserID: adminUserID,
    };

    return this.http.get(config.baseApiUrl + "user/get-user-by-id", {
      params: details,
    });
  }

  changeProfilePicture(files: any, data) {
    let formdata = new FormData();
    formdata.append("userId", data);
    formdata.append("profilePhoto", files);
    //
    return this.http
      .put(config.baseApiUrl + "user/change-profile/" + data, formdata)
      .pipe(
        map((res: any) => {
          let loginUser = JSON.parse(localStorage.getItem("currentUser"));
          if (loginUser._id == res.data._id) {
            this.ProfilePicture.emit(res.data);
          }
          return res;
        })
      );
  }

  addUser_with_file(body, password, files: any) {
    //
    //
    let formdata = new FormData();
    formdata.append("name", body.name);
    formdata.append("email", body.email);
    formdata.append("userRole", body.userRole);
    formdata.append("password", password);
    formdata.append("joiningDate", body.date);
    formdata.append("phone", body.phone);
    // formdata.append('isDelete', body.isDelete);
    formdata.append("experienceYear", body.experienceYear);
    formdata.append("experienceMonth", body.experienceMonth);
    formdata.append("branch", body.branch);
    if (files.length) {
      for (var i = 0; i < files.length; i++) {
        if (files.type == "application/pdf") {
          formdata.append("CV", files[i]);
        } else {
          formdata.append("profilePhoto", files[i]);
        }
      }
    }
    //
    return this.http.post(config.baseApiUrl + "user/signup", formdata);
  }

  editUserProfileWithFile(data, id) {
    return this.http.put(config.baseApiUrl + "user/update-details/" + id, data);
  }

  logout(DeviceToken) {
    let body = {
      token: DeviceToken,
    };
    return this.http.put(config.baseApiUrl + "user/logout", body);

    // return new Promise((resolve, reject) => {
    //   this.angularFireMessaging.requestToken.subscribe(
    //     (token) => {
    //       console.log("FCM token : ", token);
    //       let body = {
    //         token: token,
    //       };
    //       this.http.put(config.baseApiUrl + "user/logout", body).subscribe(
    //         (res) => {
    //           console.log("logout response : ", res);
    //           resolve(res);
    //         },
    //         (err) => {
    //           reject(err);
    //         }
    //       );
    //     },
    //     (err) => {
    //       console.error("Unable to get permission to notify.", err);
    //       reject(err);
    //     }
    //   );
    // });
  }

  resetPwd(user) {
    return this.http.put(config.baseApiUrl + "user/forgot-password", user);
  }

  updatepwd(user) {
    return this.http.put(config.baseApiUrl + "user/update-password", user);
  }

  getTodayDate() {
    return this.http.get(config.baseApiUrl + "user/getDate");
  }

  getTotalCounts() {
    return this.http.get(config.baseApiUrl + "user/totalCounts");
  }
  getNotificationCount() {
    // let user = JSON.parse(localStorage.getItem('currentUser'));
    //
    // if (user != null) {
    return this.http.get(config.baseApiUrl + "user/notification-count").pipe(
      map((res: any) => {
        this.notificationCount.emit(res);
        return res;
      })
    );
    // }
  }

  // Attendance Routes
  getIpCliente() {
    return this.http.get("https://api.ipify.org");
  }

  socialAuth(provider) {
    switch (provider) {
      case "google": {
        return new auth.GoogleAuthProvider();
        break;
      }
      case "facebook": {
        return new auth.FacebookAuthProvider();
      }
      case "github": {
        return new auth.GithubAuthProvider();
      }
    }
  }

  /**
   *
   * @param idToken - Firebase idToken for decode the user data.
   * @param invitationData - if user login with project invitation.
   * @returns
   */
  getUserFromBackend(idToken, invitationData?) {
    let headers = new HttpHeaders().set("token", idToken);
    // get the parameters from the invitation link.
    //    let params = { invitationData: "akshay@gmail.com" };

    return this.http.post(
      config.baseApiUrl + "user/socialSignin",
      { data: invitationData },
      {
        headers: headers,
        // params: params,
      }
    );
  }

  signinWithGoogle(provider, invitationData?) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth
        .signInWithPopup(this.socialAuth(provider))
        .then((googleAuth) => {
          googleAuth.user.getIdToken().then((idToken) => {
            //send the token to the backend...
            this.getUserFromBackend(idToken, invitationData).subscribe(
              (user: any) => {
                console.log("User data : ", user);
                if (user && user.data) {
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  localStorage.setItem(
                    "currentUser",
                    JSON.stringify(user.data.data)
                  );
                  localStorage.setItem("token", JSON.stringify(user.token));
                  // this.requestPermission(user.data.data._id);
                  // this.receiveMessage();

                  resolve(googleAuth);
                  // this.currentUserSubject.next(user);
                }
              },
              (err) => {
                reject(err);
              }
            );
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
