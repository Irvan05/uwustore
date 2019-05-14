import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

/*
  Generated class for the RemoteServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RemoteServiceProvider {
  //basepath="http://192.168.0.100:8080/warmat/apioop.php?";
  //basepath="https://warmatmunawaroh.000webhostapp.com/apioop.php?";
  basepath="http://www.kroptokon.com/kroptokon.com/warmat/api/apioop.php?";
  imageBasepath="http://www.kroptokon.com/kroptokon.com/warmat/uploads/"
  constructor(public http: Http,
    private platform: Platform,
    private storage:Storage) {
    console.log('Hello RemoteServiceProvider Provider');
    if(this.platform.is("cordova")){
      //this.basepath="https://warmatmunawaroh.000webhostapp.com/api.php?";
    }
  }

  getAllCategory(){
    return this.http.get(`${this.basepath}code=20`);
  }

  deleteProduct(myData){
    return this.http.post(`${this.basepath}code=19`, myData)
  }

  getTansactionOrderDetails(myData){
    return this.http.post(`${this.basepath}code=18`, myData)
  }

  editProduct(myData){
    return this.http.post(`${this.basepath}code=17`, myData)
  }

  getAllUserRating(myData){
    return this.http.post(`${this.basepath}code=16`, myData)
  }

  // apiTest(myData){
  //   return this.http.post('http://www.kroptokon.com/upftp.php',myData)
  // }

  getUserRecommendation(myData){
    return this.http.post(`${this.basepath}code=15`, myData)
  }

  userEditInfo(myData){
    return this.http.post(`${this.basepath}code=14`, myData)
  }

  userUpdateRating(myData){
    return this.http.post(`${this.basepath}code=12`, myData)
  }

  userGetRating(myData){
    return this.http.post(`${this.basepath}code=11`, myData)
  }

  userOrderList(myData){
    return this.http.post(`${this.basepath}code=13`, myData);
  }

  adminOrderList(){
    return this.http.get(`${this.basepath}code=8`);
  }

  updateOrder(myData){
    return this.http.post(`${this.basepath}code=9`, myData)
  }

  updateOrder1(myData){
    return this.http.post(`${this.basepath}code=10`, myData)
  }

  updateOrderHargaTotal(myData){
    return this.http.post(`${this.basepath}code=22`, myData)
  }

  updateOrderDaftarBarang(myData){
    return this.http.post(`${this.basepath}code=23`, myData)
  }

  tambahProduk(myData:any){
    return this.http.post(`${this.basepath}code=5`, myData);
  }

  userRegister(myData:any){
    return this.http.post(`${this.basepath}code=3`, myData);
  }

  userLogin(myData: any){
    return this.http.post(`${this.basepath}code=4`, myData);
  }

  cartCheckout(myData: any){
    return this.http.post(`${this.basepath}code=7`, myData);
  }

  getAllProduct(){
    //console.log(this.basepath);
    return this.http.get(`${this.basepath}code=6`);
  }

  getSpecificProduct(myData){
    return this.http.post(`${this.basepath}code=21`, myData);
  }

  // checkUpdateTeros(){
  //   return this.http.get(`${this.basepath}code=999`);
  // }

  getImageBasepath(){
    return this.imageBasepath;
  }

  checkLogin(){
    return new Promise( (resolve, reject) => {
      this.storage.get('userData').then((val) => {
        try{
          //val=val[0];
          // console.log(val);
          //  console.log('in service: Your type is', val.type);
          if(val.type==null||val.type=="")
            resolve("true");
          else if(val.type=="admin")
          resolve("admin");
          else 
          resolve("false");
          //console.log("your username :"+val.name);
        }catch(err) {
          console.log('error get storeg= '+err);
          resolve("true");
        }
      },
      (error: any) => {
        console.log("login gagal :"+error);
        resolve("true");
        
      });
      //console.log("gagal");
      //resolve("true");
      
    });
  }

  getLoginData(){
    return new Promise( (resolve, reject) => {
      this.storage.get('userData').then((val) => {
          resolve(val);
      },
      (error: any) => {
        reject(error);
      });
    });
  }
}


///////////////////////////
      // BUAT INSERT DATA KE DB//
      ///////////////////////////
      /*this.http.post(link, myData)
      .subscribe(data => {
        //this.data.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
        let alert = this.alertCtrl.create({
          title: 'Registrasi sukses',
          subTitle: "Silakan pindah ke halaman login",
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
        alert.present();
      }, error => {
          this.data.response="oops!"+error;
          console.log("Oooops!");
          
          let alert = this.alertCtrl.create({
            title: 'Registrasi gagal',
            subTitle: error,
            buttons: ['Kembali']
          });
          alert.present();
        
      });*/

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