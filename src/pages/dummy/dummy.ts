import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events, LoadingController, AlertController } from 'ionic-angular';
import { RemoteServiceProvider } from '../../providers/remote-service/remote-service';

/**
 * Generated class for the DummyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dummy',
  templateUrl: 'dummy.html',
  providers:[RemoteServiceProvider]
})
export class DummyPage {
  dummy:string="sample text";
  listAllItemCards:Array<{id_product:number, name:string, price:number, description:string, category:string, stock:number, photo:string, cart_count:number}>=[] ;
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private provider: RemoteServiceProvider,
    public viewCtrl: ViewController,
    public events: Events,
    public formBuilder: FormBuilder,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {
    // this.order=navParams.get('orderData');
  }

 

  dismiss() {
    
    this.viewCtrl.dismiss();
  }

  ngOnInit(){
    this.listAllItemCards=this.navParams.get('listCard');
  }

  // presentLoading() {
  //   this.loading = this.loadingCtrl.create({
  //     content: 'Please wait...'
  //   });
  
  //   this.loading.present();
  // }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DummyPage');
  }

}
