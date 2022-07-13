import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-no-data-found',
  templateUrl: './no-data-found.component.html',
  styleUrls: ['./no-data-found.component.css']
})
export class NoDataFoundComponent implements OnInit {
  @Input('dataFound') noDataFound
  displayData
  constructor() { }

  ngOnInit() {
  }


  ngOnChanges(changes: SimpleChanges) {
    

    if (changes.noDataFound && changes.noDataFound.currentValue) {
      this.displayData = changes.noDataFound.currentValue
    }
  }

}
