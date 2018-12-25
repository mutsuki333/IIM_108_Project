import { Component, OnInit } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material';
import { Router } from '@angular/router';

import { HttpRequestService } from '../../service/http-request.service'

@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.component.html',
  styleUrls: ['./userpage.component.css']
})
export class UserpageComponent implements OnInit {
  collapsed;
  goodsInCart;

  name:string;
  mobile:string;
  email:string;

  photo:string="";


  constructor(
    private bottomSheet: MatBottomSheet,
    private httpRequestService: HttpRequestService,
    private router: Router
  ) { }

  openBottomSheet(): void {
    this.bottomSheet.open(EditUserInfo);
  }

  ngOnInit() {
    this.httpRequestService.get_json('/customer_api/profile')
    .then(
      (response)=>{
        console.log(response)
        this.photo=response['photo']==undefined?
        'https://i.imgur.com/P5zUOzV.jpg':response['photo']
        this.mobile=response['mobile']
        this.email=response['email']
        this.name=response['last_name']
        this.photo=response['photo']==undefined?
        'http://54.71.220.94/files/item/5c1a5ce171ca3d54cb4eaffd':response['photo']
      }
    )
    .catch(
      (error)=>{
        console.log(error)
        this.router.navigate(['/login'])
      }
    )
  }

}

@Component({
  selector: 'editUserInfo',
  templateUrl: 'editUserInfo.html',
})
export class EditUserInfo {
  err_msg=[]
  shop_name='';
  first_name;
  last_name;
  mobile='';
  email='';
  address='';
  selectedFile: File;
  imgID;
  imgURL

  email_re = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  mobile_re = new RegExp('09{1}[0-9]{8}');


  constructor(
    private bottomSheetRef: MatBottomSheetRef<EditUserInfo>,
    private httpRequestService: HttpRequestService,
    private router: Router,
  ) {}

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
  onFileChanged(event) {
    this.httpRequestService.get_json('/customer_api/profile')
    .then((response)=>{
      if(this.imgID !=null)this.httpRequestService.get('/files/delete/users/'+this.imgID);
      this.selectedFile = event.target.files[0]
      const uploadData = new FormData();
      uploadData.append('file', this.selectedFile, this.selectedFile.name);
      this.httpRequestService.postFile('/files/upload?base=item&filename=test.jpg', uploadData)
      .then(
        (response) => {
          let tmp:string = String(response);
          this.imgURL=this.httpRequestService.host+tmp;
          this.imgID=tmp.split('/')[3];
          this.httpRequestService.post('/customer_api/update_profile',{'photo':this.imgURL})
          this.bottomSheetRef.dismiss();
          window.location.reload();
        }
      )
    })
  }
  save(){
    let update_pofile=false;
    let profile={};
    // if(this.address!=''){
    //   update_info=true;
    //   response['address']=this.address;
    // }
    if(this.mobile_re.test(this.mobile)){
      update_pofile=true;
      profile['mobile']=this.mobile;
    }
    else if(this.mobile!='')this.err_msg.push('手機號碼錯誤')
    if(this.email_re.test(this.email)){
      update_pofile=true;
      profile['email']=this.email
    }
    else if(this.email!='')this.err_msg.push('email 錯誤')
    // this.httpRequestService.post_json()
    if(update_pofile)
      this.httpRequestService.post('/customer_api/update_profile',profile)
      this.bottomSheetRef.dismiss();
      window.location.reload();
  }
}
