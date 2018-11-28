import { Component, OnInit } from '@angular/core';

import { HttpRequestService } from '../../service/http-request.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public imgURL=null;
  private imgID=null;

  constructor(private httpRequestService: HttpRequestService) { }

  ngOnInit() {
  }
  selectedFile: File;

  onFileChanged(event) {
    if(this.imgID !=null)this.httpRequestService.get('/files/delete/users/'+this.imgID);
    this.selectedFile = event.target.files[0]
    const uploadData = new FormData();
    uploadData.append('file', this.selectedFile, this.selectedFile.name);
    this.httpRequestService.postFile('/files/upload?base=users&filename=test.jpg', uploadData)
    .then(
      (response) => {
        console.log(response);
        let tmp:string = String(response);
        this.imgURL='http://54.71.220.94'+tmp;
        this.imgID=tmp.split('/')[3];
        console.log(this.imgID);
      }
    )
  }


}
