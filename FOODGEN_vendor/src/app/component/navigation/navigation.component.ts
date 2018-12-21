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
  constructor(
    private httpRequestService: HttpRequestService,
    private router: Router
  ) { }

  ngOnInit() {
  }
  logout(){
    this.httpRequestService.get('/vendor_api/logout')
    .then(
      ()=>this.router.navigate(['/login'])
    )
  }

}
