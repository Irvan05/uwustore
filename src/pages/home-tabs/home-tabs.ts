import { BackgroundMode } from '@ionic-native/background-mode';
import { AdminOrderListPage } from './../admin-order-list/admin-order-list';
import { ProfilePage } from './../profile/profile';
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { RemoteServiceProvider } from '../../providers/remote-service/remote-service';

/**
 * Generated class for the HomeTabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-tabs',
  templateUrl: 'home-tabs.html',
  providers:[RemoteServiceProvider]
})
export class HomeTabsPage {
  homePage:any=HomePage;
  profilePage=ProfilePage;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private provider:RemoteServiceProvider,
    private backgroundMode: BackgroundMode,
    private platform: Platform) {
    // this.platform.ready().then((result) => {
    //   this.platform.registerBackButtonAction(fn=>{
    //     console.log("back pressed");
    //     this.backgroundMode.moveToBackground();
    //   });
      
    // }).catch((err) => {
      
    // });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeTabsPage');
    this.provider.checkLogin().then((res:any) => {
      console.log("return provider");
      console.log(res);
      if(res=="admin"){
        this.homePage=AdminOrderListPage;
        //this.navCtrl.parent.select(0); 
        //this.navCtrl.setRoot(AdminOrderListPage);
      }else{
        this.homePage=HomePage;
      }
    }).catch((err) => {
      console.log("error"+err);
    });
  }

  homeRefresh(){
    
  }

}
