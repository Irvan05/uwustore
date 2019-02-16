import { BrowseProductPage } from './../browse-product/browse-product';
import { DummyPage } from './../dummy/dummy';
import { AdminOrderListPage } from './../admin-order-list/admin-order-list';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Storage } from '@ionic/storage';
import { ProdukDetailPage } from './../produk-detail/produk-detail';
import { Component } from '@angular/core';
import { NavController, App, ModalController, Platform, AlertController } from 'ionic-angular';
import { CartModalPage } from './../cart-modal/cart-modal';
import { RemoteServiceProvider } from '../../providers/remote-service/remote-service';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Observable } from 'rxjs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [RemoteServiceProvider, LocalNotifications, BackgroundMode]
})
export class HomePage {
  searchBox : String = "";
  belumLogin:string="true";
  //link: string="http://192.168.0.100:8080/warmat/uploads/";
  listCards:Array<{id_product:number, name:string, price:number, description:string, category:string, stock:number, photo:string, cart_count:number}>=[] ;
  listAllItemCards:Array<{id_product:number, name:string, price:number, description:string, category:string, stock:number, photo:string, cart_count:number}>=[] ;
  itemCount:number;
  // listItemCart:Array<{id_product:number, name:string, price:number, description:string, category:string, stock:number, photo:string, cart_count:number}>=[];
  listItemCart:any;
  //listOrder:Array<any>;
  //orderCount:number=0;
  returnDataPop:any;
  imageBasepath:string;

  myCallbackFunction = (_params1, _params2) => {
    return new Promise((resolve, reject) => {
        this.listItemCart = _params1;
        this.itemCount=_params2;
        //console.log("balik ke main page: "+_params2);
        //console.log(this.returnDataPop);
        resolve();
    });
  }

  constructor(public navCtrl: NavController,
   public app: App,
   private storage: Storage,
   public modalCtrl: ModalController,
   private provider: RemoteServiceProvider,
   private localNotifications: LocalNotifications,
   private platform: Platform,
   private alertCtrl:AlertController,
   private backgroundMode: BackgroundMode) {
    this.itemCount=0;
    this.imageBasepath=this.provider.getImageBasepath();
  }

  
  

  buyClicked(item:any){

    // var updateCard=this.listAllItemCards.find(card=> card.name==item.name);
    // var index=this.listAllItemCards.indexOf(updateCard);
    // console.log("item index in list card :"+index);
    // console.log("buy clicked :"+item.photo);

    if(item.stock==0){
      alert("stok barang habis");
      return;
    }

    // if(this.listCards[index].cart_count==0){
    //   this.listItem.push(item);
    // }
    // else{
    //   var updateItem=this.listItem.find(data=> data.id_product==item.id_product);
    //   var index=this.listItem.indexOf(updateItem);
    //   this.listItem[index].cart_count++;
    // }
    if(this.itemCount==0){
      this.listItemCart=new Array<{id_product:number, name:string, price:number, description:string, category:string, stock:number, photo:string, cart_count:number}>();
    }
    if(this.itemCount!=0 &&this.isItemExist(this.listItemCart, item)){
      var updateItem=this.listItemCart.find(data=> data.id_product==item.id_product);
      var index=this.listItemCart.indexOf(updateItem);
      this.listItemCart[index].cart_count++;
      console.log("item exist");
      console.log("item clicked count :"+this.listItemCart[index].cart_count);
    }
    else{
      item.cart_count=1;
      // this.listItemCart.push(item);
      // this.listItemCart=new Array<item>
      // this.listItemCart=new Array<{id_product:number, name:string, price:number, description:string, category:string, stock:number, photo:string, cart_count:number}>();
      this.listItemCart.unshift(item);
      // this.listItemCart.splice(0, 0, item);
      // console.log("item clicked count :"+item.cart_count);
      // console.log(item);
      // console.log("listItemCart :");
      // console.log(this.listItemCart);
    }
    //item.cart_count=0;
    this.itemCount++;
    console.log("itemcount :"+this.itemCount);
    //console.log("item card count :"+item.cart_count);

    //this.listCards[index].cart_count++;//=this.listCards[index].cart_count+1;//parseInt(this.listCards[index].cart_count);
    //console.log("list card count :"+this.listCards[index].cart_count);

    //console.log("listitem name :"+this.listItem[this.itemCount].name);
    

    //this.listItemNoDuplicate=new Set(this.listItem);
    //this.listItem=Array.from(this.listItemNoDuplicate);
    this.storage.set("currentCart", this.listItemCart);
    // console.log("listItemCart :");
    // console.log(this.listItemCart);
  }

