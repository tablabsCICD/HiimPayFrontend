import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import zoomPlugin from 'chartjs-plugin-zoom';
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CreateUserComponent } from '../project-admin/create-user/create-user.component';
import { MatDialog } from '@angular/material/dialog';

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

Chart.register(zoomPlugin);

@Component({
  selector: 'app-journey-roadmap',
  templateUrl: './journey-roadmap.component.html',
  styleUrl: './journey-roadmap.component.css',
})
export class JourneyRoadmapComponent implements OnInit {
  substagesData: any;
  data: any = [];
  dataSecond: any = [];
  peopleMatrixData: any = [];
  barChart: any = [];
  barChart2: any = [];
  barChart3: any = [];
  activeTab: string = 'survey';

  survey: any;
  cardsData: any;
  datatouchPointStakeHolders: any;
  touchpoint: any;
  questionListWithOptionCount: any;
  touchPointEfficiencies: any;
  touchPointEfficiencies2: any;
  isLoading: boolean = false;
  isInnerLoading: boolean = false;
  responseData: any;
  lineChartData: any;
  dataLineChart: any;
  chartOptions: any;
  surveyValues: any;
  qualityValues: any;
  realityValues: any;
  surveyValues2: any;
  qualityValues2: any;
  realityValues2: any;
  descriptiveQuestion: any;
  touchpointFreeNoteDtos: any
  stages: any;
  touchPointStakeHoldersLabels: any;
  touchPointLabels: any;
  touchPointEfficienciesLabels: any;
  stagelineChart: any;
  isLoadingSpin: boolean = false;
  isCpoc: boolean = false;
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  // @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  selectedParent: any = '';
  tenure: any = '';
  jobType: any = '';
  gender: any = '';
  lifeCycle: any = '';
  contractType: any = '';
  displayClientData: any;

  constructor(private service: ProjectService, public dialog: MatDialog,) { }
  ngOnInit(): void {
    this.displayClientData = JSON.parse(sessionStorage.getItem('ClientData')!);
    this.executeJourneyMapFlow();
  }

  executeJourneyMapFlow() {
    this.isCpoc = sessionStorage.getItem('isCpoc') == 'true';
    this.getJourneyMapData();
    this.getAllpeopleMatrixDataByClientId();
    console.log(this.gender);
  }


  ondownload() {
    this.isLoadingSpin = true;
    this.service.downoadJourneymap(sessionStorage.getItem("ClientId")).subscribe((res: any) => {
      this.isLoadingSpin = false;
      window.open(res.data)
      // console.log("---------------------------------------",res);
    })
  }

