import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RemoteServiceProvider } from '../../providers/remote-service/remote-service';

/**
 * Generated class for the UserOrderDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-order-detail',
  templateUrl: 'user-order-detail.html',
  providers:[RemoteServiceProvider]
})
export class UserOrderDetailPage {
  listOrderDetail:any;
  orderData:any;
  imageBasepath:string;

  constructor(public navCtrl: NavController, 
    private provider: RemoteServiceProvider,
    public navParams: NavParams) {
    this.imageBasepath=provider.getImageBasepath();
  }

  ngOnInit(){
    this.orderData=this.navParams.get("orderData");
    var uploadData= JSON.stringify({
      id_order: this.orderData.id_order
    });
    this.provider.getTansactionOrderDetails(uploadData).toPromise().then((data)=>{
      this.listOrderDetail=JSON.parse(data["_body"]);
      // console.log("list order detail");
      // console.log(this.listOrderDetail);

    }).catch(error=>{
      console.error('An error occurred', error);
      console.log('error');
      console.log(error);
      alert("connection failed");
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserOrderDetailPage');
  }

}
