import { Component, OnInit } from '@angular/core';
import { DatabaseService,ProdIn, RestIn } from 'src/app/Services/DatabaseService/database.service';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/Services/DataService/data.service';
import { ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { ref } from 'firebase/database';


@Component({
  selector: 'app-crud-prod',
  templateUrl: './crud-prod.component.html',
  styleUrls: ['./crud-prod.component.scss'],
})
export class CrudProdComponent  implements OnInit {
  @ViewChild('modal') modal: IonModal | undefined;
  prods : ProdIn[] = [];
  r : RestIn = {
    direccion : '',
    h_apertura: '',
    h_cierre: '',
    id: '',
    id_usuario: '',
    nombre: '',
    telefono: '',
    imagen: '',
  };
  r$: Observable<RestIn[]>| undefined;
  prod: ProdIn = {
    descripcion:'',
    nombre:'',
    id:'',
    id_restaurante:'',
    precio:0,
    imagen:'https://img-global.cpcdn.com/recipes/1c086891517e39e1/680x482cq70/hamburguesa-fit-con-pan-nube-foto-principal.jpg',
  };
  constructor(private db: DatabaseService, private modalCtrl: ModalController, private data: DataService) { }

  async ngOnInit() {
    const admin = await this.data.getItem('rest');
      this.r$ = this.db.LoadRest(admin[0]);
      this.r$.subscribe(
      data => {
        this.r = data[0];
        this.db.LoadProds(data[0].id).subscribe(
          datta => {
            this.prods = datta;
            console.log('aaremangala',datta);
          }
        );
      }
    )
    
  }
  async update(newProd: ProdIn){
    if(this.prod.descripcion !== ''){
      console.log(newProd.id);
      if(newProd.id !== ''){
        this.db.UpdProd(newProd);
      }else{
        this.db.AddProd(newProd.descripcion,this.r.id,newProd.nombre,newProd.precio,newProd.imagen);
      }
    
    this.closeModal();
    this.prod = {
      descripcion:'',
      nombre:'',
      id:'',
      id_restaurante:'',
      precio:0,
      imagen:'https://img-global.cpcdn.com/recipes/1c086891517e39e1/680x482cq70/hamburguesa-fit-con-pan-nube-foto-principal.jpg',
    };
    }
  }
  async closeModal() {
    await this.modalCtrl.dismiss();
  }
  async openModal(p :ProdIn) {
    this.prod = p; 
    if (this.modal) {
      await this.modal.present();
    }
  }
  deleteprod(p: ProdIn){
    this.db.RemoveProd(p);
  }
}
