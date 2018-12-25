import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HttpRequestService } from '../../service/http-request.service'
import { Totop } from '../../animation'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  phone: string;
  first_name: string='';
  last_name: string='';
  username: string;
  email: string;
  pwd: string;
  pwd_2: string;

  usr_re = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/);
  email_re = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  mobile_re = new RegExp('09{1}[0-9]{8}');
  pwd_re = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/);

  err_msg = [];
  submit_obj:Object;

  constructor(
    private router: Router,
    private httpRequestService: HttpRequestService
  ) { }

  ngOnInit() {
    this.httpRequestService.get('/customer_api/is_logged_in')
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
    if(this.last_name == ''){
      this.err_msg.push("請輸入姓")
      valid=false;
    }
    if(this.first_name == ''){
      this.err_msg.push("請輸入名")
      valid=false;
    }
    if(!this.usr_re.test(this.username)){
      this.err_msg.push("帳號格式錯誤");
      valid=false;
    }
    if (!this.mobile_re.test(this.phone)){
      this.err_msg.push("手機號碼錯誤");
      valid=false;
    }
    if(!this.email_re.test(this.email)){
      this.err_msg.push("email 錯誤");
      valid=false;
    }
    if(!this.pwd_re.test(this.pwd)){
      this.err_msg.push("密碼錯誤");
      valid=false;
    }
    if(this.pwd!=this.pwd_2){
      this.err_msg.push("確認密碼錯誤");
      valid=false;
    }

    if(!valid)Totop();
    else {
      let b = {
        username:this.username,
        password:this.pwd,
        mobile:this.phone,
        first_name:this.first_name,
        last_name:this.last_name,
        email:this.email,
      }
      this.httpRequestService.post('/customer_api/register',b)
      .then(
        (response) => {
          if(response.toString()=='success')
            this.router.navigate(['/login'])
          if(response.toString()=='Please use a different username.'){
            this.err_msg.push('請使用不同的帳號');
            Totop();
          }
          if(response.toString()=='is logged in')
            this.router.navigate(['/userpage'])

        }
      )
      .catch(
        (error) => console.log(error)
      );
    }
  }

}
