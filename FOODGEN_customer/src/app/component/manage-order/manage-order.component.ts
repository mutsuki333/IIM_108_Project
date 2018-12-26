import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HttpRequestService } from '../../service/http-request.service'

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.css']
})
export class ManageOrderComponent implements OnInit {

  orders;
  setup;
  setup_h;
  order_tmp;

  constructor(
    private httpRequestService: HttpRequestService,
    private router: Router
  ) { }

  ngOnInit() {
    this.setup_h=false;
    this.setup=false;
    this.httpRequestService.get_json('/customer_api/get_checks')
    .then((response)=>{
      console.log(response)
      this.orders=response;
    })
  }
  cancel(id:string){
    this.httpRequestService.get('/customer_api/cancel_check/'+id)
    this.ngOnInit()
  }

}
