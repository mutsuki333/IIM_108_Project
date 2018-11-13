import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { FlexLayoutModule } from "@angular/flex-layout";

import { HttpClientModule } from '@angular/common/http';

import { MatModule } from "./mat/mat.module";

import { AppComponent } from './app.component';
import { ItemModifierComponent } from './components/item-modifier/item-modifier.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';

import { HttpRequestService } from "./service/http-request.service";
import { AppRoutingModule } from './/app-routing.module';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    ItemModifierComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    MatModule,
    // FlexLayoutModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [HttpRequestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
