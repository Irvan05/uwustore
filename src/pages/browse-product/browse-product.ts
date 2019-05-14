import { ProdukDetailPage } from './../produk-detail/produk-detail';
import { CartModalPage } from './../cart-modal/cart-modal';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, RadioButton, Alert } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import { RemoteServiceProvider } from '../../providers/remote-service/remote-service';

/**
 * Generated class for the BrowseProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-browse-product',
  templateUrl: 'browse-product.html',
  providers:[RemoteServiceProvider]
})
export class BrowseProductPage {
  searchTerm: string = '';
  searchControl: FormControl;
  searching: any = false;

  category:Array<string>=[];
  currentCategory:string;

  imageBasepath:string;

  listAllItemCards:Array<{id_product:number, name:string, price:number, description:string, category:string, stock:number, photo:string, cart_count:number}>=[] ;
  listFiltereditemCardsCategory:Array<{id_product:number, name:string, price:number, description:string, category:string, stock:number, photo:string, cart_count:number}>=[] ;
  listFiltereditemCardsName:Array<{id_product:number, name:string, price:number, description:string, category:string, stock:number, photo:string, cart_count:number}>=[] ;
  itemCount:number;
  listItemCart:any;
  
  callback:any;

  alertc:Alert;

  constructor(public navCtrl: NavController, 
    private storage:Storage,
    private modalCtrl:ModalController,
    private alertCtrl:AlertController,
    private provider: RemoteServiceProvider,
    public navParams: NavParams) {
      this.searchControl = new FormControl();
      this.currentCategory="all";
      this.imageBasepath=provider.getImageBasepath();
  }

  buyClicked(item:any){

    console.log("buy clicked :"+item.photo);

    if(item.stock==0){
      alert("stok barang habis");
      return;
    }

    if(this.itemCount==0){
      this.listItemCart=new Array<{id_product:number, name:string, price:number, description:string, category:string, stock:number, photo:string, cart_count:number}>();
    }
    if(this.itemCount!=0 && this.isItemExist(this.listItemCart, item)){
      var updateItem=this.listItemCart.find(data=> data.id_product==item.id_product);
      var index=this.listItemCart.indexOf(updateItem);
      this.listItemCart[index].cart_count++;
      console.log("item clicked count :"+this.listItemCart[index].cart_count);
    }
    else{
      item.cart_count++;
      this.listItemCart.unshift(item);
      console.log("item clicked count :"+item.cart_count);
    }

    this.itemCount++;
    console.log("itemcount :"+this.itemCount);

    //this.listCards[index].cart_count++;//=this.listCards[index].cart_count+1;//parseInt(this.listCards[index].cart_count);
    //console.log("list card count :"+this.listCards[index].cart_count);

    //console.log("listitem name :"+this.listItem[this.itemCount].name);
    

    //this.listItemNoDuplicate=new Set(this.listItem);
    //this.listItem=Array.from(this.listItemNoDuplicate);
    this.storage.set("currentCart", this.listItemCart);
    //console.log("listItemCart :");
    //console.log(this.listItemCart);
  }

  itemCardClick(item){
    //this.navCtrl.push(ProdukDetailPage, {item});
    if(this.itemCount==0){
      this.listItemCart=new Array<{id_product:number, name:string, price:number, description:string, category:string, stock:number, photo:string, cart_count:number}>();
    }
    var updateItem=this.listItemCart.find(data=> data.id_product==item.id_product);
    //console.log("searching update item");
    //console.log(updateItem);
    if(updateItem==null||updateItem==undefined){
      var cartToNumber:number=0;
      //console.log(cartToNumber);
      updateItem=item;
    }else{
      var index=this.listItemCart.indexOf(updateItem);
      var cartToNumber:number=this.listItemCart[index].cart_count;
      console.log(cartToNumber);
    }
    let prodDetailModal = this.modalCtrl.create(ProdukDetailPage, { data: updateItem},{ enableBackdropDismiss: false });
    prodDetailModal.present();
    prodDetailModal.onDidDismiss(returnData=>{
      if(this.isItemExist(this.listItemCart,returnData)){
        var updateItem=this.listItemCart.find(data=> data.id_product==returnData.id_product);
        var index=this.listItemCart.indexOf(updateItem);
        var itemCountDiff:number=returnData.cart_count;
        //console.log(itemCountDiff);
        this.itemCount=this.itemCount+(itemCountDiff-cartToNumber);
        //console.log(this.itemCount);
        this.listItemCart[index].cart_count=returnData.cart_count;
        //console.log(this.listItemCart[index]);
        this.storage.set("currentCart", this.listItemCart);
      }
      else{
        console.log("barang g ada di cart");
        //console.log(returnData);
        if(returnData.cart_count>0){
          this.listItemCart.push(returnData);
          this.itemCount=this.itemCount+returnData.cart_count;
          console.log("total cart item "+this.itemCount);
          this.storage.set("currentCart", this.listItemCart);
        }
      }
    });
  }

  cartButtonClicked(){
    this.storage.get("currentCart").then((val)=>{
        //console.log("current cart instorage :");
        //console.log(val);
        if(val!=null&&val!=""){
          let cartModal = this.modalCtrl.create(CartModalPage, { currentCart: val},{ enableBackdropDismiss: false });
          cartModal.present();
          cartModal.onDidDismiss(returnData=>{
            if(returnData.cart==[]||returnData.cart==""||returnData.cart==null){
              console.log("empty return jalan");
              this.deleteElementEmpty();
            }else{
              console.log("cart return jalan");
              //console.log(returnData.cart);
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

  isItemExist(dataList: Array<any>, item){
    for(var i of dataList){
      if(i.id_product==item.id_product)
        return true;
    }
    return false;
  }

  isCatExist(dataList: Array<any>, item){
    for(var i of dataList){
      // console.log("i: "+i.id_product+" item: "+item.id_product);
      if(i.category==item.category)
        return true;
    }
    return false;
  }

  deleteElementEmpty(){
    this.listItemCart.forEach(element => {
      console.log("recursive delete array home");
      var updateItem=this.listItemCart.find(data=> data.id_product==element.id_product);
      var index=this.listItemCart.indexOf(updateItem);
      //console.log(this.listItemCart[index]);
      this.listItemCart[index].cart_count=0;
      this.listItemCart.splice(index, 1);
      this.deleteElementEmpty();
    });
  }

  deleteElement(returnData){
    this.listItemCart.forEach(element => {
      if(this.isItemExist(returnData.cart,element)){
        console.log("exist");
        //console.log(element);
      }else{
        console.log("not exist");
        //console.log(element);
        var updateItem=this.listItemCart.find(data=> data.id_product==element.id_product);
        var index=this.listItemCart.indexOf(updateItem);
        this.listItemCart[index].cart_count=0;
        console.log("element removed");
        //console.log(this.listItemCart[index]);
        this.listItemCart.splice(index, 1);
        this.deleteElement(returnData);
      }
    });
  }

  ngOnInit(){
    //this.listAllItemCards=this.navParams.get('listCard');
    this.provider.getAllProduct().toPromise().then((result) => {
      this.listAllItemCards=JSON.parse(result["_body"]);
      this.itemCount=this.navParams.get("itemCount");
      this.listItemCart=this.navParams.get("listCart");
      this.callback=this.navParams.get("callback");
      this.listFiltereditemCardsCategory=this.listAllItemCards;
      this.listFiltereditemCardsName=this.listAllItemCards;
      this.listFiltereditemCardsName.sort(function(a, b) {
      var nameA = a.name.toUpperCase(); // ignore upper and lowercase
      var nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
    
      // names must be equal
      return 0;
    });
    var temp:Array<any>=[];
    for(var i of this.listAllItemCards){
      if(!this.isCatExist(temp, i)){
        this.category.push(i.category);
        temp.push(i);
      }
    }
    this.category.sort();
    console.log("categori:");
    console.log(this.category);
    }).catch((error) => {
      console.error('An error occurred', error);
      console.log('error');
      console.log(error);
    });
    
    //console.log(temp);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BrowseProductPage');

    //this.setFilteredItems();

    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
        this.searching = false;
        this.setFilteredItemsName();
    });
  }

  selectCategory(){
    this.alertc=this.alertCtrl.create({
      title: 'Pilih kategori',
      // inputs:[
      //   {
      //     label:"Semua",
      //     value:"all",
      //     type:"radio"
      //     // checked:true
      //   }
      // ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Pilih',
          handler: (data) => {
            console.log('pilih clicked');
            //console.log(data);
            if(data=="undefined"||data==null||data=="all"){
              console.log("belum pilih kategori");
              this.currentCategory="all";
              this.listFiltereditemCardsCategory=this.listAllItemCards;
              this.setFilteredItemsName();
            }else{
              this.currentCategory=data;
              this.setFilteredItemsCategory(data);
              this.setFilteredItemsName();
            }
          }
        }
      ]
    });
    // console.log("current cat: "+this.currentCategory+" i2:");
    if(this.currentCategory=="all"){
      this.alertc.addInput({type: 'radio', label: "Semua", value: "all", checked:true});
    }else {
      this.alertc.addInput({type: 'radio', label: "Semua", value: "all"});
    }
    for(var i2 of this.category){
      if(this.currentCategory==i2){
        this.alertc.addInput({type: 'radio', label: i2, value: i2, checked:true});
      }else
        this.alertc.addInput({type: 'radio', label: i2, value: i2});
    }
    this.alertc.present();
  }


  setFilteredItemsCategory(cat) {

    this.listFiltereditemCardsCategory = this.filterItemsCategory(cat);

  }

  filterItemsCategory(catTerm){
    return this.listAllItemCards.filter((item) => {
      return item.category.toLowerCase()==catTerm.toLowerCase();
    });  
  }

  setFilteredItemsName() {

    this.listFiltereditemCardsName = this.filterItemsName(this.searchTerm);
    
    //this.listFiltereditemCardsName = this.listFiltereditemCardsName.sort((a,b) => a.name.toLowerCase() >b.name.toLowerCase() ? 1 : 0);
    this.listFiltereditemCardsName.sort(function(a, b) {
      var nameA = a.name.toUpperCase(); // ignore upper and lowercase
      var nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
    
      // names must be equal
      return 0;
    });
    
    // var result = data.sort((a,b) => `${a.address}${a.last_name}`.toLowerCase() >`${b.address}${b.last_name}`.toLowerCase() ? 1 : 0);
    // console.log("sorted:");
    // console.log(this.listFiltereditemCardsName);

  }

  filterItemsName(searchTerm){

    return this.listFiltereditemCardsCategory.filter((item) => {
        return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });  

  }

  searchBoxFocus(input){
    
  }

  searchBoxInput(input){
    this.searching = true;
  }

  searchBoxClear(event){
    this.searchTerm="";
  }

  ionViewWillLeave() {
    this.callback(this.listItemCart,this.itemCount).then(()=>{
       //this.navCtrl.pop();
      console.log("callback called");
    });
    // this.storage.set("currentCart", this.listItemCart);
    // this.storage.set("itemCount", this.itemCount);
  }
}
