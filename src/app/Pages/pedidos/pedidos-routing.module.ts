import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchPedidoComponent } from 'src/app/Components/search-pedido/search-pedido.component';
import { PedidosPage } from './pedidos.page';

const routes: Routes = [
  {
    path: '',
    component: PedidosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidosPageRoutingModule {}
