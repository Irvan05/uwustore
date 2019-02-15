import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserOrderDetailPage } from './user-order-detail';

@NgModule({
  declarations: [
    UserOrderDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(UserOrderDetailPage),
  ],
})
export class UserOrderDetailPageModule {}
