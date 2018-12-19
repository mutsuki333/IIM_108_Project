import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HttpRequestService } from '../../service/http-request.service'

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  msg:string;

  constructor(
    private router: Router,
    private httpRequestService: HttpRequestService
  ) { }

  ngOnInit() {
    this.httpRequestService.get('/vendor_api/is_logged_in')
    .then(
      (response)=>console.log(response)
    )
    .catch(
      (error)=>console.log(error)
    )
  }

}
