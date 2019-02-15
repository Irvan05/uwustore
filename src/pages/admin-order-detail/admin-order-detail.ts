import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { RemoteServiceProvider } from '../../providers/remote-service/remote-service';

/**
 * Generated class for the AdminOrderDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin-order-detail',
  templateUrl: 'admin-order-detail.html',
  providers:[RemoteServiceProvider]
})
export class AdminOrderDetailPage {
  listOrderDetail:any;
  orderData:any;
  imageBasepath:string;
  constructor(public navCtrl: NavController,
    private provider: RemoteServiceProvider,
    private actionSheetCtrl:ActionSheetController,
    public navParams: NavParams) {
      this.imageBasepath=provider.getImageBasepath();
  }

  tanggapiClick(){
    console.log("option bayar keluar");
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Ganti status pesanan',
      buttons: [
        {
          text: 'Sudah dikirim',
          handler: () => {
            console.log('Sudah dikirim clicked');
            var myData = JSON.stringify({
              id_order: this.orderData.id_order});
            //console.log("isi data post:");
            //console.log(myData);
            this.updateOrder(myData);
          }
        },{
          text: 'Barang Habis',
          handler: () => {
            console.log('Terima clicked');
            var myData = JSON.stringify({
              id_order: this.orderData.id_order});
            this.updateOrder1(myData);
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  updateOrder(myData){
    this.provider.updateOrder(myData).toPromise().then(data=>{}).catch(this.handleError);
    this.orderData.status='terkirim'
  }

  updateOrder1(myData){
    this.provider.updateOrder1(myData).toPromise().then(data=>{}).catch(this.handleError);
    this.orderData.status='gagal'
  }

  ngOnInit(){
    this.orderData=this.navParams.get("orderData");
    var uploadData= JSON.stringify({
      id_order: this.orderData.id_order
    });
    this.provider.getTansactionOrderDetails(uploadData).toPromise().then((data)=>{
      this.listOrderDetail=JSON.parse(data["_body"]);
      //console.log(this.listOrderDetail);

    }).catch(error=>{
      console.error('An error occurred', error);
      console.log('error');
      console.log(error);
      alert("connection failed");
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminOrderDetailPage');
  }

  private handleError(error: any) {
    console.log('error');
    console.log(error);
    alert('Connection failed');
  }

}
