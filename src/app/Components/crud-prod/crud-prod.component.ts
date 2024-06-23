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
  prod: ProdIn | any;
  constructor(private db: DatabaseService, private modalCtrl: ModalController, private data: DataService) { }

  async ngOnInit() {
    const admin = await this.data.getItem('rest');
    this.db.LoadRest(admin[0]).subscribe(
      data => {
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
    this.db.UpdProd(newProd);
    this.closeModal();
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
}
