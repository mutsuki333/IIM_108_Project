import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HttpRequestService } from '../../service/http-request.service'

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.css']
})
export class ManageOrderComponent implements OnInit {
  history;
  setup;
  setup_h;
  orders;
  order_tmp;

  constructor(
    private httpRequestService: HttpRequestService,
    private router: Router
  ) { }

  ngOnInit() {
    this.setup_h=false;
    this.setup=false;
    this.httpRequestService.get_json('/vendor_api/get_checks')
    .then((response)=>{
      this.orders=response;
      console.log(this.orders)
    })
    .catch(()=>this.router.navigate(['/login']))
  }
  cancel(order,index){
    this.httpRequestService.get('/vendor_api/cancel_check/'+order+'/'+index)
    this.ngOnInit()
  }
  accomplish(order,index){
    this.httpRequestService.get('/vendor_api/accomplish_check/'+order+'/'+index)
    this.ngOnInit()
  }

}
