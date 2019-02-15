import { AboutAppPage } from './../about-app/about-app';
import { AdminListProductPage } from './../admin-list-product/admin-list-product';
import { HomePage } from './../home/home';
import { EditUserProfilePage } from './../edit-user-profile/edit-user-profile';
import { UserOrderHistoryPage } from './../user-order-history/user-order-history';
import { AdminOrderListPage } from './../admin-order-list/admin-order-list';
import { TambahProdukPage } from './../tambah-produk/tambah-produk';
import { MyApp } from './../../app/app.component';
import { RegisterPage } from './../register/register';
import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { RemoteServiceProvider } from '../../providers/remote-service/remote-service';
import { RatingPage } from '../rating/rating';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  providers:[RemoteServiceProvider]
})
export class ProfilePage {
  public loginForm : FormGroup;
  public belumLogin : string;
  asd:any = {};
  loading : any;

  constructor(public navCtrl: NavController,
    public app:App,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private storage: Storage,
    public alertCtrl: AlertController,
    public cdr: ChangeDetectorRef,
    public loadingCtrl: LoadingController,
    private modalCtrl:ModalController,
    private provider: RemoteServiceProvider) {
      this.loginForm=this.formBuilder.group({
        email: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,4}$')])],
        password: ['',  Validators.compose([Validators.required, Validators.minLength(1), Validators.pattern('[a-zA-Z0-9 ]*')])]
      });
  }

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    this.loading.present();
  }

  logForm(){
    this.presentLoading();
    // console.log(this.loginForm.value);
    // console.log(this.loginForm.value.email);
    var recieved_data: any;
    var emailinput=this.loginForm.value.email;
    emailinput=emailinput.toLowerCase();
    var pass=this.loginForm.value.password;
    var myData = JSON.stringify({
      email: emailinput,
      password: pass});
    //var link='http://192.168.0.100:8080/warmat/api.php?code=4';
    //var link='http://localhost:8080/warmat/api.php?code=4';
    this.provider.userLogin(myData)
          .toPromise().then((data) => {
            try {
              recieved_data =JSON.parse(data["_body"]);
              this.asd.response = data["_body"];
              // console.log("data dapet= "+recieved_data[0].id_customer);
              // console.log("data dapet= "+recieved_data[0].name);
              // console.log("data dapet= "+recieved_data[0].address);
              // console.log("data dapet= "+recieved_data[0].email);
              // console.log("data dapet= "+recieved_data[0].phone);
              // console.log("data dapet= "+recieved_data[0].password);
              // console.log("data dapet= "+recieved_data[0].type);
              
              // this.storage.set("id_customer", recieved_data[0].id_customer)
              // this.storage.set("name",recieved_data[0].name);
              // this.storage.set("address",recieved_data[0].address);
              // this.storage.set("email",recieved_data[0].email);
              // this.storage.set("phone",recieved_data[0].phone);
              // this.storage.set("password",recieved_data[0].password);
              // this.storage.set("type",recieved_data[0].type);

              this.storage.set("userData",recieved_data[0]).then((data)=>{
                if(recieved_data[0].type=='admin')
                  this.belumLogin="admin";  
                else
                  this.belumLogin="false";

                // console.log("login set value :");
                // console.log(data);

                //console.log("storage test= "+this.storage.get("name"));
                // this.storage.get('userData').then((val) => {
                //   console.log("all userData: ");
                //   console.log(val);
                //   console.log('Your name is', val.name);
                // });
                let alertc = this.alertCtrl.create({
                  title: 'Login sukses',
                  subTitle: "Silakan pindah ke halaman login",
                  buttons:[
                    {
                      text: 'Kembali',
                      role: 'cancel',
                      handler: () => {
                        console.log('Kembali clicked');
                        this.app.getRootNav().setRoot(MyApp);
                        //this.navCtrl.setRoot(MyApp);
                      }
                    }]
                });
                this.loading.dismiss();
                alertc.present();

              });

              

              
            }
            catch(err) {
              this.loading.dismiss();
              console.log('error login/storage= '+err);
              //this.asd.response = err;
              alert("email atau password salah");
            }
              
              
          }).catch(error=>{
            console.error('An error occurred', error);
            console.log('error');
            console.log(error);
            alert("connection failed");
            this.loading.dismiss();
          });
  }

  // public handleError(error: any) {
  //   console.error('An error occurred', error);
  //   console.log('error');
  //   console.log(error);
  //   alert("connection failed");
  //   //this.loading.dismiss();
  //   //return Promise.reject(error.message || error);
  // }

  logout(){
    this.presentLoading();
    this.storage.remove("userData");
    this.belumLogin="true";
    console.log('Logged Out');
    //this.cdr.detectChanges(); 
    let alertc = this.alertCtrl.create({
      title: 'Berhasil Logout',
      buttons:[
        {
          text: 'kembali',
          role: 'cancel',
          handler: () => {
            console.log('Kembali clicked');
            //this.navCtrl.setRoot(MyApp);
            this.app.getRootNav().setRoot(MyApp);
          }
        }]
    });
    this.loading.dismiss();
    alertc.present();
    //this.navCtrl.setRoot(MyApp);
    this.app.getRootNav().setRoot(MyApp);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    // console.log(this.loginForm.value);
    //this.belumLogin=this.provider.checkLogin();
    this.storage.get('userData').then((val) => {
      try{
        //val=val[0];
        // console.log(val);
        console.log('Your type is', val.type);
        if(val.type==null||val.type=="")
          this.belumLogin="true";
        else if(val.type=="admin")
          this.belumLogin="admin";
        else 
          this.belumLogin="false";

        console.log("your username :"+val.name);
      }catch(err) {
        console.log('error get storeg= '+err);
        this.asd.response = err;
        this.belumLogin="true";
      }
    },
    (error: any) => {
      this.belumLogin="true";
      console.log("login gagal :"+error);
    });
    //this.cdr.detectChanges(); 
  }

  openRegisterPage(){
    this.navCtrl.push(RegisterPage);
  }

  openTambahProdukPage(){
    this.navCtrl.push(TambahProdukPage);
  }

  openAdminOrderListPage(){
    this.navCtrl.push(AdminOrderListPage);
  }

  openUserOrderHistoryPage(){
    this.navCtrl.push(UserOrderHistoryPage);
  }

  openEditUserPage(){
    this.navCtrl.push(EditUserProfilePage);
  }

  openEditProductPage(){
    this.navCtrl.push(AdminListProductPage);
  }

  openAboutApp(){
    this.navCtrl.push(AboutAppPage);
  }

  openRatingPage(){
    //this.navCtrl.push(DummyPage);
    var ratingModal = this.modalCtrl.create(RatingPage, { orderData: "all"});
    ratingModal.present();
    ratingModal.onDidDismiss(returnData=>{});
  }
  
}
