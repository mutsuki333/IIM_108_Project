import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component'
// import { HomeComponent } from './component/home/home.component'
import { UserpageComponent } from './component/userpage/userpage.component'
// import { UserOrderComponent } from './component/user-order/user-order.component'
import { NotFoundComponent } from './component/not-found/not-found.component'
import { ManageGoodsComponent } from './component/manage-goods/manage-goods.component'
import { ManageOrderComponent } from './component/manage-order/manage-order.component'
import { ManageAnnouncementComponent } from './component/manage-announcement/manage-announcement.component'

import { TestComponent } from './component/test/test.component'

const routes: Routes = [
  { path: '', redirectTo: '/manage-goods', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: UserpageComponent },
  { path: 'userpage', component: UserpageComponent },
  { path: 'manage-order', component: ManageOrderComponent },
  { path: 'manage-goods', component: ManageGoodsComponent },
  { path: 'manage-announcement', component: ManageAnnouncementComponent },
  { path: '404', component: NotFoundComponent},
  { path: '**', redirectTo: '/404'},
  { path: 'test', component: TestComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
