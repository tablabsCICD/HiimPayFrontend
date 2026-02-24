import { Component } from '@angular/core';

@Component({
  selector: 'app-infographic',
  templateUrl: './infographic.component.html',
  styleUrl: './infographic.component.css'
})
export class InfographicComponent {
//   getJourneyMapData() {
//     this.isLoading = true;
//     this.service.journeyMapnByClientId(sessionStorage.getItem('ClientId')).subscribe({
//       next: (res: any) => {
//         this.isLoading = false;
//         this.data = res.data;
//         console.log(this.data);

//         this.responseData = this.data.responseOuterChart;
//         console.log(this.responseData);

//         this.updateChartData();
//         const labels = Object.keys(this.responseData);
//         const values = Object.values(this.responseData);

//         // this.renderChart(labels, values);
//       },
//       error: () => {
//         this.isLoading = false;
//       },
//       complete: () => {},
//     });
//   }
//   public barChartData: ChartConfiguration<'bar'>['data'] = {
//     labels: [],
//     datasets: [
//       {
//         data: [],
//         backgroundColor: '#103a7f',
//       },
//     ],
//   };
//  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
//     responsive: true,
//     indexAxis: 'y',  // Ensure the chart is horizontal
//     scales: {
//       x: {
//         beginAtZero: true
//       }
//     }
//   };
//   updateChartData() {
//     if (this.responseData) {
//       const labels = Object.keys(this.responseData);
//       const values = Object.values(this.responseData).map(value => Number(value));

//       this.barChartData.labels = labels;
//       this.barChartData.datasets[0].data = values;

//       // Update the chart
//       this.chart?.update();
//     }
//   }







// setTimeout(() => {
  //   this.barChart = new Chart('barChartCanvas', {
  //     type: 'line',
  //     data: {
  //       labels: ['Attract', 'Onboard', 'Develop', 'Retain', 'Separate'],
  //       datasets: [
  //         {
  //           data: this.surveyDatagraph,
  //           label: 'Survey',
  //           borderColor: '#103a7f',
  //           backgroundColor: '#103a7f',
  //           tension: 0.4,
  //           fill: false,
  //           pointRadius: 5,
  //           pointBackgroundColor: '#069de0',
  //           pointBorderColor: 'white',
  //         },
  //         {
  //           data: this.realityDatagraph,
  //           label: 'Reality',
  //           borderColor: '#2980b9',
  //           backgroundColor: '#2980b9',
  //           tension: 0.4,
  //           fill: false,
  //           pointRadius: 5,
  //           pointBackgroundColor: '#103a7f',
  //           pointBorderColor: 'white',
  //         },
  //         {
  //           data: this.touchpointDatagraph,
  //           label: 'Touchpoint',
  //           borderColor: '#103a7f',
  //           backgroundColor: '#103a7f',
  //           tension: 0.4,
  //           fill: false,
  //           pointRadius: 5,
  //           pointBackgroundColor: '#069de0',
  //           pointBorderColor: 'white',
  //         },
  //       ],
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true,
  //           max: 100,
  //           min: 0,
  //         },
  //       },
  //       elements: {
  //         line: {
  //           borderWidth: 2,
  //         },
  //       },
  //     },
  //   });
  // }, 1000);
}
