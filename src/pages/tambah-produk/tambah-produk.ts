import { Base64 } from '@ionic-native/base64';
import { EditPhotoPage } from './../edit-photo/edit-photo';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Crop } from '@ionic-native/crop';
import { RemoteServiceProvider } from '../../providers/remote-service/remote-service';
/**
 * Generated class for the TambahProdukPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tambah-produk',
  templateUrl: 'tambah-produk.html',
  providers:[RemoteServiceProvider]
})
export class TambahProdukPage {
  public addProductForm : FormGroup;
  public image: any;
  //public imageName: string= "";
  asd:any = {};
  //myImage = null;
  loading:any;
  itemStatus:string="available";
  //reader = new FileReader();
  
  category:Array<String>;
  selectedCategory:string;
  //categoryInputDisable:boolean=false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public camera: Camera,
    public formBuilder: FormBuilder,
    public domSanitizer: DomSanitizer,
    public fileTransfer: FileTransfer,
    private provider: RemoteServiceProvider,
    public crop: Crop,
    public platform: Platform,
    public modalCtrl: ModalController,
    public base64: Base64,
    public loadingCtrl:LoadingController,
    public alertCtrl:AlertController) {
      this.addProductForm=this.formBuilder.group({
        nama: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
        kategori: ['', Validators.required],
        harga: ['', Validators.required],
        deskripsi: ['', Validators.required]
        //stok: ['', Validators.required]
      });
  }

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    this.loading.present();
  }


  // namaFormBlur(input){
  //   //console.log("input: "+input);
  //   this.imageName=this.addProductForm.value.nama+".jpg";
  // }

  submitProduct(){
    this.presentLoading();
    //this.imageName=this.addProductForm.value.nama+".jpg";

    var uploadData= JSON.stringify({
      name: this.addProductForm.value.nama,
      price: this.addProductForm.value.harga,
      description: this.addProductForm.value.deskripsi,
      category: this.addProductForm.value.kategori,
      stock: this.addProductForm.value.stok,
      photo: this.addProductForm.value.nama+".jpg"
    });
    console.log(uploadData);
    if(this.image==""||this.image==null){
      this.loading.dismiss();
      alert("Belum ada gambar");
    }
    else
      this.uploadPhoto(uploadData);

    
    
  }

  sourcePhoto(){
    
    // console.log("input: "+this.addProductForm.value.poto);
    var alertc = this.alertCtrl.create({
      title: 'Ambil Foto',
      buttons: [
        {//0
          text: 'Album',
          handler: () => {
            //this.ambilPoto(0);
            this.ambilPoto(0);
            console.log('0 clicked');
          }
        },
        {//1
          text: 'Kamera',
          handler: () => {
            //this.ambilPoto(1);
            this.ambilPoto(1);
            console.log('1 clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    alertc.present();
  }

  // photoQuality(sourceType:number){
  //   var alertc = this.alertCtrl.create({
  //     title: 'Kualitas Foto',
  //     buttons: [
  //       {//0
  //         text: '50',
  //         handler: () => {
  //           this.ambilPoto(sourceType,50);
  //           console.log('0 clicked');
  //         }
  //       },
  //       {//1
  //         text: '75',
  //         handler: () => {
  //           this.ambilPoto(sourceType,75);
  //           console.log('1 clicked');
  //         }
  //       },
  //       {//1
  //         text: '85',
  //         handler: () => {
  //           this.ambilPoto(sourceType,85);
  //           console.log('1 clicked');
  //         }
  //       },
  //       {//1
  //         text: '95',
  //         handler: () => {
  //           this.ambilPoto(sourceType,95);
  //           console.log('1 clicked');
  //         }
  //       },
  //       {
  //         text: '100',
  //         handler: () => {
  //           this.ambilPoto(sourceType,100);
  //           console.log('Cancel clicked');
  //         }
  //       }
  //     ]
  //   });
  //   alertc.present();
  // }

  ambilPoto(sourceType:number){
    // this.presentLoading();
    
    const cameraOptions: CameraOptions = {
      quality: 75,
      targetWidth:  480,
      targetHeight: 800,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType:sourceType,
    }

    this.camera.getPicture(cameraOptions).then((imageData) => {
      //this.image= 'data:image/jpeg;base64,' + imageData;
      this.image= 'data:image/jpeg;base64,' + imageData;
      this.photoEditModal();
      } ),
      error => { 
        console.error('Error cropping image', error)
        alert('new image path error: ' + error)
        // this.loading.dismiss();
      }

  }
  // photoEditBrowser(files: FileList){
  // //     var selectedFile :File;
  // //     selectedFile = files.item(0);
  // //     console.log("selected file pc: "+selectedFile.name.toString());
  // //     this.image=selectedFile.toString();


  //     //this.image=this.base64.encodeFile(selectedFile.toString());
  //     //console.log("selected file pc: "+this.image);
  //     //"https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Paracas_National_Reserve%2C_Ica%2C_Peru-3April2011.jpg/300px-Paracas_National_Reserve%2C_Ica%2C_Peru-3April2011.jpg"
  //   var photoEditModdal = this.modalCtrl.create(EditPhotoPage, { myImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Paracas_National_Reserve%2C_Ica%2C_Peru-3April2011.jpg/300px-Paracas_National_Reserve%2C_Ica%2C_Peru-3April2011.jpg" },{ enableBackdropDismiss: false });
  //   photoEditModdal.present();
  //   photoEditModdal.onDidDismiss(returnData=>{
  //     //console.log("modal data="+returnData);
  //     this.image=returnData;
  //   })
  // }

  refreshImage(){
    // console.log("data image: "+this.image);
  }

  photoEditModal(){
    var photoEditModdal = this.modalCtrl.create(EditPhotoPage, { myImage: this.image},{ enableBackdropDismiss: false });
    photoEditModdal.present();
    photoEditModdal.onDidDismiss(returnData=>{
      //console.log("modal data="+returnData);
      // this.loading.dismiss();
      this.image=returnData;
    });
  }



  uploadPhoto(productData: any)
  {
    const fileTransferObject: FileTransferObject = this.fileTransfer.create();

    let uploadOptions: FileUploadOptions = {
      fileKey: 'file',
      fileName: this.addProductForm.value.nama+".jpg",
      mimeType:"image/jpeg",
      chunkedMode: false,
      headers: {}
    }
    console.log("uploading image");
    //var link="https://warmatmunawaroh.000webhostapp.com";
    //http://192.168.0.100:8080/warmat/upload.php
    //http://www.kroptokon.com/upload.php
    fileTransferObject.upload(this.image, 'http://www.kroptokon.com/upftp.php', uploadOptions)
    .then((data) => {
      // success
      alert("upload photo success");
      //this.imageName=uploadOptions.fileName;
      //this.asd.response=this.addProductForm.value.poto;
      //this.image="http://localhost:8080/warmat/uploads/"+this.imageName;
      console.log("upload success");
      // console.log(data["_body"]);
      this.loading.dismiss();
      this.addProduct(productData);
    }, (err) => {
      console.log("upload poto failed error: "+JSON.stringify(err));
      this.loading.dismiss();
      alert("upload poto failed error"+JSON.stringify(err));
    });
    // var uploadData= JSON.stringify({
    //   file:this.image
    // })
    // this.provider.apiTest(this.image).toPromise().then((data) => {
    //   alert("upload photo success");
    //       console.log("upload success");
    //       console.log(data["_body"]);
    //       this.loading.dismiss();
    // }).catch((err) => {
    //   console.log("upload poto failed error: "+JSON.stringify(err));
    //   this.loading.dismiss();
    // });


  }

  addProduct(productData: any){
    this.provider.tambahProduk(productData)
    .toPromise().then((data) => {
        this.asd.response = data["_body"];
        this.loading.dismiss();
        alert("upload data success");
        this.navCtrl.pop();
    }).catch(err=>{
      console.log('error');
      console.log(err);
      this.loading.dismiss();
      alert("upload data failed");
    });
    /*
    ,
    (error: any) => {
        console.log('error');
        console.log(error);
        this.loading.dismiss();
        alert("upload data failed/n"+error);
    }
    */
  }

  // private handleError(error: any) {
  //   console.log('error');
  //   console.log(error);
  //   this.loading.dismiss();
  //   alert("upload data failed");
  // }

  categorySelect(data){
    this.selectedCategory=data;
    if(data=="Kategori baru"){
      //console.log("false");
      this.selectedCategory="";
      //this.categoryInputDisable=true;
    }
  }

  ngOnInit(){
    this.provider.getAllCategory().toPromise().then((result) => {
      var cat=JSON.parse(result["_body"]);
      //console.log(cat);
      if(cat==[]||cat==null||cat==undefined){
        this.category=new Array<string>();
        this.category.sort();
        this.category.unshift("Kategori baru");
        return;
      }
      this.category=new Array<string>();
      cat.forEach(element => {
        try{
          this.category.push(element.category);
        }
        catch(err) {
          this.category.unshift(element.category);
        }
      });
      this.category.sort();
      this.category.unshift("Kategori baru");
      //console.log(this.category);
    }).catch(err=>{
      console.log('error');
      console.log(err);
      this.loading.dismiss();
      alert("connection failed");
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TambahProdukPage');
  }

  ionViewDidEnter() {
    // Now you can use the tabs reference
    console.log("a = ");
 }
 
  
}


