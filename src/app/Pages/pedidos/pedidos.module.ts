import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidosPageRoutingModule } from './pedidos-routing.module';
import { SearchPedidoComponent } from 'src/app/Components/search-pedido/search-pedido.component';
import { PedidosPage } from './pedidos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedidosPageRoutingModule
  ],
  declarations: [PedidosPage, SearchPedidoComponent]
})
export class PedidosPageModule {}
