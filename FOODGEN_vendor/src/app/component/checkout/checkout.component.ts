import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource, MatCheckboxModule} from '@angular/material';
import {MAT_STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

export interface Bill {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

const ELEMENT_DATA: Bill[] = [
  {quantity: 1, name: '品項1', price: 100, total: 100},
  {quantity: 2, name: '品項2', price: 200, total: 100},
  {quantity: 3, name: '品項3', price: 300, total: 100},
  {quantity: 4, name: '品項4', price: 400, total: 100},
  {quantity: 5, name: '品項5', price: 500, total: 100},
];

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

  displayedColumns: string[] = [ 'name', 'price','quantity', 'total'];
  dataSource = new MatTableDataSource<Bill>(ELEMENT_DATA);
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

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

}
