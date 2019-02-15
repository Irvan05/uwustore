import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BrowseProductPage } from './browse-product';

@NgModule({
  declarations: [
    BrowseProductPage,
  ],
  imports: [
    IonicPageModule.forChild(BrowseProductPage),
  ],
})
export class BrowseProductPageModule {}