  isItemExist(dataList: Array<any>, item){
    for(var i of dataList){
      if(i.id_product==item.id_product)
        return true;
    }
    return false;
  }

  cartButtonClicked(){
    this.storage.get("currentCart").then((val)=>{
        // console.log("current cart instorage :");
        // console.log(val);
        if(val!=null&&val!=""){
          let cartModal = this.modalCtrl.create(CartModalPage, { currentCart: val},{ enableBackdropDismiss: false });
          cartModal.present();
          cartModal.onDidDismiss(returnData=>{
            if(returnData.cart==[]||returnData.cart==""||returnData.cart==null){
              console.log("empty return jalan");
              this.deleteElementEmpty();
            }else{
              console.log("cart return jalan");
              // console.log(returnData.cart);
              this.deleteElement(returnData)
            }
            this.itemCount=returnData.itemCount;
            console.log("itemcount di modal abis balik :"+this.itemCount);
          });
        }else{
          alert("keranjang belanja kosong");
        }
      });
      
  }

  deleteElementEmpty(){
    this.listItemCart.forEach(element => {
      console.log("recursive delete array home");
      var updateItem=this.listItemCart.find(data=> data.id_product==element.id_product);
      var index=this.listItemCart.indexOf(updateItem);
      // console.log(this.listItemCart[index]);
      this.listItemCart[index].cart_count=0;
      this.listItemCart.splice(index, 1);
      this.deleteElementEmpty();
    });
  }

  deleteElement(returnData){
    this.listItemCart.forEach(element => {
      if(this.isItemExist(returnData.cart,element)){
        console.log("exist");
        // console.log(element);
      }else{
        console.log("not exist");
        // console.log(element);
        var updateItem=this.listItemCart.find(data=> data.id_product==element.id_product);
        var index=this.listItemCart.indexOf(updateItem);
        this.listItemCart[index].cart_count=0;
        console.log("element removed");
        // console.log(this.listItemCart[index]);
        this.listItemCart.splice(index, 1);
        this.deleteElement(returnData);
      }
    });
  }

  ngOnInit(){
    console.log('home init');
    // this.provider.checkLogin().then((res:any) => {
    //   console.log("return provider");
    //   console.log(res);
    //   this.belumLogin=res;
    //   console.log('belum login: ', this.belumLogin);
    //   if(this.belumLogin=="admin"){
    //     this.navCtrl.setRoot(AdminOrderListPage);
    //     //this.navCtrl.parent.select(0); 
    //     //this.timerLoop();
    //   }
    //   else
    //     this.getMainPageContent();
      
    //   this.getAllProductHome();
    // }).catch((err) => {
    //   console.log("error"+err);
    // });
    
  }

  getAllProductHome(){
    this.provider.getAllProduct().toPromise().then(result=>{
      // console.log("result promise getAllProduct");
      // console.log(result);
      this.listAllItemCards=JSON.parse(result["_body"]);
      this.listAllItemCards.sort(function(a, b) {
        return b.id_product - a.id_product;
      });
    }).catch(error=>{
      console.error('An error occurred', error);
      console.log('error');
      console.log(error);
      alert("connection failed");
    });
  }

  getMainPageContent(){
    if(this.belumLogin=="true"){
      this.provider.getAllProduct().toPromise().then(result=>{
        // console.log("result promise getAllProduct");
        // console.log(result);
        this.listCards=JSON.parse(result["_body"]);
      }).catch(error=>{
        console.error('An error occurred', error);
        console.log('error');
        console.log(error);
        alert("connection failed");
      });
    }
    else{
      var myData:any;
      this.provider.getLoginData().then((result:any) => {
        // console.log("isi storage dari provider");
        // console.log(result);
        myData=JSON.stringify({
          id_customer: result.id_customer});
        
        this.provider.getUserRecommendation(myData).toPromise().then(result=>{
          // console.log("result promise recommendation");
          // console.log(result);
          this.listCards=JSON.parse(result["_body"]);
        }).catch(error=>{
          console.error('An error occurred', error);
          console.log('error');
          console.log(error);
          alert("connection failed");
        });  
        
      }).catch((err) => {
        console.log("login gagal :"+err);
      });
      
    }
  }