  downloadPDF() {
    this.isLoadingSpin = true;
    const data = document.getElementById('journeymap-content');
    if (data) {
      html2canvas(data).then(canvas => {
        const imgWidth = 200;
        const pageHeight = 295;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        const contentDataURL = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        let position = 5;
        pdf.addImage(contentDataURL, 'PNG', 5, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(contentDataURL, 'PNG', 5, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        const currentDate = new Date();
        const formattedDate = `Generated on: ${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
        pdf.setFontSize(10);
        pdf.text(formattedDate, 10, pdf.internal.pageSize.height - 10);

        pdf.save('Journey map' + '.pdf');
        this.isLoadingSpin = false;
      });
    }
  }
  tab(tab: string) {
    this.activeTab = tab;
  }

  getJourneyMapData() {
    this.isLoading = true;
    this.data = '';
    this.survey = '';
    this.responseData = '';
    this.lineChartData = '';
    this.surveyValues = '';
    this.realityValues = '';
    this.qualityValues = '';
    this.surveyValues2 = '';
    this.qualityValues2 = '';
    this.realityValues2 = '';
    this.datatouchPointStakeHolders = '';
    this.touchpoint = '';
    this.stagelineChart = '';
    this.questionListWithOptionCount = '';
    this.touchPointEfficiencies = '';
    this.touchPointEfficiencies2 = '';
    this.touchPointEfficienciesLabels = '';
    this.touchPointLabels = '';
    this.touchPointStakeHoldersLabels = '';
    this.service
      .journeyMapDynamicLineChartByClientId(sessionStorage.getItem('ClientId'), this.contractType, this.gender, this.lifeCycle, this.tenure)
      .subscribe({
        next: (res: any) => {
          // this.isLoading = false;
          this.data = res.data;
          console.log(this.data);
          // this.survey = this.data.stages;
          // if (this.survey && this.survey.length > 0) {
          //   this.survey[0].clicked = true;
          //   this.clickOnStage(this.survey[0]);
          // }
          console.log(this.survey);
          this.responseData = this.data.responseOuterChart;
          this.lineChartData = this.data.lineOuterChart;
          this.cardsData = Object.keys(this.responseData).map((key,index) => ({
            stageName: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
            stageScore: this.responseData[key],
            clicked: index === 0
          }));
          // const labels = this.lineChartData.map((item: any) => item.label);
          const labels = this.lineChartData?.map((item: any) => {
            const trimmedLabel = item?.label.trim();
            const words = trimmedLabel?.split(' ');
            const firstTwoWords = words?.slice(0, 1).join(' ');
            // return firstTwoWords;
            return trimmedLabel;
          });

          this.surveyValues = this.lineChartData?.map(
            (item: any) => item?.surveyValue
          );
          this.realityValues = this.lineChartData?.map(
            (item: any) => item?.realityValue
          );
          this.qualityValues = this.lineChartData?.map(
            (item: any) => item?.qualityValue
          );
          this.updateBarChartData();
          // this.initializeBarChart('barChartCanvas2', labels, this.surveyValues, this.realityValues, this.qualityValues);
          setTimeout(() => {
            this.barChart = new Chart('barChartCanvas', {
              type: 'line',
              data: {
                labels: labels,
                datasets: [
                  {
                    data: this.surveyValues,
                    label: 'EX Foundations Satisfaction ',
                    borderColor: '#747687',
                    backgroundColor: '#747687',
                    tension: 0.4,
                    fill: false,
                    pointRadius: 5,
                    pointBackgroundColor: '#747687',
                    pointBorderColor: 'white',
                  },
                  {
                    data: this.realityValues,
                    label: 'EX Foundations  Reality',
                    borderColor: '#103a7f',
                    backgroundColor: '#103a7f',
                    tension: 0.4,
                    fill: false,
                    pointRadius: 5,
                    pointBackgroundColor: '#103a7f',
                    pointBorderColor: 'white',
                  },
                  {
                    data: this.qualityValues,
                    label: 'EX Foundations Quality',
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
                  // zoom: {
                  //   pan: {
                  //     enabled: true,
                  //     mode: 'xy',
                  //   },
                  //   zoom: {
                  //     wheel: {
                  //       enabled: true,
                  //     },
                  //     pinch: {
                  //       enabled: true,
                  //     },
                  //     mode: 'xy',
                  //   },
                  // },
                },
                responsive: true,
                maintainAspectRatio: false,
              },
            });
          }, 1000);
        },
        error: () => {
          this.isLoading = false;
        },
        complete: () => { },
      });

      this.service.journeyMapDynamicStageDataByClientId(sessionStorage.getItem('ClientId'), this.contractType, this.gender, this.lifeCycle, this.tenure, 'Attract')
      .subscribe({next:(res)=>{
        this.isLoading = false;
        this.dataSecond = res?.data;
        this.survey = this.dataSecond?.stages;
        console.log(this.survey[0]);
        if (this.survey && this.survey?.length > 0) {
          // this.clickOnStage(this.survey[0]);
          setTimeout(() => {
            this.clickOnStage(this.survey[0]);  // Delay execution
          }, 1000);
        }
      },error:(err)=>{console.log(err),this.isLoading = false;},complete:()=>{}});
  }

  onChangeStage(stage:any,index:number){
    if (this.isInnerLoading) {
      return; 
    }
    this.isInnerLoading = true;
    this.cardsData?.forEach((val: any) => (val.clicked = false));
    this.cardsData[index].clicked = true;
    this.service.journeyMapDynamicStageDataByClientId(sessionStorage.getItem('ClientId'), this.contractType, this.gender, this.lifeCycle, this.tenure, stage?.stageName)
      .subscribe({next:(res)=>{
        this.dataSecond = res.data;
        this.survey = this.dataSecond.stages;
        this.isInnerLoading = false;
        console.log(this.survey[0]);
        if (this.survey && this.survey.length > 0) {
          this.clickOnStage(this.survey[0]);
        }
      },error:(err)=>{console.log(err),this.isInnerLoading = false;},complete:()=>{}});
  }

  getAllpeopleMatrixDataByClientId() {
    this.service.peoplemetricsByClientId(sessionStorage.getItem('ClientId')).subscribe({
      next: (res: any) => {
        console.log(res);
        this.peopleMatrixData = res.data;
        console.log(this.data);

      }, error: () => { }, complete: () => { }
    })
  }

  initializeBarChart(chartId: string, labels: any[], surveyValues: any[], realityValues: any[], qualityValues: any[]) {
    const existingChart = Chart.getChart(chartId); // Check if a chart already exists
    if (existingChart) {
      existingChart.destroy(); // Destroy existing chart to avoid duplicates
    }

    const newChart = new Chart(chartId, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            data: surveyValues,
            label: 'EX Foundations Satisfaction',
            borderColor: '#747687',
            backgroundColor: '#747687',
            tension: 0.4,
            fill: false,
            pointRadius: 5,
            pointBackgroundColor: '#747687',
            pointBorderColor: 'white',
          },
          {
            data: realityValues,
            label: 'EX Foundations Reality',
            borderColor: '#103a7f',
            backgroundColor: '#103a7f',
            tension: 0.4,
            fill: false,
            pointRadius: 5,
            pointBackgroundColor: '#103a7f',
            pointBorderColor: 'white',
          },
          {
            data: qualityValues,
            label: 'EX Foundations Quality',
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
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
          },
          tooltip: {
            enabled: true,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });


    if (chartId === 'barChartCanvas') {
      this.barChart = newChart;
    } else if (chartId === 'barChartCanva2') {
      this.barChart2 = newChart;
    }
  }







  // getJourneyMapData() {
  //   this.isLoading = true;
  //   this.service
  //     .journeyMapnByClientId(sessionStorage.getItem('ClientId'))
  //     .subscribe({
  //       next: (res: any) => {
  //         this.isLoading = false;
  //         this.data = res.data;
  //         console.log(this.data);
  //         this.survey = this.data.stages;
  //         if (this.survey && this.survey.length > 0) {
  //           this.survey[0].clicked = true;
  //           this.clickOnStage(this.survey[0]);
  //         }
  //         console.log(this.survey);
  //         this.responseData = this.data.responseOuterChart;
  //         this.lineChartData = this.data.lineOuterChart;

  //         // const labels = this.lineChartData.map((item: any) => item.label);
  //         const labels = this.lineChartData.map((item: any) => {
  //           const trimmedLabel = item.label.trim();
  //           const words = trimmedLabel.split(' ');
  //           const firstTwoWords = words.slice(0, 1).join(' ');
  //           return firstTwoWords;
  //         });

  //         this.surveyValues = this.lineChartData.map(
  //           (item: any) => item.surveyValue
  //         );
  //         this.realityValues = this.lineChartData.map(
  //           (item: any) => item.realityValue
  //         );
  //         this.qualityValues = this.lineChartData.map(
  //           (item: any) => item.qualityValue
  //         );
  //         this.updateBarChartData();
  //         setTimeout(() => {
  //           this.barChart = new Chart('barChartCanvas', {
  //             type: 'line',
  //             data: {
  //               labels: labels,
  //               datasets: [
  //                 {
  //                   data: this.surveyValues,
  //                   label: 'EX Foundations Satisfaction ',
  //                   borderColor: '#103a7f',
  //                   backgroundColor: '#103a7f',
  //                   tension: 0.4,
  //                   fill: false,
  //                   pointRadius: 5,
  //                   pointBackgroundColor: '#103a7f',
  //                   pointBorderColor: 'white',
  //                 },
  //                 {
  //                   data: this.realityValues,
  //                   label: 'EX Foundations  Reality',
  //                   borderColor: '#2980b9',
  //                   backgroundColor: '#2980b9',
  //                   tension: 0.4,
  //                   fill: false,
  //                   pointRadius: 5,
  //                   pointBackgroundColor: '#103a7f',
  //                   pointBorderColor: 'white',
  //                 },
  //                 {
  //                   data: this.qualityValues,
  //                   label: 'EX Foundations Quality',
  //                   borderColor: '#069de0',
  //                   backgroundColor: '#069de0',
  //                   tension: 0.4,
  //                   fill: false,
  //                   pointRadius: 5,
  //                   pointBackgroundColor: '#069de0',
  //                   pointBorderColor: 'white',
  //                 },
  //               ],
  //             },
  //             options: {
  //               scales: {
  //                 y: {
  //                   beginAtZero: true,
  //                   max: 100,
  //                   min: 0,
  //                 },
  //               },
  //               elements: {
  //                 line: {
  //                   borderWidth: 2,
  //                 },
  //               },
  //               plugins: {
  //                 legend: {
  //                   display: true,
  //                   position: 'bottom',
  //                 },
  //                 tooltip: {
  //                   enabled: true,
  //                 },
  //                 // zoom: {
  //                 //   pan: {
  //                 //     enabled: true,
  //                 //     mode: 'xy',
  //                 //   },
  //                 //   zoom: {
  //                 //     wheel: {
  //                 //       enabled: true,
  //                 //     },
  //                 //     pinch: {
  //                 //       enabled: true,
  //                 //     },
  //                 //     mode: 'xy',
  //                 //   },
  //                 // },
  //               },
  //               responsive: true,
  //               maintainAspectRatio: false,
  //             },
  //           });
  //         }, 1000);
  //       },
  //       error: () => {
  //         this.isLoading = false;
  //       },
  //       complete: () => { },
  //     });
  // }

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: '#103a7f',
        label: 'Percentage Complete',
      },
    ],
  };
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        max: 100
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
  updateBarChartData() {
    if (this.responseData) {
      const labels = Object.keys(this.responseData).map(label =>
        label.charAt(0).toUpperCase() + label.slice(1)
      );
      const values = Object.values(this.responseData).map((value) =>
        Number(value)
      );

      this.barChartData.labels = labels;
      this.barChartData.datasets[0].data = values;

      // Update the chart
      this.chart?.update();
    }
  }

  stageName: any;

  clickOnStage(stageDetail: any) {
    // this.survey?.forEach((val: any) => (val.clicked = false));
    console.log(this.cardsData)
    console.log(stageDetail)

    this.surveyValues2 = stageDetail?.lineChart?.map((item: any) => item?.surveyValue);
    this.realityValues2 = stageDetail?.lineChart?.map((item: any) => item?.realityValue);
    this.qualityValues2 = stageDetail?.lineChart?.map((item: any) => item?.qualityValue);
    const labels = stageDetail?.lineChart?.map((item: any) => item?.label);
    this.descriptiveQuestion = stageDetail?.descriptiveQuestion;
    this.touchpointFreeNoteDtos = stageDetail?.touchpointFreeNoteDtos;


    if (this.barChart2 && typeof this.barChart2?.destroy === 'function') {
      this.barChart2?.destroy();
    }

    setTimeout(() => {
      this.initializeBarChart('barChartCanva2', labels, this.surveyValues2, this.realityValues2, this.qualityValues2);
    }, 1000);


    // this.data.stages.forEach((val: any) => (val.clicked = false));

    // stageDetail.clicked = true;

    this.stageName = stageDetail?.stageName;

    this.stages = stageDetail;

    this.datatouchPointStakeHolders = stageDetail?.touchPointStakeHolders;
    this.touchpoint = stageDetail?.touchPoint;
    this.stagelineChart = stageDetail?.lineChart;
    this.questionListWithOptionCount = stageDetail?.questionListWithOptionCount;
    this.touchPointEfficiencies = stageDetail?.touchPointEfficiencies;
    this.touchPointEfficiencies2 = stageDetail?.touchPointEfficiencies2;

    this.setChartData(this.touchPointEfficiencies);
    this.setChartDataForInternalAndExternal(this.touchPointEfficiencies2);
    this.showQuestionGraph(this.questionListWithOptionCount);


    this.touchPointStakeHoldersLabels = this.datatouchPointStakeHolders?.map(
      (stage: any) => stage?.label
    );
    this.touchPointLabels = this.touchpoint?.map(
      (itemLabel: any) => itemLabel?.subphaseName
    );

    const ownershipCategories = new Set<string>();
    const ownershipCategories2 = new Set<string>();

    this.touchpoint.forEach((stage: any) => {
      Object.keys(stage.touchPointData).forEach((categoryData) => {
        ownershipCategories2.add(categoryData);
      });
    });

    this.datatouchPointStakeHolders.forEach((stage: any) => {
      Object.keys(stage.ownershipData).forEach((category) => {
        ownershipCategories.add(category);
      });
    });

    const sortedDatasets = Array.from(ownershipCategories).sort();
    this.ensureUniqueColors(sortedDatasets.length);
    const datasets = Array.from(sortedDatasets).map((category, index) => {
      return {
        label: category,
        data: this.datatouchPointStakeHolders.map(
          (stage: any) => stage.ownershipData[category] || 0
        ),
        backgroundColor: this.colors[index % this.colors.length],
      };
    });

    // const sortedCategories = Array.from(ownershipCategories2).sort();
    //   const sortedCategories = Array.from(ownershipCategories2)
    // .map(category => category.trim()) // Trim spaces before sorting
    // .sort();
    // console.log(sortedCategories)
    //   this.ensureUniqueColors(sortedCategories.length);
    //   const datasets2 = sortedCategories
    //     .filter(category =>
    //       this.touchpoint.some((stage: any) => stage.touchPointData[category.trim()] > 0) // Keep only non-zero categories
    //     )
    //     .map((category, index) => {
    //       return {
    //         label: category.trim(),
    //         data: this.touchpoint.map(
    //           (stage: any) => stage.touchPointData[category.trim()] || 0
    //         ),
    //         backgroundColor: this.colors[index % this.colors.length],
    //       };
    //     });

    // Normalize touchPointData keys in each stage
    this.touchpoint = this.touchpoint.map((stage: any) => ({
      ...stage,
      touchPointData: Object.fromEntries(
        Object.entries(stage.touchPointData).map(([key, value]) => [key.trim(), value])
      ),
    }));

    // Sort and filter categories
    const sortedCategories = Array.from(ownershipCategories2)
      .map(category => category.trim()) // Trim spaces before sorting
      .sort();
    console.log(sortedCategories);

    this.ensureUniqueColors(sortedCategories.length);

    const datasets2 = sortedCategories
      .filter(category =>
        this.touchpoint.some((stage: any) => stage.touchPointData[category] > 0) // No need to trim here again
      )
      .map((category, index) => ({
        label: category,
        data: this.touchpoint.map((stage: any) => stage.touchPointData[category] || 0),
        backgroundColor: this.colors[index % this.colors.length],
      }));

    console.log(datasets2);

    // const datasets2 = Array.from(sortedCategories).map(
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

    this.efficiencyData = {
      labels: this.touchPointStakeHoldersLabels,
      datasets: datasets,
    };

    this.efficiencyData2 = {
      labels: this.touchPointLabels,
      datasets: datasets2,
    };



  }

  // clickOnStage(stageDetail: any) {
  //   console.log(stageDetail);

  //   this.data.stages.forEach((val: any) => (val.clicked = false));

  //   stageDetail.clicked = true;

  //   this.stageName = stageDetail.stageName;

  //   this.stages = stageDetail;

  //   this.datatouchPointStakeHolders = stageDetail.touchPointStakeHolders;
  //   this.touchpoint = stageDetail.touchPoint;
  //   this.stagelineChart = stageDetail.lineChart;
  //   this.questionListWithOptionCount = stageDetail.questionListWithOptionCount;
  //   this.touchPointEfficiencies = stageDetail.touchPointEfficiencies;
  //   this.touchPointEfficiencies2 = stageDetail.touchPointEfficiencies2;

  //   this.setChartData(this.touchPointEfficiencies);
  //   this.setChartDataForInternalAndExternal(this.touchPointEfficiencies2);
  //   this.showQuestionGraph(this.questionListWithOptionCount);
  //   const labels = this.stagelineChart.map((item: any) => item.label);
  //   this.surveyValues2 = this.stagelineChart.map(
  //     (item: any) => item.surveyValue
  //   );
  //   this.realityValues2 = this.stagelineChart.map(
  //     (item: any) => item.realityValue
  //   );
  //   this.qualityValues2 = this.stagelineChart.map(
  //     (item: any) => item.qualityValue
  //   );

  //   this.touchPointStakeHoldersLabels = this.datatouchPointStakeHolders.map(
  //     (stage: any) => stage.label
  //   );
  //   this.touchPointLabels = this.touchpoint.map(
  //     (itemLabel: any) => itemLabel.subphaseName
  //   );

  //   const ownershipCategories = new Set<string>();
  //   const ownershipCategories2 = new Set<string>();

  //   this.touchpoint.forEach((stage: any) => {
  //     Object.keys(stage.touchPointData).forEach((categoryData) => {
  //       ownershipCategories2.add(categoryData);
  //     });
  //   });

  //   this.datatouchPointStakeHolders.forEach((stage: any) => {
  //     Object.keys(stage.ownershipData).forEach((category) => {
  //       ownershipCategories.add(category);
  //     });
  //   });

  //   const datasets = Array.from(ownershipCategories).map((category, index) => {
  //     return {
  //       label: category,
  //       data: this.datatouchPointStakeHolders.map(
  //         (stage: any) => stage.ownershipData[category] || 0
  //       ),
  //       backgroundColor: this.colors[index % this.colors.length],
  //     };
  //   });

  //   const datasets2 = Array.from(ownershipCategories2).map(
  //     (category, index) => {
  //       return {
  //         label: category,
  //         data: this.touchpoint.map(
  //           (stage: any) => stage.touchPointData[category] || 0
  //         ),
  //         backgroundColor: this.colors[index % this.colors.length],
  //       };
  //     }
  //   );

  //   this.efficiencyData = {
  //     labels: this.touchPointStakeHoldersLabels,
  //     datasets: datasets,
  //   };

  //   this.efficiencyData2 = {
  //     labels: this.touchPointLabels,
  //     datasets: datasets2,
  //   };

  //   setTimeout(() => {
  //     this.barChart2 = new Chart('barChartCanva2', {
  //       type: 'line',
  //       data: {
  //         labels: labels,
  //         datasets: [
  //           {
  //             data: this.surveyValues2,
  //             label: 'EX foundations satisfaction ',
  //             borderColor: '#103a7f',
  //             backgroundColor: '#103a7f',
  //             tension: 0.4,
  //             fill: false,
  //             pointRadius: 5,
  //             pointBackgroundColor: '#103a7f',
  //             pointBorderColor: 'white',
  //           },
  //           {
  //             data: this.realityValues2,
  //             label: 'EX foundations  reality',
  //             borderColor: '#2980b9',
  //             backgroundColor: '#2980b9',
  //             tension: 0.4,
  //             fill: false,
  //             pointRadius: 5,
  //             pointBackgroundColor: '#103a7f',
  //             pointBorderColor: 'white',
  //           },
  //           {
  //             data: this.qualityValues2,
  //             label: 'EX foundations Quality',
  //             borderColor: '#069de0',
  //             backgroundColor: '#069de0',
  //             tension: 0.4,
  //             fill: false,
  //             pointRadius: 5,
  //             pointBackgroundColor: '#069de0',
  //             pointBorderColor: 'white',
  //           },
  //         ],
  //       },
  //       options: {
  //         scales: {
  //           y: {
  //             beginAtZero: true,
  //             max: 100,
  //             min: 0,
  //           },
  //         },
  //         elements: {
  //           line: {
  //             borderWidth: 2,
  //           },
  //         },
  //         plugins: {
  //           legend: {
  //             display: true,
  //             position: 'bottom',
  //           },
  //           tooltip: {
  //             enabled: true,
  //           },
  //           // zoom: {
  //           //   pan: {
  //           //     enabled: true,
  //           //     mode: 'xy',
  //           //   },
  //           //   zoom: {
  //           //     wheel: {
  //           //       enabled: true,
  //           //     },
  //           //     pinch: {
  //           //       enabled: true,
  //           //     },
  //           //     mode: 'xy',
  //           //   },
  //           // },
  //         },
  //         responsive: true,
  //         maintainAspectRatio: false,
  //       },
  //     });
  //   }, 1000);
  // }

  getRandomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, 0.5)`;
  }

  private colors: string[] = [
    '#103a7f',
    '#2980b9',
    '#747687',
    '#103a7f',
    '#2B3A67',

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
    // '#A0D8FF', // Lighter shade of #103a7f
    // '#4A90E2', // Slightly deeper shade of #103a7f
    // '#1F618D', // Darker shade of #2980b9
    // '#5DADE2', // Softer version of #2980b9
    // '#8B8D98', // Muted version of #747687
    // '#565A63', // Darker shade of #747687
    // '#1A4780', // Deep blue variation of #103a7f
    // '#3C6FB6', // Lighter version of #103a7f
    // '#1E2E4F', // Dark navy variant of #2B3A67
    // '#515C87', // Softer blue-gray related to #2B3A67
    // '#89CFF0', // Sky blue complementing #103a7f
    // '#2874A6', // Stronger blue from the #2980b9 family
    // '#6C757D', // Gray variation fitting with #747687
    // '#154360', // Deep teal in the range of #103a7f
    // '#3B4F73', // Bluish-gray variant complementing #2B3A67
  ];


  public efficiencyLegend = true;
  public efficiencyPlugins = [];

  public efficiencyData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [],
  };
  public efficiencyData2: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [],
  };
  public efficiencyData3!: ChartConfiguration<'bar'>['data'];
  public efficiencyData4!: ChartConfiguration<'bar'>['data'];

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
        callbacks: {
          label: function (tooltipItem: any) {
            const dataset = tooltipItem.dataset;
            const dataValue = dataset.data[tooltipItem.dataIndex];
            return `${dataset.label}: ${dataValue}%`; // Append percentage sign
          },
        },
      },
      // zoom: {
      //   pan: {
      //     enabled: true,
      //     mode: 'xy',
      //   },
      //   zoom: {
      //     wheel: {
      //       enabled: true,
      //     },
      //     pinch: {
      //       enabled: true,
      //     },
      //     mode: 'xy',
      //   },
      // },
    },
  };

