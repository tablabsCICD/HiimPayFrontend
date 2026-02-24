import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { StartstekholderComponent } from '../touchpoint-stakeholders/startstekholder/startstekholder.component';

import { TouchpointService } from '../../../../services/touchpoint.service';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Chart, ChartConfiguration } from 'chart.js';
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
  ApexLegend,
} from 'ng-apexcharts';
import { BaseChartDirective } from 'ng2-charts';

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
  selector: 'app-infochart',
  templateUrl: './infochart.component.html',
  styleUrl: './infochart.component.css',
})
export class InfochartComponent implements OnInit {
  barChart: any = [];
  public lineChartLegend = true;
  public lineChartPlugins = [];
  lineChartData: any;
  id: any;
  graphData: any;
  realityValues: any;
  qualityValues: any;
  stageName: any;
  touchpoint: any;
  datatouchPointStakeHolders: any;
  touchPointStakeHoldersLabels: any;
  touchPointLabels: any;
  touchPointEfficiencies:any;
  touchPointEfficiencies2:any;
  stages: any;
  survey:any;
  private colors: string[] = [
    '#103a7f',
    '#2980b9',
    '#747687',
    '#103a7f',
    '#2B3A67',
    '#103a7f',
    '#103a7f',
     // Shades of Light Blue (#103a7f)
     '#A0D8FF', // Softer Sky Blue
     '#4A90E2', // Medium Sky Blue
 
     // Shades of Deep Blue (#2980b9)
     '#1F618D', // Muted Deep Blue
     '#5DADE2', // Soft Pastel Blue
 
     // Shades of Grayish Blue (#747687)
     '#8B8D98', // Slightly Lighter Grayish Blue
     '#565A63', // Darker Grayish Blue
 
     // Shades of Darker Blue (#103a7f)
     '#1A4780', // Midnight Blue
     '#3C6FB6', // Soft Cobalt Blue
 
     // Shades of Navy Blue (#2B3A67)
     '#1E2E4F', // Dark Navy
     '#515C87', // Steel Blue
 
     // Additional Colors for Better Differentiation
     '#89CFF0', // Bright Sky Blue
     '#2874A6', // Ocean Blue
     '#6C757D', // Neutral Gray
     '#154360', // Dark Teal
     '#3B4F73', // Bluish Gray
  ];
  constructor(
    private dialogRef: MatDialogRef<StartstekholderComponent>,
    @Inject(DIALOG_DATA) public data: { id: number },
    private api: TouchpointService
  ) {}

