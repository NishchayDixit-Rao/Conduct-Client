import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import { config } from "../config";
@Component({
  selector: "app-image-display",
  templateUrl: "./image-display.component.html",
  styleUrls: ["./image-display.component.css"],
})
export class ImageDisplayComponent implements OnInit {
  @Input("imageDisplay") imageList;
  @Input("imageEdit") displayEdit;
  @Input("indexOf") indexOfImage;
  @Output() removeImage: EventEmitter<any> = new EventEmitter();
  path = config.baseMediaUrl;
  image;
  displayIcon;
  constructor() {}

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges) {
    
    
    if (changes.imageList && changes.imageList.currentValue) {
      this.image = changes.imageList.currentValue;
    }
    if (changes.displayEdit && changes.displayEdit.currentValue) {
      this.displayIcon = changes.displayEdit.currentValue;
    }
  }

  removeAvatar(image) {
    
    this.removeImage.emit(this.indexOfImage);
  }
}
