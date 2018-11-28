import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';

import { HttpRequestService } from '../../service/http-request.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  constructor(
    private httpRequestService: HttpRequestService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    /*test*/
    let b = {username:'admin333',password:'admin333'}
    this.httpRequestService.get('/vendor_api/logout')
    /*test*/

    this.httpRequestService.post_json('/vendor_api/login',b)
    .then(
      (response) => {
        console.log(response)
        this.getProfile();
      }
    )
    .catch(
      (error) => console.log(error)
    );

  }

  getProfile(){
    this.httpRequestService.get_json('/vendor_api/profile')
    .then(
      (response) => {
        console.log(response)
      }
    )
    .catch(
      (error) => {
        console.log(error);
        this.router.navigate(['/login'])
      }
    );
  }

}
