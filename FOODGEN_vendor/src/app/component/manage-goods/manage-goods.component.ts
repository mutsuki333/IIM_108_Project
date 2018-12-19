import { Component, OnInit } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';
import { Router } from '@angular/router';

import { HttpRequestService } from '../../service/http-request.service'


export interface Option {
  name: string;
}

@Component({
  selector: 'app-manage-goods',
  templateUrl: './manage-goods.component.html',
  styleUrls: ['./manage-goods.component.css']
})
export class ManageGoodsComponent implements OnInit {
  selected;
  history;
  item;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  options: Option[] = [

  ];

  category_name;
  new_cat;
  del_cat='';
  check_del=false;
  err_msg = [];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.options.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(option: Option): void {
    const index = this.options.indexOf(option);

    if (index >= 0) {
      this.options.splice(index, 1);
    }
  }

  constructor(
    private router: Router,
    private httpRequestService: HttpRequestService
  ) { }

  ngOnInit() {
    this.check_del=false;
    this.httpRequestService.get_json('/vendor_api/item_list')
    .then(
      (response)=>{
        console.log(response);
        this.category_name=response;
      }
    )
    .catch((error)=>{
      this.router.navigate(['/login']);
      console.log(error)})
  }

  NewCat(){
    this.err_msg=[];
    if(this.new_cat===undefined || this.new_cat=='')return
    this.httpRequestService.get('/vendor_api/new_category/'+this.new_cat)
    .then(
      (response)=>{
        this.ngOnInit()
        if(response.toString()!='new category added')
          this.err_msg.push(response.toString())
      }
    )
    .catch(
      (error)=>console.log(error)
    )
  }
  DelCat(){
    this.err_msg=[];
    if(this.del_cat===undefined||this.del_cat=='')return
    this.httpRequestService.get('/vendor_api/delete_category/'+this.del_cat)
    .then(
      (response)=>{
        this.ngOnInit()
        if(response.toString()!='category deleted')
          this.err_msg.push(response.toString())
      }
    )
    .catch(
      (error)=>console.log(error)
    )

  }

}
