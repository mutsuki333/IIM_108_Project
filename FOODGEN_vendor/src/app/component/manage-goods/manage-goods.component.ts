import { Component, OnInit } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';
import { Router } from '@angular/router';

import { HttpRequestService } from '../../service/http-request.service'


export interface Option {
  name: string;
}
export interface Item {
  name?: string;
  description?: string;
  pic?: string;
  base_price?: number;
  ctr?: number;
  attribute?: Array<string>;
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
  update_err_msg = [];
  cats=[];
  item_tmp:Item={}
  imgID=null;
  isNewItem:boolean;
  index_tmp:number;
  selectedFile: File;

  onFileChanged(event) {
    if(this.imgID !=null)this.httpRequestService.get('/files/delete/users/'+this.imgID);
    this.selectedFile = event.target.files[0]
    const uploadData = new FormData();
    uploadData.append('file', this.selectedFile, this.selectedFile.name);
    this.httpRequestService.postFile('/files/upload?base=item&filename=test.jpg', uploadData)
    .then(
      (response) => {
        console.log(response);
        let tmp:string = String(response);
        // this.item_tmp.pic='http://54.71.220.94'+tmp;
        this.item_tmp.pic='http://0.0.0.0:5000'+tmp;
        this.imgID=tmp.split('/')[3];
        console.log(this.imgID);
      }
    )
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      for (let key in this.options) {
          if(this.options[key].name==value.trim()){
            input.value = '';
            this.update_err_msg.push('屬性重複')
            setTimeout(()=>{this.update_err_msg=[]},1000)
            return;
          }
      }
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
    this.isNewItem=false;
    this.item_tmp={};
    this.httpRequestService.get_json('/vendor_api/item_list')
    .then(
      (response)=>{
        // console.log(response);
        this.category_name=response;
        for (let cat of response) {
            this.cats.push(cat.category_name)
        }
        // console.log(this.cats)
      }
    )
    .catch((error)=>{
      this.router.navigate(['/login']);
      console.log(error)})
  }
  updateItem(goodsOnShelf:any){
    console.log(this.isNewItem)
    let valid = true;
    if(this.item_tmp.name==''||this.item_tmp.name==undefined){
      this.update_err_msg.push('請輸入名稱')
      valid=false;
    }
    if(this.item_tmp.base_price==0||this.item_tmp.base_price==undefined){
      this.update_err_msg.push('請輸入價錢')
      valid=false;
    }
    if(this.selected==undefined){
      this.update_err_msg.push('請選擇分類')
      valid=false;
    }
    if(valid){
      if(this.isNewItem){
        this.item_tmp.ctr=0;
        this.item_tmp.attribute=[];
        for (let i in this.options) {
          this.item_tmp.attribute.push(this.options[i].name)
        }
      }
      let url=this.isNewItem?'/vendor_api/update_items/'+this.selected:'/vendor_api/update_items/'+this.selected+'/'+this.index_tmp
      this.httpRequestService.post(url,this.item_tmp)
      .then(
        (response)=>{
          console.log(response)
          if(response.toString()=='success'){
            this.ngOnInit();
            goodsOnShelf.close()
          }
          else this.update_err_msg.push(response.toString())
        }
      )
      .catch(
        (error)=>console.log(error)
      )
    }
    setTimeout(()=>{this.update_err_msg=[]},1000)

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
  setItem_tmp(item:any){
    if(item===undefined){
      this.item_tmp={};
      this.options=[]
      this.selected=undefined;
      return;
    }
    this.item_tmp.name=item.name;
    this.item_tmp.base_price=item.base_price;
    this.item_tmp.pic=item.pic;
    this.item_tmp.ctr=item.ctr;
    this.item_tmp.description=item.description;
    for (let key in item.attribute) {
      this.options.push({name:item.attribute[key]})
    }
    console.log(item)
  }
  DelItem(cat:string,item:string){
    // console.log('/vendor_api/delete_items/'+cat+'/'+item)
    this.httpRequestService.get('/vendor_api/delete_items/'+cat+'/'+item)
    .then(
      (response)=>{
        if(response.toString()=='success')this.ngOnInit();
        else {
          this.err_msg.push(response.toString())
          setTimeout(()=>{this.err_msg=[]},1000)
        }

      }
    )
    .catch(
      (error)=>console.log(error)
    )
  }

}
