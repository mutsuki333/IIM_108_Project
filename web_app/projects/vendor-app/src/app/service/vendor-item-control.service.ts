import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import {map} from 'rxjs/operators';

import {host} from '../conf'
import {VendorItem} from "../class/vendor-item";


interface Items {
    items:VendorItem[]
}
interface itemList {
    list:Items[]
}

@Injectable({
  providedIn: 'root'
})
export class VendorItemControlService {
  str:string;

  constructor(private http:HttpClient) { }

  getItems(): Observable<itemList>{
    this.http.get(host+'/site_api/item_list/sdf')
    .subscribe((res:Response) => console.log(res));
    return;
  }

}
