import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController } from 'ionic-angular';
import { RemoteServiceProvider } from '../../providers/remote-service/remote-service';
import { RatingPage } from '../rating/rating';
import { UserOrderDetailPage } from '../user-order-detail/user-order-detail';


/**
 * Generated class for the UserOrderHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-order-history',
  templateUrl: 'user-order-history.html',
  providers:[RemoteServiceProvider]
})
export class UserOrderHistoryPage {
  listOrder:Array<any>;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private provider: RemoteServiceProvider,
    public actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    public storage: Storage) {

  }

  openRatingPage(item){
    var ratingModal = this.modalCtrl.create(RatingPage, { orderData: item});
    ratingModal.present();
    ratingModal.onDidDismiss(returnData=>{
      //console.log("modal data="+returnData);
      //this.loading.dismiss();
      //this.image=returnData;
    });
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    //this.cdr.detectChanges();
    setTimeout(() => {
      console.log('Async operation has ended');
      this.getUserOrders();
      refresher.complete();
    }, 2000);
  }

  openUserOrderDetailPage(orderData){
    console.log('buka order detail user');
    this.navCtrl.push(UserOrderDetailPage,{"orderData": orderData});  
  }

  ngOnInit(){
    this.getUserOrders();
  }

  getUserOrders(){
    this.storage.get('userData').then((val) => {
      // console.log("all userData: ");
      // console.log(val);
      console.log('Your name is', val.name);
      var myData=JSON.stringify({
        id_customer:val.id_customer
      });
      
      this.provider.userOrderList(myData).toPromise().then((data:any)=>{
        if(data["_body"]=='failed'){
          // console.log(data);
        }else
        this.listOrder=JSON.parse(data["_body"]);
        //this.listOrderCustom=this.listOrder;
      }).catch(this.handleError);

    }),(err)=>{
      alert("belum login");
    };
  }

  private handleError(error: any) {
    console.log('error');
    console.log(error);
    alert('Connection failed');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserOrderHistoryPage');
  }

}
