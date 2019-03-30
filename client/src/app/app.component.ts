import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  url = 'http://localhost/server/';

  barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  barChartLabels: string[] = [];
  barChartType: string = 'line';
  barChartLegend: boolean = true;
  barChartData: any[] = [];
  listo = false;
  constructor(private http: Http) {

  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.listo = false;
    this.barChartLabels = [];
    this.barChartData = [];
    this.http.get(this.url + 'getRegisters').toPromise().then( r=> {
      const datos = r.json();
      const dataIn = [];
      datos.forEach(dato => {
        this.barChartLabels.push(dato.moment);
        dataIn.push(dato.mesure);
      });
      this.barChartData.push({ data: dataIn, label: 'Oxígeno' });
      this.listo = true;
    }).catch( e=> { console.log(e) });
  }


}
