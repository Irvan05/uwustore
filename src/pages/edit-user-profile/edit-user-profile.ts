import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { RemoteServiceProvider } from '../../providers/remote-service/remote-service';

/**
 * Generated class for the EditUserProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-user-profile',
  templateUrl: 'edit-user-profile.html',
  providers:[RemoteServiceProvider]
})
export class EditUserProfilePage {

  userForm:FormGroup;
  userData:any={
    name:"",
    email:'',
    telepon:'',
    alamat:''

  };
  userID:number;
  loading:any;
  // usernameEdit:boolean=true;
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private provider: RemoteServiceProvider,
    public viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {
    // this.order=navParams.get('orderData');
    // console.log("isi orderData di modal");
    // console.log(this.order);
    this.userForm=this.formBuilder.group({
      email: ['', Validators.compose([Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')])],
      editPassword: ['',  Validators.compose([Validators.minLength(6), Validators.pattern('[a-zA-Z0-9 ]*')])],
      confirmEditPassword: ['',  Validators.compose([Validators.minLength(6), Validators.pattern('[a-zA-Z0-9 ]*')])],
      nama: ['', Validators.compose([Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')])],
      alamat: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      telepon: ['', Validators.compose([Validators.minLength(10)])],
      currentPassword: ['',  Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9 ]*')])]
    });
  }

  userFormSubmit(){
    var myData=JSON.stringify({});
    if(this.userForm.value.editPassword!=null||this.userForm.value.editPassword!=""){
      if(this.userForm.value.editPassword!=this.userForm.value.confirmEditPassword){
        alert("password tidak sesuai");
      }else{
        var myData=JSON.stringify({
          id_customer: this.userID,
          username: this.userForm.value.nama,
          address: this.userForm.value.alamat,
          email: this.userForm.value.email,
          phone: this.userForm.value.telepon,
          currentPassword: this.userForm.value.currentPassword,
          editPassword: this.userForm.value.editPassword
        });
        this.callProvider(myData);
      }
    }else{
      var myData=JSON.stringify({
        id_customer: this.userID,
        username: this.userForm.value.nama,
        address: this.userForm.value.alamat,
        email: this.userForm.value.email,
        phone: this.userForm.value.telepon,
        currentPassword: this.userForm.value.currentPassword,
        editPassword: ""
      });
      this.callProvider(myData);
    }
    
    
  }  

  callProvider(myData:any){
    this.presentLoading();
    // console.log(myData);
    var recieved_data: any;
    this.provider.userEditInfo(myData).toPromise().then(data=>{
      recieved_data =data["_body"];
      
      if(this.isJson(recieved_data)){
        recieved_data=JSON.parse(recieved_data);
        this.storage.set("userData",recieved_data[0]).then((data)=>{
          console.log("storeg set");
          // console.log(data);
          let alertc = this.alertCtrl.create({
            title: 'Data anda berhasil diupdate',
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
        });
      }else{
        let alertc = this.alertCtrl.create({
          title: 'Terjadi kesalahan',
          subTitle: "error:"+recieved_data,
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
      }
    }).catch(error=>{
      this.loading.dismiss();
      console.error('An error occurred', error);
      console.log('error');
      console.log(error);
      alert("connection failed");
      //this.loading.dismiss();
    })
  }

  isJson(str) {
    console.log("data balik");
    // console.log(str);
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
    
  }

  dismiss() {
    
    this.viewCtrl.dismiss();
  }

  ngOnInit(){
    this.storage.get('userData').then((val) => {
      console.log('userdata sotreg');
      // console.log(val);
      this.userID=val.id_customer;
      this.userData.name=val.name;
      this.userData.email=val.email;
      this.userData.telepon=val.phone;
      this.userData.alamat=val.address;
      this.userData.currentPassword=val.password;
    });
  }

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    this.loading.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DummyPage');
  }

}
