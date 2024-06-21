import { Injectable } from '@angular/core';
import { database } from 'src/environments/environment';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ref, DataSnapshot, onValue, remove, push, update, get, set } from 'firebase/database';
import { DataService } from '../DataService/data.service';

const repRef = ref(database, 'Usuarios');
const repartRef = ref(database, 'Repartidores');
const restRef = ref(database,'Restaurante');
const prodRef = ref(database,'Productos');
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private data: DataService) { }

  loadClient(email: string): Observable<RepOut[]> {
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
              key: key,
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
      key: key,
    };
    update(userRef, nuevoUser)
    .then(() => {
      console.log('listo');
    })
    .catch((error) => {
      console.error('Error:', error);
    });

    
  }

  LoadRest(email: string): Observable<RestIn[]> {
    return new Observable<RestIn[]>((subscriber) => {
      const unsubscribe = onValue(repartRef, (snapshot: DataSnapshot) => {
        if (!snapshot.exists()) {
          console.log('No se encontraron datos en Firebase');
          subscriber.next([]);
          return;
        }
        const data = snapshot.val();
          const rest: RestIn[] = Object.keys(data)
            .filter((key) => data[key].id_usuario == email)
            .map((key) => ({
              direccion: data[key].direccion,
              h_apertura: data[key].h_apertura,
              h_cierre: data[key].h_cierre,
              id: key,
              id_user: data[key].id_user,
              nombre: data[key].nombre,
              telefono: data[key].telefono,
              imagen: data[key].imagen,
            }));
          subscriber.next(rest);
      }, (error) => {
        console.error('Error al obtener datos de Firebase:', error);
        subscriber.error(error);
      });
  
      return () => {
        unsubscribe();
      };
    });
  }

  
  async AddRest(nombre: string, email: string, tefono: number, apellido: string) {
    const hola : string='';
    const hol : string='restaurante';
    const img : string = 'https://www.corazon.cl/wp-content/uploads/2018/05/640-1448125125819-1.jpg';
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
      key: hola,
    };
    const newRef = await push(repRef, nuevoclient);
    const key = newRef.key;
    if (key !== null){
    nuevoclient.key = key;
     update(newRef, nuevoclient);
    }else{
      console.log('key es null');
    }
  }

  async AddProd(desc : string, id_rest: any, nombre: string, precio: number, imagen: any){
    const id = '';
    const NweProd : ProdIn = {
      desc: desc,
      id: id,
      id_rest: id_rest,
      nombre: nombre,
      precio: precio,
      imagen: imagen,
      }
    const newRef = await push(prodRef, NweProd);
    const key = newRef.key;
    if (key !== null){
    NweProd.id = key;
    update(newRef, NweProd);
    console.log('hey hey hey chavalines');
    }else{
      console.log('key es null');
    }
  }

  async UpdProd(NweProd: ProdIn) {
    const key = NweProd.id;
    if (key) {
      try {
        await update(ref(database, `Productos/${key}`), NweProd);
        console.log('Producto actualizado exitosamente');
      } catch (error) {
        console.error('Error al actualizar el producto:', error);
      }
    } else {
      console.error('ID del producto no válido');
    }
  }

  RemoveProd(key: any) {
    remove(ref(database,`Productos/${key}`))
      .then(() => {
        console.log('producto eliminado exitosamente.');
      })
      .catch((error) => {
        console.error('Error al eliminar producto:', error);
      });
  }
  //////////////////////////////////
}
export class  RepOut{
  nombre: string = '';
  apellido: string = '';
  imagen: string = '';
  direccion: string = '';
  tipo_usuario:string = 'restaurante';
  telefono: number = 0;
  puntaje:any;
  email: string = '';
  key: string= '';
};
export class ProdIn {
  desc: string = '';
  id: string= '';
  id_rest: string = '';
  nombre: string = '';
  precio: number= 0;
  imagen:string = '';
}
export class RestIn {
  direccion: string = '';
  h_apertura: string = '';
  h_cierre: string = '';
  id: string = '';
  id_user: string = '';
  nombre: string = '';
  telefono: string= '';
  imagen: string = '';
}
export class PedidOut{
cantidad: number = 1;
estado: string = '';
id_usuario: any;
productos: any;
precio: number = 0;
key: any;
};

export class EntregOut{
  direccion: string = '';
  estado:string = '';
  id_repartidor: any;
  key: any;
  pedidos:string = '';
  
};