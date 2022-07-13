import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { config } from '../../config';
import { ActivatedRoute, Router } from '@angular/router';
import { Observer, Observable } from 'rxjs';
import { connect } from 'net';
import { saveAs } from 'file-saver';
var FileSaver = require('file-saver');

@Component({
  selector: 'app-file-tile',
  templateUrl: './file-tile.component.html',
  styleUrls: ['./file-tile.component.css']
})
export class FileTileComponent implements OnInit {

  @Input('singleFile') fileDetails

  @Output() removeImage: EventEmitter<any> = new EventEmitter();
  image
  path = config.baseMediaUrl
  convertImage
  fileType
  constructor(
    public router: Router,
  ) { }

  ngOnInit() {
  }

  filename = "http://localhost/pmt_server_development/uploads/"

  ngOnChanges(changes: SimpleChanges) {
    if (changes.fileDetails && changes.fileDetails.currentValue) {
      this.image = changes.fileDetails.currentValue
      // this.convertImage = this.path + this.image.fileName
      this.fileType = this.image.alias.split('.')[1]
      

      // let newFile = this.getBase64Image(this.image.fileName)
      // 
      // let imageUrl = this.path + this.image.fileName
      // this.getBase64ImageFromURL(imageUrl).subscribe(base64data => {
      // 
      // this.convertImage = base64data
      // this.base64Image = 'data:image/jpg;base64,' + base64data;
      // });

    }
    // 


  }
  imageData() {
    var blob = new Blob([this.convertImage]);
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = this.image.alias;
    link.click();
    // var link = document.createElement('a');
    // link.href = this.convertImage;
    // link.download = this.image.alias;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);

  }

  getImage(image) {
    this.getBase64ImageFromURL(image).subscribe(base64data => {
      let content = this.image.alias.split('.')[1]
      let finalType
      if (content == 'pdf') {
        

        finalType = "application/" + content
      } else {

        finalType = "image/" + content
      }


      const blobData = this.convertBase64ToBlobData(base64data, finalType);
      if (window.navigator && window.navigator.msSaveOrOpenBlob) { //IE
        window.navigator.msSaveOrOpenBlob(blobData, this.image.alias);
      } else { // chrome
        let contentType = this.image.alias.split('.')[1]
        const blob = new Blob([blobData], { type: finalType });
        const url = window.URL.createObjectURL(blob);
        // window.open(url);
        const link = document.createElement('a');
        link.href = url;
        link.download = this.image.alias.split('.')[0];
        link.click();

      }

    });


  }
  // Convert file to base64 string
  // fileToBase64 = (filename, filepath) => {
  //   return new Promise(resolve => {
  //     var file = new File([filename], filepath);
  //     var reader = new FileReader();
  //     // Read file content on file loaded event
  //     reader.onload = function (event) {
  //       resolve(event.target.result);
  //     };

  //     // Convert data to base64 
  //     reader.readAsDataURL(file);
  //   });
  // };
  // Example call:
  // fileToBase64("test.pdf", "../files/test.pdf")
  // .then(result => {
  //   
  // });


  saveFile(url, name) {
    

    FileSaver.saveAs(url, name);

  }



  finalDownLoad(filename, base64data) {

    // 
    // 


    const downloadLink = document.createElement("a");
    const fileName = filename;
    downloadLink.href = base64data;
    downloadLink.download = fileName;
    downloadLink.click();
  }


  downloadFile(fileURL, filename) {

    let final = this.path + fileURL


    let link = document.createElement('a');
    link.download = filename;

    let blob = new Blob([final], { type: 'text/plain' });

    link.href = URL.createObjectURL(blob);

    link.click();

    URL.revokeObjectURL(link.href)


    // let displayImage = this.fileToBase64(filename, final)
    // 
    // let file = this.b64Blob()
    // alert(filename)
    // this.getBase64ImageFromURL(this.path + fileURL).subscribe(base64data => {
    //   
    // const downloadLink = document.createElement("a");
    // const fileName = filename;
    // downloadLink.href = base64data;
    // downloadLink.download = fileName;
    // downloadLink.click();
    // })
    // const win = window.open("","_blank");
    // let html = '';

    // html += '<html>';
    // html += '<body style="margin:0!important">';
    // html += '<embed width="100%" height="100%" src='+ this.path + fileURL  +' type="application/pdf" />';
    // html += '</body>';
    // html += '</html>';

    // setTimeout(() => {
    //   win.document.write(html);
    // }, 0);


  }


  convertBase64ToBlobData(base64Data: string, contentType, sliceSize = 512) {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }


  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      // create an image object
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
        // This will call another method that will create image from url
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  getBase64Image(img: HTMLImageElement) {
    // We create a HTML canvas object that will create a 2d image
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    // This will draw image    
    ctx.drawImage(img, 0, 0);
    // Convert the drawn image to Data URL
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

  deleteImage(image) {
    this.removeImage.emit(image)
  }

  imageDetails(imageId) {
    this.router.navigate(['./document-file/', imageId]);
  }

  openImage(image) {
    let link = image
    
    window.open(link, "_blank");


  }

}
