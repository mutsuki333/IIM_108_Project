import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HttpRequestService } from '../../service/http-request.service'


export interface Vendor {
  shop_name:any;
  _id:any;
  photo:any;
}



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  vendor_list;
  vendor_tmp:Vendor={shop_name:'',_id:'',photo:''};
  vendor_ID;
  items;
  selected_item_obj;
  setup=false;
  setup_shop=false;
  selected_shop_obj;

  constructor(
    private httpRequestService: HttpRequestService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.httpRequestService.get_json('/site_api/vendor_list')
    .then((response)=>{
      // console.log(response)
      this.vendor_list=response
    })
    .catch((error)=>this.router.navigate['/login'])
  }

  setVendor(vendor){
    this.vendor_tmp.shop_name=vendor.info.shop_name;
    this.vendor_tmp._id=vendor._id;
    this.vendor_tmp.photo=vendor.info.photo
  }

  getItems(ID){
    this.items=[]
    this.httpRequestService.get_json('/site_api/item_list/'+ID)
    .then((response)=>{
      console.log(response)
      for (let x in response) {
        let cat = response[x].category_name;
        // console.log(cat)
        for (let y in response[x].item) {
            // console.log(response[x].item[y])
            let _id=response[x].item[y]._id;
            let obj=response[x].item[y].item;
            obj['category_name']=cat;
            obj['_id']=_id
            // console.log(obj)
            this.items.push(obj)
        }
      }
      // console.log(this.items)
    })
  }

  addToCart(id){
    // console.log(id)
    this.httpRequestService.get('/customer_api/add_to_cart/'+id)
    alert('成功')
  }
  selected_item(item:any){
    this.setup=true
    this.selected_item_obj=item;
  }
  selected_shop(vendor:any){
    this.httpRequestService.get_json('/site_api/vendor_profile/'+vendor._id)
    .then((response)=>{
      console.log(response)
      this.selected_shop_obj=response;
      this.setup_shop=true;
    })
  }
}
