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
  address:string;


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
        console.log(response['obj']['info']['address'])
        this.mobile=response['mobile']
        this.email=response['email']
        this.name=response['last_name']+response['first_name']
        response['obj']['info']['address']==undefined?
        this.address='[無]':
        this.address = response['obj']['info']['address'];
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
  constructor(private bottomSheetRef: MatBottomSheetRef<EditUserInfo>) {}

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
