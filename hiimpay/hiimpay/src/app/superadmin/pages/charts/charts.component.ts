import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.css'
})
export class ChartsComponent implements OnInit {

  ngOnInit(): void {
 
  }


  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [ 'Survey 1', 'Survey 2', 'Survey 3', 'Survey 4'],
    datasets: [
      { data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'Attempted' },
      { data: [ 28, 48, 40, 19, 86, 27, 90 ], label: ' Not Attempted' }
    ]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };


}
