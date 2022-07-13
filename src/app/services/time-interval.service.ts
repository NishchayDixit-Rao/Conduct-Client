import { Injectable } from "@angular/core";
import { interval } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TimeIntervalService {
  private intervalSubscription;
  // public intervalTimer = interval(300000);
  public intervalTimer = interval(5000);
  constructor() {}

  startInterval() {
    this.intervalSubscription = this.intervalTimer.subscribe((x) => {});
    return interval(5000);
    // return new Promise((resolve, reject) => {
    //   this.intervalSubscription = this.intervalTimer.subscribe(
    //     (x) => {
    //       return resolve(x);
    //     },
    //     (err) => {
    //       return reject(err);
    //     }
    //   );
    // });
  }

  stopInterval() {
    this.intervalSubscription.unsubscribe();
  }
}
