import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HttpRequestService } from '../../service/http-request.service'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  pwd: string;

  usr_re = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/);
  pwd_re = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/);
  err_msg = [];

  constructor(
    private router: Router,
    private httpRequestService: HttpRequestService
  ) { }

  ngOnInit() {
    this.httpRequestService.get('/vendor_api/is_logged_in')
    .then(
      (response) => {
        if(response.toString()=='True')
          this.router.navigate(['/userpage'])
      }
    )
    .catch(
      (error) => console.log(error)
    );
  }
  submit(){
    this.err_msg=[];
    let valid=true;
    if(!this.usr_re.test(this.username)){
      this.err_msg.push("帳號格式錯誤");
      valid=false;
    }
    if(!this.pwd_re.test(this.pwd)){
      this.err_msg.push("密碼格式錯誤");
      valid=false;
    }
    if(!valid)window.scroll(0,0);
    else{
      let b={username:this.username,password:this.pwd}
      this.httpRequestService.post('/vendor_api/login',b)
      .then(
        (response)=>{
          console.log(response)
          if(response.toString()=='Invalid username or password'){
            this.err_msg.push('帳號或密碼錯誤');
            window.scroll(0,0);
          }
          if(response.toString()=='success')
            this.router.navigate(['/userpage'])
        }
      )
      .catch(
        (error)=>console.log(error)
      )
    }
  }

}
