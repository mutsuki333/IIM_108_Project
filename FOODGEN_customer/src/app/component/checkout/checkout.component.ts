import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource, MatCheckboxModule} from '@angular/material';
import {MAT_STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { Router } from '@angular/router';

import { HttpRequestService } from '../../service/http-request.service'

export interface Bill {
  name: string;
  price: number;
}


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  providers: [{
    provide: MAT_STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})
export class CheckoutComponent implements OnInit {
  selected;
  payment;
  items;
  time;
  amount=0;

  ELEMENT_DATA: Bill[] = [];

  displayedColumns: string[] = [ 'name', 'price'];
  dataSource = new MatTableDataSource<Bill>(this.ELEMENT_DATA);
  selection = new SelectionModel<Bill>(true, []);

  isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }

  masterToggle() {
    this.isAllSelected() ?
    this.selection.clear() :
    this.dataSource.data.forEach(row => this.selection.select(row));
    }

  secondFormGroup: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private httpRequestService: HttpRequestService,
    private router: Router
  ) {}

  ngOnInit() {
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.httpRequestService.get_json('/customer_api/cart')
    .then((response)=>{
      this.items=response;
      // console.log(this.items)
      for (let item of this.items) {
        this.ELEMENT_DATA.push({
          name:item.item.name,
          price:item.item.base_price
        })
        this.amount+=item.item.base_price;
      }
      console.log(this.ELEMENT_DATA)
      this.dataSource = new MatTableDataSource<Bill>(this.ELEMENT_DATA);
    })
  }
  send(){
    console.log(this.time)
    this.httpRequestService.get('/customer_api/check/'+this.time)
    .then((response)=>{
      if(response.toString()=='success')this.router.navigate(['/manage-order'])
      else alert(response.toString())
    })
    .catch((error)=>console.log(error)
  )}

}
