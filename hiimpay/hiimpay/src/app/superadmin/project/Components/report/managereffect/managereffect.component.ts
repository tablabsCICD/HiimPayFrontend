import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexFill,
  ApexLegend
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  fill: ApexFill;
  legend: ApexLegend;
};


@Component({
  selector: 'app-managereffect',
  templateUrl: './managereffect.component.html',
  styleUrl: './managereffect.component.css'
})
export class ManagereffectComponent {
  chartOptions: any;

  constructor(private dialogRef: MatDialogRef<ManagereffectComponent>){
    this.chartOptions = {
      series: [
        {
          name: "Agree",
          data: [44, 55, 41, 37, 22, 43, 21]
        },
        {
          name: "Strongly agree",
          data: [53, 32, 33, 52, 13, 43, 32]
        },
        {
          name: "Disagree",
          data: [12, 17, 11, 9, 15, 11, 20]
        },
        {
          name: "Strongly disagree",
          data: [9, 7, 5, 8, 6, 9, 4]
        },
        {
          name: "Neither agree or disagree",
          data: [9, 7, 5, 8, 6, 9, 4]
        },
      ],
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        stackType: "100%"
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      stroke: {
        width: 1,
        colors: ["#fff"]
      },
      xaxis: {
        categories: [' I Am Proud To Invite Friends Or Visitors To My Workplace', ' Facilities Available In My Workplace Are Sufficient And Well Maintained', 'I Have Opportunities To Learn And Grow On The Job', ' I Understand How My Role Impacts The End Customer', ' I Feel My Skills Are Being Used In My Current Role','Our Organisation’s Purpose Makes A Positive Contribution To Wider Society',' We Appreciate Each Other And Treat Everyone Fairly And Equally']
      },
      tooltip: {
        y: {
          formatter: function(val: string) {
            return val + "";
          }
        }
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40
      },
      colors: ['#103a7f', '#2980b9', '#069de0', '#103a7f', '#7ec5f8'] 
  }
}

  ngOnInit(): void {
  
  }
  onClose(): void {
    this.dialogRef.close();
  }
}
