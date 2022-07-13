import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LeaveService } from '../../services/leave.service'
declare var $: any;
import Swal from 'sweetalert2';

import * as moment from 'moment';
import * as _ from 'lodash';
@Component({
  selector: 'app-leave-form',
  templateUrl: './leave-form.component.html',
  styleUrls: ['./leave-form.component.css']
})
export class LeaveFormComponent implements OnInit {
  isDisable = false;
  leaveForm: FormGroup
  curruntDate: string = new Date().toISOString();
  isValue: boolean = false
  noOfDays
  shortLeave
  constructor(private leaveService: LeaveService, private elementRef: ElementRef) { }

  ngOnInit() {
    this.leaveForm = new FormGroup({
      date: new FormControl('', [Validators.required]),
      noOfDays: new FormControl(''),
      reason: new FormControl('', [Validators.required]),
      extraHours: new FormControl(''),
      shortLeave: new FormControl('')
    });

    var singleDayDate = $('#startDateFor1').pickadate({
      min: new Date(),
    }),
      fromSingle = singleDayDate.pickadate('picker')

    fromSingle.on('set', (event) => {
      if (event.select) {
        
        let singleDateValue = fromSingle.get('select')
        
        this.leaveForm.controls.date.setValue(singleDateValue.obj);
      }
    })
  }


  applyLeave(data) {
    this.isDisable = false
    
    
    
    if (this.leaveForm.invalid) {
      return;
    }
    this.leaveService.applyLeave(data)
      .subscribe((res: any) => {
        
        Swal.fire({ type: 'success', title: 'Leave Apply Successfully', showConfirmButton: false, timer: 2000 })
        // this._toastService.presentToast(res.message);
        this.leaveForm.reset();
        this.isDisable = false;
        this.isValue = false;
      }, err => {
        
        this.isDisable = false;
      })
  }

  /**
   * Validtion of enter shortleave hour
   * @param {Number} e 
   * @param {String} data 
   */
  updateList(e, data) {
    // 
    this.noOfDays = this.leaveForm.controls.noOfDays.value
    this.shortLeave = this.leaveForm.controls.shortLeave.value
    if (data == 'days' && e > 1) {
      this.leaveForm.get('noOfDays').valueChanges.subscribe(selected => {
        // 
        this.leaveForm.get('shortLeave').disable()
      })
    }
    if (data == 'days' && e == '') {
      this.leaveForm.get('noOfDays').valueChanges.subscribe(selected => {
        // 
        this.leaveForm.get('shortLeave').enable()
      })
    }
    if (data == 'shortLeave' && e > 1) {
      this.leaveForm.get('shortLeave').valueChanges.subscribe(selected => {
        // 
        this.leaveForm.get('noOfDays').disable()
      })
    }
    if (data == 'shortLeave' && e == '') {
      this.leaveForm.get('shortLeave').valueChanges.subscribe(selected => {
        // 
        this.leaveForm.get('noOfDays').enable()
      })
    }
    if (e) {
      this.isValue = true;
    } else {
      this.isValue = false;
    }
    if (e > 3 && data === 'shortLeave') {
      // 
      alert("please enter value less than three")
      const element = this.elementRef.nativeElement.querySelector('#input2');
      // 
      element.value = 3
    } else if (e < 3 && e > 1) {
      const element = this.elementRef.nativeElement.querySelector('#input2');
      // element.value = e
    } else if (e == "") {
      const element = this.elementRef.nativeElement.querySelector('#input2');
      element.value = ''
    } else if (e < 1) {
      alert("value must be positive ")
      const element = this.elementRef.nativeElement.querySelector('#input2');
      element.value = 1
    }
  }
}
