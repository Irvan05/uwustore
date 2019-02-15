import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularCropperjsComponent  } from 'angular-cropperjs';

/**
 * Generated class for the EditPhotoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-photo',
  templateUrl: 'edit-photo.html',
})
export class EditPhotoPage {
  @ViewChild('angularCropper') public angularCropper: AngularCropperjsComponent ;
  cropperOptions: any;
  croppedImage = null;
  myImage = null;
  scaleValX = 1;
  scaleValY = 1;
  loading:any;

  asd:any;
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private viewCrtl: ViewController) {
      this.cropperOptions = {
        dragMode: 'crop',
        aspectRatio: 1,
        autoCrop: true,
        movable: true,
        zoomable: true,
        scalable: true,
        autoCropArea: 0.8,
      };
      this.myImage=navParams.get('myImage');
      //console.log("constructor edit poto "+navParams.get('myImage'));
      
  }


  dismiss() {
    //let data = { 'foo': 'bar' };
    this.viewCrtl.dismiss(this.croppedImage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditPhotoPage');
  }

  reset() {
    this.angularCropper.cropper.reset();
  }
 
  clear() {
    this.angularCropper.cropper.clear();
  }
 
  rotate() {
    this.angularCropper.cropper.rotate(90);
  }
 
  zoom(zoomIn: boolean) {
    let factor = zoomIn ? 0.1 : -0.1;
    this.angularCropper.cropper.zoom(factor);
  }
 
  scaleX() {
    this.scaleValX = this.scaleValX * -1;
    this.angularCropper.cropper.scaleX(this.scaleValX);
  }
 
  scaleY() {
    this.scaleValY = this.scaleValY * -1;
    this.angularCropper.cropper.scaleY(this.scaleValY);
  }
 
  move(x, y) {
    this.angularCropper.cropper.move(x, y);
  }
 
  save() {
    let croppedImgB64String: string = this.angularCropper.cropper.getCroppedCanvas().toDataURL('image/jpeg', (100 / 100));
    this.croppedImage = croppedImgB64String;
    this.dismiss();
  }

}
