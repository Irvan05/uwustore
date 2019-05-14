import { FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { RemoteServiceProvider } from '../../providers/remote-service/remote-service';

/**
 * Generated class for the AdminSwapProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin-swap-product',
  templateUrl: 'admin-swap-product.html',
  providers:[RemoteServiceProvider]
})
export class AdminSwapProductPage {
  listAllItemCards:Array<{id_product:number, name:string, price:number, description:string, category:string, stock:number, photo:string, cart_count:number}>=[] ;
  listAllItemCardsSearch:Array<{id_product:number, name:string, price:number, description:string, category:string, stock:number, photo:string, cart_count:number}>=[] ;

  imageBasepath:string;

  searchTerm: string = '';
  searchControl: FormControl;
  searching: any = false;

  constructor(public navCtrl: NavController, 
    private provider: RemoteServiceProvider,
    private viewCtrl:ViewController,
    public navParams: NavParams) {
      this.searchControl = new FormControl();
      this.imageBasepath=this.provider.getImageBasepath();
  }

  ngOnInit(){
    console.log('home init');
    this.getAllProductHome();
    
  }

  getAllProductHome(){
    this.provider.getAllProduct().toPromise().then(result=>{
      //console.log("result promise getAllProduct");
      //console.log(result);
      this.listAllItemCards=JSON.parse(result["_body"]);
      this.listAllItemCardsSearch=JSON.parse(result["_body"]);
      this.listAllItemCardsSearch.sort(function(a, b) {
        var nameA = a.name.toUpperCase(); // ignore upper and lowercase
        var nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
      
        // names must be equal
        return 0;
      });
    }).catch(error=>{
      console.error('An error occurred', error);
      console.log('error');
      console.log(error);
      alert("connection failed");
    });
  }

  productClicked(item){
    console.log(item);
    this.viewCtrl.dismiss(item);
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  setFilteredItemsName() {

    this.listAllItemCardsSearch = this.filterItemsName(this.searchTerm);
    
    this.listAllItemCardsSearch.sort(function(a, b) {
      var nameA = a.name.toUpperCase(); // ignore upper and lowercase
      var nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
    
      // names must be equal
      return 0;
    });
    
  }

  filterItemsName(searchTerm){

    return this.listAllItemCards.filter((item) => {
        return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });  

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminListProductPage');
    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
      this.setFilteredItemsName();
    });
  }

  searchBoxFocus(input){
    
  }

  searchBoxInput(input){
    this.searching = true;
  }

  searchBoxClear(event){
    this.searchTerm="";
  }

  ionViewWillEnter() {
    this.getAllProductHome();
  }

}
