import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import {MatButtonModule, MatExpansionModule, MatBottomSheetModule, MatDialogModule, MatChipsModule, MatDatepickerModule, MatSelectModule, MatNativeDateModule, MatTableModule, MatStepperModule, MatGridListModule, MatTabsModule, MatCardModule, MatCheckboxModule,MatToolbarModule,MatSidenavModule, MatIconModule, MatListModule, MatInputModule} from '@angular/material';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NavigationComponent } from './component/navigation/navigation.component';
import { CheckoutComponent } from './component/checkout/checkout.component';
import { HomeComponent } from './component/home/home.component';
import { UserpageComponent, EditUserInfo } from './component/userpage/userpage.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';

import { HttpRequestService } from "./service/http-request.service";
import { TestComponent } from './component/test/test.component';
import { UserOrderComponent } from './component/user-order/user-order.component';
import { NotFoundComponent } from './component/not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    CheckoutComponent,
    HomeComponent,
    UserpageComponent, EditUserInfo,
    LoginComponent,
    RegisterComponent,
    TestComponent,
    UserOrderComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,FormsModule, ReactiveFormsModule,
    CdkTableModule, CdkTreeModule, DragDropModule, ScrollingModule,
    MatButtonModule, MatBottomSheetModule, MatExpansionModule, MatChipsModule, MatDialogModule, MatNativeDateModule, MatDatepickerModule, MatSelectModule, MatTableModule, MatStepperModule, MatGridListModule, MatTabsModule, MatCardModule, MatCheckboxModule,MatToolbarModule,MatSidenavModule, MatIconModule, MatListModule, MatInputModule
  ],
  entryComponents: [UserpageComponent, EditUserInfo],
  providers: [HttpRequestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
