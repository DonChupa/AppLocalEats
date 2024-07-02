import { Component, OnInit } from '@angular/core';
import { DatabaseService,ProdIn, RestIn } from 'src/app/Services/DatabaseService/database.service';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/Services/DataService/data.service';
import { ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';



@Component({
  selector: 'app-crud-prod',
  templateUrl: './crud-prod.component.html',
  styleUrls: ['./crud-prod.component.scss'],
})
export class CrudProdComponent  implements OnInit {
  immagen = 'https://cdn.iconscout.com/icon/premium/png-256-thumb/no-image-2840213-2359555.png';
  @ViewChild('modal') modal: IonModal | undefined;
  @ViewChild('modal2') modal2: IonModal | undefined;
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
    imagen: this.immagen,
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
            console.log(datta);
          }
        );
      }
    )
    
  }
  async update(newProd: ProdIn){
    if(this.prod.descripcion!='' || this.prod.nombre !='' || this.prod.precio !=0 || this.prod.imagen != this.immagen){
      console.log(newProd.id);
      if(newProd.id !== ''){
        this.db.UpdProd(newProd);
      }else{
        this.db.AddProd(newProd.descripcion,this.r.id,newProd.nombre,newProd.precio,newProd.imagen);
      }
    
    this.closeModal();
    }
  }
  async closeModal() {
    this.prod ={
      descripcion:'',
      nombre:'',
      id:'',
      id_restaurante:'',
      precio:0,
      imagen: this.immagen,
    };
    await this.modalCtrl.dismiss();
  }



  async openModal(p :ProdIn) {
    this.prod = p;
    if (this.modal) {
      await this.modal.present();
    }
  }
  async openModal2() {
    if (this.modal2) {
      await this.modal2.present();
    }
  }
  
  deleteprod(p: ProdIn){
    this.db.RemoveProd(p);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.prod.imagen = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  }
  onFileRestSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.r.imagen = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  }
  async updateRest(newRest: RestIn){
    if(newRest.nombre !='' || newRest.telefono != '' ){
      console.log(newRest);
      this.db.UpdateRest(newRest);
    this.closeModal();
    }
  }
}
