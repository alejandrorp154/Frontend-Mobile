import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AltaEventoPage } from './alta-evento.page';

const routes: Routes = [
  {
    path: '',
    component: AltaEventoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AltaEventoPageRoutingModule {}
