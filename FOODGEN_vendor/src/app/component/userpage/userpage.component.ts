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
  shop_name:string;
  mobile:string;
  email:string;
  address:string;

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
    this.httpRequestService.get_json('/vendor_api/profile')
    .then(
      (response)=>{
        // console.log(response['obj']['info']['address'])
        this.photo=response['obj']['info']['photo']==undefined?
        'https://i.imgur.com/P5zUOzV.jpg':response['obj']['info']['photo']
        this.mobile=response['mobile']
        this.email=response['email']
        this.name=response['last_name']
        this.shop_name=response['obj']['info']['shop_name']
        this.address=response['obj']['info']['address']==undefined?
        '[無]':response['obj']['info']['address'];
        this.photo=response['obj']['info']['photo']==undefined?
        'http://54.71.220.94/files/item/5c1a5ce171ca3d54cb4eaffd':response['obj']['info']['photo']
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
    let info;
    this.httpRequestService.get_json('/vendor_api/profile')
    .then((response)=>{
      info=response['obj']['info'];
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
          info['photo']=this.imgURL;
          this.httpRequestService.post('/vendor_api/update_info',info)
          this.bottomSheetRef.dismiss();
          window.location.reload();
        }
      )
    })
  }
  save(){
    let profile={},info;
    let update_pofile=false,update_info=false;
    this.httpRequestService.get_json('/vendor_api/profile')
    .then((response)=>{
      info=response['obj']['info'];
      if(this.shop_name!=''){
        update_info=true;
        info['shop_name']=this.shop_name;
      }
      if(this.address!=''){
        update_info=true;
        info['address']=this.address;
      }
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
      if(update_info){
        this.httpRequestService.post('/vendor_api/update_info',info)
        this.bottomSheetRef.dismiss();
        window.location.reload();
      }
      // this.httpRequestService.post_json()
      if(update_pofile)
        this.httpRequestService.post('/vendor_api/update_user_profile',profile)
        this.bottomSheetRef.dismiss();
        window.location.reload();
    })
    .catch((error)=>console.log(error))
  }
}
