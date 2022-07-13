import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CalendarView } from 'angular-calendar';

@Component({
  selector: 'mwl-demo-utils-calendar-header',
  template: `
    <div class="row mt-1 align-items-center">
    <div class="col-md-4 text-md-left">
        <div class="btn-group">
          <div
            class="btn btn-primary mr-1"
            (click)="viewChange.emit(CalendarView.Month)"
            [class.active]="view === CalendarView.Month"
          >
            Month
          </div>
          <div
            class="btn btn-primary mr-1"
            (click)="viewChange.emit(CalendarView.Week)"
            [class.active]="view === CalendarView.Week"
          >
            Week
          </div>
          <div
            class="btn btn-primary"
            (click)="viewChange.emit(CalendarView.Day)"
            [class.active]="view === CalendarView.Day"
          >
            Day
          </div>
        </div>
      </div>
    <div class="col-md-4 text-md-center">
    <h5>{{ viewDate | calendarDate: view + 'ViewTitle':locale }}</h5>
  </div>
      <div class="col-md-4 text-md-right">
        <div class="btn-group">
          <div
            class="btn btn-primary"
            mwlCalendarPreviousView
            [view]="view"
            [(viewDate)]="viewDate"
            (viewDateChange)="viewDateChange.next(viewDate)"
          >
          <i class="fa fa-angle-double-left" aria-hidden="true"></i> 
          </div>
          <div
            class="btn btn-default mx-1"
            mwlCalendarToday
            [(viewDate)]="viewDate"
            (viewDateChange)="viewDateChange.next(viewDate)"
          >
            Today
          </div>
          <div
            class="btn btn-primary"
            mwlCalendarNextView
            [view]="view"
            [(viewDate)]="viewDate"
            (viewDateChange)="viewDateChange.next(viewDate)"
          >
           
            <i class="fa fa-angle-double-right" aria-hidden="true"></i>
          </div>
        </div>
      </div>
     
      
    </div>
    <br />
  `,
})
export class CalendarHeaderComponent {
  @Input() view: CalendarView;

  @Input() viewDate: Date;

  @Input() locale: string = 'en';

  @Output() viewChange = new EventEmitter<CalendarView>();

  @Output() viewDateChange = new EventEmitter<Date>();

  CalendarView = CalendarView;
}
