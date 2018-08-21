import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from "@angular/flex-layout";

import { MatModule } from "./mat/mat.module";

import { AppComponent } from './app.component';
import { ItemModifierComponent } from './components/item-modifier/item-modifier.component';


@NgModule({
  declarations: [
    AppComponent,
    ItemModifierComponent
  ],
  imports: [
    BrowserModule,
    MatModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
