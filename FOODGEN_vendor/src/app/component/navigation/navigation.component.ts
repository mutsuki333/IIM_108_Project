import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HttpRequestService } from '../../service/http-request.service'

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  value;
  close;

  photo='http://54.71.220.94/files/item/5c1a5ce171ca3d54cb4eaffd';
  is_logged_in=false;
  shop_name;

  constructor(
    private httpRequestService: HttpRequestService,
    private router: Router
  ) { }

  ngOnInit() {
    this.httpRequestService.get('/vendor_api/is_logged_in')
    .then(
      (response) => {
        if(response.toString()=='True')
          this.is_logged_in=true;
        else this.is_logged_in=false;
        // if(this.is_logged_in){
        //   this.httpRequestService.get_json('/vendor_api/profile')
        //   .then(
        //     (response)=>{
        //       this.photo=response['obj']['info']['photo']==undefined?
        //       'http://54.71.220.94/files/item/5c1a5ce171ca3d54cb4eaffd':response['obj']['info']['photo']}
        //   )
        //   .catch((error)=>console.log(error))
        // }
      }
    )
    .catch(
      (error) => console.log(error)
    );
  }
  logout(){
    this.httpRequestService.get('/vendor_api/logout')
    .then(
      ()=>this.router.navigate(['/login'])
    )
  }

}
