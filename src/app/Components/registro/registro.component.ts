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
  admin : RepOut = {
    nombre: '',
    apellido: '',
    telefono: undefined,
    email: '',
    pass: '',
    imagen: '',
    direccion: '',
    tipo_usuario: 'restaurante',
    puntaje: '',
    key: '',

  } 
errorMessage = ''


  constructor(private authService: AuthService, private router: Router, private db : DatabaseService, private data : DataService) { }
  ngOnInit(){}

  // metodo llama a AuthService para registrar, luego, si es efectivo el registro, inicia sesion
  async register() {
    if (!this.admin.email || !this.admin.pass || !this.admin.nombre || !this.admin.apellido || !this.admin.telefono) {
      this.errorMessage = 'Por favor, completa todos los campos.';
    } else {
    try {
    const result = await this.authService.signUp(this.admin);
    if (result == true) {
      this.authService.signIn(this.admin.email, this.admin.pass);
      const rest = [this.admin.email, this.admin.pass];
      this.data.setItem('rest', rest);
      this.router.navigate(['/main']);
    }}
    catch (error) {
      console.log('Error durante el registro:', error);
    }
  }
}
}