import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { LoginService } from "../services/login.service";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  currentUser: any;

  constructor(private router: Router, private _loginService: LoginService) {
    this._loginService.currentUser.subscribe((x) => (this.currentUser = x));
  }

  ngOnInit() {}

  // logout() {
  // 	this._loginService.logout();
  // 	this.router.navigate(['/login']);
  // }

  public onActivate(event) {
    if (event.displayButton && event.displayButton == true) {
      let data = true;
      let output = this._loginService.returnMenu(data);
      // displayBtn.
    } else {
      let data = false;
      let output = this._loginService.returnMenu(data);
    }
    if (event.sideMenuButton && event.sideMenuButton == true) {
      let data = true;
      let output = this._loginService.sideMenu(data);
    } else {
      let data = false;
      let output = this._loginService.sideMenu(data);
    }
  }
}
