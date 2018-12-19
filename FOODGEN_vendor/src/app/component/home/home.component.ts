import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HttpRequestService } from '../../service/http-request.service'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
goodsInCart;
  constructor(
    private httpRequestService: HttpRequestService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.httpRequestService.get('/vendor_api/logout')
  }

}
