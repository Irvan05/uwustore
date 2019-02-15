import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProdukDetailPage } from './produk-detail';

@NgModule({
  declarations: [
    ProdukDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ProdukDetailPage),
  ],
})
export class ProdukDetailPageModule {}
