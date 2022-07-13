import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireMessaging } from "@angular/fire/messaging";
import { mergeMapTo } from "rxjs/operators";
import { take } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { config } from "../config";
import { AlertService } from "./alert.service";
import { ToastrService } from "ngx-toastr";
import { LoginService } from "./login.service";
import { Output, EventEmitter } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class MessagingService {
  finalCount = 0;
  currentMessage = new BehaviorSubject(null);
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  loginUserId;
  @Output() notificationCount = new EventEmitter();

  constructor(
    public alert: AlertService,
    public http: HttpClient,
    private angularFireDB: AngularFireDatabase,
    private angularFireAuth: AngularFireAuth,
    private angularFireMessaging: AngularFireMessaging,
    private toastr: ToastrService,
    public loginService: LoginService
  ) {
    this.angularFireMessaging.messaging.subscribe((_messaging) => {
      _messaging.onMessage = _messaging.onMessage.bind(_messaging);
      _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
    });
  }

  updateToken(userId, token) {
    // we can change this function to request our backend service
    this.angularFireAuth.authState.pipe(take(1)).subscribe(() => {
      const data = {};
      data[userId] = token;
      this.angularFireDB.object("fcmTokens/").update(data);
    });
  }

  requestPermission(userId) {
    if ("Notification" in window) {
    } else {
    }
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        console.log("FCM token : ", token);
        localStorage.setItem("DeviceToken", token);
        //
        const udata = {
          userId: userId,
          token: token,
        };
        this.loginUserId = userId;
        this.addEntry(udata);
        // this.addNotification(udata);

        //this.updateToken(userId, token);
      },
      (err) => {
        console.error("Unable to get permission to notify.", err);
      }
    );
  }

  receiveMessage() {
    // if (this.currentUser._id == this.loginUserId) {

    this.angularFireMessaging.messages.subscribe((payload: any) => {
      let count = 0;
      this.loginService.getNotificationCount().subscribe(
        (response) => {},
        (error) => {}
      );
      // this.notificationCount.emit('notificationCount')
      // if (Number(this.finalCount == 0)) {
      //   let newCount = Number(this.finalCount) + + 1
      //   this.finalCount = newCount
      //
      //   this.notificationCount.emit(newCount)
      // }
      // else {
      //   let newCount = Number(count) + + 1
      //   this.notificationCount.emit(newCount);
      // }

      //
      // this.currentMessage.next(payload);
      if (payload.notification.body == "comment") {
        this.toastr.error(payload.notification.title, "", {
          disableTimeOut: true,
          closeButton: true,
          enableHtml: true,
        });
      } else if (payload.notification.body == "other") {
        this.toastr.success(payload.notification.title, "", {
          disableTimeOut: true,
          closeButton: true,
          enableHtml: true,
        });
      } else if (payload.notification.body == "task") {
        this.toastr.info(payload.notification.title, "", {
          disableTimeOut: true,
          closeButton: true,
          enableHtml: true,
        });
      } else {
        this.toastr.warning(payload.notification.title, "", {
          disableTimeOut: true,
          closeButton: true,
          enableHtml: true,
        });
      }
    });
    // }
  }

  addEntry(udata) {
    this.http
      .post(config.baseApiUrl + "notification/addUser", udata)
      .subscribe((success) => {});
  }
}
