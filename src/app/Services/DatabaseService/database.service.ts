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
const pedRef = ref(database, 'Pedido');
const EntreRef = ref(database,'Entrega');
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
              pass: data[key].pass,
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




  UpdateAdmin(nuevoUser : RepOut){
    const key = nuevoUser.key;
    const userRef = ref(database, `Usuarios/${key}`);
    update(userRef, nuevoUser)
    .then(() => {
      console.log('listo');
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  UpdateRest(newRest : RestIn){
      const key = newRest.id;
      const newRef = ref(database, `Restaurante/${key}`);
      update(newRef, newRest);
  }
  LoadProds(id : any): Observable<ProdIn[]> {
    return new Observable<ProdIn[]>((subscriber) => {
      const unsubscribe = onValue(prodRef, (snapshot: DataSnapshot) => {
        const data = snapshot.val();
        if (data) {
          const prods: ProdIn[] = Object.keys(data)
          .filter((key) => data[key].id_restaurante == id).map((key) => ({
            descripcion : data[key].descripcion,
            imagen: data[key].imagen,
            id : key,
            id_restaurante : data[key].id_restaurante,
            nombre : data[key].nombre,
            precio : data[key].precio,
          }));
          subscriber.next(prods);
        } else {
          subscriber.next([]);
        }
      });
      return () => {
        unsubscribe();
      };
    });
  }
  LoadPed(c: string, r:string): Observable<PedidOut[]> {
    return new Observable<PedidOut[]>((subscriber) => {
      const unsubscribe = onValue(pedRef, (snapshot: DataSnapshot) => {
        if (!snapshot.exists()) {
          console.log('No se encontraron datos en Firebase');
          subscriber.next([]);
          return;
        }
        const data = snapshot.val();
          const peds: PedidOut[] = Object.keys(data)
           .filter((key) => (data[key].estado == c && data[key].id_rest == r))
            .map((key) => ({
              cantidad: data[key].cantidad,
              estado: data[key].estado,
              id_usuario: data[key].id_usuario,
              producto: data[key].producto,
              precio: data[key].precio,
              key: key,
            }));
          subscriber.next(peds);
      }, (error) => {
        console.error('Error al obtener datos de Firebase:', error);
        subscriber.error(error);
      });
  
      return () => {
        unsubscribe();
      };
    });
  }
  deletePred(key : any){
    remove(ref(database,`Pedido/${key}`));
  }

  LoadRest(email: string): Observable<RestIn[]> {
    return new Observable<RestIn[]>((subscriber) => {
      const unsubscribe = onValue(restRef, (snapshot: DataSnapshot) => {
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
              id_usuario: data[key].id_usuario,
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

  
  async AddClient(nuevoclient : RepOut) {
    nuevoclient.tipo_usuario = 'restaurante';
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
      descripcion: desc,
      id: id,
      id_restaurante: id_rest,
      nombre: nombre,
      precio: precio,
      imagen: imagen,
      }
    const newRef = await push(prodRef, NweProd);
    const key = newRef.key;
    if (key !== null){
    NweProd.id = key;
    update(newRef, NweProd);
    }
  }

  async UpdProd(NweProd: ProdIn) {
    console.log(NweProd);
    const key = NweProd.id;
    if (key !== null) {
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
  async UpdPd(NweProd: PedidOut) {
    console.log(NweProd);
    const key = NweProd.key;
    if (key !== null) {
      try {
        await update(ref(database, `Pedido/${key}`), NweProd);
        console.log('Producto actualizado exitosamente');
      } catch (error) {
        console.error('Error al actualizar el pedido:', error);
      }
    } else {
      console.error('ID del pedido no válido');
    }
  }

  RemoveProd(p: ProdIn) {
    remove(ref(database,`Productos/${p.id}`))
      .then(() => {
        console.log('producto eliminado exitosamente.');
      })
      .catch((error) => {
        console.error('Error al eliminar producto:', error);
      });
  }
  LoadClicli(): Observable<RepOut[]> {
    return new Observable<RepOut[]>((subscriber) => {
      const unsubscribe = onValue(repRef, (snapshot: DataSnapshot) => {
        if (!snapshot.exists()) {
          console.log('No se encontraron datos en Firebase');
          subscriber.next([]);
          return;
        }
        const data = snapshot.val();
          const rep: RepOut[] = Object.keys(data)
            .map((key) => ({
              nombre: data[key].nombre,
              apellido:  data[key].apellido,
              imagen:  data[key].imagen,
              direccion:  data[key].direccion,
              tipo_usuario: data[key].tipo_usuario,
              telefono:  data[key].telefono,
             puntaje: data[key].puntaje,
             email:  data[key].email,
             key:  key,
             pass : data[key].pass,
            }));
          subscriber.next(rep);
      }, (error) => {
        console.error('Error al obtener datos de Firebase:', error);
        subscriber.error(error);
      });
  
      return () => {
        unsubscribe();
      };
    });
  }
  async AddEntrega(pedido : PedidOut[], repartidor : RepOut){
    const newEntrega:EntregOut = {
      direccion:'',
      estado: pedido[0].estado,
      id_repartidor: repartidor.key,
      key: '',
      pedidos: pedido,
    };
    const newRef = await push(EntreRef, newEntrega);
    const key = newRef.key;
    if(key !== null){
      newEntrega.key = key;
      update(newRef,newEntrega);
    }
    
  }
  LoadRepart(): Observable<RepartOut[]> {
    return new Observable<RepartOut[]>((subscriber) => {
      const unsubscribe = onValue(repartRef, (snapshot: DataSnapshot) => {
        if (!snapshot.exists()) {
          console.log('No se encontraron datos en Firebase');
          subscriber.next([]);
          return;
        }
        const data = snapshot.val();
          const rep: RepartOut[] = Object.keys(data)
          .filter((key) => data[key].estado == 'Disponible')
            .map((key) => ({
              disponibilidad: data[key].disponibilidad,
              id_usuario:data[key].id_usuario,
              licencia_conducir: data[key].licencia_conducir,
              vehiculo: data[key].vehiculo,
              key : key,
            }));
          subscriber.next(rep);
      }, (error) => {
        console.error('Error al obtener datos de Firebase:', error);
        subscriber.error(error);
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
  tipo_usuario:string = 'restaurante';
  telefono: number | undefined = 0;
  puntaje:any;
  email: string = '';
  key: string= '';
  pass: string= '';
};
export class ProdIn {
  descripcion: string = '';
  id: string= '';
  id_restaurante: any = '';
  nombre: string = '';
  precio: number= 0;
  imagen:string = '';
}
export class RestIn {
  direccion: string = '';
  h_apertura: string = '';
  h_cierre: string = '';
  id: string = '';
  id_usuario: string = '';
  nombre: string = '';
  telefono: string= '';
  imagen: string = '';
}
export class PedidOut{
cantidad: number = 1;
estado: string = '';
id_usuario: any;
producto: any;
precio: number = 0;
key: any;
};

export class EntregOut{
  direccion: string = '';
  estado:string = '';
  id_repartidor: any;
  key: any;
  pedidos: any= '';
  
};
export class  RepartOut{
  disponibilidad: string = 'No disponible';
  id_usuario:any;
  licencia_conducir: string = '';
  vehiculo: string = '';
  key : any;
};
//// Disponible