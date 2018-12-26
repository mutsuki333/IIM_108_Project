import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';

import { HttpRequestService } from '../../service/http-request.service'

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  items;
  selected;
  amount=0;

  constructor(
    private httpRequestService: HttpRequestService,
    private router: Router
  ) { }

  ngOnInit() {
    this.amount=0;
    this.httpRequestService.get('/customer_api/is_logged_in')
    .then((response)=>{
      console.log()
      if(response.toString()=='False')this.router.navigate(['/login'])
    })
    .catch((error)=>{
      console.log(error);
      this.router.navigate(['/login']);
    })
    this.httpRequestService.get_json('/customer_api/cart')
    .then((response)=>{
      this.items=response;
      // console.log(this.items)
      for (let item of response) {
          this.amount+=item.item.base_price;
      }
    })
  }

  remove_from_cart(id){
    this.httpRequestService.get('/customer_api/remove_from_cart/'+id)
    .then(()=>this.ngOnInit())

  }
  send(){
    if(this.items.length<=0){
      alert('購物車內沒有商品')
      this.router.navigate(['/home'])
    }
    else this.router.navigate(['/checkout'])
    // this.httpRequestService.get('/customer_api/check')
    // .then((response)=>{
    //   if(response.toString()=='success')this.router.navigate(['/manage-order'])
    //   else alert(response.toString())
    // })
    // .catch((error)=>console.log(error))
  }

}
