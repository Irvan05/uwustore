
import { RemoteServiceProvider } from './../providers/remote-service/remote-service';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SQLite } from '@ionic-native/sqlite';
import { HttpModule } from '@angular/http';
import { HttpClientModule} from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Crop } from '@ionic-native/crop';
//import { ImageCropperModule } from "ng2-img-cropper/index";
import { Base64 } from '@ionic-native/base64';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BackgroundMode } from '@ionic-native/background-mode';



import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ProfilePage } from './../pages/profile/profile';
import { HomeTabsPage } from './../pages/home-tabs/home-tabs';
import { ProdukDetailPage } from '../pages/produk-detail/produk-detail';
import { RegisterPage } from '../pages/register/register';
import { TambahProdukPage } from '../pages/tambah-produk/tambah-produk';
import { CartModalPage } from './../pages/cart-modal/cart-modal';
import { EditPhotoPage } from './../pages/edit-photo/edit-photo';
import { UserOrderHistoryPage } from '../pages/user-order-history/user-order-history';
import { AdminOrderListPage } from './../pages/admin-order-list/admin-order-list';
import { DummyPage } from './../pages/dummy/dummy';
import { RatingPage } from '../pages/rating/rating';
import { EditUserProfilePage } from './../pages/edit-user-profile/edit-user-profile';
import { BrowseProductPage } from './../pages/browse-product/browse-product';
import { AdminListProductPage } from './../pages/admin-list-product/admin-list-product';
import { AdminEditProductPage } from './../pages/admin-edit-product/admin-edit-product';
import { AdminOrderDetailPage } from '../pages/admin-order-detail/admin-order-detail';
import { UserOrderDetailPage } from './../pages/user-order-detail/user-order-detail';
import { AboutAppPage } from './../pages/about-app/about-app';
import { AdminSwapProductPage } from './../pages/admin-swap-product/admin-swap-product';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ProfilePage,
    ProdukDetailPage,
    HomeTabsPage,
    RegisterPage,
    TambahProdukPage,
    EditPhotoPage,
    CartModalPage,
    AdminOrderListPage,
    UserOrderHistoryPage,
    DummyPage,
    RatingPage,
    EditUserProfilePage,
    BrowseProductPage,
    AdminListProductPage,
    AdminEditProductPage,
    AdminOrderDetailPage,
    UserOrderDetailPage,
    AboutAppPage,
    AdminSwapProductPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicModule,
    HttpModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    IonicStorageModule,
    AngularCropperjsModule,
    
    // StarRatingModule
    //ImageCropperModule
  ],
  exports:[
  ]
  ,
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ProfilePage,
    ProdukDetailPage,
    HomeTabsPage,
    RegisterPage,
    TambahProdukPage,
    EditPhotoPage,
    CartModalPage,
    AdminOrderListPage,
    UserOrderHistoryPage,
    DummyPage,
    RatingPage,
    EditUserProfilePage,
    BrowseProductPage,
    AdminListProductPage,
    AdminEditProductPage,
    AdminOrderDetailPage,
    UserOrderDetailPage,
    AboutAppPage,
    AdminSwapProductPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    Camera,
    FileTransfer,
    Crop,
    Base64,
    {provide: ErrorHandler, useClass: IonicErrorHandler}, 
    IonicStorageModule,
    RemoteServiceProvider, 
    LocalNotifications,
    BackgroundMode
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
