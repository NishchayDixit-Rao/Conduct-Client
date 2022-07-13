import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { config } from "../config";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getUserToDoTasksLists() {
    return this.http.get(config.baseApiUrl + "dashboard/get-user-todo-tasks");
  }
}
