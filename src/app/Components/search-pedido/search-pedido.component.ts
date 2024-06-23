import { Component, OnInit } from '@angular/core';
import { DatabaseService,PedidOut,RepOut, RestIn} from 'src/app/Services/DatabaseService/database.service';
import { DataService } from 'src/app/Services/DataService/data.service';

@Component({
  selector: 'app-search-pedido',
  templateUrl: './search-pedido.component.html',
  styleUrls: ['./search-pedido.component.scss'],
})
export class SearchPedidoComponent  implements OnInit {
  Peds : PedidOut[] | any;
  event = { detail: {value : 'En Espera'}}
  filteredpeds: any[] = [];
  content: boolean = false;
  orden : any[] = [];
  users : any[] = [];
  carga: string = 'cargando contenido';

  segmentValue: string = 'En Espera';
  rest : RestIn = {
    direccion : '',
    h_apertura: '',
    h_cierre: '',
    id: '',
    id_usuario: '',
    nombre: '',
    telefono: '',
    imagen: '',
  };
rests$: RestIn[]= [];
  constructor(private db: DatabaseService, private data: DataService) { }
  countdown: number = 5;
  intervalId: any;
  async ngOnInit() {
this.inic();
  }
  async inic(){
 await this.chargeRest();
  }
  bar : boolean = true;
    startCountdown() {
      this.bar = true;
      this.countdown = 10; 
      this.intervalId = setInterval(() => {
        this.countdown--;
        console.log('alo');
        if (this.countdown <= 0) {
          clearInterval(this.intervalId);
          if (!this.content) { 
            this.onCountdownEnd(); 
          }
        }
      }, 1000);
    }
    // Método que se ejecuta cuando el contador llega a cero
    onCountdownEnd() {
      console.log('El contador ha llegado a cero y el dato sigue siendo false');
      this.bar = false;
    }
  
  segmentChanged(event: any) {
    console.log(event.detail.value);
    this.segmentValue = event.detail.value;
    this.Ver(this.segmentValue);
    this.startCountdown();
  }

  async chargeRest(){
    const e = await this.data.getItem('rest');
    if (e.length > 0){
    this.db.LoadRest(e[0]).subscribe(
      (data  : RestIn[]) => {
        this.rests$ = data;
        this.rest = this.rests$[0];
        this.startCountdown();
        this.segmentChanged(this.event);
        console.log(this.rest, this.rests$[0]);

      }
    )
  }
  }
  async filterPeds(p :PedidOut[]){
    this.filteredpeds = [];
    this.users = [];
    for (let ped of p) {
      if (!this.users.includes(ped.id_usuario)){
        this.users.push(ped.id_usuario);
      }
    }
    for (let u of this.users){
      console.log(u);
      this.orden = [];
      for (let ped of p) {
        if (ped.id_usuario == u){
          this.orden.push(ped);
        } 
      }
      this.filteredpeds.push(this.orden);
    }
    if (this.filteredpeds.length != 0){
      this.content = true;
    }else {
      this.content = false;
    }
    console.log(this.content);
  }

  changeState(p : PedidOut){
    p.estado = this.Stado(p.estado);
    this.db.UpdPd(p);
  }
  Stado(e: string): string {
    switch (e) {
      case 'En Espera':
        return 'En proceso';
        case 'En proceso':
        return 'Esperando Repartidor';
      case 'Esperando Repartidor':
        return 'En Camino';
      default:
        return 'En Espera';
    }
  }



  delete(id : any){
    this.db.deletePred(id);
    console.log('deleteado chavalin');
  }


  async Ver(a : string){
    console.log(this.rest);
    this.db.LoadPed(a, this.rest.id).subscribe(
      data =>{
        this.Peds = data;
        this.filterPeds(this.Peds);
        console.log(this.filteredpeds);
      }
    )
  }
}
