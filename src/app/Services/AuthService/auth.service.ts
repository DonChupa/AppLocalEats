import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';  
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataService } from '../DataService/data.service';
import { DatabaseService, RepOut } from '../DatabaseService/database.service';


// @ts-ignore
export interface DocumentSnapshotExists<T> extends firebase.firestore.DocumentSnapshot {

}

@Injectable({
  providedIn: 'root',
})


export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  checkAuthentication(): boolean {
    return this.isAuthenticated.value;
  }
  getIsAuthenticated(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }
  constructor(private afAuth: AngularFireAuth, 
              private router: Router, 
              private data : DataService,
              private db: DatabaseService)
   {this.exist();
   }
  // metodo crear cuenta con manejo de errores
  async signIn(email: string, password: string): Promise<boolean> {
    try {
      const verif = await this.signInWithEmailAndPassword(email, password);
      if (verif){
        this.isAuthenticated.next(true);
        console.log('exito');
        console.log(this.isAuthenticated.value);
        this.router.navigate(['/user']);
        return true;
      }else{
        return false;
      }
      
    } catch (error) {
      console.log("Error al iniciar sesión: ", error);
      return false;
    }
  }
  signInWithEmailAndPassword(e: string, p: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.loadClient(e).subscribe({
        next: (data: RepOut[]) => {
          const rep = data[0];
          if (rep && rep.pass == p) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error: (error) => {
          // Manejo de errores
          console.error('Error cargando repartidores:', error);
          reject(false);
        }
      });
    });
  }
  // metodo iniciar sesión con manejo de errores
  
  async signUp(repp : RepOut): Promise<any> {
    try {
       this.db.AddClient(repp);
        return true;
    } catch (error) {
        if (error !== null && typeof error === 'object' && 'message' in error) {
            console.log("Error al registrar:", error.message);
            return error.message;
        } else {
            console.log("Error desconocido al registrar:", error);
            return "Error desconocido al intentar registrar.";
        }
    }
}
// colgarse
async signOut(): Promise<void> {
  await this.afAuth.signOut();
  this.isAuthenticated.next(false);
};

// no me acuerdo que hace pero si se borra no funciona
async exist(){
 try {

    const existe = await this.data.getItem('rest');
    
    console.log('funciona biennn');
    this.signIn(existe[0], existe[1]);
} catch (error) {
  console.log('Errorrrr');
};
}
}