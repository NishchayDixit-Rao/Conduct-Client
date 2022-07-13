import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css']
})
export class TextEditorComponent implements OnInit {

  @Input('valueReset') resetValue
  @Input('description') displayContent
  @Output() commentData: EventEmitter<any> = new EventEmitter();
  content
  displayData
  constructor() { }

  ngOnInit() {

    this.content = new FormGroup({
      contentData: new FormControl('')
    })
    this.changeValue()
  }



  ngOnChanges(changes: SimpleChanges) {
    if (changes.resetValue && changes.resetValue.currentValue) {
      this.content.controls['contentData'].setValue(null);
    }
    if (changes.displayContent && changes.displayContent.currentValue) {
      this.displayData = changes.displayContent.currentValue
    }
  }

  changeValue() {
    this.content.valueChanges.subscribe((data) => {
      
      // if (data.contentData != null) {
      this.commentData.emit(data.contentData)
      // }
    })
  }


}