  ngOnInit(): void {
    this.id = sessionStorage.getItem("ClientId")
    console.log(this.id);
    this.api.toucpointGraph(this.id).subscribe((res: any) => {
      console.log(res);
      this.graphData = res.data;
      this.stageName = this.graphData.stageName;
      this.survey = this.graphData.stages;
      this.clickOnStage(this.survey[0]);
      // this.touchpoint = this.graphData.touchPoint;
      // this.datatouchPointStakeHolders =  this.graphData.touchPointStakeHolders;
      // this.touchPointEfficiencies = this.graphData.touchPointEfficiencies;
      // this.setChartData(this.touchPointEfficiencies);
      // const ownershipCategories2 = new Set<string>();
   
      // this.touchPointLabels = this.touchpoint.map(
      //   (itemLabel: any) => itemLabel.subphaseName
      // );

      // this.touchpoint.forEach((stage: any) => {
      //   Object.keys(stage.touchPointData).forEach((categoryData) => {
      //     ownershipCategories2.add(categoryData);
      //   });
      // });
     
      // const datasets2 = Array.from(ownershipCategories2).map(
      //   (category, index) => {
      //     return {
      //       label: category,
      //       data: this.touchpoint.map(
      //         (stage: any) => stage.touchPointData[category] || 0
      //       ),
      //       backgroundColor: this.colors[index % this.colors.length],
      //     };
      //   }
      // );

      // this.efficiencyData2 = {
      //   labels: this.touchPointLabels,
      //   datasets: datasets2,
      // };

      // const ownershipCategories = new Set<string>();
     
      // this.touchPointStakeHoldersLabels = this.datatouchPointStakeHolders.map(
      //   (stage: any) => stage.label
      // );

      // this.datatouchPointStakeHolders.forEach((stage: any) => {
      //   Object.keys(stage.ownershipData).forEach((category) => {
      //     ownershipCategories.add(category);
      //   });
      // });
      // const datasets = Array.from(ownershipCategories).map(
      //   (category, index) => {
      //     return {
      //       label: category,
      //       data: this.datatouchPointStakeHolders.map(
      //         (stage: any) => stage.ownershipData[category] || 0
      //       ),
      //       backgroundColor: this.colors[index % this.colors.length],
      //     };
      //   }
      // );

      // this.efficiencyData = {
      //   labels: this.touchPointStakeHoldersLabels,
      //   datasets: datasets,
      // };

      this.lineChartData = this.graphData.lineOuterChart;
      const labels = this.lineChartData.map((item: any) => {
        const trimmedLabel = item.label.trim();
        const words = trimmedLabel.split(' ');
        const firstTwoWords = words.slice(0, 1).join('');
        return firstTwoWords;
      });
      this.realityValues = this.lineChartData.map(
        (item: any) => item.realityValue
      );
      this.qualityValues = this.lineChartData.map(
        (item: any) => item.qualityValue
      );
      setTimeout(() => {
        this.barChart = new Chart('barChartCanvas', {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                data: this.realityValues,
                label: 'EX foundations  reality',
                borderColor: '#2980b9',
                backgroundColor: '#2980b9',
                tension: 0.4,
                fill: false,
                pointRadius: 5,
                pointBackgroundColor: '#103a7f',
                pointBorderColor: 'white',
              },
              {
                data: this.qualityValues,
                label: 'EX foundations Quality',
                borderColor: '#069de0',
                backgroundColor: '#069de0',
                tension: 0.4,
                fill: false,
                pointRadius: 5,
                pointBackgroundColor: '#069de0',
                pointBorderColor: 'white',
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                min: 0,
              },
            },
            elements: {
              line: {
                borderWidth: 2,
              },
            },
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
              },
              tooltip: {
                enabled: true,
              },
            },
          },
        });
      }, 1000);
    });
  }

