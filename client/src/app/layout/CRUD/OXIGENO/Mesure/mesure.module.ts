import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MesureRoutingModule } from './mesure-routing.module';
import { MesureComponent } from './mesure.component';
import { MesureService } from './../../../../services/CRUD/OXIGENO/mesure.service';
import { environment } from 'src/environments/environment';

@NgModule({
   imports: [CommonModule,
             MesureRoutingModule,
             FormsModule],
   declarations: [MesureComponent],
   providers: [
               NgbModal,
               MesureService
               ]
})
export class MesureModule {}