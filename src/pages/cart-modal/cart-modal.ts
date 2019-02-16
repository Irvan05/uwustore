import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { iterateListLike } from '@angular/core/src/change_detection/change_detection_util';
import { RemoteServiceProvider } from '../../providers/remote-service/remote-service';

/**
 * Generated class for the CartModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cart-modal',
  templateUrl: 'cart-modal.html',
  providers:[RemoteServiceProvider]
})
export class CartModalPage {
  cart:Array<{id_product:number, name:string, price:number, description:string, category:string, stock:number, photo:string, cart_count:number}>;
  //cartSet:Set<{id_product:number, name:string, price:number, description:string, category:string, stock:number, photo:string, cart_count:number}>;
  itemCount:number;
  totalPrice:number;
  asd:any;
  imageBasepath:string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private storage: Storage,
    private provider: RemoteServiceProvider) {
      this.imageBasepath=provider.getImageBasepath();
      // this.cart=navParams.get("currentCart");
      // console.log("currentcart di modal:");
      // console.log(this.cart);
      // this.itemCount=0;
      // this.totalPrice=0;
      // for(var data of this.cart){
      //   this.itemCount=this.itemCount+data.cart_count;
      // }
      // console.log("itemcount di modal :"+this.itemCount);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartModalPage');
    this.cart=this.navParams.get("currentCart");
    //console.log("currentcart di modal:");
    //console.log(this.cart);
    this.countTotalPrice();
  }

  countTotalPrice(){
    this.totalPrice=0;
    this.itemCount=0;
    this.cart.forEach(element => {
      this.totalPrice=this.totalPrice+(element.price*element.cart_count);
      this.itemCount=this.itemCount+element.cart_count;
    });
  }

  removeItem(item){
    var updateItem=this.cart.find(cart=> cart.name==item.name);
    var index=this.cart.indexOf(updateItem);
    if(this.cart[index].cart_count<=0){
    }
    else{
      this.cart[index].cart_count--;
      this.itemCount--;
    }
    // console.log("cart di modal apus :");
    // console.log(this.cart);
    console.log("itemcount di modal :"+this.itemCount);
    this.countTotalPrice();
  }

  addItem(item){
    var updateItem=this.cart.find(cart=> cart.name==item.name);
    var index=this.cart.indexOf(updateItem);
    this.cart[index].cart_count++;
    this.itemCount++;
    this.countTotalPrice();
  }

  // deleteItem(item){
  //   var updateItem=this.cart.find(cart=> cart.name==item.name);
  //   var index=this.cart.indexOf(updateItem);
  //   this.itemCount=this.itemCount-item.cart_count;
  //   this.cart.splice(index, 1);
  // }

  confirmBuy(){
    if(this.itemCount==0){
      alert("Keranjang belanja kosong");
      return;
    }
    this.storage.get('userData').then((val)=>{
      // console.log("isi storeg: ");
      // console.log(val);

      if(val==null||val==""){
        alert("belum login");
      }else{
        this.countTotalPrice();
  
        var userDetail={id_customer:val.id_customer, total_price:this.totalPrice};
        
        var myData = JSON.stringify({
          order: userDetail,
          orderDetails: this.cart});
  
        // console.log("data buat api :");
        // console.log(myData);
        this.postData(myData);
      }
    }),err=>{
      alert("belum login");
    };
  }

  postData(myData){
    this.provider.cartCheckout(myData)
      .subscribe((data) => {
          var recieved_data =(data["_body"]);
          this.asd = data["_body"];
          // console.log('recieve data post modal :');
          // console.log(recieved_data);
          alert("Pesanan anda akan diproses");
          this.dismissConfirmBuy();
      },
      (error: any) => {
        console.log('error');
        console.log(error);
    });
  }

  dismiss() {
    console.log("dismiss klik");
    // console.log(this.cart);
    // var index:Array<number>=[];
    // this.cart.forEach(element => {
    //   if(element.cart_count==0){
    //     var updateItem=this.cart.find(data=> data.id_product==element.id_product);
    //     index.push(this.cart.indexOf(updateItem));
    //     //this.cart.splice(index, 1);
    //   }
    // });
    // console.log("isi index");
    // console.log(index);
    // for(var i of index){
    //   console.log("delete index: "+ i);
    //   console.log(this.cart[i]);
    //   this.cart.splice(i,1);
    // }
     this.deleteElement();
    // for(var element of this.cart){
    //   if(element.cart_count==0){
    //     var updateItem=this.cart.find(data=> data.id_product==element.id_product);
    //     var index=this.cart.indexOf(updateItem);
    //     this.cart.splice(index, 1);
    //   }
    // }
    this.storage.set("currentCart", this.cart).then((result) => {
      console.log("itemcount di modal mau balik :"+this.itemCount);
      // console.log(this.cart);
      var data={"cart":this.cart, "itemCount":this.itemCount}
      this.viewCtrl.dismiss(data);
    }).catch((err) => {
      
    });

   
  }
  dismissConfirmBuy() {
    // this.cart.forEach(element => {
    //   var updateItem=this.cart.find(data=> data.id_product==element.id_product);
    //   var index=this.cart.indexOf(updateItem);
    //   this.cart.splice(index, 1);
    // });
    // var index:Array<number>=[];
    // this.cart.forEach(element => {
    //   if(element.cart_count==0){
    //     var updateItem=this.cart.find(data=> data.id_product==element.id_product);
    //     index.push(this.cart.indexOf(updateItem));
    //     //this.cart.splice(index, 1);
    //   }
    // });
    // console.log("isi index");
    // console.log(index);
    // for(var i of index){
    //   console.log("delete index: "+ i);
    //   this.cart.splice(i,1);
    // }
    console.log("confidm buy dismiss");
    this.deleteAllElement();
    this.storage.set("currentCart", this.cart).then((result) => {
      //console.log("itemcount di modal mau balik :"+this.itemCount);
      var returnData={"cart":this.cart, "itemCount":0};
      this.viewCtrl.dismiss(returnData);
    }).catch((err) => {
      
    });
  }

  deleteElement(){
    this.cart.forEach(element => {
      console.log("recursive delete array");
      if(element.cart_count==0){
        var updateItem=this.cart.find(data=> data.id_product==element.id_product);
        var index=this.cart.indexOf(updateItem);
        // console.log(this.cart[index]);
        this.cart.splice(index, 1);
        this.deleteElement();
      }
    });
  }

  deleteAllElement(){
    this.cart.forEach(element => {
      console.log("recursive delete all array");
      var updateItem=this.cart.find(data=> data.id_product==element.id_product);
      var index=this.cart.indexOf(updateItem);
      // console.log(this.cart[index]);
      this.cart[index].cart_count=0;
      this.cart.splice(index, 1);
      this.deleteAllElement();
    });
  }
}
