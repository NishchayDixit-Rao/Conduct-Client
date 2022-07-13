import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { config } from '../config';
@Component({
  selector: 'app-single-employee-card',
  templateUrl: './single-employee-card.component.html',
  styleUrls: ['./single-employee-card.component.css']
})
export class SingleEmployeeCardComponent implements OnInit {
  @Input('singleItem') itemDetails
  @Input('singleItem1') pmDetails
  @Output() removeItem: EventEmitter<any> = new EventEmitter<any>()
  item;
  baseUrl = config.baseMediaUrl;
  constructor() { }

  ngOnInit() {
    // 

  }


  ngOnChanges(changes: SimpleChanges) {
    
    if (changes.itemDetails && changes.itemDetails.currentValue) {
      this.item = changes.itemDetails.currentValue
    } else {
      this.item = null
    }
    if (changes.pmDetails && changes.pmDetails.currentValue) {
      this.item = changes.pmDetails.currentValue
    }
  }

  removeDeveloper(item) {
    
    this.removeItem.emit(item)
  }

}
