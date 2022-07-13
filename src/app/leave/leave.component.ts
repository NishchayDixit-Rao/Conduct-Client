import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { LeaveService } from '../services/leave.service';
// import { ImageViewerModule } from 'ng2-image-viewer';
import Swal from 'sweetalert2';
declare var $: any;




@Component({
	selector: 'app-leave',
	templateUrl: './leave.component.html',
	styleUrls: ['./leave.component.css']
})
export class LeaveComponent implements OnInit {
	addForm: FormGroup;
	files: Array<File> = [];
	showOneDays;
	showMoreDayss;
	showHalfDay;
	leaveDuration;
	startDate;
	commentUrl = [];
	url = [];
	currentUser = JSON.parse(localStorage.getItem('currentUser'));
	submitted = false;
	isDisable: boolean = false;
	singleDateValue;
	moreDateValue;
	halfDateValue;
	isTableDisplay: boolean = false;
	moreStartDate;
	moreEndDate;
	constructor(public router: Router, public _leaveService: LeaveService) {
		// this.addForm = new FormGroup({
		// 	leaveDuration: new FormControl(''),
		// 	typeOfLeave: new FormControl('', Validators.required),
		// 	reasonForLeave: new FormControl(''),
		// 	startingDate: new FormControl(''),
		// 	noOfDays: new FormControl(''),
		// 	endingDate: new FormControl(''),
		// 	singleDate: new FormControl(''),
		// 	attechment: new FormControl('')
		// })

		this.addForm = new FormGroup({
			typeOfLeave: new FormControl('', Validators.required),
			reasonForLeave: new FormControl(''),
			attechment: new FormControl(''),
			hours: new FormControl(''),
			leaves: new FormControl(''),
			compenstation: new FormControl('')
		})
	}


	ngOnInit() {

		let checked = $('input[name="radio-group"]:checked').val();
		
		$('.datepicker').pickadate({
			min: new Date(),
		})

		// TimePicker
		$('#input_starttime').pickatime({});

		$('#input_endtime').pickatime({});


		var singleDayDate = $('#startDateFor1').pickadate(),
			fromSingle = singleDayDate.pickadate('picker')


		fromSingle.on('set', (event) => {
			if (event.select) {
				
				this.singleDateValue = fromSingle.get('select')
				this.isTableDisplay = true;

				this.displayDate(this.singleDateValue)
			}
		})

		var halfDay = $('#halfDateFor').pickadate(),
			fromHalfDay = halfDay.pickadate('picker')
		fromHalfDay.on('set', (event) => {
			if (event.select) {
				this.halfDateValue = fromHalfDay.get('select')
				this.isTableDisplay = true;
				setTimeout(() => {
					$('#input_starttime').pickatime({});
				}, 200)
			}
		})

		var from_input = $('#startDate').pickadate(),
			from_picker = from_input.pickadate('picker')

		var to_input = $('#endDate').pickadate(),
			to_picker = to_input.pickadate('picker')

		if (from_picker.get('value')) {
			
			to_picker.set('min', from_picker.get('select'))
		}
		if (to_picker.get('value')) {
			from_picker.set('max', to_picker.get('select'))
		}

		from_picker.on('set', (event) => {
			if (event.select) {
				to_picker.set('min', from_picker.get('select'))
				this.moreStartDate = from_picker.get('select')
				
				// this.moreDays(this.moreStartDate)
			}
			else if ('clear' in event) {
				to_picker.set('min', false)
			}
		})

		to_picker.on('set', (event) => {
			if (event.select) {
				from_picker.set('max', to_picker.get('select')) + 1
				this.moreEndDate = to_picker.get('select')
				
				this.moreDays(this.moreStartDate, this.moreEndDate)
			}
			else if ('clear' in event) {
				from_picker.set('max', false)
			}
		})
		this.showMoreDayss = false;
		localStorage.setItem("showMoreDayss", JSON.stringify(false));

		this.showOneDays = false;
		localStorage.setItem("showOneDays", JSON.stringify(false));

	}
	displayDate(date){
		
		this.addForm.controls.leaves.setValue(date);
	}
	moreDays(firstDate, secondDate) {
		
		var dateArray = [];
		var currentDate = moment(firstDate.obj);
		var stopDate = moment(secondDate.obj);
		while (currentDate <= stopDate) {
			dateArray.push(moment(currentDate).format('YYYY-MM-DD'))
			currentDate = moment(currentDate).add(1, 'days');
		}
		
		this.moreDateValue = dateArray;
		this.isTableDisplay = true;
	}