  openBrowseProductPage(listKirim){
    console.log("harusnya buka Browse product page");
    
    this.storage.set("currentCart", this.listItemCart).then((result) => {
      this.storage.set("itemCount", this.itemCount).then((result) => {
        this.navCtrl.push(BrowseProductPage,{"listCard": listKirim, "listCart":this.listItemCart, "itemCount":this.itemCount, "callback":this.myCallbackFunction});  
      }).catch((err) => {
        
      });
    }).catch((err) => {
      
    });;
    
  }

  itemCardClick(item){
    //this.navCtrl.push(ProdukDetailPage, {item});
    if(this.itemCount==0){
      this.listItemCart=new Array<{id_product:number, name:string, price:number, description:string, category:string, stock:number, photo:string, cart_count:number}>();
    }
    var updateItem=this.listItemCart.find(data=> data.id_product==item.id_product);
    // console.log("searching update item");
    // console.log(updateItem);
    if(updateItem==null||updateItem==undefined){
      var cartToNumber:number=0;
      // console.log(cartToNumber);
      updateItem=item;
    }else{
      var index=this.listItemCart.indexOf(updateItem);
      var cartToNumber:number=this.listItemCart[index].cart_count;
      // console.log(cartToNumber);
    }
    let prodDetailModal = this.modalCtrl.create(ProdukDetailPage, { data: updateItem},{ enableBackdropDismiss: false });
    prodDetailModal.present();
    prodDetailModal.onDidDismiss(returnData=>{
      if(this.isItemExist(this.listItemCart,returnData)){
        var updateItem=this.listItemCart.find(data=> data.id_product==returnData.id_product);
        var index=this.listItemCart.indexOf(updateItem);
        var itemCountDiff:number=returnData.cart_count;
        // console.log(itemCountDiff);
        this.itemCount=this.itemCount+(itemCountDiff-cartToNumber);
        // console.log(this.itemCount);
        this.listItemCart[index].cart_count=returnData.cart_count;
        // console.log(this.listItemCart[index]);
        this.storage.set("currentCart", this.listItemCart);
      }
      else{
        console.log("barang g ada di cart");
        // console.log(returnData);
        if(returnData.cart_count>0){
          this.listItemCart.push(returnData);
          this.itemCount=this.itemCount+returnData.cart_count;
          console.log("total cart item "+this.itemCount);
          this.storage.set("currentCart", this.listItemCart);
        }
        //console.log("total cart item "+this.itemCount);
      }
      // this.listItemCart.forEach(element => {
      //   console.log("return item detail ganti item count");
      //   //console.log(element);
      //   if(element.id_product==returnData.id_product){
      //     var updateItem=this.listItemCart.find(data=> data.id_product==element.id_product);
      //     var index=this.listItemCart.indexOf(updateItem);
      //     var itemCountDiff:number=returnData.cart_count;
      //     console.log(itemCountDiff);
      //     this.itemCount=this.itemCount+(itemCountDiff-cartToNumber);
      //     console.log(this.itemCount);
      //     this.listItemCart[index].cart_count=returnData.cart_count;
      //     console.log(this.listItemCart[index]);
      //     this.storage.set("currentCart", this.listItemCart);
      //   }
      // });
    });
  }

  searchBoxFocus(input){
    
  }

  searchBoxInput(input){

  }

  searchBoxClear(event){
    this.searchBox=""
  }

  ionViewDidLoad() {
    //this.pushBackgroundAdminOnly();
  }

  ionViewWillEnter() {
    console.log("re enter home");
    // this.deleteElementEmpty();
    // this.listAllItemCards.sort(function(a, b) {
    //   return b.id_product - a.id_product;
    // });
    this.provider.checkLogin().then((res:any) => {
      console.log("return provider");
      // console.log(res);
      this.belumLogin=res;
      console.log('belum login: ', this.belumLogin);
      if(this.belumLogin=="admin"){
        this.navCtrl.setRoot(AdminOrderListPage);
        //this.navCtrl.parent.select(0); 
        //this.timerLoop();
      }
      else
        this.getMainPageContent();
      
      this.getAllProductHome();
    }).catch((err) => {
      console.log("error"+err);
    });
    // Promise.all([this.storage.get("currentCart"), this.storage.get("itemCount")]).then(values => {
    //   console.log("currentCart", values[0]);
    //   console.log("itemCount", values[1]);
    //   this.listItemCart=values[0];
    //   this.itemCount=values[1];
    // }); 
    this.storage.get("currentCart").then((result) => {
      this.listItemCart=result;
      this.itemCount=0;
      for(var i of result){
        this.itemCount=this.itemCount+i.cart_count;
      }
    }).catch((err) => {
      
    });
  }

}