  public touchpointOptions: ChartConfiguration<'bar'>['options'] = {
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
        callbacks: {
          label: function (tooltipItem: any) {
            const dataset = tooltipItem.dataset;
            const dataValue = dataset.data[tooltipItem.dataIndex];
            return `${dataset.label}: ${dataValue}`;
          },
        },
      },
      // zoom: {
      //   pan: {
      //     enabled: true,
      //     mode: 'xy',
      //   },
      //   zoom: {
      //     wheel: {
      //       enabled: true,
      //     },
      //     pinch: {
      //       enabled: true,
      //     },
      //     mode: 'xy',
      //   },
      // },
    },
  };



  setChartData(data: any) {
    // Clear existing data and then populate with new values
    let labels: string[] = [];
    let partiallyAutomated: number[] = [];
    // let internalSystem: number[] = [];
    // let externalSystem: number[] = [];
    let automated: number[] = [];
    let manual: number[] = [];

    labels = data?.map((item: any) => item?.subphaseName);
    partiallyAutomated = data?.map((item: any) => item?.partiallyAutomated);
    // internalSystem = data.map((item: any) => item.internalSystem);
    // externalSystem = data.map((item: any) => item.externalSystem);
    automated = data?.map((item: any) => item?.automated);
    manual = data?.map((item: any) => item?.manual);


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

  setChartDataForInternalAndExternal(data: any) {
    // Clear existing data and then populate with new values
    let labels: string[] = [];
    // let partiallyAutomated: number[] = [];
    let internalSystem: number[] = [];
    let externalSystem: number[] = [];
    // let automated: number[] = [];
    // let manual: number[] = [];

    labels = data?.map((item: any) => item?.subphaseName) || [];
    // partiallyAutomated = data?.map((item: any) => item.partiallyAutomated) || [];
    internalSystem = data?.map((item: any) => item?.internalSystem) || [];
    externalSystem = data?.map((item: any) => item?.externalSystem) || [];
    // automated = data?.map((item: any) => item.automated) || [];
    // manual = data?.map((item: any) => item.manual) || [];


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

  showQuestionGraph(res: any) {
    let xAxisCategories: string[] = [];
    let agreeData: number[] = [];
    let stronglyAgreeData: number[] = [];
    let disagreeData: number[] = [];
    let stronglyDisagreeData: number[] = [];

    xAxisCategories = res?.map((item: any) => item?.question);
    agreeData = res?.map((item: any) => item?.agree);
    stronglyAgreeData = res?.map((item: any) => item?.stronglyAgree);
    disagreeData = res?.map((item: any) => item?.disagree);
    stronglyDisagreeData = res?.map((item: any) => item?.stronglyDisagree);
    // const neitherAgreeNorDisagreeData = res.map(
    //   (item: any) => item.neitherAgreeNorDisagree
    // );

    const maxLabelWidth = this.getMaxLabelWidth(xAxisCategories);

    const seriesData = [
      {
        name: 'Strongly Agree',
        data: stronglyAgreeData,
        backgroundColor: '#103a7f',
      },
      {
        name: 'Agree',
        data: agreeData,
        backgroundColor: '#2980b9',
      },
      {
        name: 'Disagree',
        data: disagreeData,
        backgroundColor: '#103a7f',
      },
      {
        name: 'Strongly Disagree',
        data: stronglyDisagreeData,
        backgroundColor: '#2B3A67',
      },
      // {
      //   name: 'Neither Agree Nor Disagree',
      //   data: neitherAgreeNorDisagreeData,
      //   backgroundColor: '#747687',
      // },
    ];
    const currentDate = `Generated on: ${this.getCurrentDate()}`;

    this.chartOptions = {
      series: seriesData,
      chart: {
        type: 'bar',
        height: 530,
        // width: 700,
        // height: 600,
        stacked: true,
        stackType: '100%',
        toolbar: {
          show: true,
          export: {
            beforeScreenshot: (chartContext: any) => {
              let svg = chartContext.el.querySelector("svg");

              // Create text element for Client Name
              let clientText = document.createElementNS("http://www.w3.org/2000/svg", "text text text text text");
              clientText.setAttribute("x", "20");
              clientText.setAttribute("y", "30");
              clientText.setAttribute("fill", "black");
              clientText.setAttribute("font-size", "14");
              clientText.textContent = `Client: ${this.displayClientData?.clientName}`;
              svg.appendChild(clientText);

              // Create text element for Generated Date
              let dateText = document.createElementNS("http://www.w3.org/2000/svg", "text text text text text");
              dateText.setAttribute("x", "20");
              dateText.setAttribute("y", "50");
              dateText.setAttribute("fill", "black");
              dateText.setAttribute("font-size", "14");
              dateText.textContent = `Generated on: ${currentDate}`;
              svg.appendChild(dateText);
            },
            csv: {
              filename: "EXwise_JouneyMap_Question_Summary",
              columnDelimiter: ",",
              headerCategory: "Client name :," + this.displayClientData?.clientName + "\n" + currentDate + "\n Question",
              headerValue: "Value",
              customFormatter: (options: any) => {
                let csvData = "Question, Value\n";
                options.series.forEach((series: any, index: number) => {
                  csvData += `${options.xaxis.categories[index]}, ${series.data.join(", ")}\n`;
                });
                // csvData += `\n\n${currentDate}`;
                return csvData;
              },
            },
            svg: {
              filename: "EXwise_JouneyMap_Question_Summary",
              // afterDownload: () => {
              //   console.log(currentDate);
              // }
            },
            png: {
              filename: "EXwise_JouneyMap_Question_Summary",
              // afterDownload: () => {
              //   console.log(currentDate);
              // }
            },
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '100%',
        },
      },
      grid: {
        padding: {
          top: 10,
          bottom: 10,
        },
        row: {
          colors: ['transparent', 'transparent'],
          opacity: 0.5,
        },
      },
      stroke: {
        width: 1,
        colors: ['#fff'],
      },
      xaxis: {
        labels: {
          style: {
            fontSize: '14px',
          },
        },
        categories: xAxisCategories,
      },
      yaxis: {
        labels: {
          // maxWidth: 600,
          maxWidth: maxLabelWidth,
        },
      },
      // title: {
      //   text: `${this.stageName} Questions`,
      //   align: "center",
      //   style: {
      //     fontSize: "15px",
      //     fontWeight: "bold",
      //   },
      // },
      subtitle: {
        text: `Client name: ${this.displayClientData?.clientName || "N/A"} |  ${currentDate}`,
        align: "center",
        style: {
          fontSize: "12px",
          fontWeight: "bold",
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
        followCursor: true,
        y: {
          formatter: function (val: string) {
            return val + '';
          },
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40,
      },
      colors: ['#2980b9', '#103a7f', '#103a7f', '#2B3A67', '#747687'],
    };
  }

  private getMaxLabelWidth(categories: string[]): number {
    const maxLength = Math.max(...categories.map(cat => cat.length));
    const approxCharWidth = 8;
    return maxLength * approxCharWidth;
  }

  resetChartZoom(chart: Chart | undefined): void {
    if (chart) {
      chart.resetZoom();
    }
  }

  onChangeParent(event: any) {
    this.selectedParent = event.target.value;
    this.contractType = '';
    this.lifeCycle = '',
      this.gender = '';
    this.jobType = '';
    this.tenure = '';
  }

  filterData(e: any) {

    if (this.selectedParent === 'contractType') {
      this.contractType = e.target.value;
    }
    else if (this.selectedParent === 'gender') {
      this.gender = e.target.value;
    }
    else if (this.selectedParent === 'jobType') {
      this.jobType = e.target.value;
    }
    else if (this.selectedParent === 'tenure') {
      this.tenure = e.target.value;
    }
    else if (this.selectedParent === 'lifecycle') {
      this.lifeCycle = e.target.value;
    }
    this.executeJourneyMapFlow();
  }

  onClearFilter() {
    this.selectedParent = '';
    this.contractType = '';
    this.gender = '';
    this.jobType = '';
    this.tenure = '';
    this.lifeCycle = '';
    this.executeJourneyMapFlow();
  }

  editUser(userId: number) {
    console.log(userId);

    const dialogRef = this.dialog.open(CreateUserComponent, {
      width: '800px',
      height: '600px',
      disableClose: true,
      data: { name: 'edit-user', id: userId, isConsultant: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  formatText(text: string): string {
    return text ? text.replace(/\n/g, '<br>') : '';
  }

  isLastItem(touchpoint: any): boolean {
    return this.touchpointFreeNoteDtos.indexOf(touchpoint) === this.touchpointFreeNoteDtos.length - 1;
  }

  getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  exportChart() {
    if (this.chart) {
      (this.chart as any).dataURI().then(({ imgURI }: { imgURI: string }) => {
        let link = document.createElement("a");
        link.href = imgURI;
        link.download = "EXwise_JourneyMap_Question_Summary.png";
        link.click();
      });
    }
  }

  // Function to add unique colors dynamically based on sortedCategories length
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
