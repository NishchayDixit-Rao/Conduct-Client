import { Component, OnInit, Inject } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-select-avatar',
  templateUrl: './select-avatar.component.html',
  styleUrls: ['./select-avatar.component.css','../../create-project/create-project.component.css']
})
export class SelectAvatarComponent implements OnInit {

  constructor(

    public dialogRef: MatDialogRef<SelectAvatarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    // this.dialogRef.disableClose = true;
  }

  ngOnInit() {
    
  }


  closeModel() {
    this.dialogRef.close();
  }

  addIcon(data) {
    
    this.dialogRef.close(data);
  }


}
