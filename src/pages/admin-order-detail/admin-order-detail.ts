import { AdminSwapProductPage } from './../admin-swap-product/admin-swap-product';
import { AdminEditProductPage } from './../admin-edit-product/admin-edit-product';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController } from 'ionic-angular';
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
  uploadData:any;
  enterFlag:boolean=false;

  constructor(public navCtrl: NavController,
    private provider: RemoteServiceProvider,
    private actionSheetCtrl:ActionSheetController,
    public modalCtrl: ModalController,
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

  editItem(item){
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Edit pesanan',
      buttons: [
        {
          text: 'Ganti harga dan ketersediaan barang',
          handler: () => {
            console.log('clicked');
            console.log(item);
            var myData = JSON.stringify({
              id_product: item.id_product});
            this.provider.getSpecificProduct(myData).toPromise().then(data=>{
              var dataGet=JSON.parse(data["_body"]);
              console.log('dapet prod');
              //console.log(dataGet[0]);
              this.navCtrl.push(AdminEditProductPage,{"data":dataGet[0]});
            }).catch(this.handleError);
          }
        },{
          text: 'Ganti produk',
          handler: () => {
            console.log('clicked');
            // var myData = JSON.stringify({
            //   id_product: item.id_product});
            // this.provider.getSpecificProduct(myData).toPromise().then(data=>{
            //   var dataGet=JSON.parse(data["_body"]);
            //   console.log('dapet prod');
              this.enterFlag=false;
              let swapProdModal = this.modalCtrl.create(AdminSwapProductPage, { enableBackdropDismiss: false });
              swapProdModal.present();
              swapProdModal.onDidDismiss(returnData=>{
                console.log("ondismiss");
                returnData.qty=1;
                returnData.id_customer=this.orderData.id_customer;
                returnData.id_order_detail=item.id_order_detail;
                var updateItem=this.listOrderDetail.find(data=> data.id_product==item.id_product);
                //console.log(updateItem);
                var index=this.listOrderDetail.indexOf(updateItem);
                //console.log(index);
                this.listOrderDetail.splice(index, 1);
                this.listOrderDetail.unshift(returnData);
                console.log(this.listOrderDetail);
                this.countTotalPrice(this.listOrderDetail);

                this.updateDaftarBarang(item, returnData);
              });
            // }).catch(this.handleError);
          }
        },{
          text: 'Batal',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  removeItem(item){
    console.log("rem");
    if(item.qty>0){
      item.qty--;
      this.countTotalPrice(this.listOrderDetail);
      this.updateDaftarBarang(item, item);
    }
  }

  addItem(item){
    console.log('add');
    item.qty++;
    this.countTotalPrice(this.listOrderDetail)
    this.updateDaftarBarang(item, item);
  }

  updateDaftarBarang(item, returnData){
    var myData = JSON.stringify({
      id_order_detail: item.id_order_detail,
      id_product: returnData.id_product,
      qty:returnData.qty
    });
    console.log(myData);
    this.provider.updateOrderDaftarBarang(myData).toPromise().then(data=>{
      //var dataGet=JSON.parse(data["_body"]);
      console.log('apdet barang');
      //console.log(data);

    }).catch(this.handleError);
  }

  updateOrder(myData){
    this.provider.updateOrder(myData).toPromise().then(data=>{}).catch(this.handleError);
    this.orderData.status='terkirim'
  }

  updateOrder1(myData){
    this.provider.updateOrder1(myData).toPromise().then(data=>{}).catch(this.handleError);
    this.orderData.status='gagal'
  }

  ionViewWillEnter() {
   if(this.enterFlag){
    this.provider.getTansactionOrderDetails(this.uploadData).toPromise().then((data)=>{
      this.listOrderDetail=JSON.parse(data["_body"]);
      if(this.orderData.status=='pending'){
        this.countTotalPrice(this.listOrderDetail);
      }
      //console.log(this.listOrderDetail);

    }).catch(error=>{
      console.error('An error occurred', error);
      console.log('error');
      console.log(error);
      alert("connection failed");
    });
   }
   else this.enterFlag=true;
   
  }

  ngOnInit(){
    this.orderData=this.navParams.get("orderData");
    this.uploadData= JSON.stringify({
      id_order: this.orderData.id_order
    });
    this.provider.getTansactionOrderDetails(this.uploadData).toPromise().then((data)=>{
      this.listOrderDetail=JSON.parse(data["_body"]);
      if(this.orderData.status=='pending'){
        //this.listOrderDetail=JSON.parse(data["_body"])
        this.countTotalPrice(JSON.parse(data["_body"]));
      }
      //console.log(this.listOrderDetail);

    }).catch(error=>{
      console.error('An error occurred', error);
      console.log('error');
      console.log(error);
      alert("connection failed");
    });
    
  }

  countTotalPrice(list){
    this.orderData.total_price=0;
    var itemCount=0;
    list.forEach(element => {
      this.orderData.total_price=this.orderData.total_price+(element.price*element.qty);
      itemCount=itemCount+element.qty;
    });
    console.log("tot price= "+this.orderData.total_price);
    console.log(list);
    var myData = JSON.stringify({
      id_order: this.orderData.id_order,
      total_price: this.orderData.total_price
    });
    console.log(myData);
    this.provider.updateOrderHargaTotal(myData).toPromise().then(data=>{
      //var dataGet=JSON.parse(data["_body"]);
      console.log('apdet tot');
      //console.log(data);

    }).catch(this.handleError);
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
