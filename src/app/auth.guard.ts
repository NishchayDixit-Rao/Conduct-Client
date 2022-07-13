import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { LoginService } from "./services/login.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  newCurrentUser;
  constructor(
    private router: Router,
    // tslint:disable-next-line:variable-name
    private _loginService: LoginService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this._loginService.currentUserValue.data;
    this.newCurrentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    // tslint:disable-next-line:triple-equals
    if (
      (currentUser && currentUser.userRole === "admin") ||
      (this.newCurrentUser && this.newCurrentUser.userRole == "admin")
    ) {
      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    
    this.router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
    return false;
  }
}

@Injectable({ providedIn: "root" })
export class ProjectManagerGuard implements CanActivate {
  newCurrentUser;
  constructor(
    private router: Router,
    // tslint:disable-next-line:variable-name
    private _loginService: LoginService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this._loginService.currentUserValue.data;
    this.newCurrentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    if (
      (currentUser &&
        (currentUser.userRole == "admin" ||
          currentUser.userRole == "Manager")) ||
      (this.newCurrentUser &&
        (this.newCurrentUser.userRole == "admin" ||
          this.newCurrentUser.userRole == "Manager"))
    ) {
      // authorised so return true
      return true;
    }
    // not logged in so redirect to login page with the return url
  
    this.router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
    return false;
  }
}

@Injectable({ providedIn: "root" })
export class LoginGuard implements CanActivate {
  newCurrentUser: any;
  constructor(private router: Router, private _loginService: LoginService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this._loginService.currentUserValue;
    this.newCurrentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    if (currentUser || this.newCurrentUser) {
      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    
    this.router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
