import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { RemoteServiceProvider } from '../../providers/remote-service/remote-service';

/**
 * Generated class for the RatingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rating',
  templateUrl: 'rating.html',
  providers:[RemoteServiceProvider]
})
export class RatingPage {
  order: any;
  listItem: Array<any>;
  rating:number=3;
  starCount:Array<number>=[];
  starOutlineCount:Array<number>=[1,2,3,4,5];
  imageBasepath:string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private provider: RemoteServiceProvider,
    private platform: Platform,
    public viewCtrl: ViewController) {
    this.order=navParams.get('orderData');
    // console.log("isi orderData di modal");
    // console.log(this.order);
    this.imageBasepath=provider.getImageBasepath();
    this.platform.registerBackButtonAction(fn=>{
      console.log("back pressed");
      this.dismiss();
    });
  }

  getRating(num, item){
    item.rating=num;
    switch (num){
      case 1:{
        item.starCount=[1];
        item.starOutlineCount=[2,3,4,5]; 
        break;}
      case 2:{
        item.starCount=[1,2];
        item.starOutlineCount=[3,4,5]; 
        break;}
      case 3:{  
        item.starCount=[1,2,3];
        item.starOutlineCount=[4,5]; 
        break;}
      case 4:{
        item.starCount=[1,2,3,4];
        item.starOutlineCount=[5]; 
        break;}
      case 5:{
        item.starCount=[1,2,3,4,5];
        item.starOutlineCount=[]; 
        break;}
    }
  }

  dismiss() {
    if(this.listItem==undefined||this.listItem==null){
      this.viewCtrl.dismiss();
    }else{
      this.listItem.forEach(element => {
        console.log("item dismiss:");
        // console.log(element);
        var myData=JSON.stringify({
          id_customer_rating: element.id_customer_rating,
          rating:element.rating
        });
        //console.log(myData);
        this.provider.userUpdateRating(myData).toPromise().then(data=>{

        }).catch(error=>{
          console.error('An error occurred', error);
          console.log('error');
          console.log(error);
          alert("connection failed");
          //this.loading.dismiss();
        });
      });
      this.viewCtrl.dismiss();
    } 
  }

  ngOnInit(){
    if(this.order=="all"){
      this.provider.getLoginData().then((result:any) => {
        var myData= JSON.stringify({
          id_customer:result.id_customer
        });
        this.provider.getAllUserRating(myData).toPromise().then(data=>{
          // console.log(data["_body"]);
          if(data["_body"]=='failed'){
            alert("Belum ada produk yang dibeli");
            this.dismiss();
            return;
          }
          this.listItem =JSON.parse(data["_body"]);
          this.listItem.forEach(element => {
              element.starCount=[];
              element.starOutlineCount=[];
              console.log("rating :"+element.rating);
              var num=element.rating;
              if(num==1){
                element.starCount=[1];
                element.starOutlineCount=[2,3,4,5]; 
              }
              else if(num==2){
                element.starCount=[1,2];
                element.starOutlineCount=[3,4,5]; 
              }
              else if(num==3){  
                element.starCount=[1,2,3];
                element.starOutlineCount=[4,5]; 
              }
              else if(num==4){
                element.starCount=[1,2,3,4];
                element.starOutlineCount=[5]; 
              }
              else if(num==5){
                console.log("case jalan");
                element.starCount=[1,2,3,4,5];
                element.starOutlineCount=[]; 
              }
              else{
                element.starCount=[];
                element.starOutlineCount=[1,2,3,4,5];
              }
          });
          // console.log("data rating:");
          // console.log(this.listItem);
        }).catch(this.handleError);
      }).catch((err) => {
        console.log("ambil userdata error");
      });
    }else{
      var myData= JSON.stringify({
        id_order:this.order.id_order
      });
      console.log("ambil rating");
      this.provider.userGetRating(myData).toPromise().then(data=>{
          // console.log(data);
          if(data["_body"]!="failed"){
            this.listItem =JSON.parse(data["_body"]);
            this.listItem.forEach(element => {
                element.starCount=[];
                element.starOutlineCount=[];
                console.log("rating :"+element.rating);
                var num=element.rating;
                if(num==1){
                  element.starCount=[1];
                  element.starOutlineCount=[2,3,4,5]; 
                }
                else if(num==2){
                  element.starCount=[1,2];
                  element.starOutlineCount=[3,4,5]; 
                }
                else if(num==3){  
                  element.starCount=[1,2,3];
                  element.starOutlineCount=[4,5]; 
                }
                else if(num==4){
                  element.starCount=[1,2,3,4];
                  element.starOutlineCount=[5]; 
                }
                else if(num==5){
                  console.log("case jalan");
                  element.starCount=[1,2,3,4,5];
                  element.starOutlineCount=[]; 
                }
                else{
                  element.starCount=[];
                  element.starOutlineCount=[1,2,3,4,5];
                }
            });
            // console.log("data rating:");
            // console.log(this.listItem);
          }
          else
            alert("Semua barang pada pembelian ini sudah dirating")
      }).catch(this.handleError);
    }
    
  }

  private handleError(error: any) {
    console.log('error');
    console.log(error);
    alert('Connection error');
    //this.viewCtrl.dismiss();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DummyPage');
  }

}
