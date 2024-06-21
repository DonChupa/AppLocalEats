import { Component, NgModule, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/Services/AuthService/auth.service';
import { DatabaseService, RepOut } from 'src/app/Services/DatabaseService/database.service';
import { DataService } from 'src/app/Services/DataService/data.service';

// @ts-ignore

export interface DocumentSnapshotExists<T> extends firebase.firestore.DocumentSnapshot {
  // ...
}



@Component({
  selector: 'app-registro',
  templateUrl: './registro.Component.html',
  styleUrls: ['./registro.component.scss'],
})


export class RegistroComponent implements OnInit {
  
 // variables conectadas al formulario
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  nombre: string= '';
  apellido: string= '';
  telefono: number = 0;


  constructor(private authService: AuthService, private router: Router, private db : DatabaseService, private data : DataService) { }
  ngOnInit(){}

  // metodo llama a AuthService para registrar, luego, si es efectivo el registro, inicia sesion
  async register() {
    if (!this.email || !this.password || !this.nombre || !this.apellido || !this.telefono) {
      this.errorMessage = 'Por favor, completa todos los campos.';
    } else {
    try {
    const result = await this.authService.signUp(this.email, this.password);
    if (result == true) {
      this.authService.signIn(this.email, this.password);
      const rest = [this.email, this.password];
      this.data.setItem('rest', rest);
      this.db.AddRest(this.nombre, this.email, this.telefono, this.apellido);
      this.router.navigate(['/main']);
    }}
    catch (error) {
      console.log('Error durante el registro:', error);
    }
  }
}
}