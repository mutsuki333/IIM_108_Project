import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {
  sec:number;
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.sec = 5;
    window.setInterval(()=>{
      this.sec -= 1;
      if (this.sec<=0)this.router.navigate(['/home'])
    },1000)
  }

  ToHome(){
    this.router.navigate(['/home']);
  }

}
