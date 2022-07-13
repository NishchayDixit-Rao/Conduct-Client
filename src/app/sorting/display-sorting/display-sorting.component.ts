import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-display-sorting',
  templateUrl: './display-sorting.component.html',
  styleUrls: ['./display-sorting.component.css']
})
export class DisplaySortingComponent implements OnInit {
  @Input('sorting') sortingList
  @Input('length') taskLength
  @Input('reset') filterReset
  @Output() dueDate: EventEmitter<any> = new EventEmitter();
  @Output() priority: EventEmitter<any> = new EventEmitter();
  @Output() taskUniqueId: EventEmitter<any> = new EventEmitter();
  displayMenu
  totalList
  selected
  resetFilter
  displayName = 'Choose'
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    

    if (changes.sortingList && changes.sortingList.currentValue) {
      this.displayMenu = changes.sortingList.currentValue
    }
    if (changes.taskLength && changes.taskLength.currentValue) {
      this.totalList = changes.taskLength.currentValue
    }
    if (changes.filterReset && changes.filterReset.currentValue) {
      this.resetFilter = changes.filterReset.currentValue
      this.selected = 0
      this.displayName = 'Choose'
    }
    
  }
  menuClosed(event) {
    

  }

  sortTasksByDueDate(type) {
    
    this.displayName = 'Due Date'
    if (type == 'asc') {
      this.selected = 1
    }
    if (type == 'desc') {
      this.selected = 2
    }
    this.dueDate.emit(type)
  }

  sortTasksByPriority(type) {
    this.displayName = 'Priority'
    if (type == 'asc') {
      this.selected = 3
    }
    if (type == 'desc') {
      this.selected = 4
    }
    this.priority.emit(type)
  }

  sortTasksByTaskName(type) {

    this.displayName = 'Task'
    if (type == 'asc') {
      this.selected = 5
    }
    if (type == 'desc') {
      this.selected = 6
    }
    this.taskUniqueId.emit(type)
  }


}
