import { RemoteServiceProvider } from './../../providers/remote-service/remote-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform } from 'ionic-angular';

/**
 * Generated class for the ProdukDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-produk-detail',
  templateUrl: 'produk-detail.html',
  providers:[RemoteServiceProvider]
})
export class ProdukDetailPage {
  item:any;
  title:string="produk detail";
  imageBasepath:string;

  constructor(public navCtrl: NavController, 
    private viewCtrl:ViewController,
    private provider: RemoteServiceProvider,
    private platform: Platform,
    public navParams: NavParams) {
    this.item=this.navParams.get('data');
    // console.log(this.item);
    // console.log('item desc '+this.item.description);
    this.imageBasepath=provider.getImageBasepath();
    //this.title=this.item.desc;
    this.platform.registerBackButtonAction(fn=>{
      console.log("back pressed");
      this.dismiss();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProdukDetailPage');
  }

  ngAfterViewInit() {
    let tabs = document.querySelectorAll('.show-tabbar');
    if (tabs !== null) {
        Object.keys(tabs).map((key) => {
            tabs[key].style.display = 'none';
        });
    }
  }
  ionViewWillLeave() {
    let tabs = document.querySelectorAll('.show-tabbar');
    if (tabs !== null) {
        Object.keys(tabs).map((key) => {
            tabs[key].style.display = 'flex';
        });

    }
  }

  buyClicked(){
    if(this.item.stock==0){
      alert("stok barang habis");
      return;
    }else
      this.item.cart_count++;
  }

  dismiss(){
    this.viewCtrl.dismiss(this.item);
  }
}
