import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminOrderListPage } from './admin-order-list';

@NgModule({
  declarations: [
    AdminOrderListPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminOrderListPage),
  ],
})
export class AdminOrderListPageModule {}
