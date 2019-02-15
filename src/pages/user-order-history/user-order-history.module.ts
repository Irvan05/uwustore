import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserOrderHistoryPage } from './user-order-history';

@NgModule({
  declarations: [
    UserOrderHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(UserOrderHistoryPage),
  ],
})
export class UserOrderHistoryPageModule {}
