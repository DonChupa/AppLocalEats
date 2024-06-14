import { Injectable } from '@angular/core';
import { database } from 'src/environments/environment';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ref, DataSnapshot, onValue, remove, push, update, get, set } from 'firebase/database';
import { DataService } from '../DataService/data.service';
const prodRef = ref(database, 'Productos');
const restRef = ref(database, 'Restaurante');
const repRef = ref(database, 'Usuarios');

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private data: DataService) { }

  loadRep(email: string): Observable<RepOut[]> {
    return new Observable<RepOut[]>((subscriber) => {
      const unsubscribe = onValue(repRef, (snapshot: DataSnapshot) => {
        const data = snapshot.val();
        if (data) {
          // 
          const rep: RepOut[] = Object.keys(data)
            .filter((key) => data[key].email == email )
            .map((key) => ({
              nombre: data[key].nombre,
              imagen: data[key].imagen,
              apellido: data[key].apellido,
              direccion: data[key].direccion,
              tipo_usuario: data[key].tipo_usuario,
              telefono: data[key].telefono,
              puntaje: data[key].puntaje,
              email: email,
            }));
          subscriber.next(rep);
        } else {
          console.log('error, no encontre user')
          subscriber.next([]);
        }
      });
  
      return () => {
        unsubscribe();
      };
    });
  }


  UpdateRep(nombre: string, email: string, tefono: number, key: any, direccion: string, apellido:string){
    const img: string ='';
    const puntos: any ='';
    const hol: string = 'repartidor';
    const disp = 'No disponible';
    const userRef = ref(database, `Usuarios/${key}`);
    const nuevoUser: RepOut = {
      nombre: nombre,
      imagen: img,
      apellido: apellido,
      direccion: direccion,
      tipo_usuario: hol,
      telefono: tefono, 
      email: email,
      puntaje: puntos,
    };
    update(userRef, nuevoUser)
    .then(() => {
      console.log('listo');
    })
    .catch((error) => {
      console.error('Error:', error);
    });

    
  }
  async RepState(r: Observable<RepOut[]>){
    r.subscribe(data =>{
      if (data.length > 0){
        const key = data[0];
        this.LoadRepart(key).subscribe(
          datta =>{
            const keyy = datta[0];
            keyy.disponibilidad = keyy.disponibilidad === 'No disponible' ? 'Disponible' : 'No disponible';
            const nuevorepart = {
              disponibilidad : keyy.disponibilidad,
              id_usuario: key,
              licencia_conducir: keyy.licencia_conducir,
              vehiculo: keyy.vehiculo,
            }
            const userRef = ref(database, `Repartidores/${key}`);
            update(userRef, nuevorepart)
          }
        )
      }
      else{
        console.log('error');
      }
    }
    )
  }

  LoadRepart(id : any){
    return new Observable<RepartOut[]>((subscriber) => {
      const unsubscribe = onValue(repRef, (snapshot: DataSnapshot) => {
        const data = snapshot.val();
        if (data) {
          // 
          const rep: RepartOut[] = Object.keys(data)
            .filter((key) => data[key].id_user == id)
            .map((key) => ({
              disponibilidad: data[key].disponibilidad,
              id_usuario: id,
              licencia_conducir: data[key].licencia_conducir,
              vehiculo: data[key].vehiculo,
            }));
          subscriber.next(rep);
        } else {
          console.log('error, no encontre user')
          subscriber.next([]);
        }
      });
  
      return () => {
        unsubscribe();
      };
    });
  }

  
  AddRep(nombre: string, email: string, tefono: number, apellido: string) {
    const hola : string='';
    const img : string = 'https://img.freepik.com/fotos-premium/repartidor-sobre-amarillo-aislado-pulgares-arriba-porque-algo-bueno-ha-sucedido_1368-70622.jpg';
    const hol : string='repartidor';
    const punt : any = '';
    const nuevoclient: RepOut = {
      nombre: nombre,
      imagen: img,
      apellido: apellido,
      direccion: hola,
      tipo_usuario: hol,
      telefono: tefono, 
      puntaje: punt,
      email: email,
    };
    push(repRef, nuevoclient);
  }

  AddRepart(id: any) {
    const licencia : string='';
    const disponibilidad : string='repartidor';
    const vehiculo: any = '';
    const nuevorepart: RepartOut = {
      disponibilidad: disponibilidad,
      licencia_conducir: licencia,
      id_usuario: id,
      vehiculo: vehiculo,
    };
    const userRef = ref(database, `Repartidores`);
    push(repRef, nuevorepart);
  }




  RemoveRep(claveUnica: any) {
    remove(ref(database,`Usuarios/${claveUnica.id}`))
      .then(() => {
        console.log('Repartidor eliminado exitosamente.');
      })
      .catch((error) => {
        console.error('Error al eliminar repartidor:', error);
      });
  }

  AllRep(): Observable<RepOut[]> {
    return new Observable<RepOut[]>((subscriber) => {
      const unsubscribe = onValue(repRef, (snapshot: DataSnapshot) => {
        const data = snapshot.val();
        if (data > 0) {
          // 
          const rep: RepOut[] = Object.keys(data)
            .map((key) => ({
              nombre: data[key].nombre,
              imagen: data[key].imagen,
              apellido: data[key].apellido,
              direccion: data[key].direccion,
              tipo_usuario: data[key].tipo_usuario,
              telefono: data[key].telefono,
              puntaje: data[key].puntaje,
              email: data[key].email,
              disponibilidad: data[key].disponibilidad,
            } ));
          subscriber.next(rep);
          console.log(data);
          
        } else {
          console.log('error, no encontre users')
          subscriber.next([]);
        }
      });
  
      return () => {
        unsubscribe();
      };
    });
  }
  //////////////////////////////////
}
export class  RepOut{
  nombre: string = '';
  apellido: string = '';
  imagen: string = '';
  direccion: string = '';
  tipo_usuario:string = 'repartidor';
  telefono: number = 0;
  puntaje:any;
  email: string = '';
};
export class  RepartOut{
  disponibilidad: string = 'No disponible';
  id_usuario:any;
  licencia_conducir: string = '';
  vehiculo: string = '';
};
export class repartFull{
  nombre: string = '';
  apellido: string = '';
  imagen: string = '';
  direccion: string = '';
  tipo_usuario:string = 'repartidor';
  telefono: number = 0;
  puntaje:any;
  email: string = '';
  disponibilidad: string = 'No disponible';
  licencia_conducir: string = '';
  vehiculo: string = '';
}