	check(event) {
		
		if (event.value) {
			$('.compenstationArea').css({ 'display': 'block' })
		}
	}

	changeFile(event) {
		this.files = event;
		
		
	}
	get f() { return this.addForm.controls; }

	addLeave(form) {
		

		// this.submitted = true;
		// if (this.addForm.invalid) {
		// 	return false;
		// }
		// this.isDisable = true;
		// form.startingDate = $('#startDate').val();
		// form.singleDate = $('#startDateFor1').val();
		// 
		// form.endingDate = $('#endDate').val();

		// form['id'] = this.currentUser._id;
		// form['name'] = this.currentUser.name;
		// form['email'] = this.currentUser.email;

		// 
		// if (form.singleDate) {
		// 	form.noOfDays = "1-day";
		// 	
		// }
		// 
		// if (form.noOfDays == "1-day") {
		// 	form['endingDate'] = form['singleDate'];
		// 	form['startingDate'] = form['singleDate'];
		// 	
		// } else {
		// 	form.noOfDays == "more-day"
		// 	var date2 = new Date(form.startingDate);
		// 	var date1 = new Date(form.endingDate);
		// 	// 
		// 	
		// 	form['endingDate'] = $('#endDate').val();
		// 	form['startingDate'] = $('#startDate').val();
		// 	// 
		// 	// 
		// 	var timeDuration = Math.abs(date1.getTime() - date2.getTime());
		// 	var daysDuration = Math.ceil(timeDuration / (1000 * 3600 * 24));
		// 	
		// 	form['leaveDuration'] = daysDuration;
		// 	
		// }

		// this._leaveService.addLeave(this.addForm.value, this.files).subscribe((res: any) => {
		// 	Swal.fire({ type: 'success', title: 'Leave Apply Successfully', showConfirmButton: false, timer: 2000 })
		// 	this.addForm.reset();
		// 	this.isDisable = false;
		// 	this.router.navigate(['./myleave']);
		// 	
		// }, err => {
		// 	
		// 	Swal.fire('Oops...', 'Something went wrong!', 'error')
		// 	this.isDisable = false;
		// })
	}
	showOneDay() {
		this.isTableDisplay = false
		// $('.datepicker').pickdate()
		
		this.showMoreDayss = false;
		localStorage.setItem("showMoreDayss", JSON.stringify(false));
		if (this.showOneDays == false) {
			this.showOneDays = true;
			localStorage.setItem("showOneDays", JSON.stringify(true));
			
		}
		else {
			this.showOneDays = false;
			localStorage.setItem("showOneDays", JSON.stringify(false));
		}
	}
	showMoreDays() {
		this.isTableDisplay = false
		$('.datepicker').pickadate();
		localStorage.setItem("showOneDays", JSON.stringify(false));
		this.showOneDays = false;
		if (this.showMoreDayss == false) {
			this.showMoreDayss = true;
			localStorage.setItem("showMoreDayss", JSON.stringify(true));
		}
		else {
			this.showMoreDayss = false;
			localStorage.setItem("showMoreDayss", JSON.stringify(false));
		}
	}
	showHalfDays() {
		this.isTableDisplay = false;
		this.showMoreDayss = false;
		if (this.showHalfDay == false) {
			this.showHalfDay = true;
		}
		else {
			this.showHalfDay = false;
		}
	}

}
