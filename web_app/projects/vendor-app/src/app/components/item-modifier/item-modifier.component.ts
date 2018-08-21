import { Component, OnInit } from '@angular/core';

import { VendorItemControlService } from '../../service/vendor-item-control.service'

@Component({
  selector: 'app-item-modifier',
  templateUrl: './item-modifier.component.html',
  styleUrls: ['./item-modifier.component.css']
})
export class ItemModifierComponent implements OnInit {

  constructor(
    private vendorItemControlService:VendorItemControlService) { }

  ngOnInit() {
    this.vendorItemControlService.getItems();
  }

}
