import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { RemoteServiceProvider } from '../../providers/remote-service/remote-service';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers: [RemoteServiceProvider]
})
export class RegisterPage {
  public registerForm : FormGroup;
  //public login : boolean;
  public confirmPass : any;

  data:any = {};
  mylink : string= 'ttp://localhost:8080';
  UserAgent   : string = "request";
  Accept      : string = "application/json";
  headers     : any    = new Headers({
      'Access-Control-Allow-Origin': this.mylink, // Format: www.MyURL.com/api
      'User-Agent': this.UserAgent,
      'Accept': this.Accept
    });
  loading: any;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private provider: RemoteServiceProvider,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public remoteSvc: RemoteServiceProvider,
    public loadingCtrl: LoadingController) {
      //this.login=false;
      this.registerForm=this.formBuilder.group({
        email: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')])],
        confirmEmail: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')])],
        password: ['',  Validators.compose([Validators.required, Validators.minLength(6), Validators.pattern('[a-zA-Z0-9 ]*')])],
        confirmPassword: ['',  Validators.compose([Validators.required, Validators.minLength(6), Validators.pattern('[a-zA-Z0-9 ]*')])],
        nama: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')])],
        alamat: ['', Validators.compose([Validators.required])],
        telepon: ['', Validators.compose([Validators.required, Validators.minLength(10)])]
      });
  }

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    this.loading.present();
  }


  regForm(){
    this.presentLoading();
    // console.log(this.registerForm.value);
    // console.log(this.registerForm.value.email);
    if(this.registerForm.value.password!=this.registerForm.value.confirmPassword){
      alert("Password tidak diulang dengan benar");
      this.loading.dismiss();
    }else if(this.registerForm.value.email!=this.registerForm.value.confirmEmail){
      alert("Email tidak diulang dengan benar");
      this.loading.dismiss();
    }else{
      var nama=this.registerForm.value.nama;
      var emailinput:string=this.registerForm.value.email;
      emailinput=emailinput.toLowerCase();
      var alamat=this.registerForm.value.alamat;
      var telepon=this.registerForm.value.telepon;
      var pass=this.registerForm.value.password;
      //http://192.168.0.100:8080/warmat
      //var link='http://localhost:8080/warmat/api.php?code=3';
      var myData = JSON.stringify({
        username: nama,
        address: alamat,
        email: emailinput,
        phone: telepon,
        password: pass});
      
      
      ///////////////////////////
      // BUAT INSERT DATA KE DB//
      ///////////////////////////
      this.provider.userRegister(myData)
      .toPromise().then(data => {
        this.data = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
        if(this.data=="New record created successfully"){
          let alertc = this.alertCtrl.create({
            title: 'Registrasi sukses',
            //subTitle: "Silakan pindah ke halaman login",
            subTitle:this.data,
            buttons:[
              {
                text: 'Kembali',
                role: 'cancel',
                handler: () => {
                  console.log('Kembali clicked');
                  this.navCtrl.pop();
                }
              }]
          });
          this.loading.dismiss();
          alertc.present();
        }else{
          let alertc = this.alertCtrl.create({
            title: 'Registrasi gagal',
            //subTitle: "Silakan pindah ke halaman login",
            subTitle:this.data,
            buttons:[
              {
                text: 'Kembali',
                role: 'cancel',
                handler: () => {
                  console.log('Kembali clicked');
                }
              }]
          });
          this.loading.dismiss();
          alertc.present();
        }
      }).catch(this.handleError);
      

      /*, error => {
        this.data.response="oops!"+error;
        console.log("Oooops!");
        
        let alert = this.alertCtrl.create({
          title: 'Registrasi gagal',
          subTitle: error,
          buttons: ['Kembali']
        });
        this.loading.dismiss();
        alert.present();
      }*/

      //////////////////////////////
      //BUAT DAPET DATA JSON ARRAY//
      //////////////////////////////
      /*
      var recieved_data: any;
      this.http.get('http://192.168.0.100:8080/warmat/api.php?code=4')
            .subscribe((data) => {
               recieved_data =JSON.parse(data["_body"]);
               this.data.response=recieved_data;
               console.log("data dapet= "+recieved_data[1].address);
                //this.loading.dismiss();
            },
            (error: any) => {
                console.log('error');
                console.log(error);
            });
            */

    }
  }

  private handleError(error: any) {
    this.data.response="oops!"+error;
    console.log("Oooops!");
    
    let alert = this.alertCtrl.create({
      title: 'Registrasi gagal',
      subTitle: "gagal terhubung ke server "+error,
      buttons: ['Kembali']
    });
    this.loading.dismiss();
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
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
}
