import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-notify-user-list',
  templateUrl: './notify-user-list.component.html',
  styleUrls: ['./notify-user-list.component.css']
})
export class NotifyUserListComponent implements OnInit {
  @Input('totalList') allMembers

  @Output() developerSelected: EventEmitter<any> = new EventEmitter()
  totalMembers = []
  selectionChanges
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    
    if (changes.allMembers && changes.allMembers.currentValue) {
      this.totalMembers = changes.allMembers.currentValue
    }
  }

  closeMenu(event) {
    
    this.developerSelected.emit(this.selectionChanges)

  }



}