clickOnStage(stageDetail: any){
  console.log(stageDetail);

  this.graphData.stages.forEach((val: any) => (val.clicked = false));

  stageDetail.clicked = true;

  this.stageName = stageDetail.stageName;

  this.stages = stageDetail;

  this.datatouchPointStakeHolders = stageDetail?.touchPointStakeHolders;
  this.touchpoint = stageDetail?.touchPoint;
  this.touchPointEfficiencies = stageDetail?.touchPointEfficiencies;
  this.touchPointEfficiencies2 = stageDetail?.touchPointEfficiencies2;

   this.setChartData(this.touchPointEfficiencies);
   this.setChartDataForInternalExternal(this.touchPointEfficiencies2);
      const ownershipCategories2 = new Set<string>();
   
      this.touchPointLabels = this.touchpoint.map(
        (itemLabel: any) => itemLabel.subphaseName
      );

      this.touchpoint.forEach((stage: any) => {
        Object.keys(stage.touchPointData).forEach((categoryData) => {
          ownershipCategories2.add(categoryData);
        });
      });
     

      const sortedCategories = Array.from(ownershipCategories2).map(category => category.trim()).sort();
      this.ensureUniqueColors(sortedCategories.length);
      const datasets2 = Array.from(sortedCategories).map(
        (category, index) => {
          return {
            label: category,
            data: this.touchpoint.map(
              (stage: any) => stage.touchPointData[category] || 0
            ),
            backgroundColor: this.colors[index % this.colors.length],
          };
        }
      );

      this.efficiencyData2 = {
        labels: this.touchPointLabels,
        datasets: datasets2,
      };

      const ownershipCategories = new Set<string>();
     
      this.touchPointStakeHoldersLabels = this.datatouchPointStakeHolders.map(
        (stage: any) => stage.label
      );

      this.datatouchPointStakeHolders.forEach((stage: any) => {
        Object.keys(stage.ownershipData).forEach((category) => {
          ownershipCategories.add(category);
        });
      });

      // const sortedCategories = Array.from(ownershipCategories2)
      // .map(category => category.trim()) // Trim spaces before sorting
      // .sort();

      const sorteddataset = Array.from(ownershipCategories).map(category => category.trim()).sort();
      this.ensureUniqueColors(sorteddataset?.length);
      const datasets = Array.from(sorteddataset).map(
        (category, index) => {
          return {
            label: category,
            data: this.datatouchPointStakeHolders.map(
              (stage: any) => stage.ownershipData[category] || 0
            ),
            backgroundColor: this.colors[index % this.colors.length],
          };
        }
      );

      this.efficiencyData = {
        labels: this.touchPointStakeHoldersLabels,
        datasets: datasets,
      };
}


  setChartData(data: any) {
    const labels = data.map((item: any) => item.subphaseName);
    const partiallyAutomated = data.map((item: any) => item.partiallyAutomated);
    // const internalSystem = data.map((item: any) => item.internalSystem);
    // const externalSystem = data.map((item: any) => item.externalSystem);
    const automated = data.map((item: any) => item.automated);
    const manual = data.map((item: any) => item.manual);
    
    this.efficiencyData3 = {
      labels: labels,
      datasets: [
        {
          label: 'Partially Automated',
          data: partiallyAutomated,
          backgroundColor: '#103a7f',
        },
        // {
        //   label: 'Internal System',
        //   data: internalSystem,
        //   backgroundColor: '#2980b9',
        // },
        // {
        //   label: 'External System',
        //   data: externalSystem,
        //   backgroundColor: '#747687 ',
        // },
        {
          label: 'Automated',
          data: automated,
          backgroundColor: '#103a7f ',
        },
        {
          label: 'Manual',
          data: manual,
          backgroundColor: '#2B3A67 ',
        },
      ],
    };
  }

  setChartDataForInternalExternal(data: any) {
    const labels = data.map((item: any) => item.subphaseName);
    // const partiallyAutomated = data.map((item: any) => item.partiallyAutomated);
    const internalSystem = data.map((item: any) => item.internalSystem);
    const externalSystem = data.map((item: any) => item.externalSystem);
    // const automated = data.map((item: any) => item.automated);
    // const manual = data.map((item: any) => item.manual);
    this.efficiencyData4 = {
      labels: labels,
      datasets: [
        // {
        //   label: 'Partially Automated',
        //   data: partiallyAutomated,
        //   backgroundColor: '#103a7f',
        // },
        {
          label: 'Internal System',
          data: internalSystem,
          backgroundColor: '#2980b9',
        },
        {
          label: 'External System',
          data: externalSystem,
          backgroundColor: '#747687 ',
        },
        // {
        //   label: 'Automated',
        //   data: automated,
        //   backgroundColor: '#103a7f ',
        // },
        // {
        //   label: 'Manual',
        //   data: manual,
        //   backgroundColor: '#2B3A67 ',
        // },
      ],
    };
  }
  public touchpointLegend = true;
  public touchpointPlugins = [];



  public touchpointOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  public efficiencyLegend = true;
  public efficiencyPlugins = [];
  public efficiencyData3!: ChartConfiguration<'bar'>['data'];
  public efficiencyData4!: ChartConfiguration<'bar'>['data'];

  public efficiencyData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [],
  };

  public efficiencyOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  public efficiencyData2: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [],
  };

  onClose(): void {
    this.dialogRef.close();
  }

  private ensureUniqueColors(count: number): void {
    const usedColors = new Set(this.colors.map(color => color.toLowerCase())); // Store existing colors in lowercase
  
    while (this.colors.length < count) {
      let newColor;
      do {
        newColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`.toLowerCase(); 
        // Ensures 6-digit hex and converts to lowercase for consistency
      } while (usedColors.has(newColor)); // Ensure uniqueness
  
      this.colors.push(newColor); // Add new color to the array
      usedColors.add(newColor);
    }
  }

}
