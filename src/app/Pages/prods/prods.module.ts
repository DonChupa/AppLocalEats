import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProdsPageRoutingModule } from './prods-routing.module';

import { ProdsPage } from './prods.page';
import { CrudProdComponent } from 'src/app/Components/crud-prod/crud-prod.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProdsPageRoutingModule
  ],
  declarations: [ProdsPage, CrudProdComponent]
})
export class ProdsPageModule {}
