import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  SimpleChanges,
} from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
} from "@angular/forms";

@Component({
  selector: "app-mate-date-picker",
  templateUrl: "./mate-date-picker.component.html",
  styleUrls: ["./mate-date-picker.component.css"],
})
export class MateDatePickerComponent implements OnInit {
  @Input("deadlineDate") deadLineDate;
  @Input("dateName") displayName;
  @Input("date") dateDisable;
  @Input("addEmployee") employeeAdd;
  @Input("listDate") minDate;
  @Input("timeDate") adminDate;
  @Output() selectedDate: EventEmitter<any> = new EventEmitter<any>();
  todayDate = JSON.parse(localStorage.getItem("todayDate"));
  maxDate;
  dueDateForm: FormGroup;

  constructor() {}
  displayDate;
  isDisplay;
  ngOnInit() {
    this.dueDateForm = new FormGroup({
      dueDate: new FormControl("", [Validators.required]),
    });
    
  }

  ngOnChanges(changes: SimpleChanges) {
    
    if (changes.deadLineDate && changes.deadLineDate.currentValue) {
      this.displayDate = changes.deadLineDate.currentValue;
    }
    if (changes.dateDisable && changes.dateDisable.currentValue) {
      this.isDisplay = true;
    }
    if (changes.employeeAdd && changes.employeeAdd.currentValue) {
      this.todayDate = new Date(2016, 2, 3);
      // this.maxDate = JSON.parse(localStorage.getItem('todayDate'))
      
    
    }
    if (changes.minDate && changes.minDate.currentValue) {
      this.todayDate = changes.minDate.currentValue;
      this.maxDate = JSON.parse(localStorage.getItem("todayDate"));
    }
    if (changes.adminDate && changes.adminDate.currentValue) {
      

      this.todayDate = new Date(2016, 2, 3);
    }
  }

  getDate(event) {
    
    this.selectedDate.emit(event.target.value);
  }
}
