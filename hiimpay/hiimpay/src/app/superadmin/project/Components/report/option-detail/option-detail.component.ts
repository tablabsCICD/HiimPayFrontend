import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GraphService } from '../../../services/graph.service';
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
import { SubTitle } from 'chart.js';

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
  selector: 'app-option-detail',
  templateUrl: './option-detail.component.html',
  styleUrl: './option-detail.component.css'
})
export class OptionDetailComponent implements OnInit {
  chartOptions: any;
  name: any;
  id: any;
  stageName: any;
  displayClientData: any;

  constructor(private dialogRef: MatDialogRef<OptionDetailComponent>, private api: GraphService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.name = data.name.trim();
    this.id = data.id;
    this.stageName = data.stageName === 'Wellbeing' ? 'Wellness' : data.stageName;
    console.log(data)
  }

  ngOnInit(): void {
    this.displayClientData = JSON.parse(sessionStorage.getItem('ClientData')!);
    const clientId = parseInt(sessionStorage.getItem('ClientId')!, 10);
    if (this.name === 'Feel, Use, Do and See survey') {
      this.api.getFudsForQuestionGraph(clientId, this.id).subscribe({
        next: (res) => {
          // this.api.getGaph3().subscribe({next:(res)=>{
          if (res.success) {
            this.showQuestionGraph(res, 'Feel, Use, Do and See survey');
          }
        }, error: (err) => { console.log(err) }, complete: () => { }
      });
    }
    else if (this.name === 'Employee Engagement survey') {
      this.api.getEEForQuestionGraph(clientId, this.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.showQuestionGraph(res, 'Employee Engagement survey');
          }
        }, error: (err) => { console.log(err) }, complete: () => { }
      });
    }
    else if (this.name === 'Exit survey') {
      this.api.getExitSurveyForQuestionGraph(clientId, this.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.showQuestionGraph(res, 'Exit survey');
          }
        }, error: (err) => { console.log(err) }, complete: () => { }
      });
    }
    else if (this.name === 'Onboarding feedback survey') {
      this.api.getOnboardingEffectivenessForQuestionGraph(clientId, this.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.showQuestionGraph(res, 'Onboarding feedback survey');
          }
        }, error: (err) => { console.log(err) }, complete: () => { }
      });
    }
    else if (this.name === 'Induction effectiveness survey') {
      this.api.getInductionSurveyQuestionGraph(clientId, this.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.showQuestionGraph(res, 'Induction effectiveness survey');
          }
        }, error: (err) => { console.log(err) }, complete: () => { }
      });
    }
    else if (this.name === 'On-the-job training effectiveness survey') {
      this.api.getOJTSurveyQuestionGraph(clientId, this.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.showQuestionGraph(res, 'On-the-job training effectiveness survey');
          }
        }, error: (err) => { console.log(err) }, complete: () => { }
      });
    }
    else if (this.name === 'Pulse surveys') {
      this.api.getPulseSurveyQuestionGraph(clientId, this.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.showQuestionGraph(res, 'Pulse surveys');
          }
        }, error: (err) => { console.log(err) }, complete: () => { }
      });
    }
    else if (this.name === 'Manager Effectiveness survey') {
      this.api.getManagerEffectivenessQuestionGraph(clientId, this.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.showQuestionGraph(res, 'Manager Effectiveness survey');
          }
        }, error: (err) => { console.log(err) }, complete: () => { }
      });
    }
    else {
      this.api.getOtherSurveyQuestionGraphForDynamicSurvey(clientId, false, this.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.showQuestionGraph(res, this.name);
          }
        }, error: (err) => { console.log(err) }, complete: () => { }
      });
    }
  }

  // showQuestionGraph(res: any,chartTitle:string) {
  //   let xAxisCategories = [];
  //   let options = [];
  //   if (this.stageName) {
  //     const stageData = res?.data?.stages.find((stage: any) => stage?.stage === this.stageName);
  //     console.log(stageData);

  //     if (stageData) {
  //       xAxisCategories = stageData?.xaxis;
  //       options = stageData?.options;
  //     }
  //   } else {
  //     xAxisCategories = res?.data?.xaxis;
  //     options = res?.data?.options;
  //   }

  //   const order = [
  //     "Strongly agree",
  //     "Agree",
  //     "Neither agree nor disagree",
  //     "Disagree",
  //     "Strongly disagree",
  //     "Other"
  // ];

  // const optionMap = new Map<any, any>();

  // options.forEach((option: any) => {
  //     const values = Object.values(option)[0];  // Values array
  //     const name = Object.values(option)[1];    // Option label
  //     optionMap.set(name, { name, data: values });
  // });

  //   // const seriesData = options?.map((option: any) => {
  //   //   const values = Object.values(option)[0];
  //   //   const name = Object.values(option)[1];
  //   //   return {
  //   //     name: name,
  //   //     data: values
  //   //   };
  //   // });

  //   const seriesData = order
  //       .map(name => optionMap.get(name))   // Get the mapped values in correct order
  //       .filter(option => option);  

  //   this.chartOptions = {
  //     series: seriesData,
  //     chart: {
  //       type: "bar",
  //       height: xAxisCategories?.length > 5 ? 530 : 300,
  //       stacked: true,
  //       stackType: "100%",
  //       toolbar: {
  //         show: true,
  //         export: {
  //             csv: {
  //                 filename: `FUDS_Question_Summary`,
  //                 columnDelimiter: ',',
  //                 headerCategory: 'Category',
  //                 headerValue: 'Value',
  //             },
  //             svg: {
  //                 filename: `FUDS_Question_Summary`,
  //             },
  //             png: {
  //                 filename: `FUDS_Question_Summary`,
  //             },
  //         },
  //     },
  //   },
  //     events: {
  //       beforeExport: (chart: {
  //           addText: (arg0: {
  //             text: string; x: number; // Center align
  //             y: number; // Bottom position
  //             align: string; style: { fontSize: string; color: string; };
  //           }) => void; w: { globals: { chartWidth: number; chartHeight: number; }; };
  //         }) => {
  //           const dateText = `Generated on: ${this.getCurrentDate()}`;
  //           chart.addText({
  //               text: dateText,
  //               x: chart.w.globals.chartWidth / 2, // Center align
  //               y: chart.w.globals.chartHeight - 20, // Bottom position
  //               align: "center",
  //               style: {
  //                   fontSize: "12px",
  //                   color: "#333",
  //               },
  //           });
  //       }
  //   },
  //     plotOptions: {
  //       bar: {
  //         horizontal: true,
  //         barHeight: '100%',
  //         innerHeight: '100%'
  //       }
  //     },
  //     stroke: {
  //       width: 1,
  //       colors: ["#fff"]
  //     },
  //     xaxis: {
  //       categories: xAxisCategories
  //     },
  //     tooltip: {
  //       y: {
  //         formatter: function(val: string) {
  //           return val + "";
  //         }
  //       }
  //     },
  //     fill: {
  //       opacity: 1
  //     },
  //     legend: {
  //       position: "top",
  //       horizontalAlign: "left",
  //       offsetX: 40
  //     },
  //     colors: ['#103a7f', '#2980b9', '#747687', '#103a7f', '#2b3a67'],
  //     title: {
  //       text: chartTitle,
  //       align: 'center',
  //       style: {
  //           fontSize: '15px',
  //           fontWeight: 'bold'
  //       }
  //   }
  //   };
  // }

  showQuestionGraph(res: any, chartTitle: string) {
    let xAxisCategories = [];
    let options = [];

    if (this.stageName) {
      const stageData = res?.data?.stages.find((stage: any) => stage?.stage === this.stageName);
      if (stageData) {
        xAxisCategories = stageData?.xaxis;
        options = stageData?.options;
      }
    } else {
      xAxisCategories = res?.data?.xaxis;
      options = res?.data?.options;
    }

    const maxLabelWidth = this.getMaxLabelWidth(xAxisCategories);

    const order = [
      "Strongly agree",
      "Agree",
      "Neither agree nor disagree",
      "Disagree",
      "Strongly disagree",
      "Other"
    ];

    const optionMap = new Map<any, any>();

    options.forEach((option: any) => {
      const values = Object.values(option)[0];
      const name = Object.values(option)[1];
      optionMap.set(name, { name, data: values });
    });

    const seriesData = order
      .map(name => optionMap.get(name))
      .filter(option => option);

    const currentDate = `Generated on: ${this.getCurrentDate()}`;

    this.chartOptions = {
      series: seriesData,
      chart: {
        type: "bar",
        height: xAxisCategories?.length > 5 ? 530 : 300,
        stacked: true,
        stackType: "100%",
        toolbar: {
          show: true,
          export: {
            csv: {
              filename: "EXwise" + this.name + "_Summary",
              columnDelimiter: ",",
              headerCategory: "Client name :," + this.displayClientData?.clientName + "\n" + currentDate + "\n Question",
              headerValue: "Value",
              customFormatter: (options: any) => {
                let csvData = "Question, Value\n";
                options.series.forEach((series: any, index: number) => {
                  csvData += `${options.xaxis.categories[index]}, ${series.data.join(", ")}\n`;
                });
                csvData += `\n\n${currentDate}`;
                return csvData;
              },
            },
            svg: {
              filename: "EXwise" + this.name + "_Summary",
              afterDownload: () => {
                // console.log(currentDate); 
              }
            },
            png: {
              filename: "EXwise" + this.name + "_Summary",
              afterDownload: () => {
                // console.log(currentDate); 
              }
            },
          },
        },
        events: {
          beforeExport: (chart: any) => {
            const dateText = currentDate;
            chart.addText({
              text: dateText,
              x: chart.w.globals.chartWidth / 2,
              y: chart.w.globals.chartHeight - 20,
              align: "center",
              style: {
                fontSize: "14px",
                color: "#000",
                fontWeight: "bold",
              },
            });
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "100%",
          innerHeight: "100%",
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      xaxis: {
        categories: xAxisCategories,
      },
      yaxis: {
        labels: {
          // maxWidth: 600,
          maxWidth: maxLabelWidth,
        },
      },
      tooltip: {
        y: {
          formatter: function (val: string) {
            return val + "";
          },
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40,
      },
      colors: ["#103a7f", "#2980b9", "#747687", "#103a7f", "#2b3a67"],
      title: {
        text: `${chartTitle}`,
        align: "center",
        html: true,
        style: {
          fontSize: "15px",
          fontWeight: "bold",
        },
      },
      subtitle: {
        text: `Client name: ${this.displayClientData?.clientName || "N/A"} |  ${currentDate}`,
        align: "center",
        style: {
          fontSize: "12px",
          fontWeight: "bold",
        },
      }
    };
  }


  onClose(): void {
    this.dialogRef.close();
  }

  getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Extract YYYY-MM-DD
  }

  private getMaxLabelWidth(categories: string[]): number {
    const maxLength = Math.max(...categories.map(cat => cat.length)); 
    const approxCharWidth = 8;
    return maxLength * approxCharWidth;
  }
}
