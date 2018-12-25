import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import { HttpRequestService } from '../../service/http-request.service'

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  items;
  amount=0;

  constructor(
    private httpRequestService: HttpRequestService
  ) { }

  ngOnInit() {
    this.amount=0;
    this.httpRequestService.get_json('/customer_api/cart')
    .then((response)=>{
      this.items=response;
      console.log(this.items)
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

  }

}
