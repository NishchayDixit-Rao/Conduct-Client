import {
  Component,
  OnInit,
  SimpleChanges,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";

@Component({
  selector: "app-developer-filter",
  templateUrl: "./developer-filter.component.html",
  styleUrls: ["./developer-filter.component.css"],
})
export class DeveloperFilterComponent implements OnInit {
  @Input("developerList") displayList;
  @Input("filter") filterReset;
  @Output() developerSelected: EventEmitter<any> = new EventEmitter();
  @Output() managerSelected: EventEmitter<any> = new EventEmitter();
  developerName;
  selectedOptions;
  redirect = false;
  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.displayList && changes.displayList.currentValue) {
      this.developerName = changes.displayList.currentValue;
    }
    //
    if (changes.filterReset && changes.filterReset.currentValue) {
      let filterData = changes.filterReset.currentValue;
      if (filterData == true) {
        this.selectedOptions = [];
      }
    }
  }

  closeMenu(event) {
    //
    // console.log("Developer event : ", event.option._value);
    // this.developerSelected.emit([event.option._value]);
    this.developerSelected.emit(this.selectedOptions);
    this.managerSelected.emit(this.selectedOptions);
  }
}
