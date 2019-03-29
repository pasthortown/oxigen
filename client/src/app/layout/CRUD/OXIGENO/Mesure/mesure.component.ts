import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { saveAs } from 'file-saver/FileSaver';
import { MesureService } from './../../../../services/CRUD/OXIGENO/mesure.service';
import { Mesure } from './../../../../models/OXIGENO/Mesure';

@Component({
   selector: 'app-mesure',
   templateUrl: './mesure.component.html',
   styleUrls: ['./mesure.component.scss']
})
export class MesureComponent implements OnInit {
   mesures: Mesure[] = [];
   mesureSelected: Mesure = new Mesure();

   currentPage = 1;
   lastPage = 1;
   showDialog = false;
   recordsByPage = 5;
   constructor(
               private modalService: NgbModal,
               private toastr: ToastrManager,
               private mesureDataService: MesureService) {}

   ngOnInit() {
      this.goToPage(1);
   }

   selectMesure(mesure: Mesure) {
      this.mesureSelected = mesure;
   }

   goToPage(page: number) {
      if ( page < 1 || page > this.lastPage ) {
         this.toastr.errorToastr('La página solicitada no existe.', 'Error');
         return;
      }
      this.currentPage = page;
      this.getMesures();
   }

   getMesures() {
      this.mesures = [];
      this.mesureSelected = new Mesure();
      this.mesureDataService.get_paginate(this.recordsByPage, this.currentPage).then( r => {
         this.mesures = r.data as Mesure[];
         this.lastPage = r.last_page;
      }).catch( e => console.log(e) );
   }

   newMesure(content) {
      this.mesureSelected = new Mesure();
      this.openDialog(content);
   }

   editMesure(content) {
      if (typeof this.mesureSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.openDialog(content);
   }

   deleteMesure() {
      if (typeof this.mesureSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.mesureDataService.delete(this.mesureSelected.id).then( r => {
         this.toastr.successToastr('Registro Borrado satisfactoriamente.', 'Borrar');
         this.getMesures();
      }).catch( e => console.log(e) );
   }

   backup() {
      this.mesureDataService.getBackUp().then( r => {
         const backupData = r;
         const blob = new Blob([JSON.stringify(backupData)], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_Mesures.json');
      }).catch( e => console.log(e) );
   }

   toCSV() {
      this.mesureDataService.get().then( r => {
         const backupData = r as Mesure[];
         let output = 'id;sensor_value;moment\n';
         backupData.forEach(element => {
            output += element.id; + element.sensor_value + ';' + element.moment + '\n';
         });
         const blob = new Blob([output], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_Mesures.csv');
      }).catch( e => console.log(e) );
   }

   decodeUploadFile(event) {
      const reader = new FileReader();
      if (event.target.files && event.target.files.length > 0) {
         const file = event.target.files[0];
         reader.readAsDataURL(file);
         reader.onload = () => {
            const fileBytes = reader.result.toString().split(',')[1];
            const newData = JSON.parse(decodeURIComponent(escape(atob(fileBytes)))) as any[];
            this.mesureDataService.masiveLoad(newData).then( r => {
               this.goToPage(this.currentPage);
            }).catch( e => console.log(e) );
         };
      }
   }

   openDialog(content) {
      this.modalService.open(content, { centered: true }).result.then(( response => {
         if ( response === 'Guardar click' ) {
            if (typeof this.mesureSelected.id === 'undefined') {
               this.mesureDataService.post(this.mesureSelected).then( r => {
                  this.toastr.successToastr('Datos guardados satisfactoriamente.', 'Nuevo');
                  this.getMesures();
               }).catch( e => console.log(e) );
            } else {
               this.mesureDataService.put(this.mesureSelected).then( r => {
                  this.toastr.successToastr('Registro actualizado satisfactoriamente.', 'Actualizar');
                  this.getMesures();
               }).catch( e => console.log(e) );
            }
         }
      }), ( r => {}));
   }
}