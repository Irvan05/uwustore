import { RemoteServiceProvider } from './../../providers/remote-service/remote-service';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { EditPhotoPage } from '../edit-photo/edit-photo';

/**
 * Generated class for the AdminEditProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin-edit-product',
  templateUrl: 'admin-edit-product.html',
  providers:[RemoteServiceProvider]
})
export class AdminEditProductPage {
  public editProductForm : FormGroup;
  public image: any;
  oldImage:any;
  //public imageName: string= "";
  product:any;
  loading:any;
  oldPhoto:any;
  imageBasepath:string;

  itemStatCount:number=10;
  zone:any;

  constructor(public navCtrl: NavController, 
    public formBuilder: FormBuilder,
    public camera: Camera,
    public alertCtrl:AlertController,
    public fileTransfer: FileTransfer,
    public loadingCtrl:LoadingController,
    public provider: RemoteServiceProvider,
    public modalCtrl: ModalController,
    private _zone: NgZone,
    public navParams: NavParams) {
      this.editProductForm=this.formBuilder.group({
        nama: ['', Validators.compose([Validators.required])],
        kategori: ['', Validators.required],
        harga: ['', Validators.required],
        deskripsi: ['', Validators.required]
        //stok: ['', Validators.required]
      });
      this.imageBasepath=provider.getImageBasepath();
      this.zone = _zone;
  }

  submitEditProduct(){
    this.presentLoading();
    //this.imageName=this.addProductForm.value.nama+".jpg";
    var uploadData= JSON.stringify({
      id_product: this.product.id_product,
      name: this.editProductForm.value.nama,
      price: this.editProductForm.value.harga,
      description: this.editProductForm.value.deskripsi,
      category: this.editProductForm.value.kategori,
      stock: this.itemStatCount,
      photo: this.editProductForm.value.nama+".jpg",
      oldPhoto: this.oldPhoto
    }) 
    this.editProduct(uploadData);
    // if(this.image==""||this.image==null){
    //   this.loading.dismiss();
    //   alert("Belum ada gambar");
    // }
    // else
    //   this.uploadPhoto(uploadData);

  }
  editProduct(productData: any){
    //console.log(productData);
    this.provider.editProduct(productData)
    .toPromise().then((data) => {
        this.loading.dismiss();
        //console.log(data);
        alert("upload data success");
        this.editProductForm.reset;
    }).catch(this.handleError);
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

  sourcePhoto(){
    var alertc = this.alertCtrl.create({
      title: 'Ambil Foto',
      buttons: [
        {//0
          text: 'Album',
          handler: () => {
            this.ambilPoto(0);
            console.log('0 clicked');
          }
        },
        {//1
          text: 'Kamera',
          handler: () => {
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

  ambilPoto(sourceType:number){
    //this.presentLoading();
    
    const cameraOptions: CameraOptions = {
      quality: 50,
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
        //this.loading.dismiss();
      }

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

  uploadPhoto()
  {
    if(this.oldImage==this.image){
      alert("poto sama");
    }else{
      const fileTransferObject: FileTransferObject = this.fileTransfer.create();

      let uploadOptions: FileUploadOptions = {
        fileKey: 'file',
        fileName: this.editProductForm.value.nama+".jpg",
        mimeType:"image/jpeg",
        chunkedMode: false,
        headers: {}
      }
      console.log("uploading image");
      fileTransferObject.upload(this.image, 'http://www.kroptokon.com/upftp.php', uploadOptions)
      .then((data) => {
        // success
        alert("upload photo success");
        console.log("upload success");
        //console.log(data["_body"]);
        this.oldImage=this.image;
        this.loading.dismiss();
      }, (err) => {
        console.log("upload poto failed error: "+JSON.stringify(err));
        this.loading.dismiss();
        alert("upload poto failed error"+JSON.stringify(err));
      });
    }
  }

  radioChecked(data){
    //console.log("barang "+data);
    this.itemStatCount=data;
  }

  ngOnInit(){
    this.product=this.navParams.get("data");
    this.oldPhoto=this.product.photo;
    this.image=this.imageBasepath+this.product.photo;
    this.oldImage=this.imageBasepath+this.product.photo;
  }

  private handleError(error: any) {
    console.log('error');
    console.log(error);
    this.loading.dismiss();
    alert("upload data failed");
  }

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminEditProductPage');
  }

}
