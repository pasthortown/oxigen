import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MesureComponent } from './mesure.component';

const routes: Routes = [
   {
      path: '',
      component: MesureComponent
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class MesureRoutingModule {}
