import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';

import { HttpRequestService } from '../../service/http-request.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  constructor(private httpRequestService: HttpRequestService) { }

  ngOnInit() {
    this.httpRequestService.get('/vendor_api/is_logged_in')
    .then(
      (response) => {
        console.log(response)
      }
    )
    .catch(
      (error) => console.log(error)
    );
  }

}
