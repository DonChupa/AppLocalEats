import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private storage: Storage) { this.init(); }

// inicializar ionic storage
  async init() {
    const storage = await this.storage.create();

  }
  async set(key: string, value: any) {
    await this.storage.set(key, value);
  }
// crear o cambiar valores
  async setItem(id: string, value: any){
    await this.storage.set(id, value);
  }

// obtener valores
  async getItem(id: string) {
    return await this.storage.get(id);
  }

// borrar valores
  async removeItem(id: string){
    await this.storage.remove(id);
  }
}
