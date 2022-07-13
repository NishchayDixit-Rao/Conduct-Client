import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-folder-tile',
  templateUrl: './folder-tile.component.html',
  styleUrls: ['./folder-tile.component.css']
})
export class FolderTileComponent implements OnInit {

  @Input('singleFolder') folderData
  @Input('index') indexOfFolder
  @Output() editFolder: EventEmitter<any> = new EventEmitter();
  @Output() removeFolder: EventEmitter<any> = new EventEmitter();
  @Output() singleFolderDetails: EventEmitter<any> = new EventEmitter();
  folderDetails


  constructor(

    public router: Router,
    public activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
  }



  ngOnChanges(changes: SimpleChanges) {
    
    if (changes.folderData && changes.folderData.currentValue) {
      this.folderDetails = changes.folderData.currentValue
      
    }

  }



  /**
   * @param index 
   * Navigate to single folder details 
   */
  singleFolder(index) {
    
    let name = index.path
    // let singleDetails = this.allFolderList[index]
    // 
    this.singleFolderDetails.emit(index.folderId)
    // this.router.navigate(['./singleFile/', index.folderId], { state: name })
  }


  newEditFolder(folderDetails) {
    
    

    this.editFolder.emit({ details: folderDetails, index: this.indexOfFolder })
  }



  deleteFolder() {
    this.removeFolder.emit(this.indexOfFolder)
  }

}
