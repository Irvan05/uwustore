import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TambahProdukPage } from './tambah-produk';

@NgModule({
  declarations: [
    TambahProdukPage,
  ],
  imports: [
    IonicPageModule.forChild(TambahProdukPage),
  ],
})
export class TambahProdukPageModule {}
