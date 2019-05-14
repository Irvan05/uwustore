import { AdminOrderDetailPage } from './../admin-order-detail/admin-order-detail';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform, AlertController } from 'ionic-angular';
import { RemoteServiceProvider } from '../../providers/remote-service/remote-service';
import { Observable } from 'rxjs';

/**
 * Generated class for the AdminOrderListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin-order-list',
  templateUrl: 'admin-order-list.html',
  providers:[RemoteServiceProvider]
})
export class AdminOrderListPage {
  listOrder:Array<any>;
  listOrderCustom:Array<any>;
  isCustomListHidden:boolean;
  isDefaultListHidden:boolean;

  orderCount:number=0;
  timer:any;
  timer2:any;
  subscription:any;
  loginState:string="admin";

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private provider: RemoteServiceProvider,
    public actionSheetCtrl: ActionSheetController,
    private platform: Platform,
    private localNotifications: LocalNotifications,
    private backgroundMode: BackgroundMode,
    private alertCtrl:AlertController,
    public cdr: ChangeDetectorRef) {
    this.listOrderCustom=new Array<any>({
      "id_order":"",
      "id_customer":"",
      "order_date":"",
      "total_price":"",
      "status":"",
      "payment":"",
      "name":""
    });
    this.isCustomListHidden=true;    
    this.isDefaultListHidden=false;  
    this.platform.registerBackButtonAction(fn=>{
      console.log("back pressed");
      this.backgroundMode.moveToBackground();
    });
    this.platform.ready().then((result) => {
      console.log("ready");
      this.backgroundMode.enable();
      this.timerLoop();
      //HANDLER KALO NOTIF DI KLIK
      this.localNotifications.on('click').subscribe(notif=>{
        var buyer =notif.data;
        // console.log("1");
         //console.log(buyer.data);
         this.openOrderDetailPage(buyer);
        // console.log("2");
         //console.log(notif.data.data);
        // var alertc=this.alertCtrl.create({
        //   title:notif.title,
        //   subTitle:buyer.nama
        // });
        // alertc.present();
      });
    }).catch((err) => {
      console.log("error "+err);
    });
  }

  timerLoop(){
    console.log("masuk timer loop");
    this.timer = Observable.timer(0, 30000);
    this.subscription=this.timer.subscribe(t => { 
      //this.ticks = t; 
      //console.log(t);
      //console.log("tick");
      if(this.backgroundMode.isActive()){
        console.log("in background mode");
        //this.pushBackgroundAdminOnly();
        this.checkLoginStat();
      }else{
        this.pushBackgroundAdminOnly();
      }
      //this.cd.detectChanges(); // Invoke the change detector
    });
    // this.timer2 = Observable.timer(0, 120000);
    // this.subscription=this.timer.subscribe(t => { 
    //   this.provider.checkUpdateTeros().toPromise().then((result) => {
    //     console.log("update rating teros");
    //   }).catch((err) => {
        
    //   });
    // });
  }

  pushBackgroundAdminOnly(){
    this.provider.adminOrderList().toPromise().then((data)=>{
      this.listOrder=JSON.parse(data["_body"]);
      console.log("get dummy");
      //console.log(this.listOrder);
      if(this.orderCount>0&&this.orderCount<this.listOrder.length){
        this.orderCount=this.listOrder.length;
        this.sendNotif(this.listOrder[0]);
      }else{
        this.orderCount=this.listOrder.length;
      }
      

      //this.listOrderCustom=this.listOrder;
    }).catch(error=>{
      console.error('An error occurred', error);
      console.log('error');
      console.log(error);
      //alert("connection failed");
      //this.loading.dismiss();
    });
  }

  sendNotif(lastPosData){
    //var date=new Date();
    //console.log(lastPosData.data);
    this.localNotifications.schedule({
      id:1,
      title:'Pesanan Masuk',
      text: lastPosData.name,
      data: lastPosData
    });
    console.log("notif sent");
  }

  checkLoginStat(){
    this.provider.checkLogin().then((res:any) => {
      // console.log("return provider");
      // console.log(res);
      this.loginState=res;
      // console.log('Your type is', this.loginState);
      if(this.loginState=="admin"){
        this.pushBackgroundAdminOnly();
      }
      else{
        this.subscription.unsubscribe();
      }
    }).catch((err) => {
      console.log("error"+err);
    });
  }

  ngOnInit(){
    // this.provider.adminOrderList().toPromise().then((data)=>{
    //   this.listOrder=JSON.parse(data["_body"]);
    //   //this.listOrderCustom=this.listOrder;
    // }).catch(this.handleError);
    /*
    ,
    (error: any) => {
        console.log('error');
        console.log(error);
        alert('Connection failed');
    }
    */
   console.log("asdasdsad");

    this.pushBackgroundAdminOnly();

  }

  
  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminOrderListPage');
  }

  cardOption(item){
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Ganti status pesanan',
      buttons: [
        {
          text: 'Sudah dikirim',
          handler: () => {
            console.log('Sudah dikirim clicked');
            var myData = JSON.stringify({
              id_order: item.id_order});
            //console.log("isi data post:");
            //console.log(myData);
            this.updateOrder(myData);
          }
        },{
          text: 'Barang Habis',
          handler: () => {
            console.log('Terima clicked');
            var myData = JSON.stringify({
              id_order: item.id_order});
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
    setTimeout(() => {
      console.log('Async operation has ended');
      this.pushBackgroundAdminOnly();
    }, 2000);
    //this.pushBackgroundAdminOnly();
    //var send=this.provider.updateOrder1(myData).toPromise();

  }

  updateOrder1(myData){
    this.provider.updateOrder1(myData).toPromise().then(data=>{}).catch(this.handleError);
    setTimeout(() => {
      console.log('Async operation has ended');
      this.pushBackgroundAdminOnly();
    }, 2000);
    //this.pushBackgroundAdminOnly();
    //var send=this.provider.updateOrder1(myData).toPromise();

  }
  
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    //this.cdr.detectChanges();
    setTimeout(() => {
      console.log('Async operation has ended');
      this.pushBackgroundAdminOnly();
      refresher.complete();
    }, 2000);
  }

  orderCustom(){
    
    if(this.isCustomListHidden){
      console.log("jadi custom");
      this.isCustomListHidden=false;
      this.isDefaultListHidden=true;  
      this.pushBackgroundAdminOnly();
    }else this.cancelCustom();
    // this.listOrderCustom=new Array<any>();
    // this.listOrder.forEach(element => {
    //   if(element.name=="agu"){
    //     this.listOrderCustom.push(element);
    //   }
    // });
    // console.log("isi list: ");
    // console.log(this.listOrderCustom);
    // this.isCustomListHidden=false;
    // this.isDefaultListHidden=true; 
    //this.cdr.detectChanges(); 
  }

  cancelCustom(){
    console.log("jadi default");
    this.isCustomListHidden=true;
    this.isDefaultListHidden=false; 
    this.pushBackgroundAdminOnly();
    //this.cdr.detectChanges(); 
  }

  openOrderDetailPage(orderData){
    this.navCtrl.push(AdminOrderDetailPage,{"orderData": orderData});  
  }

  updateUI(){
    
  }

  private handleError(error: any) {
    console.log('error');
    console.log(error);
    alert('Connection failed');
  }

}
