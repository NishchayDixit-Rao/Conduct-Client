import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.css']
})
export class DateRangePickerComponent implements OnInit {

  @Input('dateReset') resetDate
  @Output() selectedDate: EventEmitter<any> = new EventEmitter()
  displayDate
  resetSelectedDate
  constructor() { }

  ngOnInit() {
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.resetDate && changes.resetDate.currentValue) {
      let date = changes.resetDate.currentValue
      if (date == true) {
        this.displayDate = null
      }
    }

  }



  inlineDate: { chosenLabel: string; startDate: moment.Moment; endDate: moment.Moment };

  selected = {
    startDate: moment('2015-11-18T00:00Z'),
    endDate: moment('2015-11-26T00:00Z'),
  };

  chosenDate(chosenDate: { chosenLabel: string; startDate: moment.Moment; endDate: moment.Moment }): void {
    
    this.inlineDate = chosenDate;
  }

  datesSelected(chosenDate) {
    
    if (chosenDate.startDate != null && chosenDate.endDate != null) {
      let tempStart = chosenDate.startDate._d
      let tempEnd = chosenDate.endDate._d
      let obj = {
        startDate: tempStart,
        endDate: tempEnd
      }
      // 
      this.selectedDate.emit(obj)
    }
  }

}
