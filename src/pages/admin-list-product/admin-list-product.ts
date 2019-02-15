import { AdminEditProductPage } from './../admin-edit-product/admin-edit-product';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RemoteServiceProvider } from '../../providers/remote-service/remote-service';

/**
 * Generated class for the AdminListProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin-list-product',
  templateUrl: 'admin-list-product.html',
  providers:[RemoteServiceProvider]
})
export class AdminListProductPage {
  listAllItemCards:Array<{id_product:number, name:string, price:number, description:string, category:string, stock:number, photo:string, cart_count:number}>=[] ;
  imageBasepath:string;

  constructor(public navCtrl: NavController, 
    private provider: RemoteServiceProvider,
    public navParams: NavParams) {
      this.imageBasepath=this.provider.getImageBasepath();
  }

  ngOnInit(){
    console.log('home init');
    this.getAllProductHome();
    
  }

  getAllProductHome(){
    this.provider.getAllProduct().toPromise().then(result=>{
      //console.log("result promise getAllProduct");
      //console.log(result);
      this.listAllItemCards=JSON.parse(result["_body"]);
    }).catch(error=>{
      console.error('An error occurred', error);
      console.log('error');
      console.log(error);
      alert("connection failed");
    });
  }

  productClicked(item){
    console.log("product clicked");
    this.navCtrl.push(AdminEditProductPage,{"data":item});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminListProductPage');
  }

  ionViewWillEnter() {
    this.getAllProductHome();
  }

}
