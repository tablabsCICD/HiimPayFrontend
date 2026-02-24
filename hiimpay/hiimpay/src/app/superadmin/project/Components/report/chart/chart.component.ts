import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoryScale, LinearScale, BarController, BarElement, Tooltip, Legend, registerables } from 'chart.js/auto';
import { Chart } from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import { OptionDetailComponent } from '../option-detail/option-detail.component';
import { ManagereffectComponent } from '../managereffect/managereffect.component';
import { GraphService } from '../../../services/graph.service';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexTooltip,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexPlotOptions
} from "ng-apexcharts";
import { ActivatedRoute } from '@angular/router';
import { fontWeight } from 'html2canvas/dist/types/css/property-descriptors/font-weight';
import { Location } from '@angular/common';
import { color } from 'html2canvas/dist/types/css/types/color';
import { CreateUserComponent } from '../../project-admin/create-user/create-user.component';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis & {
    labels: {
      show: boolean;
      rotate: number;
      style: {
        colors: string[];
        fontSize: string;
      };
      formatter: (value: string) => string;
    };
  };
  yaxis?: ApexYAxis & {
    title: {
      text: string;
    };
  };
  tooltip?: ApexTooltip & {
    y: {
      formatter: (value: number) => string;
    };
  };
  colors: any;
  plotOptions?: ApexPlotOptions;
};

export type pulseChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis & {
    labels: {
      show: boolean;
      rotate: number;
      style: {
        colors: string[];
        fontSize: string;
      };
      formatter: (value: string) => string;
    };
  };
  yaxis?: ApexYAxis & {
    title: {
      text: string;
    };
  };
  tooltip?: ApexTooltip & {
    y: {
      formatter: (value: number) => string;
    };
  };
  colors: any;
  plotOptions?: ApexPlotOptions;
};

export type ChartOptionsdoghnut = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};


Chart.register(...registerables);
Chart.register(zoomPlugin);

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
})
export class ChartComponent implements OnInit {
  isLoading: boolean = false;
  checkPDFDownloadSpinner: boolean = false;
  isStaticSurvey: boolean = false;
  clientId: number = 0;
  isTableVisible: boolean = true;
  activeTab: string = '';
  otherSurvey: boolean = false;
  fudsLineChart: Chart | undefined;
  fudsBarChart: Chart | undefined;
  eeBarChart: Chart | undefined;
  pulseBarChart: Chart | undefined;
  exitsurvey: any = [];
  onboardinglineChart: Chart | undefined;
  onboardBarChart: Chart | undefined;
  inductionSurvey: any = [];
  inductionBarChart: Chart | undefined;
  pulse: any = [];
  ojtEffectiveness: any = [];
  ojtBarChart: Chart | undefined;
  managerEffectiveness: any = [];
  managerdoughnutChart: any = [];
  eNPSdoughnutChart: any = [];
  managerBarChart: Chart | undefined;
  otherChart: Chart | undefined;
  otherBarChart: Chart | undefined;
  exitdoughnutChart: any = [];
  exitBarChart: Chart | undefined;
  importanceData: any = [];
  agreementData: any = [];
  fudsDetails: any;
  fudsDetails2: any;
  eeDetails: any;
  eeDetails2: any;
  pulseDetails: any;
  pulseDetails2: any;
  otherDetails: any;
  otherDetails2: any;
  otherProgressBar: any;
  fudsProgressBar: any;
  fudsWithDetails: any;
  onboardingProgressBar: any
  ojtProgressBar: any
  inductionProgressBar: any;
  pulseProgressBar: any;
  eeProgressBar: any;
  fudsGraph: any;
  paramsId: any;
  paramsName: any;
  fudsTable: any;
  eetable: any;
  exitTable: any;
  otherTable: any
  onboardTable: any;
  ojtTable: any;
  inductionTable: any;
  pulsetable: any;
  managerTable: any;
  testTitle: any = 'fuds';
  backendMessage = null;
  eeThemeScore: any;
  pulseThemeScore: any;
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: any;
  @ViewChild("pulsechart") pulsechart!: pulseChartOptions;
  public pulseChartOptions!: any;

  @ViewChild("doghnutcharts") doghnutcharts!: ChartComponent;
  public ChartOptionsdoghnut!: Partial<ChartOptions>;

  public fudstabs: string[] = [];
  public eetabs: string[] = [];
  public pulsetabs: string[] = [];
  public othertabs: string[] = [];
  tabsdata: any[] = [
    { name: 'MCQ', clicked: true },
    { name: 'Descriptive', clicked: false }
  ];
  selectedTab: string = 'MCQ';
  allData: any;
  selectedParent: any = '';
  tenure: any = '';
  jobType: any = '';
  gender: any = '';
  lifeCycle: any = '';
  contractType: any = '';
  displayClientData: any;

  constructor(private dialog: MatDialog, private api: GraphService, private activatedRoute: ActivatedRoute, private location: Location) { }

  ngOnInit(): void {
    this.displayClientData = JSON.parse(sessionStorage.getItem('ClientData')!);
    this.activatedRoute.params.subscribe(params => {
      console.log(params);
      const id = params['id']
      console.log(id)
      this.paramsId = id
      const nm = params['surveyName']
      this.paramsName = nm;
      this.isStaticSurvey = params['isStaticSurvey'] === 'true';
      console.log(this.paramsName);
      this.clientId = parseInt(sessionStorage.getItem('ClientId')!, 10);
      console.log('client Id' + this.clientId, id)
      if (this.paramsName.trim().includes("Feel, Use, Do and See survey")) {
        this.executeFlowForFUDS();
      }
      else if (this.paramsName.includes('Employee Engagement survey')) {
        this.executeFlowForEE();
      }
      else if (this.paramsName.includes('Exit survey')) {
        this.executeFlowForExit();
      }
      else if (this.paramsName.includes('Onboarding feedback survey')) {
        this.executeFlowForOnboardingFeedback();
      }
      else if (this.paramsName.includes('On-the-job training effectiveness survey')) {
        this.executeFlowForOnTheJobTrainingEffectiveness();
      }
      else if (this.paramsName.includes('Induction effectiveness survey ')) {
        this.executeFlowForInductionEffectiveness();
      }
      else if (this.paramsName.includes(' Pulse surveys')) {
        this.executeFlowForPulse();
      }
      else if (this.paramsName.includes('Manager Effectiveness survey')) {
        this.executeFlowForManagerEffectiveness();
      }
      else if (this.paramsName.includes('eNPS survey')) {
        this.executeFlowForENPS();
      }
      else {
        this.executeFlowForOtherDynamic();
      }
    });
  }

  executeFlowForFUDS() {
    this.isLoading = true;
    this.importanceData = '';
    this.agreementData = '';
    this.fudsProgressBar = '';
    this.fudsTable = '';
    this.fudstabs = [];
    this.api.getFudsSurveyLineGrapah(this.clientId, this.paramsId).subscribe({
      next: (res) => {
        this.importanceData = res?.data?.map((item: { importance: any; }) => item?.importance);
        this.agreementData = res?.data?.map((item: { agreement: any; }) => item?.agreement);
        this.executeFudsGraph();
      }, error: (err) => { console.log(err) }, complete: () => { }
    });

    // this.api.getFudsForProgressBar(this.clientId, this.paramsId).subscribe({
    //   next: (res) => {
    //     const colors = ["#103a7f", "#103a7f", "#2980b9", "#069de0"];
    //     this.fudsWithDetails = res?.data;
    //     this.fudsProgressBar = res?.data?.finalDtos.map((item: any, index: number) => {
    //       return {
    //         stageName: item.stage,
    //         percentage: item.responseCount || 0,
    //         color: colors[index % colors.length]
    //       };
    //     });
    //   },
    //   error: (err) => { console.log(err) },
    //   complete: () => { }
    // });

    this.api.getFudsForProgressBar(this.clientId, this.paramsId).subscribe({
      next: (res) => {
        const colors = ["#103a7f", "#103a7f", "#2980b9", "#069de0"];
        this.fudsWithDetails = res?.data;

        const firstItem = res?.data?.finalDtos?.[0];
        if (firstItem) {
          this.fudsProgressBar = [
            {
              stageName: firstItem.stage,
              percentage: firstItem.responseCount || 0,
              color: colors[0]
            }
          ];
        }
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => { }
    });


    this.api.getFudsForTable(this.clientId, this.paramsId).subscribe({
      next: (res) => {
        this.fudsTable = res.data;
        this.fudstabs = this.fudsTable.map((item: { stage: any; }) => item.stage);
        this.setActiveTabForFuds(this.fudstabs[0]);
        this.isLoading = false;
        this.executeFudsGraph();
      }, error: (err) => { console.log(err) }, complete: () => { }
    });
  }

  executeFlowForEE() {
    this.isLoading = true;
    this.api.getEESurveyLineGrapah(this.clientId, this.paramsId).subscribe({
      next: (res) => {
        this.executeEESurveyGraph(res);
      }, error: (err) => { console.log(err) }, complete: () => { }
    });

    this.api.getEEForProgressBar(this.clientId, this.paramsId).subscribe({
      next: (res) => {
        const colors = ["#103a7f", "#103a7f", "#2980b9", "#069de0"];
        this.eeProgressBar = res.data?.finalDtos.map((item: any, index: number) => {
          const stageName = item.stage.trim();

          let shortForm = "";
          if (stageName === "Communication") {
            shortForm = "COMM";
          } else if (stageName === "Direct manager") {
            shortForm = "DM";
          } else if (stageName === "Diversity and inclusion") {
            shortForm = "DEI";
          } else if (stageName === "Employee engagement index") {
            shortForm = "EEI";
          } else if (stageName === "Job satisfaction") {
            shortForm = "JSAT";
          } else if (stageName === "Leadership") {
            shortForm = "L";
          } else if (stageName === "Performance management and reward") {
            shortForm = "PM&R";
          } else if (stageName === "Purpose") {
            shortForm = "JPUR";
          } else if (stageName === "Teamwork") {
            shortForm = "TEAM";
          } else if (stageName === "Learning and growth opportunities") {
            shortForm = "L&G";
          } else if (stageName === "Wellness") {
            shortForm = "WB";
          } else {

            shortForm = stageName
              .split(' ')
              .map((word: any) => word[0])
              .join('');
          }
          return {
            stageName: `${stageName === 'Wellness' ? 'Wellbeing' : stageName} (${shortForm})`,
            percentage: item.responseCount || 0,
            color: colors[index % colors.length]
          };
        });
      },
      error: (err) => { console.log(err) },
      complete: () => { }
    });

    // this.api.getEEForProgressBar(clientId, this.paramsId).subscribe({
    //   next: (res) => {
    //     const totalEmployees = res.data?.totalEmployee || 0;
    //     this.eeProgressBar = res.data?.finalDtos.map((item: any, index: number) => {
    //       const colors = ["#103a7f", "#103a7f", "#2980b9", "#069de0"];
    //       const stageName = item.stage.trim();
    //       const shortForm = stageName
    //         .split(' ')
    //         .map((word: any) => word[0])
    //         .join('');
    //       const responseCount = item.responseCount || 0;
    //       const percentage = totalEmployees > 0 ? ((responseCount / totalEmployees) * 100).toFixed(1) : "0";
    //       return {
    //         stageName: `${stageName} (${shortForm})`,
    //         percentage: parseFloat(percentage),
    //         color: colors[index % colors?.length]
    //       };
    //     });
    //   },
    //   error: (err) => { console.log(err) },
    //   complete: () => { }
    // });

    this.api.getEEForTable(this.clientId, this.paramsId).subscribe({
      next: (res) => {
        this.eetable = res.data;
        if (this.eetable?.length > 0) {
          this.eetabs = this.eetable?.map((item: { stage: any }) => {
            return item?.stage === 'Wellness' ? 'Wellbeing' : item?.stage;
          });
          // this.eetabs = this.eetable?.map((item: { stage: any; }) => item?.stage);
          this.setActiveTabForEE(this.eetabs[0]);
          this.isLoading = false;
        }
      }, error: (err) => { console.log(err) }, complete: () => { }
    });
  }

  executeFlowForExit() {
    this.isLoading = true;
    this.api.getExitSurveyLineGraph(this.clientId, this.paramsId).subscribe({
      next: (res) => {
        this.executeExitGraph(res);
      }, error: (err) => { console.log(err) }, complete: () => { }
    });

    this.api.getExitSurveyReasonProgressBar(this.clientId, this.paramsId).subscribe({
      next: (res) => {
        this.executeExitDoughnutChart(res);
      }, error: (err) => { console.log(err) }, complete: () => { }
    });

    this.api.getExitSurveyForTable(this.clientId, this.paramsId).subscribe({
      next: (res) => {
        this.exitTable = res?.data[0];
        this.isLoading = false;
        this.executeExitBarChart();
      }
    })
  }

  executeFlowForOnboardingFeedback() {
    this.isLoading = true;
    this.api.getOnboardingLineChart(this.clientId, this.paramsId).subscribe({
      next: (res) => {
        this.executeOnBoardingGraph(res);
      }, error: (err) => { console.log(err) }, complete: () => { }
    });

    this.api.getOnBoardingEffectivenessProgressBar(this.clientId, this.paramsId).subscribe({
      next: (res) => {
        this.onboardingProgressBar = res.data.map((item: any, index: number) => {
          const colors = ["#103a7f", "#103a7f", "#2980b9", "#069de0"];
          return {
            stageName: item?.stage,
            percentage: item?.responseCount,
            color: colors[index % colors?.length]
          };
        });
      }, error: (err) => { console.log(err) }, complete: () => { }
    });

    this.api.getOnboardingEffectivenessForTable(this.clientId, this.paramsId).subscribe({
      next: (res) => {
        this.onboardTable = res?.data[0];
        this.isLoading = false;
        this.executeOnbarodingBarChart();
      }, error: (err) => { console.log(err) }, complete: () => { }
    });
  }

  executeFlowForOnTheJobTrainingEffectiveness() {
    this.isLoading = true;
    this.api.getOJTSurveyLineGraph(this.clientId, this.paramsId).subscribe({
      next: (res) => {
        this.executeOjt(res);
      }, error: (err) => { console.log(err) }, complete: () => { }
    });

    this.ojtProgressBar = '';
    this.api.getOJTProgressBar(this.clientId, this.paramsId).subscribe({
      next: (res) => {
        this.ojtProgressBar = res.data.map((item: any, index: number) => {
          const colors = ["#103a7f", "#103a7f", "#2980b9", "#069de0"];
          return {
            stageName: item?.stage,
            percentage: item?.responseCount,
            color: colors[index % colors?.length]
          };
        });
      }, error: (err) => { console.log(err) }, complete: () => { }
    });

    this.ojtTable = '';
    this.api.getOJTSurveyForTable(this.clientId, this.paramsId).subscribe({
      next: (res) => {
        this.ojtTable = res?.data[0];
        this.isLoading = false;
        this.executeojtBarChart();
      }, error: (err) => { console.log(err) }, complete: () => { }
    });
  }

  executeFlowForInductionEffectiveness() {
    this.isLoading = true;
    this.api.getInductionSurveyLineGraph(this.clientId, this.paramsId).subscribe({
      next: (res) => {
        this.executeInduction(res);
      }, error: (err) => { console.log(err) }, complete: () => { }
    });

    this.api.getInductionsurveyProgressBar(this.clientId, this.paramsId).subscribe({
      next: (res) => {
        this.inductionProgressBar = res?.data?.map((item: any, index: number) => {
          const colors = ["#103a7f", "#103a7f", "#2980b9", "#069de0"];
          return {
            stageName: item?.stage,
            percentage: item?.responseCount,
            color: colors[index % colors?.length]
          };
        });
      }, error: (err) => { console.log(err) }, complete: () => { }
    });

    this.api.getInductionSurveyForTable(this.clientId, this.paramsId).subscribe({
      next: (res) => {
        this.inductionTable = res?.data[0];
        this.isLoading = false;
        this.executeInductionBarChart();
      }, error: (err) => { console.log(err) }, complete: () => { }
    });
  }

  executeFlowForPulse() {
    this.isLoading = true;
    this.api.getPulseSurveyLineGraph(this.clientId, this.paramsId).subscribe({
      next: (res) => {
        this.executePulse(res);
      }, error: (err) => { console.log(err) }, complete: () => { }
    });


    this.api.getPulsesurveyProgressBar(this.clientId, this.paramsId).subscribe({
      next: (res) => {
        const colors = ["#103a7f", "#103a7f", "#2980b9", "#069de0"];

        this.pulseProgressBar = res.data?.finalDtos.map((item: any, index: number) => {
          const stageName = item?.stage.trim();

          let shortForm = "";
          if (stageName === "Communication") {
            shortForm = "COMM";
          } else if (stageName === "Direct manager") {
            shortForm = "DM";
          } else if (stageName === "Diversity and inclusion") {
            shortForm = "DEI";
          } else if (stageName === "Employee engagement index") {
            shortForm = "EEI";
          } else if (stageName === "Job satisfaction") {
            shortForm = "JSAT";
          } else if (stageName === "Leadership") {
            shortForm = "L";
          } else if (stageName === "Performance management and reward") {
            shortForm = "PM&R";
          } else if (stageName === "Purpose") {
            shortForm = "JPUR";
          } else if (stageName === "Teamwork") {
            shortForm = "TEAM";
          } else if (stageName === "Learning and growth opportunities") {
            shortForm = "L&G";
          } else if (stageName === "Wellness") {
            shortForm = "WB";
          } else {
            shortForm = stageName
              .split(' ')
              .map((word: any) => word[0])
              .join('');
          }

          return {
            stageName: `${stageName === 'Wellness' ? 'Wellbeing' : stageName} (${shortForm})`,
            percentage: item?.responseCount || 0,
            color: colors[index % colors.length]
          };
        });
      },
      error: (err) => { console.log(err) },
      complete: () => { }
    });



    // this.api.getPulsesurveyProgressBar(clientId, this.paramsId).subscribe({
    //   next: (res) => {
    //     const totalEmployees = res.data?.totalEmployee || 0;
    //     this.pulseProgressBar = res.data?.finalDtos.map((item: any, index: number) => {
    //       const colors = ["#103a7f", "#103a7f", "#2980b9", "#069de0"];
    //       const stageName = item?.stage.trim();
    //       const shortForm = stageName
    //         .split(' ')
    //         .map((word: any) => word[0])
    //         .join('');
    //       const responseCount = item?.responseCount || 0;
    //       const percentage = totalEmployees > 0 ? ((responseCount / totalEmployees) * 100).toFixed(1) : "0";
    //       return {
    //         stageName: `${stageName} (${shortForm})`,
    //         percentage: parseFloat(percentage),
    //         color: colors[index % colors?.length]
    //       };
    //     });
    //   },
    //   error: (err) => { console.log(err) },
    //   complete: () => { }
    // });


    this.api.getPulseSurveyForTable(this.clientId, this.paramsId).subscribe({
      next: (res) => {
        this.pulsetable = res.data;
        if (this.pulsetable.length > 0) {
          // this.pulsetabs = this.pulsetable?.map((item: { stage: any; }) => item?.stage);
          this.pulsetabs = this.pulsetable?.map((item: { stage: any; }) => {
            return item?.stage === 'Wellness' ? 'Wellbeing' : item?.stage;
          });

          this.setActiveTabForPulse(this.pulsetabs[0]);
          this.isLoading = false;
        }
      }, error: (err) => { console.log(err) }, complete: () => { }
    });
  }

  executeFlowForManagerEffectiveness() {
    this.isLoading = true;
    this.api.getManagerEffectivenessLineGraph(this.clientId, this.paramsId).subscribe({
      next: (res) => {
        this.executeManagerLine(res);
      }, error: (err) => { console.log(err) }, complete: () => { }
    });

    this.api.getManagerEffectivenessDonutGrpah(this.clientId, this.paramsId).subscribe({
      next: (res) => {
        this.executeManagerDoughnut(res);
      }, error: (err) => { console.log(err) }, complete: () => { }
    });

    this.api.getManagerEffectivenessForTable(this.clientId, this.paramsId).subscribe({
      next: (res) => {
        this.managerTable = res?.data[0];
        this.isLoading = false;
        this.executeMangerBarChart()
      }, error: (err) => { console.log(err) }, complete: () => { }
    });
  }

  executeFlowForENPS() {
    this.isLoading = true;
    this.api.getENPSSUrveyForDonutChart(this.clientId, this.paramsId).subscribe({
      next: (res) => {
        this.executeDonutGraphForENPS(res);
        this.isLoading = false;
      }, error: (err) => { console.log(err) }, complete: () => { }
    });
  }

  executeFlowForOtherDynamic() {
    this.otherSurvey = true;
    this.isLoading = true;
    this.api.getDaynamicSurveyLineGrapah(this.clientId, this.isStaticSurvey, this.paramsId).subscribe({
      next: (res) => {
        this.executeOtherLineChart(res);
      }, error: (err) => { console.log(err) }, complete: () => { }
    });

    this.api.getOtherDynamicSurveyProgressBar(this.clientId, this.isStaticSurvey, this.paramsId).subscribe({
      next: (res) => {
        const colors = ["#103a7f", "#103a7f", "#2980b9", "#069de0"];
        this.otherProgressBar = res?.data?.finalDtos.map((item: any, index: number) => {
          const stageName = item.stage.trim();
          return {
            stageName,
            percentage: item.responseCount ?? 0,
            color: colors[index % colors.length]
          };
        });
      },
      error: (err) => { console.log(err) },
      complete: () => { }
    });

    // this.api.getOtherDynamicSurveyProgressBar(clientId, this.isStaticSurvey, this.paramsId).subscribe({
    //   next: (res) => {
    //     const totalEmployees = res?.data?.totalEmployee ?? 0;
    //     this.otherProgressBar = res?.data?.finalDtos.map((item: any, index: number) => {
    //       const colors = ["#103a7f", "#103a7f", "#2980b9", "#069de0"];
    //       const stageName = item.stage.trim();
    //       const shortForm = stageName
    //         .split(' ')
    //         .map((word: any) => word[0])
    //         .join('');
    //         const responseCount = item?.responseCount ?? 0;
    //         const percentage = totalEmployees > 0 ? ((responseCount / totalEmployees) * 100): '0';
    //       return {
    //         stageName,
    //         percentage: percentage,
    //         color: colors[index % colors?.length]
    //       };
    //     });
    //   },
    //   error: (err) => { console.log(err) },
    //   complete: () => { }
    // });

    this.api.getOtherDaynamicSUrveyForTable(this.clientId, this.isStaticSurvey, this.paramsId).subscribe({
      next: (res) => {
        this.otherTable = res.data;
        if (this.otherTable?.length > 0) {
          this.othertabs = this.otherTable?.map((item: { stage: any; }) => item?.stage);
          this.setActiveTabForOther(this.othertabs[0]);
          this.isLoading = false;
        }
      }, error: (err) => { console.log(err) }, complete: () => { }
    });
  }


  executeFudsGraph() {
    if (this.fudsLineChart) {
      this.fudsLineChart.destroy();
    }

    this.fudsLineChart = new Chart('fudsChartCanvas', {
      type: 'line',
      data: {
        labels: ['Feel', 'Use', 'Do', 'See'],
        datasets: [
          {
            data: this.importanceData,
            label: 'Importance',
            borderColor: "#103a7f",
            backgroundColor: '#103a7f',
            tension: 0.4,
            fill: false,
            pointRadius: 5,
            pointBackgroundColor: '#069de0',
            pointBorderColor: 'white',
          },
          {
            data: this.agreementData,
            label: 'Agreement',
            borderColor: "#2980b9",
            backgroundColor: '#2980b9',
            tension: 0.4,
            fill: false,
            pointRadius: 5,
            pointBackgroundColor: '#103a7f',
            pointBorderColor: 'white',
          }
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 120,
          },
        },
        elements: {
          line: {
            borderWidth: 2,
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'Feel, Use, Do and See survey',
            font: {
              size: 15,
            },
            padding: {
              top: 5,
              bottom: 10
            }
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
        }
      },
    });
    this.executeFudsVerticleBarGraph();
  }

  executeFudsVerticleBarGraph() {
    const questions = this.fudsDetails.map((item: { question: string }) => item.question);
    const truncatedQuestions = questions.map((question: string) => {
      const words = question.trim().split(' ').filter(word => word?.length > 0);
      return words.slice(0, 5).join(' ') + '...';
    });

    const responseCategories = Object.keys(this.fudsDetails[0].optionWithCount);
    const datasets = responseCategories.map((category, index) => {
      return {
        label: category.trim(),
        data: this.fudsDetails.map((item: { optionWithCount: { [x: string]: any; }; }) => {
          const total = Object.values(item.optionWithCount).reduce((acc, val) => acc + val, 0);
          return total > 0 ? (item.optionWithCount[category] / total) * 100 : 0;
        }),
        backgroundColor: this.getColor(index),
      };
    });

    if (this.fudsBarChart) {
      this.fudsBarChart.destroy();
    }

    const allDataValues = datasets.flatMap(dataset => dataset.data);
    const maxValue = Math.max(...allDataValues);

    const roundedMaxValue = this.roundToNearestRoundFigure(maxValue);

    this.fudsBarChart = new Chart('fudsbarChartCanvas', {
      type: 'bar',
      data: {
        labels: truncatedQuestions,
        datasets: datasets,
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 100, // Make sure to set the max to 100 for percentage
            stacked: true, // Enable stacking
          },
          x: {
            stacked: true, // Enable stacking on x-axis as well
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              title: (context) => {
                const index = context[0].dataIndex;
                return questions[index];
              },
              label: (context) => {
                const dataset = context.dataset;
                const value: any = dataset.data[context.dataIndex];
                return `${dataset.label}: ${value.toFixed(1)}%`; // Show the percentage in tooltip
              }
            },
          },
          title: {
            display: true,
            text: 'Feel, Use, Do and See survey',
            font: {
              size: 15,
            },
            padding: {
              top: 5,
              bottom: 10,
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  // executeFudsVerticleBarGraph(){
  //   const questions = this.fudsDetails.map((item: { question: string }) => item.question);
  //   const truncatedQuestions = questions.map((question: string) => {
  //     const words = question.trim().split(' ').filter(word => word?.length > 0);
  //     return words.slice(0, 2).join(' ') + '...';
  //   });


  //   const responseCategories = Object.keys(this.fudsDetails[0].optionWithCount);
  //   const datasets = responseCategories.map((category, index) => {
  //     return {
  //       label: category.trim(),
  //       data: this.fudsDetails.map((item: { optionWithCount: { [x: string]: any; }; }) => item.optionWithCount[category] || 0),
  //       backgroundColor: this.getColor(index)
  //     };
  //   });

  //   if (this.fudsBarChart) {
  //     this.fudsBarChart.destroy();
  //   }

  //   const allDataValues = datasets.flatMap(dataset => dataset.data);
  //   const maxValue = Math.max(...allDataValues);

  //   const roundedMaxValue = this.roundToNearestRoundFigure(maxValue);

  //   this.fudsBarChart = new Chart('fudsbarChartCanvas', {
  //     type: 'bar',
  //     data: {
  //       labels: truncatedQuestions,
  //       datasets: datasets,
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true,
  //           max: roundedMaxValue,
  //         },
  //       },
  //       plugins: {
  //         legend: {
  //           position: 'top',
  //         },
  //         tooltip: {
  //           mode: 'index',
  //           intersect: false,
  //           callbacks: {
  //             title: (context) => {
  //               const index = context[0].dataIndex;
  //               return questions[index];
  //             },
  //           },
  //         },
  //         title: {
  //           display: true,
  //           text: 'Feel, Use, Do and See survey',
  //           font: {
  //             size: 15,
  //           },
  //           padding: {
  //             top: 5,
  //             bottom: 10
  //           }
  //         },
  //         // zoom: {
  //         //   pan: {
  //         //     enabled: true,
  //         //     mode: 'xy',
  //         //   },
  //         //   zoom: {
  //         //     wheel: {
  //         //       enabled: true,
  //         //     },
  //         //     pinch: {
  //         //       enabled: true,
  //         //     },
  //         //     mode: 'xy',
  //         //   },
  //         // },
  //       },
  //       responsive: true,
  //       maintainAspectRatio: false,
  //     },
  //   });
  // }


  // executeFudsGraph() {
  //   if (this.fudsLineChart) {
  //     this.fudsLineChart.destroy();
  // }
  //   this.fudsLineChart = new Chart('fudsChartCanvas', {
  //     type: 'line',
  //     data: {
  //       labels: ['Feel', 'Use', 'Do', 'See'],
  //       datasets: [
  //         {
  //           data: this.importanceData,
  //           label: 'Importance',
  //           borderColor: "#103a7f",
  //           backgroundColor: '#103a7f',
  //           tension: 0.4,
  //           fill: false,
  //           pointRadius: 5,
  //           pointBackgroundColor: '#069de0',
  //           pointBorderColor: 'white',
  //         },
  //         {
  //           data: this.agreementData,
  //           label: 'Aggrement',
  //           borderColor: "#2980b9",
  //           backgroundColor: '#2980b9',
  //           tension: 0.4,
  //           fill: false,
  //           pointRadius: 5,
  //           pointBackgroundColor: '#103a7f',
  //           pointBorderColor: 'white',
  //         }
  //       ],
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true,
  //           max: 100,
  //         },
  //       },
  //       elements: {
  //         line: {
  //           borderWidth: 2,
  //         },
  //       },
  //     },
  //   });

  //   const questions = this.fudsDetails.map((item: { question: string }) => item.question);
  //   const truncatedQuestions = questions.map((question: string) => {
  //       const words = question.trim().split(' ').filter(word => word.length > 0);
  //       return words.slice(0, 2).join(' ') + '...';
  //   });

  //   const responseCategories = Object.keys(this.fudsDetails[0].optionWithCount);

  //   const datasets = responseCategories.map((category, index) => {
  //       return {
  //           label: category.trim(),
  //           data: this.fudsDetails.map((item: { optionWithCount: { [x: string]: any; }; }) => item.optionWithCount[category] || 0),
  //           backgroundColor: this.getColor(index)
  //       };
  //   });

  //   if (this.fudsBarChart) {
  //     this.fudsBarChart.destroy();
  // }

  //   this.fudsBarChart = new Chart('fudsbarChartCanvas', {
  //       type: 'bar',
  //       data: {
  //           labels: truncatedQuestions,
  //           datasets: datasets,
  //       },
  //       options: {
  //           scales: {
  //               y: {
  //                   beginAtZero: true,
  //                   max: 100,
  //               },
  //           },
  //           plugins: {
  //               legend: {
  //                   position: 'top',
  //               },
  //               tooltip: {
  //                   mode: 'index',
  //                   intersect: false,
  //                   callbacks: {
  //                       title: (context) => {
  //                           const index = context[0].dataIndex;
  //                           return questions[index];
  //                       },
  //                   },
  //               },
  //           },
  //           responsive: true,
  //           maintainAspectRatio: false,
  //       },
  //   });
  // }



  executeEESurveyGraph(res: any) {
    const categories = res.data?.xaxis.categories;
    const backendData = res.data?.backendData.map((item: any) => {
      return {
        name: item.name,
        data: item.data
      };
    });


    const currentDate = `Generated on: ${this.getCurrentDate()}`;

    this.chartOptions = {
      series: backendData.map((series: any) => ({
        name: series.name,
        data: series.data.map((value: any, index: number) => ({
          x: categories[index],
          y: value
        }))
      })),
      chart: {
        height: 350,
        type: "heatmap",
        toolbar: {
          show: true,
          export: {
            csv: {
              filename: "EXwise_Employee_Engagement_Survey_Summary",
              columnDelimiter: ",",
              headerCategory: "Client name :,"+this.displayClientData?.clientName+"\n"+currentDate+"\n Question",
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
              filename: "EXwise_Employee_Engagement_Survey_Summary",
              afterDownload: () => {
                console.log(currentDate);
              }
            },
            png: {
              filename: "EXwise_Employee_Engagement_Survey_Summary",
              afterDownload: () => {
                console.log(currentDate);
              }
            },
          },
        },
      },
      dataLabels: {
        enabled: false
      },
      title: {
        text: "Employee Engagement Survey",
        align: 'center'
      },
      subtitle: {
        text: `Client name: ${this.displayClientData?.clientName || "N/A"} |  ${currentDate}`,
        align: "center",
        style: {
          fontSize: "12px",
          fontWeight: "bold",
        },
      },
      xaxis: {
        categories: categories,
        labels: {
          show: true,
          rotate: -90,
          style: {
            colors: [],
            fontSize: '12px'
          },
          formatter: function (value: string) {
            if (value === "Communication") return "COMM";
            else if (value === "Direct manager") return "DM";
            else if (value === "Diversity and inclusion") return "DEI";
            else if (value === "Employee engagement index") return "EEI";
            else if (value === "Job satisfaction") return "JSAT";
            else if (value === "Leadership") return "L";
            else if (value === "Performance management and reward") return "PM&R";
            else if (value === "Purpose") return "JPUR";
            else if (value === "Teamwork") return "TEAM";
            else if (value === "Learning and growth opportunities") return "L&G";
            else if (value === "Wellness") return "WB";
            else return value; // Default case if none match
          }
        }
      },
      yaxis: {
        title: {
          text: ""
        }
      },
      tooltip: {
        y: {
          formatter: function (value: number) {
            return value + '';
          }
        }
      },
      colors: [],
      plotOptions: {
        heatmap: {
          colorScale: {
            ranges: [
              { from: 0, to: 0, color: '#cae1f2' },
              { from: 1, to: 20, color: '#2B3A67' },
              { from: 21, to: 40, color: '#069de0' },
              { from: 41, to: 60, color: '#103a7f' },
              { from: 61, to: 80, color: '#103a7f' },
              { from: 81, to: 100, color: '#2980b9' }
            ],
            min: 0,
            max: 100,
          }
        }
      }
    } as ChartOptions;
  }

  // executeEESurveyGraph(res: any) {
  //   const categories = res.data?.xaxis.categories;
  //   const backendData = res.data?.backendData.map((item: any) => {
  //     return {
  //       name: item.name,
  //       data: item.data
  //     };
  //   });

  //   this.chartOptions = {
  //     series: backendData,
  //     chart: {
  //       height: 350,
  //       type: "heatmap"
  //     },
  //     dataLabels: {
  //       enabled: false
  //     },
  //     colors: ["#2980b9", "#103a7f"],
  //     title: {
  //       text: ""
  //     },
  //     xaxis: {
  //       categories: categories,
  //       labels: {
  //         show: true,
  //         rotate: -90,
  //         style: {
  //           colors: [],
  //           fontSize: '12px'
  //         },
  //         formatter: function (value: string) {
  //           return value.split(' ').map(word => word[0]).join('');
  //         }
  //       }
  //     },
  //     yaxis: {
  //       title: {
  //         text: "Score"
  //       }
  //     },
  //     tooltip: {
  //       y: {
  //         formatter: function (value: number) {
  //           return value + " respondents";
  //         }
  //       }
  //     }
  //   };
  // }

  execueteEEBarGraph() {
    const questions = this.eeDetails.map((item: { question: string }) => item.question);
    const truncatedQuestions = questions.map((question: string) => {
      const words = question?.trim().split(' ').filter(word => word?.length > 0);
      return words.slice(0, 5).join(' ') + '...';
    });

    const responseCategories = Object.keys(this.eeDetails[0].optionWithCount);

    // Calculate the dataset with percentage values for 100% stacked bars
    const datasets = responseCategories.map((category, index) => {
      return {
        label: category.trim(),
        data: this.eeDetails.map((item: { optionWithCount: { [x: string]: any; }; }) => {
          const total = Object.values(item.optionWithCount).reduce((acc, val) => acc + val, 0);
          return total > 0 ? (item.optionWithCount[category] / total) * 100 : 0; // Calculate percentage
        }),
        backgroundColor: this.getColor(index)
      };
    });

    if (this.eeBarChart) {
      this.eeBarChart.destroy();
    }

    const allDataValues = datasets.flatMap(dataset => dataset.data);
    const maxValue = Math.max(...allDataValues);

    // Rounded max value should be 100 for percentage representation
    const roundedMaxValue = 100;

    this.eeBarChart = new Chart('eebarChartCanvas', {
      type: 'bar',  // Bar chart type
      data: {
        labels: truncatedQuestions,
        datasets: datasets,
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: roundedMaxValue,  // Max value set to 100
            stacked: true,  // Enable stacking on y-axis
          },
          x: {
            stacked: true,  // Enable stacking on x-axis
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              title: (context) => {
                const index = context[0].dataIndex;
                return questions[index];
              },
              label: (context) => {
                const dataset = context.dataset;
                const value: any = dataset.data[context.dataIndex];
                return `${dataset.label}: ${value.toFixed(1)}%`; // Tooltip shows percentage
              },
            },
          },
          title: {
            display: true,
            text: 'Employee Engagement survey',
            font: {
              size: 15,
            },
            padding: {
              top: 5,
              bottom: 10,
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  // execueteEEBarGraph() {
  //   const questions = this.eeDetails.map((item: { question: string }) => item.question);
  //   const truncatedQuestions = questions.map((question: string) => {
  //     const words = question?.trim().split(' ').filter(word => word?.length > 0);
  //     return words.slice(0, 2).join(' ') + '...';
  //   });

  //   const responseCategories = Object.keys(this.eeDetails[0].optionWithCount);

  //   const datasets = responseCategories.map((category, index) => {
  //     return {
  //       label: category.trim(),
  //       data: this.eeDetails.map((item: { optionWithCount: { [x: string]: any; }; }) => item.optionWithCount[category] || 0),
  //       backgroundColor: this.getColor(index)
  //     };
  //   });

  //   if (this.eeBarChart) {
  //     this.eeBarChart.destroy();
  //   }

  //   const allDataValues = datasets.flatMap(dataset => dataset.data);
  //   const maxValue = Math.max(...allDataValues);

  //   const roundedMaxValue = this.roundToNearestRoundFigure(maxValue);

  //   this.eeBarChart = new Chart('eebarChartCanvas', {
  //     type: 'bar',
  //     data: {
  //       labels: truncatedQuestions,
  //       datasets: datasets,
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true,
  //           max: roundedMaxValue,
  //         },
  //       },
  //       plugins: {
  //         legend: {
  //           position: 'top',
  //         },
  //         tooltip: {
  //           mode: 'index',
  //           intersect: false,
  //           callbacks: {
  //             title: (context) => {
  //               const index = context[0].dataIndex;
  //               return questions[index];
  //             },
  //           },
  //         },
  //         title: {
  //           display: true,
  //           text: 'Employee Engagement survey',
  //           font: {
  //             size: 15,
  //           },
  //           padding: {
  //             top: 5,
  //             bottom: 10
  //           }
  //         },
  //         // zoom: {
  //         //   pan: {
  //         //     enabled: true,
  //         //     mode: 'xy',
  //         //   },
  //         //   zoom: {
  //         //     wheel: {
  //         //       enabled: true,
  //         //     },
  //         //     pinch: {
  //         //       enabled: true,
  //         //     },
  //         //     mode: 'xy',
  //         //   },
  //         // },
  //       },
  //       responsive: true,
  //       maintainAspectRatio: false,
  //     },
  //   });
  // }



  executeExitGraph(res: any): void {
    if (res.data && res.data.length) {
      const questions = res.data.map((item: any) => item.question);
      const yesScores = res.data.map((item: any) => parseInt(item.yesScore));
      const noScores = res.data.map((item: any) => parseInt(item.noScore));

      const labels = [...questions.map((question: string) => {
        const words = question.split(' ');
        const firstTwoWords = words.slice(0, 2).join(' ');
        return `${firstTwoWords}...`;
      })];

      this.exitsurvey = new Chart('exitChartCanvas', {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              data: [...yesScores],
              label: 'Yes Score',
              borderColor: "#2980b9",
              backgroundColor: '#2980b9',
              tension: 0.4,
              fill: false,
              pointRadius: 5,
              pointBackgroundColor: '#103a7f',
              pointBorderColor: 'white',
            },
            {
              data: [...noScores],
              label: 'No Score',
              borderColor: "#103a7f",
              backgroundColor: '#103a7f',
              tension: 0.4,
              fill: false,
              pointRadius: 5,
              pointBackgroundColor: '#069de0',
              pointBorderColor: 'white',
            }
          ],
        },
        options: {
          scales: {
            x: {
              ticks: {
                autoSkip: false,
                maxRotation: 0,
                minRotation: 0,
                callback: function (value, index, values) {
                  return labels[index];
                }
              }
            },
            y: {
              beginAtZero: true,
              max: 50,
              min: -50,
              grid: {
                color: function (context) {
                  return context.tick.value === 0 ? 'black' : 'rgba(0, 0, 0, 0.1)';
                },
                lineWidth: function (context) {
                  return context.tick.value === 0 ? 2 : 1;
                },
              }
            },
          },
          elements: {
            line: {
              borderWidth: 2,
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                title: function (tooltipItems) {
                  const index = tooltipItems[0].dataIndex;
                  return index === 0 ? '' : questions[index - 1];
                },
                label: function (tooltipItem) {
                  return tooltipItem.dataset.label + ': ' + tooltipItem.raw;
                }
              }
            },
            title: {
              display: true,
              text: 'Exit survey',
              font: {
                size: 15,
              },
              padding: {
                top: 5,
                bottom: 10
              }
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
          }
        },
      });
    }
  }

  executeExitDoughnutChart(res: any) {
    const optionCounts = res.data.optionCounts;

    const series = Object.values(optionCounts).reverse();
    const labels = Object.keys(optionCounts).reverse();

    const colors = ["#103a7f", "#2980b9", "#069de0", "#103a7f", "#8e44ad", "#e74c3c", "#2980b9", "#4a8bec", "#f39c12", "#3498db", "#2ecc71", "#e67e22", "#ecf0f1"];

    this.exitdoughnutChart = {
      series: series,
      chart: {
        type: "donut",
        height: 320
      },
      labels: labels,
      colors: colors,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ],
      title: {
        text: "Exit Survey Reasons",
        align: 'center',
        style: {
          fontSize: '15px',
          color: '#103a7f'
        }
      },
      tooltip: {
        y: {
          formatter: function (value: number) {
            return value;
          }
        }
      },
    };
  }

  executeExitBarChart() {
    const questions = this.exitTable.listOfStaticSubPhase[0].staticQuestionScoreForSurveyResponseDto.map((item: any) => item.question);
    const truncatedQuestions = questions.map((question: string) => {
      const words = question.trim().split(' ').filter(word => word.length > 0);
      return words.slice(0, 2).join(' ') + '...';
    });

    const responseCategories = Object.keys(this.exitTable.listOfStaticSubPhase[0].staticQuestionScoreForSurveyResponseDto[0].optionWithCount);

    // Calculate the dataset with percentage values for 100% stacked bars
    const datasets = responseCategories.map((category, index) => {
      return {
        label: category.trim(),
        data: this.exitTable.listOfStaticSubPhase[0].staticQuestionScoreForSurveyResponseDto.map((item: any) => {
          const total: any = Object.values(item.optionWithCount).reduce((acc: any, val) => acc + val, 0);
          return total > 0 ? (item.optionWithCount[category] / total) * 100 : 0; // Calculate percentage
        }),
        backgroundColor: this.getColor(index),
      };
    });

    if (this.exitBarChart) {
      this.exitBarChart.destroy();
    }

    const allDataValues = datasets.flatMap(dataset => dataset.data);
    const maxValue = Math.max(...allDataValues);

    // Set max value to 100 as we are working with percentages
    const roundedMaxValue = 100;

    this.exitBarChart = new Chart('exitbarChartCanvas', {
      type: 'bar',  // Bar chart type
      data: {
        labels: truncatedQuestions,
        datasets: datasets,
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: roundedMaxValue,  // Max value set to 100 (percentage)
            stacked: true,  // Enable stacking on y-axis
          },
          x: {
            stacked: true,  // Enable stacking on x-axis
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              title: (context) => {
                const index = context[0].dataIndex;
                return questions[index];
              },
              label: (context) => {
                const dataset = context.dataset;
                const value: any = dataset.data[context.dataIndex];
                return `${dataset.label}: ${value.toFixed(1)}%`; // Tooltip shows percentage
              },
            },
          },
          title: {
            display: true,
            text: 'Exit survey',
            font: {
              size: 15,
            },
            padding: {
              top: 5,
              bottom: 10,
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }


  // executeExitBarChart() {
  //   const questions = this.exitTable.listOfStaticSubPhase[0].staticQuestionScoreForSurveyResponseDto.map((item: any) => item.question);
  //   const truncatedQuestions = questions.map((question: string) => {
  //     const words = question.trim().split(' ').filter(word => word.length > 0);
  //     return words.slice(0, 2).join(' ') + '...';
  //   });

  //   const responseCategories = Object.keys(this.exitTable.listOfStaticSubPhase[0].staticQuestionScoreForSurveyResponseDto[0].optionWithCount);

  //   const datasets = responseCategories.map((category, index) => {
  //     return {
  //       label: category.trim(),
  //       data: this.exitTable.listOfStaticSubPhase[0].staticQuestionScoreForSurveyResponseDto.map((item: any) => item.optionWithCount[category] || 0),
  //       backgroundColor: this.getColor(index)
  //     };
  //   });

  //   if (this.exitBarChart) {
  //     this.exitBarChart.destroy();
  //   }


  //   const allDataValues = datasets.flatMap(dataset => dataset.data);
  //   const maxValue = Math.max(...allDataValues);

  //   const roundedMaxValue = this.roundToNearestRoundFigure(maxValue);

  //   this.exitBarChart = new Chart('exitbarChartCanvas', {
  //     type: 'bar',
  //     data: {
  //       labels: truncatedQuestions,
  //       datasets: datasets,
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true,
  //           max: roundedMaxValue,
  //         },
  //       },
  //       plugins: {
  //         legend: {
  //           position: 'top',
  //         },
  //         tooltip: {
  //           mode: 'index',
  //           intersect: false,
  //           callbacks: {
  //             title: (context) => {
  //               const index = context[0].dataIndex;
  //               return questions[index];
  //             },
  //           },
  //         },
  //         title: {
  //           display: true,
  //           text: 'Exit survey',
  //           font: {
  //             size: 15,
  //           },
  //           padding: {
  //             top: 5,
  //             bottom: 10
  //           }
  //         },
  //         // zoom: {
  //         //   pan: {
  //         //     enabled: true,
  //         //     mode: 'xy',
  //         //   },
  //         //   zoom: {
  //         //     wheel: {
  //         //       enabled: true,
  //         //     },
  //         //     pinch: {
  //         //       enabled: true,
  //         //     },
  //         //     mode: 'xy',
  //         //   },
  //         // },
  //       },
  //       responsive: true,
  //       maintainAspectRatio: false,
  //     },
  //   });
  // }


  executeOnBoardingGraph(res: any): void {
    if (res.data && res.data.questions) {
      const questions = res.data.questions.map((item: any) => item.question);
      const scores = res.data.questions.map((item: any) => (item.score / 5) * 100);

      const labels = questions.map((question: string) => {
        const trimmedQuestion = question.trim();
        const words = trimmedQuestion.split(' ');
        const firstTwoWords = words.slice(0, 2).join(' ');
        return `${firstTwoWords}...`;
      });

      this.onboardinglineChart = new Chart('onboardChartCanvas', {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              data: scores,
              label: 'Score',
              borderColor: "#069de0",
              backgroundColor: '#069de0',
              tension: 0.4,
              fill: false,
              pointRadius: 5,
              pointBackgroundColor: '#069de0',
              pointBorderColor: 'white',
            }
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function (value) {
                  return value + '%';
                }
              }
            },
          },
          elements: {
            line: {
              borderWidth: 2,
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                title: function (tooltipItems) {
                  const index = tooltipItems[0].dataIndex;
                  return questions[index];
                },
                label: function (tooltipItem) {
                  return tooltipItem.dataset.label + ': ' + tooltipItem.raw + '%';
                }
              }
            },
            title: {
              display: true,
              text: 'Onboarding feedback survey',
              font: {
                size: 15,
              },
              padding: {
                top: 5,
                bottom: 10
              }
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
          }
        },
      });
    }
  }

  executeOnbarodingBarChart(): void {
    const questions = this.onboardTable.listOfStaticSubPhase[0].staticQuestionScoreForSurveyResponseDto.map((item: any) => item.question);
    const truncatedQuestions = questions.map((question: string) => {
      const words = question.trim().split(' ').filter(word => word.length > 0);
      return words.slice(0, 2).join(' ') + '...';
    });

    const responseCategories = Object.keys(this.onboardTable.listOfStaticSubPhase[0].staticQuestionScoreForSurveyResponseDto[0].optionWithCount);

    // Calculate the dataset with percentage values for 100% stacked bars
    const datasets = responseCategories.map((category, index) => {
      return {
        label: category.trim(),
        data: this.onboardTable.listOfStaticSubPhase[0].staticQuestionScoreForSurveyResponseDto.map((item: any) => {
          const total: any = Object.values(item.optionWithCount).reduce((acc: any, val) => acc + val, 0);
          return total > 0 ? (item.optionWithCount[category] / total) * 100 : 0; // Calculate percentage
        }),
        backgroundColor: this.getColor(index),
      };
    });

    if (this.onboardBarChart) {
      this.onboardBarChart.destroy();
    }

    const allDataValues = datasets.flatMap(dataset => dataset.data);
    const maxValue = Math.max(...allDataValues);

    // Set max value to 100 as we are working with percentages
    const roundedMaxValue = 100;

    this.onboardBarChart = new Chart('onboardbarChartCanvas', {
      type: 'bar',  // Bar chart type
      data: {
        labels: truncatedQuestions,
        datasets: datasets,
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: roundedMaxValue,  // Max value set to 100 (percentage)
            stacked: true,  // Enable stacking on y-axis
          },
          x: {
            stacked: true,  // Enable stacking on x-axis
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              title: (context) => {
                const index = context[0].dataIndex;
                return questions[index];
              },
              label: (context) => {
                const dataset = context.dataset;
                const value: any = dataset.data[context.dataIndex];
                return `${dataset.label}: ${value.toFixed(1)}%`; // Tooltip shows percentage
              },
            },
          },
          title: {
            display: true,
            text: 'Onboarding feedback survey',
            font: {
              size: 15,
            },
            padding: {
              top: 5,
              bottom: 10,
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }


  // executeOnbarodingBarChart(): void {
  //   const questions = this.onboardTable.listOfStaticSubPhase[0].staticQuestionScoreForSurveyResponseDto.map((item: any) => item.question);
  //   const truncatedQuestions = questions.map((question: string) => {
  //     const words = question.trim().split(' ').filter(word => word.length > 0);
  //     return words.slice(0, 2).join(' ') + '...';
  //   });

  //   const responseCategories = Object.keys(this.onboardTable.listOfStaticSubPhase[0].staticQuestionScoreForSurveyResponseDto[0].optionWithCount);

  //   const datasets = responseCategories.map((category, index) => {
  //     return {
  //       label: category.trim(),
  //       data: this.onboardTable.listOfStaticSubPhase[0].staticQuestionScoreForSurveyResponseDto.map((item: any) => item.optionWithCount[category] || 0),
  //       backgroundColor: this.getColor(index)
  //     };
  //   });

  //   if (this.onboardBarChart) {
  //     this.onboardBarChart.destroy();
  //   }

  //   const allDataValues = datasets.flatMap(dataset => dataset.data);
  //   const maxValue = Math.max(...allDataValues);

  //   const roundedMaxValue = this.roundToNearestRoundFigure(maxValue);

  //   this.onboardBarChart = new Chart('onboardbarChartCanvas', {
  //     type: 'bar',
  //     data: {
  //       labels: truncatedQuestions,
  //       datasets: datasets,
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true,
  //           max: roundedMaxValue,
  //         },
  //       },
  //       plugins: {
  //         legend: {
  //           position: 'top',
  //         },
  //         tooltip: {
  //           mode: 'index',
  //           intersect: false,
  //           callbacks: {
  //             title: (context) => {
  //               const index = context[0].dataIndex;
  //               return questions[index];
  //             },
  //           },
  //         },
  //         title: {
  //           display: true,
  //           text: 'Onboarding feedback survey',
  //           font: {
  //             size: 15,
  //           },
  //           padding: {
  //             top: 5,
  //             bottom: 10
  //           }
  //         },
  //         // zoom: {
  //         //   pan: {
  //         //     enabled: true,
  //         //     mode: 'xy',
  //         //   },
  //         //   zoom: {
  //         //     wheel: {
  //         //       enabled: true,
  //         //     },
  //         //     pinch: {
  //         //       enabled: true,
  //         //     },
  //         //     mode: 'xy',
  //         //   },
  //         // },
  //       },
  //       responsive: true,
  //       maintainAspectRatio: false,
  //     },
  //   });
  // }

  executeOjt(res: any): void {
    if (res.data && res.data.questions) {
      const questions = res.data.questions.map((item: any) => item.question);
      const scores = res.data.questions.map((item: any) => (item.score / 5) * 100);

      const labels = questions.map((question: string) => {
        const trimmedQuestion = question.trim();
        const words = trimmedQuestion.split(' ');
        const firstTwoWords = words.slice(0, 1).join(' ');
        return `${firstTwoWords}...`;
      });
      this.ojtEffectiveness = '';
      this.ojtEffectiveness = new Chart('ojtChartCanvas', {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              data: scores,
              label: 'Score',
              borderColor: "#2980b9",
              backgroundColor: '#2980b9',
              tension: 0.4,
              fill: false,
              pointRadius: 5,
              pointBackgroundColor: '#103a7f',
              pointBorderColor: 'white',
            }
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function (value) {
                  return value + '%';
                }
              }
            },
          },
          elements: {
            line: {
              borderWidth: 2,
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                title: function (tooltipItems) {
                  const index = tooltipItems[0].dataIndex;
                  return questions[index];
                },
                label: function (tooltipItem) {
                  return tooltipItem.dataset.label + ': ' + tooltipItem.raw + '%';
                }
              }
            },
            title: {
              display: true,
              text: 'On-the-job training effectiveness survey',
              font: {
                size: 15,
              },
              padding: {
                top: 5,
                bottom: 10
              }
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
          }
        },
      });
    }
  }

  executeojtBarChart(): void {
    const questions = this.ojtTable.listOfStaticSubPhase[0].staticQuestionScoreForSurveyResponseDto.map((item: any) => item.question);
    const truncatedQuestions = questions.map((question: string) => {
      const words = question?.trim().split(' ').filter(word => word?.length > 0);
      return words.slice(0, 1).join(' ') + '...';
    });

    const responseCategories = Object.keys(this.ojtTable.listOfStaticSubPhase[0].staticQuestionScoreForSurveyResponseDto[0].optionWithCount);

    // Calculate datasets as percentages
    const datasets = responseCategories.map((category, index) => {
      return {
        label: category.trim(),
        data: this.ojtTable.listOfStaticSubPhase[0].staticQuestionScoreForSurveyResponseDto.map((item: any) => {
          const total = Object.values(item.optionWithCount as Record<string, number>).reduce(
            (sum: number, value: number) => sum + value,
            0
          );
          return total > 0 ? ((item.optionWithCount[category] || 0) / total) * 100 : 0; // Convert to percentage
        }),
        backgroundColor: this.getColor(index)
      };
    });

    if (this.ojtBarChart) {
      this.ojtBarChart.destroy();
    }

    this.ojtBarChart = new Chart('ojtBarChartCanvas', {
      type: 'bar',
      data: {
        labels: truncatedQuestions,
        datasets: datasets,
      },
      options: {
        scales: {
          x: {
            stacked: true, // Stack bars horizontally
          },
          y: {
            stacked: true, // Stack bars vertically
            beginAtZero: true,
            max: 100, // Ensure the Y-axis is always 100% for proportional representation
            ticks: {
              callback: (value) => `${value}%`, // Display percentage on Y-axis
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              title: (context) => {
                const index = context[0].dataIndex;
                return questions[index];
              },
              label: (tooltipItem) => {
                const datasetLabel = tooltipItem.dataset.label || '';
                const value = tooltipItem.raw as number;
                return `${datasetLabel}: ${value.toFixed(2)}%`;
              },
            },
          },
          title: {
            display: true,
            text: 'On-the-job training effectiveness survey',
            font: {
              size: 15,
            },
            padding: {
              top: 5,
              bottom: 10,
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }


  // executeojtBarChart(): void {
  //   const questions = this.ojtTable.listOfStaticSubPhase[0].staticQuestionScoreForSurveyResponseDto.map((item: any) => item.question);
  //   const truncatedQuestions = questions.map((question: string) => {
  //     const words = question?.trim().split(' ').filter(word => word?.length > 0);
  //     return words.slice(0, 2).join(' ') + '...';
  //   });

  //   const responseCategories = Object.keys(this.ojtTable.listOfStaticSubPhase[0].staticQuestionScoreForSurveyResponseDto[0].optionWithCount);

  //   const datasets = responseCategories.map((category, index) => {
  //     return {
  //       label: category.trim(),
  //       data: this.ojtTable.listOfStaticSubPhase[0].staticQuestionScoreForSurveyResponseDto.map((item: any) => item.optionWithCount[category] || 0),
  //       backgroundColor: this.getColor(index)
  //     };
  //   });

  //   if (this.ojtBarChart) {
  //     this.ojtBarChart.destroy();
  //   }

  //   const allDataValues = datasets.flatMap(dataset => dataset.data);
  //   const maxValue = Math.max(...allDataValues);

  //   const roundedMaxValue = this.roundToNearestRoundFigure(maxValue);

  //   this.ojtBarChart = new Chart('ojtBarChartCanvas', {
  //     type: 'bar',
  //     data: {
  //       labels: truncatedQuestions,
  //       datasets: datasets,
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true,
  //           max: roundedMaxValue,
  //         },
  //       },
  //       plugins: {
  //         legend: {
  //           position: 'top',
  //         },
  //         tooltip: {
  //           mode: 'index',
  //           intersect: false,
  //           callbacks: {
  //             title: (context) => {
  //               const index = context[0].dataIndex;
  //               return questions[index];
  //             },
  //           },
  //         },
  //         title: {
  //           display: true,
  //           text: 'On-the-job training effectiveness survey',
  //           font: {
  //             size: 15,
  //           },
  //           padding: {
  //             top: 5,
  //             bottom: 10
  //           }
  //         },
  //         // zoom: {
  //         //   pan: {
  //         //     enabled: true,
  //         //     mode: 'xy',
  //         //   },
  //         //   zoom: {
  //         //     wheel: {
  //         //       enabled: true,
  //         //     },
  //         //     pinch: {
  //         //       enabled: true,
  //         //     },
  //         //     mode: 'xy',
  //         //   },
  //         // },
  //       },
  //       responsive: true,
  //       maintainAspectRatio: false,
  //     },
  //   });
  // }

  executeInduction(res: any) {
    if (res.data && res.data.questions) {
      const questions = res.data.questions.map((item: any) => item.question);
      const scores = res.data.questions.map((item: any) => (item.score / 5) * 100);

      const labels = questions.map((question: string) => {
        const trimmedQuestion = question.trim();
        const words = trimmedQuestion.split(' ');
        const firstTwoWords = words.slice(0, 1).join(' ');
        return `${firstTwoWords}...`;
      });

      this.inductionSurvey = new Chart('inductionChartCanvas', {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              data: scores,
              label: 'Score',
              borderColor: "#069de0",
              backgroundColor: '#069de0',
              tension: 0.4,
              fill: false,
              pointRadius: 5,
              pointBackgroundColor: '#069de0',
              pointBorderColor: 'white',
            }
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function (value) {
                  return value + '%';
                }
              }
            },
          },
          elements: {
            line: {
              borderWidth: 2,
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                title: function (tooltipItems) {
                  const index = tooltipItems[0].dataIndex;
                  return questions[index];
                },
                label: function (tooltipItem) {
                  return tooltipItem.dataset.label + ': ' + tooltipItem.raw + '%';
                }
              }
            },
            title: {
              display: true,
              text: 'Induction effectiveness survey',
              font: {
                size: 15,
              },
              padding: {
                top: 5,
                bottom: 10
              }
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
          }
        },
      });
    }
  }

  executeInductionBarChart() {
    const questions = this.inductionTable.listOfStaticSubPhase[0].staticQuestionScoreForSurveyResponseDto.map((item: any) => item.question);
    const truncatedQuestions = questions.map((question: string) => {
      const words = question.trim().split(' ').filter(word => word?.length > 0);
      return words.slice(0, 2).join(' ') + '...';
    });

    const responseCategories = Object.keys(this.inductionTable.listOfStaticSubPhase[0].staticQuestionScoreForSurveyResponseDto[0].optionWithCount);

    // Calculate percentages for each dataset
    const datasets = responseCategories.map((category, index) => {
      const rawData = this.inductionTable.listOfStaticSubPhase[0].staticQuestionScoreForSurveyResponseDto.map((item: any) => item.optionWithCount[category] || 0);
      const totalValues = this.inductionTable.listOfStaticSubPhase[0].staticQuestionScoreForSurveyResponseDto.map((item: any) =>
        Object.values(item.optionWithCount as Record<string, number>).reduce((sum: number, value: number) => sum + value, 0)
      );


      const percentageData = rawData.map((value: any, i: any) => (value / totalValues[i]) * 100);

      return {
        label: category.trim(),
        data: percentageData,
        backgroundColor: this.getColor(index),
      };
    });

    if (this.inductionBarChart) {
      this.inductionBarChart.destroy();
    }

    this.inductionBarChart = new Chart('inductionBarChartCanvas', {
      type: 'bar',
      data: {
        labels: truncatedQuestions,
        datasets: datasets,
      },
      options: {
        scales: {
          x: {
            stacked: true,
          },
          y: {
            beginAtZero: true,
            stacked: true,
            max: 100,
            ticks: {
              callback: (value) => `${value}%`,
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              title: (context) => {
                const index = context[0].dataIndex;
                return questions[index];
              },
              label: (context: any) => {
                const datasetLabel = context.dataset.label || '';
                const value: any = context.raw.toFixed(2); // Limit to two decimal places
                return `${datasetLabel}: ${value}%`;
              },
            },
          },
          title: {
            display: true,
            text: 'Induction effectiveness survey',
            font: {
              size: 15,
            },
            padding: {
              top: 5,
              bottom: 10,
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }


  // executeInductionBarChart() {
  //   const questions = this.inductionTable.listOfStaticSubPhase[0].staticQuestionScoreForSurveyResponseDto.map((item: any) => item.question);
  //   const truncatedQuestions = questions.map((question: string) => {
  //     const words = question.trim().split(' ').filter(word => word?.length > 0);
  //     return words.slice(0, 2).join(' ') + '...';
  //   });

  //   const responseCategories = Object.keys(this.inductionTable.listOfStaticSubPhase[0].staticQuestionScoreForSurveyResponseDto[0].optionWithCount);

  //   const datasets = responseCategories.map((category, index) => {
  //     return {
  //       label: category.trim(),
  //       data: this.inductionTable.listOfStaticSubPhase[0].staticQuestionScoreForSurveyResponseDto.map((item: any) => item.optionWithCount[category] || 0),
  //       backgroundColor: this.getColor(index)
  //     };
  //   });

  //   if (this.inductionBarChart) {
  //     this.inductionBarChart.destroy();
  //   }

  //   const allDataValues = datasets.flatMap(dataset => dataset.data);
  //   const maxValue = Math.max(...allDataValues);

  //   const roundedMaxValue = this.roundToNearestRoundFigure(maxValue);

  //   this.inductionBarChart = new Chart('inductionBarChartCanvas', {
  //     type: 'bar',
  //     data: {
  //       labels: truncatedQuestions,
  //       datasets: datasets,
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true,
  //           max: roundedMaxValue,
  //         },
  //       },
  //       plugins: {
  //         legend: {
  //           position: 'top',
  //         },
  //         tooltip: {
  //           mode: 'index',
  //           intersect: false,
  //           callbacks: {
  //             title: (context) => {
  //               const index = context[0].dataIndex;
  //               return questions[index];
  //             },
  //           },
  //         },
  //         title: {
  //           display: true,
  //           text: 'Induction effectiveness survey',
  //           font: {
  //             size: 15,
  //           },
  //           padding: {
  //             top: 5,
  //             bottom: 10
  //           }
  //         },
  //         // zoom: {
  //         //   pan: {
  //         //     enabled: true,
  //         //     mode: 'xy',
  //         //   },
  //         //   zoom: {
  //         //     wheel: {
  //         //       enabled: true,
  //         //     },
  //         //     pinch: {
  //         //       enabled: true,
  //         //     },
  //         //     mode: 'xy',
  //         //   },
  //         // },
  //       },
  //       responsive: true,
  //       maintainAspectRatio: false,
  //     },
  //   });
  // }

  executePulse(res: any): void {
    const categories = res.data?.xaxis?.categories;
    // const categories = ['COMM','DM','DEI','EEI','JSAT','L','PM&R','JPUR','TEAM','L&G','WB']
    const backendData = res.data?.backendData.map((item: any) => {
      return {
        name: item.name,
        data: item.data
      };
    });

    const currentDate = `Generated on:, ${this.getCurrentDate()}`;

    this.pulseChartOptions = {
      series: backendData.map((series: any) => ({
        name: series.name,
        data: series?.data?.map((value: any, index: number) => ({
          x: categories[index],
          y: value
        }))
        // data: series?.data?.map((value: any) => ({
        //   x: categories,
        //   y: value
        // }))
      })),
      chart: {
        height: 350,
        type: "heatmap",
        toolbar: {
          show: true,
          export: {
            csv: {
              filename: "EXwise_Pulse_Summary",
              columnDelimiter: ",",
              headerCategory: "Client name :,"+this.displayClientData?.clientName+"\n"+currentDate+"\n Question",
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
              filename: "EXwise_Pulse_Survey_Summary",
              // beforeDownload: () => {
              //   console.log(currentDate); 
              // }
            },
            png: {
              filename: "Exwise_Pulse_Survey_Summary",
              // afterDownload: () => {
              //   console.log(currentDate);
              // }
            },
          },
        },
      },
      dataLabels: {
        enabled: false
      },
      title: {
        text: "Pulse survey",
        align: 'center'
      },
      subtitle: {
        text: `Client name: ${this.displayClientData?.clientName || "N/A"} |  ${currentDate}`,
        align: "center",
        style: {
          fontSize: "12px",
          fontWeight: "bold",
        },
      },
      xaxis: {
        categories: categories,
        labels: {
          show: true,
          rotate: -90,
          style: {
            colors: [],
            fontSize: '12px'
          },
          formatter: function (value: string) {
            if (value === "Communication") return "COMM";
            else if (value === "Direct manager") return "DM";
            else if (value === "Diversity and inclusion") return "DEI";
            else if (value === "Employee engagement index") return "EEI";
            else if (value === "Job satisfaction") return "JSAT";
            else if (value === "Leadership") return "L";
            else if (value === "Performance management and reward") return "PM&R";
            else if (value === "Purpose") return "JPUR";
            else if (value === "Teamwork") return "TEAM";
            else if (value === "Learning and growth opportunities") return "L&G";
            else if (value === "Wellness") return "WB";
            else return value; // Default case if none match
          }
        }
      },
      yaxis: {
        title: {
          text: ""
        }
      },
      tooltip: {
        y: {
          formatter: function (value: number) {
            return value + '';
          }
        }
      },
      colors: [],
      plotOptions: {
        heatmap: {
          colorScale: {
            ranges: [
              { from: 0, to: 0, color: '#cae1f2' },
              { from: 1, to: 20, color: '#2B3A67' },
              { from: 21, to: 40, color: '#069de0' },
              { from: 41, to: 60, color: '#103a7f' },
              { from: 61, to: 80, color: '#103a7f' },
              { from: 81, to: 100, color: '#2980b9' }
            ]
          }
        }
      }
    } as pulseChartOptions;
    // if (res.data && Array.isArray(res.data)) {
    //   const labels = res.data.map((item: any) => {
    //     return item.stageName.substring(0, 6); 
    //   });
    //   const fullLabels = res.data.map((item: any) => item.stageName); 

    //   const scores = res.data.map((item: any) => item.score);

    //   this.pulse = new Chart('pulsechartCanvas', {
    //     type: 'line',
    //     data: {
    //       labels: labels,
    //       datasets: [
    //         {
    //           data: scores,
    //           label: 'Score',
    //           borderColor: "#2980b9",
    //           backgroundColor: '#2980b9',
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
    //           max: 500,
    //           min: 10,
    //         },
    //       },
    //       elements: {
    //         line: {
    //           borderWidth: 2,
    //         },
    //       },
    //       plugins: {
    //         tooltip: {
    //           callbacks: {
    //             title: function (tooltipItems) {
    //               const index = tooltipItems[0].dataIndex;
    //               return fullLabels[index]; // Show full label on tooltip
    //             },
    //             label: function (tooltipItem) {
    //               return tooltipItem.dataset.label + ': ' + tooltipItem.raw;
    //             }
    //           }
    //         }
    //       }
    //     },
    //   });
    // }
  }

  execuetePulseBarGraph(): void {
    const questions = this.pulseDetails.map((item: { question: string }) => item.question);
    const truncatedQuestions = questions.map((question: string) => {
      const words = question.trim().split(' ').filter(word => word.length > 0);
      return words.slice(0, 5).join(' ') + '...';
    });

    const responseCategories = Object.keys(this.pulseDetails[0].optionWithCount);

    // Calculate datasets as percentages
    const datasets = responseCategories.map((category, index) => {
      return {
        label: category.trim(),
        data: this.pulseDetails.map((item: { optionWithCount: { [key: string]: any } }) => {
          const total = Object.values(item.optionWithCount as Record<string, number>).reduce(
            (sum: number, value: number) => sum + value,
            0
          );
          return total > 0 ? ((item.optionWithCount[category] || 0) / total) * 100 : 0; // Convert to percentage
        }),
        backgroundColor: this.getColor(index),
      };
    });

    if (this.pulseBarChart) {
      this.pulseBarChart.destroy();
    }

    this.pulseBarChart = new Chart('pulsebarChartCanvas', {
      type: 'bar',
      data: {
        labels: truncatedQuestions,
        datasets: datasets,
      },
      options: {
        scales: {
          x: {
            stacked: true, // Stack bars horizontally
          },
          y: {
            stacked: true, // Stack bars vertically
            beginAtZero: true,
            max: 100, // Ensure the Y-axis is always 100% for proportional representation
            ticks: {
              callback: (value) => `${value}%`, // Display percentage on Y-axis
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              title: (context) => {
                const index = context[0].dataIndex;
                return questions[index];
              },
              label: (tooltipItem) => {
                const datasetLabel = tooltipItem.dataset.label || '';
                const value = tooltipItem.raw as number;
                return `${datasetLabel}: ${value.toFixed(2)}%`;
              },
            },
          },
          title: {
            display: true,
            text: 'Pulse survey',
            font: {
              size: 15,
            },
            padding: {
              top: 5,
              bottom: 10,
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }


  // execuetePulseBarGraph() {
  //   const questions = this.pulseDetails.map((item: { question: string }) => item.question);
  //   const truncatedQuestions = questions.map((question: string) => {
  //     const words = question.trim().split(' ').filter(word => word.length > 0);
  //     return words.slice(0, 2).join(' ') + '...';
  //   });

  //   const responseCategories = Object.keys(this.pulseDetails[0].optionWithCount);

  //   const datasets = responseCategories.map((category, index) => {
  //     return {
  //       label: category.trim(),
  //       data: this.pulseDetails.map((item: { optionWithCount: { [x: string]: any; }; }) => item.optionWithCount[category] || 0),
  //       backgroundColor: this.getColor(index)
  //     };
  //   });

  //   if (this.pulseBarChart) {
  //     this.pulseBarChart.destroy();
  //   }

  //   const allDataValues = datasets.flatMap(dataset => dataset.data);
  //   const maxValue = Math.max(...allDataValues);

  //   const roundedMaxValue = this.roundToNearestRoundFigure(maxValue);

  //   this.pulseBarChart = new Chart('pulsebarChartCanvas', {
  //     type: 'bar',
  //     data: {
  //       labels: truncatedQuestions,
  //       datasets: datasets,
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true,
  //           max: roundedMaxValue,
  //         },
  //       },
  //       plugins: {
  //         legend: {
  //           position: 'top',
  //         },
  //         tooltip: {
  //           mode: 'index',
  //           intersect: false,
  //           callbacks: {
  //             title: (context) => {
  //               const index = context[0].dataIndex;
  //               return questions[index];
  //             },
  //           },
  //         },
  //         title: {
  //           display: true,
  //           text: 'Pulse survey',
  //           font: {
  //             size: 15,
  //           },
  //           padding: {
  //             top: 5,
  //             bottom: 10
  //           }
  //         },
  //         // zoom: {
  //         //   pan: {
  //         //     enabled: true,
  //         //     mode: 'xy',
  //         //   },
  //         //   zoom: {
  //         //     wheel: {
  //         //       enabled: true,
  //         //     },
  //         //     pinch: {
  //         //       enabled: true,
  //         //     },
  //         //     mode: 'xy',
  //         //   },
  //         // },
  //       },
  //       responsive: true,
  //       maintainAspectRatio: false,
  //     },
  //   });
  // }


  executeManagerLine(res: any) {
    this.managerEffectiveness = '';
    if (res.data) {
      const data = res.data;
      console.log(data)
      const labels = ['Trust and Fairness', 'Support and Motivation', 'Impact'];
      const scores = [data.trustAndFairness, data.supportAndMotivation, data.impact];

      this.managerEffectiveness = new Chart('managerChartCanvas', {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              data: scores,
              label: 'Score',
              borderColor: "#2980b9",
              backgroundColor: '#2980b9',
              tension: 0.4,
              fill: false,
              pointRadius: 5,
              pointBackgroundColor: '#2980b9',
              pointBorderColor: 'white',
            }
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
            },
          },
          elements: {
            line: {
              borderWidth: 2,
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                title: function (tooltipItems) {
                  const index = tooltipItems[0].dataIndex;
                  return labels[index];
                },
                label: function (tooltipItem) {
                  return tooltipItem.dataset.label + ': ' + tooltipItem.raw;
                }
              }
            },
            title: {
              display: true,
              text: 'Manager Effectiveness survey',
              font: {
                size: 15,
              },
              padding: {
                top: 5,
                bottom: 10
              }
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
          }
        },
      });
    }
  }

  executeManagerDoughnut(res: any) {
    this.managerdoughnutChart = '';
    const labels = res.data.map((item: any) => item.stage);
    const data = res.data.map((item: any) => item.responseCount);

    this.managerdoughnutChart = new Chart('managerdoughnutChartCanvas', {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: ['#103a7f', '#069de0', '#2980b9'],
          },
        ],
      },
      options: {
        cutout: '65%',
        plugins: {
          title: {
            display: true,
            text: 'Manager Effectiveness survey',
            font: {
              size: 15
            }
          }
        }
      },

    });
  }

  executeMangerBarChart(): void {
    const questions = this.managerTable?.listOfStaticSubPhase[0]?.staticQuestionScoreForSurveyResponseDto?.map((item: any) => item?.question);
    const truncatedQuestions = questions?.map((question: string) => {
      const words = question.trim().split(' ').filter(word => word.length > 0);
      return words.slice(0, 2).join(' ') + '...';
    });

    const responseCategories = Object.keys(this.managerTable?.listOfStaticSubPhase[0]?.staticQuestionScoreForSurveyResponseDto[0]?.optionWithCount);

    // Normalize data to percentages
    const datasets = responseCategories.map((category, index) => {
      return {
        label: category.trim(),
        data: this.managerTable?.listOfStaticSubPhase[0]?.staticQuestionScoreForSurveyResponseDto?.map((item: any) => {
          const total: any = Object.values(item.optionWithCount || {}).reduce((sum: any, value) => sum + (value as number), 0);
          return total > 0 ? ((item.optionWithCount[category] || 0) / total) * 100 : 0; // Convert to percentage
        }),
        backgroundColor: this.getColor(index),
      };
    });

    if (this.managerBarChart) {
      this.managerBarChart.destroy();
    }
    this.managerdoughnutChart = '';
    this.managerBarChart = new Chart('managerBarChartCanvas', {
      type: 'bar',
      data: {
        labels: truncatedQuestions,
        datasets: datasets,
      },
      options: {
        scales: {
          x: {
            stacked: true, // Enable stacking on the X-axis
          },
          y: {
            stacked: true, // Enable stacking on the Y-axis
            beginAtZero: true,
            max: 100, // Limit the Y-axis to 100%
            ticks: {
              callback: (value) => `${value}%`, // Show percentages on Y-axis
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              title: (context) => {
                const index = context[0].dataIndex;
                return questions[index];
              },
              label: (tooltipItem) => {
                const datasetLabel = tooltipItem.dataset.label || '';
                const value = tooltipItem.raw as number;
                return `${datasetLabel}: ${value.toFixed(2)}%`; // Show percentage with 2 decimals
              },
            },
          },
          title: {
            display: true,
            text: 'Manager Effectiveness Survey',
            font: {
              size: 15,
            },
            padding: {
              top: 5,
              bottom: 10,
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }


  // executeMangerBarChart() {
  //   const questions = this.managerTable?.listOfStaticSubPhase[0]?.staticQuestionScoreForSurveyResponseDto?.map((item: any) => item?.question);
  //   const truncatedQuestions = questions?.map((question: string) => {
  //     const words = question.trim().split(' ').filter(word => word.length > 0);
  //     return words.slice(0, 2).join(' ') + '...';
  //   });

  //   const responseCategories = Object.keys(this.managerTable.listOfStaticSubPhase[0]?.staticQuestionScoreForSurveyResponseDto[0]?.optionWithCount);

  //   const datasets = responseCategories.map((category, index) => {
  //     return {
  //       label: category.trim(),
  //       data: this.managerTable.listOfStaticSubPhase[0]?.staticQuestionScoreForSurveyResponseDto?.map((item: any) => item?.optionWithCount[category] || 0),
  //       backgroundColor: this.getColor(index)
  //     };
  //   });

  //   const allDataValues = datasets?.flatMap(dataset => dataset.data);
  //   const maxValue = Math.max(...allDataValues);

  //   const roundedMaxValue = this.roundToNearestRoundFigure(maxValue);

  //   if (this.managerBarChart) {
  //     this.managerBarChart.destroy();
  //   }

  //   this.managerBarChart = new Chart('managerBarChartCanvas', {
  //     type: 'bar',
  //     data: {
  //       labels: truncatedQuestions,
  //       datasets: datasets,
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true,
  //           max: roundedMaxValue,
  //         },
  //       },
  //       plugins: {
  //         legend: {
  //           position: 'top',
  //         },
  //         tooltip: {
  //           mode: 'index',
  //           intersect: false,
  //           callbacks: {
  //             title: (context) => {
  //               const index = context[0].dataIndex;
  //               return questions[index];
  //             },
  //           },
  //         },
  //         title: {
  //           display: true,
  //           text: 'Manager Effectiveness Survey',
  //           font: {
  //             size: 15,
  //           },
  //           padding: {
  //             top: 5,
  //             bottom: 10
  //           }
  //         },
  //         // zoom: {
  //         //   pan: {
  //         //     enabled: true,
  //         //     mode: 'xy',
  //         //   },
  //         //   zoom: {
  //         //     wheel: {
  //         //       enabled: true,
  //         //     },
  //         //     pinch: {
  //         //       enabled: true,
  //         //     },
  //         //     mode: 'xy',
  //         //   },
  //         // }
  //       },
  //       responsive: true,
  //       maintainAspectRatio: false,
  //     },
  //   });
  // }



  executeOtherLineChart(res: any) {
    const labels = res.data?.map((item: any) => item?.stageName.trim());
    const dataValues = res.data?.map((item: any) => parseFloat(item.value));

    this.otherChart = new Chart('otherChartCanvas', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            data: dataValues,
            label: 'Score',
            borderColor: "#103a7f",
            backgroundColor: '#103a7f',
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
          },
        },
        elements: {
          line: {
            borderWidth: 2,
          },
        },
        plugins: {
          title: {
            display: true,
            text: this.paramsName,
            font: {
              size: 15,
            },
            padding: {
              top: 5,
              bottom: 10
            }
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
        }
      },
    });
  }

  // executeDonutGraphForENPS(res: any) {
  //   if(res.data===null){
  //     this.backendMessage = res.message;
  //   }
  //   const promoterInpercentage = res.data?.promoterInpercentage;
  //   const passiveInPercentage = res.data?.passiveInPercentage;
  //   const decractorsInPercentage = res.data?.decractorsInPercentage;

  //   const series = [promoterInpercentage, passiveInPercentage, decractorsInPercentage];
  //   const labels = ['Promoters', 'Passives', 'Detractors'];
  //   const colors = ["#2980b9", "#069de0", "#747687"];

  //   this.eNPSdoughnutChart = {
  //     series: series,
  //     chart: {
  //       type: "donut",
  //       height: 400
  //     },
  //     labels: labels,
  //     colors: colors,
  //     responsive: [
  //       {
  //         breakpoint: 480,
  //         options: {
  //           chart: {
  //             width: 300
  //           },
  //           legend: {
  //             position: "bottom"
  //           }
  //         }
  //       }
  //     ],
  //     legend: {
  //       position: 'bottom'
  //     },
  //     title: {
  //       text: "",
  //       align: 'center',
  //       style: {
  //         fontSize: '15px',
  //         color: '#103a7f'
  //       }
  //     },
  //     tooltip: {
  //       y: {
  //         formatter: function (value: number) {
  //           return value + "%";
  //         }
  //       }
  //     },
  //     plotOptions: {
  //       pie: {
  //         donut: {
  //           labels: {
  //             show: true,
  //             value: {
  //               fontWeight: 600,
  //               formatter: function (val:any) {
  //                 return val + '%';
  //               }
  //             },
  //             total: {
  //               show: true,
  //               label: '',
  //               formatter: function () {
  //                 return '35 ENPS';
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   };
  // }
  executeDonutGraphForENPS(res: any) {
    if (res.data === null) {
      this.backendMessage = res.message;
    }
    const promoterInpercentage = res.data?.promoterInpercentage;
    const passiveInPercentage = res.data?.passiveInPercentage;
    const decractorsInPercentage = res.data?.decractorsInPercentage;

    const series = [promoterInpercentage, passiveInPercentage, decractorsInPercentage];
    const labels = ['Promoters', 'Passives', 'Detractors'];
    const colors = ["#103a7f", "#069de0", "#747687"];

    this.eNPSdoughnutChart = {
      series: series,
      chart: {
        type: "donut",
        height: 400
      },
      labels: labels,
      colors: colors,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ],
      legend: {
        position: 'right',
        offsetY: 0,
        height: 230,
        markers: {
          width: 12,
          height: 12,
        },
        itemMargin: {
          vertical: 5,
        },
        labels: {
          useSeriesColors: false,
          formatter: function (label: any, opts: any) {
            return label;
          }
        },
      },
      title: {
        text: "",
        align: 'center',
        style: {
          fontSize: '15px',
          color: '#103a7f'
        }
      },
      tooltip: {
        y: {
          formatter: function (value: number) {
            return value.toString();
          }
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '75%',
            labels: {
              show: true,
              value: {
                fontWeight: 600,
                formatter: function (val: any) {
                  return val.toString();
                }
              },
              total: {
                show: true,
                label: 'ENPS = 35',
                fontWeight: 900,
                color: '#103a7f',
                style: {
                  fontSize: '25px',
                },
                formatter: function () {
                  return '';
                }
              }
            }
          }
        }
      },
      stroke: {
        width: 1
      }
    };
  }

  execueteOtherBarGraph() {
    if (!this.otherDetails || this.otherDetails.length === 0) {
      console.warn('No data available for the bar chart.');
      return;
    }

    const questions = this.otherDetails.map((item: { question: string }) => item.question);
    const truncatedQuestions = questions.map((question: string) => {
      const words = question?.trim().split(' ').filter(word => word?.length > 0);
      return words.slice(0, 1).join(' ') + '...';
    });

    const responseCategories = Object.keys(this.otherDetails[0]?.optionWithCount || {});

    // Normalize dataset values to percentages
    const datasets = responseCategories.map((category, index) => {
      return {
        label: category.trim(),
        data: this.otherDetails.map((item: { optionWithCount: { [x: string]: number } }) => {
          const total = Object.values(item.optionWithCount || {}).reduce((sum, value) => sum + value, 0) || 1; // Avoid division by 0
          return ((item.optionWithCount[category] || 0) / total) * 100; // Convert to percentage
        }),
        backgroundColor: this.getOtherColor(index),
      };
    });

    if (this.otherBarChart) {
      this.otherBarChart?.destroy();
    }

    this.otherBarChart = new Chart('otherbarChartCanvas', {
      type: 'bar',
      data: {
        labels: truncatedQuestions,
        datasets: datasets,
      },
      options: {
        scales: {
          x: {
            stacked: true, // Enable stacking on x-axis
          },
          y: {
            stacked: true, // Enable stacking on y-axis
            beginAtZero: true,
            max: 100, // Set max to 100% for percentage
            ticks: {
              callback: (value) => `${value}%`, // Display as percentage
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              title: (context) => {
                const index = context[0]?.dataIndex;
                return questions[index];
              },
              label: (context) => {
                const value: any = context.raw || 0;
                return `${context.dataset.label}: ${value.toFixed(1)}%`;
              },
            },
          },
          title: {
            display: true,
            text: this.paramsName || 'Survey Data',
            font: {
              size: 15,
            },
            padding: {
              top: 5,
              bottom: 10,
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }


  // execueteOtherBarGraph() {
  //   const questions = this.otherDetails.map((item: { question: string }) => item.question);
  //   const truncatedQuestions = questions.map((question: string) => {
  //     const words = question?.trim().split(' ').filter(word => word?.length > 0);
  //     return words.slice(0, 2).join(' ') + '...';
  //   });

  //   const responseCategories = Object.keys(this.otherDetails[0].optionWithCount);

  //   const datasets = responseCategories.map((category, index) => {
  //     return {
  //       label: category.trim(),
  //       data: this.otherDetails.map((item: { optionWithCount: { [x: string]: any; }; }) => item.optionWithCount[category] || 0),
  //       backgroundColor: this.getOtherColor(index)
  //     };
  //   });

  //   if (this.otherBarChart) {
  //     this.otherBarChart?.destroy();
  //   }

  //   const allDataValues = datasets?.flatMap(dataset => dataset.data);
  //   const maxValue = Math.max(...allDataValues);

  //   const roundedMaxValue = this.roundToNearestRoundFigure(maxValue);

  //   this.otherBarChart = new Chart('otherbarChartCanvas', {
  //     type: 'bar',
  //     data: {
  //       labels: truncatedQuestions,
  //       datasets: datasets,
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true,
  //           max: roundedMaxValue,
  //         },
  //       },
  //       plugins: {
  //         legend: {
  //           position: 'top',
  //         },
  //         tooltip: {
  //           mode: 'index',
  //           intersect: false,
  //           callbacks: {
  //             title: (context) => {
  //               const index = context[0].dataIndex;
  //               return questions[index];
  //             },
  //           },
  //         },
  //         title: {
  //           display: true,
  //           text: this.paramsName,
  //           font: {
  //             size: 15,
  //           },
  //           padding: {
  //             top: 5,
  //             bottom: 10
  //           }
  //         },
  //         // zoom: {
  //         //   pan: {
  //         //     enabled: true,
  //         //     mode: 'xy',
  //         //   },
  //         //   zoom: {
  //         //     wheel: {
  //         //       enabled: true,
  //         //     },
  //         //     pinch: {
  //         //       enabled: true,
  //         //     },
  //         //     mode: 'xy',
  //         //   },
  //         // },
  //       },
  //       responsive: true,
  //       maintainAspectRatio: false,
  //     },
  //   });
  // }


  roundToNearestRoundFigure(value: number): number {
    console.log(value)
    if (value <= 5) return 5;
    if (value <= 10) return 10;
    if (value <= 20) return 20;
    if (value <= 50) return 50;
    if (value <= 100) return 100;
    return Math.ceil(value / 100) * 100;
  }


  externalTooltipHandler(context: any) {
    // Implement your custom tooltip logic here
    const { chart, tooltip } = context;
    // Custom tooltip code
  }

  getColor(index: number): string {
    const colors = ['#2b3a67', '#747687', '#103a7f', '#2980b9', '#103a7f', '#2b3a67', '#2ecc71'];
    return colors[index % colors.length];
  }

  getOtherColor(index: number): string {
    const colors = ['#2b3a67', '#103a7f', '#2980b9', '#103a7f', '#2ecc71', '#2b3a67'];
    return colors[index % colors.length];
  }

  resetChartZoom(chart: Chart | undefined): void {
    if (chart) {
      chart.resetZoom();
    }
  }

  resetFUDSLineChartZoom(): void {
    this.resetChartZoom(this.fudsLineChart);
  }

  resetFUDSBarChartZoom(): void {
    this.resetChartZoom(this.fudsBarChart);
  }

  resetEEBarChartZoom(): void {
    this.resetChartZoom(this.eeBarChart)
  }

  resetExitLineChartZoom(): void {
    this.resetChartZoom(this.exitsurvey);
  }

  resetExitBarChartZoom(): void {
    this.resetChartZoom(this.exitBarChart);
  }

  resetOnboardingLineChartZoom(): void {
    this.resetChartZoom(this.onboardinglineChart);
  }

  resetOnboardingBarChartZoom(): void {
    this.resetChartZoom(this.onboardBarChart);
  }

  resetOjtLineChartZoom(): void {
    this.resetChartZoom(this.ojtEffectiveness);
  }

  resetOjtBarChartZoom(): void {
    this.resetChartZoom(this.ojtBarChart);
  }

  resetInductionLineChartZoom(): void {
    this.resetChartZoom(this.inductionSurvey);
  }

  resetInductionBarChartZoom(): void {
    this.resetChartZoom(this.inductionBarChart);
  }

  resetPulseBarChartZoom(): void {
    this.resetChartZoom(this.pulseBarChart);
  }

  resetManagerBarChartZoom(): void {
    this.resetChartZoom(this.managerBarChart);
  }

  resetManagerLineChartZoom(): void {
    this.resetChartZoom(this.managerEffectiveness);
  }

  resetOtherLineChartZoom(): void {
    this.resetChartZoom(this.otherChart);
  }

  resetOtherBarChartZoom(): void {
    this.resetChartZoom(this.otherBarChart);
  }

  openPopup(name: any) {
    console.log(this.activeTab)
    const dialogRef = this.dialog.open(OptionDetailComponent, {
      width: '1200px',
      height: '650px',
      disableClose: true,
      data: { name: name, id: this.paramsId, stageName: this.activeTab }
    });
  }

  openManagerEffectiveness() {
    const dialogRef = this.dialog.open(ManagereffectComponent, {
      width: '1200px',
      height: '650px',
      disableClose: true,
    });
  }

  setActiveTabForFuds(tab: string) {
    this.fudsDetails = '';
    this.fudsDetails2 = '';
    this.activeTab = tab;
    this.fudsDetails = this.fudsTable.find((item: { stage: string; }) => item.stage === tab).listOfStaticSubPhase[0]?.staticQuestionScoreForSurveyResponseDto;
    this.fudsDetails2 = this.fudsTable.find((item: { stage: string; }) => item.stage === tab).listOfStaticSubPhase[0]?.descriptiveQuestion;
    this.executeFudsVerticleBarGraph();
  }

  setActiveTabForEE(tab: string) {
    const searchTab = tab === 'Wellbeing' ? 'Wellness' : tab;
    this.activeTab = tab;
    this.eeDetails = this.eetable.find((item: { stage: string; }) => item.stage === searchTab).listOfStaticSubPhase[0]?.staticQuestionScoreForSurveyResponseDto;
    const matchedItem = this.eetable.find((item: { stage: string; score: number }) => item.stage === searchTab);
    if (matchedItem) {
      this.eeThemeScore = Math.floor(matchedItem.score * 100) / 100;
    } else {
      this.eeThemeScore = undefined;
    }
    this.eeDetails2 = this.eetable.find((item: { stage: string; }) => item.stage === searchTab).listOfStaticSubPhase[0]?.descriptiveQuestion;
    this.execueteEEBarGraph();
    console.log(this.eeDetails);
  }

  setActiveTabForPulse(tab: string) {
    const searchTab = tab === 'Wellbeing' ? 'Wellness' : tab;
    this.activeTab = tab;
    this.pulseDetails = this.pulsetable.find((item: { stage: string; }) => item.stage === searchTab).listOfStaticSubPhase[0].staticQuestionScoreForSurveyResponseDto;
    const matchedItem = this.pulsetable.find((item: { stage: string; score: number }) => item.stage === searchTab);
    if (matchedItem) {
      this.pulseThemeScore = Math.floor(matchedItem.score * 100) / 100;
    } else {
      this.pulseThemeScore = undefined;
    }
    this.pulseDetails2 = this.pulsetable.find((item: { stage: string; }) => item.stage === searchTab).listOfStaticSubPhase[0].descriptiveQuestion;
    this.execuetePulseBarGraph();
  }

  setActiveTabForOther(tab: string) {
    this.activeTab = tab;
    this.otherDetails = this.otherTable.find((item: { stage: string; }) => item.stage === tab).listOfStaticSubPhase[0].staticQuestionScoreForSurveyResponseDto;
    this.otherDetails2 = this.otherTable.find((item: { stage: string; }) => item.stage === tab).listOfStaticSubPhase[0].descriptiveQuestion;
    console.log(this.otherDetails2);
    this.execueteOtherBarGraph();
  }

  toggleDisplay() {
    this.isTableVisible = !this.isTableVisible;
  }

  getChartFileName(chartId: string): string {
    switch (chartId) {
      case 'fudsChartCanvas':
        return 'FUDS_Summary';
      case 'fudsbarChartCanvas':
        return 'FUDS_Bar_Chart_Summary';
      case 'exitChartCanvas':
        return 'Exit_Survey_Summary';
      case 'onboardChartCanvas':
        return 'Onboarding_Summary';
      case 'inductionChartCanvas':
        return 'Induction_Survey_Summary';
      case 'ojtChartCanvas':
        return 'OJT_Effectiveness_Summary';
      case 'managerChartCanvas':
        return 'Manager_Effectiveness_Summary';
      default:
        return this.paramsName + '_Summary';
    }
  }

  downloadChart(chartId: string, format: string) {
    const canvas = document.getElementById(chartId) as HTMLCanvasElement;
    let clientName = this.displayClientData?.clientName || 'Unknown Client';
    let currentDate = this.getCurrentDate();

    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const newCanvas = document.createElement('canvas');
    newCanvas.width = width;
    newCanvas.height = height + 60;
    const newCtx = newCanvas.getContext('2d');
    if (!newCtx) return;

    newCtx.fillStyle = '#fff';
    newCtx.fillRect(0, 0, newCanvas.width, newCanvas.height);

    newCtx.fillStyle = '#000';
    newCtx.font = 'bold 16px Arial';
    newCtx.textAlign = 'center';
    newCtx.fillText(`Client Name:`, width / 2 - 80, 20);
    newCtx.font = '16px Arial';
    newCtx.fillText(clientName, width / 2 + 40, 20);


    newCtx.drawImage(canvas, 0, 30);

    newCtx.fillStyle = '#000';
    newCtx.font = 'bold 14px Arial';
    newCtx.fillText(`Generated on:`, width / 2 - 80, height + 50);
    newCtx.font = '14px Arial';
    newCtx.fillText(currentDate, width / 2 + 40, height + 50);


    if (format === 'png') {
      const dataUrl = newCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `EXwise_${this.getChartFileName(chartId)}.png`;
      link.click();
    } else if (format === 'svg') {
      const imgData = newCanvas.toDataURL('image/png');
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height + 60}">
                     <image href="${imgData}" width="${width}" height="${height + 60}" />
                   </svg>`;

      const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(svgBlob);
      link.download = `EXwise_${this.getChartFileName(chartId)}.svg`;
      link.click();
    } else if (format === 'csv') {
      this.downloadCSV(chartId);
    }
  }



  // downloadChart(chartId: string, format: string) {
  //   const canvas = document.getElementById(chartId) as HTMLCanvasElement;
  //   let clientName = this.displayClientData?.clientName || '';

  //   if (format === 'png') {
  //     const dataUrl = canvas.toDataURL('image/png');
  //     const link = document.createElement('a');
  //     link.href = dataUrl;
  //     link.download = `${this.getChartFileName(chartId)}.png`;
  //     link.click();
  //   } else if (format === 'svg') {
  //     const ctx = canvas.getContext('2d');
  //     if (!ctx) return;

  //     const width = canvas.width;
  //     const height = canvas.height;

  //     // Convert Canvas to Data URL
  //     const imgData = canvas.toDataURL('image/png');

  //     // Create SVG Structure
  //     const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  //                    <image href="${imgData}" width="${width}" height="${height}" />
  //                  </svg>`;

  //     const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  //     const link = document.createElement('a');
  //     link.href = URL.createObjectURL(svgBlob);
  //     link.download = `${this.getChartFileName(chartId)}.svg`;
  //     link.click();
  //     // const svgData = new XMLSerializer().serializeToString(canvas);
  //     // const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  //     // saveAs(svgBlob, `${chartId}.svg`);
  //   } else if (format === 'csv') {
  //     this.downloadCSV(chartId);
  //   }
  // }

  downloadCSV(chartId: string) {
    let chart;
    let fileName = chartId;
    let heading = '';
    let clientName = this.displayClientData?.clientName || '';
    let columnHeading = '';
    const currentDate = new Date().toLocaleDateString();

    if (chartId === 'fudsChartCanvas') {
      chart = this.fudsLineChart;
      fileName = 'FUDS_Summary';
      heading = 'Feel Use Do See Summary';
      columnHeading = 'FUDS Theme'
    } else if (chartId === 'fudsbarChartCanvas') {
      chart = this.fudsBarChart;
      fileName = 'FUDS_Bar_Summary';
      heading = 'Feel Use Do See Summary';
      columnHeading = 'Questions';
    } else if (chartId === 'exitChartCanvas') {
      chart = this.exitsurvey;
      fileName = 'Exit_Survey_Summary';
      heading = 'Exit Survey Summary';
      columnHeading = 'Questions';
    } else if (chartId === 'onboardChartCanvas') {
      chart = this.onboardinglineChart;
      fileName = 'Onboarding_Survey_Summary';
      heading = 'Onboarding Survey Summary';
      columnHeading = 'Questions';
    } else if (chartId === 'inductionChartCanvas') {
      chart = this.inductionSurvey;
      fileName = 'Induction_Survey_Summary';
      heading = 'Induction Survey Summary';
      columnHeading = 'Questions';
    } else if (chartId === 'ojtChartCanvas') {
      chart = this.ojtEffectiveness;
      fileName = 'OJT_Effectiveness_Summary';
      heading = 'OJT Effectiveness Summary';
      columnHeading = 'Questions';
    } else if (chartId === 'managerChartCanvas') {
      chart = this.managerEffectiveness;
      fileName = 'Manager_Effectiveness_Summary';
      heading = 'Manager Effectiveness Summary';
      columnHeading = 'Questions';
    } else {
      chart = this.otherChart;
      fileName = this.paramsName + '_Summary';
      heading = this.paramsName + ' Summary';
      columnHeading = 'Questions';
    }

    const labels = chart!.data.labels!.map((label: any) => label!.toString());
    const datasets = chart!.data.datasets.map((dataset: any) => {
      const data = dataset.data.map((value: number) => value.toString());
      return { label: dataset.label, data: data };
    });

    // let csvContent = 'data:text/csv;charset=utf-8,';
    // csvContent += 'Label,' + datasets.map((ds: { label: any; }) => ds.label).join(',') + '\n';

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += `${heading}\n`;
    csvContent += `Client Name: ${clientName}\n\n`;

    // Replacing "Label" with a meaningful name
    csvContent += `${columnHeading.replace(/_/g, ' ')},` + datasets.map((ds: any) => ds.label).join(',') + '\n';

    for (let i = 0; i < labels.length; i++) {
      const row = [labels[i]];
      datasets.forEach((ds: { data: any[]; }) => row.push(ds.data[i]));
      csvContent += row.join(',') + '\n';
    }
    csvContent += '\n';

    csvContent += `Generated on: ${currentDate}\n\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EXwise_${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  // exportToPDF(pdfname: string) {
  //   this.checkPDFDownloadSpinner = true;
  //   const data = document.getElementById('survey-content');
  //   const exportButton = document.querySelector('.export-button') as HTMLElement;

  //   if (exportButton) {
  //     exportButton.style.display = 'none';
  //   }
  //   if (data) {
  //     html2canvas(data).then(canvas => {
  //       const imgWidth = 200;
  //       const pageHeight = 295;
  //       const imgHeight = canvas.height * imgWidth / canvas.width;
  //       let heightLeft = imgHeight;
  //       const contentDataURL = canvas.toDataURL('image/png');

  //       const pdf = new jsPDF('p', 'mm', 'a4');
  //       let position = 5;
  //       pdf.addImage(contentDataURL, 'PNG', 5, position, imgWidth, imgHeight);
  //       heightLeft -= pageHeight;

  //       while (heightLeft >= 0) {
  //         position = heightLeft - imgHeight;
  //         pdf.addPage();
  //         pdf.addImage(contentDataURL, 'PNG', 5, position, imgWidth, imgHeight);
  //         heightLeft -= pageHeight;
  //       }

  //       pdf.save(pdfname + '.pdf');
  //       this.checkPDFDownloadSpinner = false;

  //       if (exportButton) {
  //         exportButton.style.display = 'block';
  //       }
  //     });
  //   }
  // }

  exportToExcel() {
    this.checkPDFDownloadSpinner = true;
    if (this.isStaticSurvey === false) {
      this.api.downloadExcelForDynamicSurveyExport(sessionStorage.getItem("ClientId"), this.paramsId).subscribe((res: any) => {
        this.checkPDFDownloadSpinner = false;
        if (res?.data) {
          window.open(res?.data)
        }
      })
    } else if (this.isStaticSurvey === true) {
      this.api.downloadExcelForStaticSurveyExport(sessionStorage.getItem("ClientId"), this.paramsId,).subscribe((res: any) => {
        this.checkPDFDownloadSpinner = false;
        if (res?.data) {
          window.open(res?.data)
        }
      })
    }
  }

  // exportToPDF(pdfname: string) {
  //   this.checkPDFDownloadSpinner = true;
  //   const data = document.getElementById('survey-content');
  //   const exportButton = document.querySelector('.export-button') as HTMLElement;

  //   if (exportButton) {
  //     exportButton.style.display = 'none';
  //   }

  //   if (data) {
  //     html2canvas(data).then(canvas => {
  //       const imgWidth = 200;
  //       const pageHeight = 295;
  //       const imgHeight = canvas.height * imgWidth / canvas.width;
  //       let heightLeft = imgHeight;
  //       const contentDataURL = canvas.toDataURL('image/png');

  //       const pdf = new jsPDF('p', 'mm', 'a4');
  //       let position = 5;
  //       pdf.addImage(contentDataURL, 'PNG', 5, position, imgWidth, imgHeight);
  //       heightLeft -= pageHeight;

  //       while (heightLeft >= 0) {
  //         position = heightLeft - imgHeight;
  //         pdf.addPage();
  //         pdf.addImage(contentDataURL, 'PNG', 5, position, imgWidth, imgHeight);
  //         heightLeft -= pageHeight;
  //       }

  //       // Create a Blob from the PDF and trigger a download
  //       const pdfBlob = pdf.output('blob');
  //       const downloadLink = document.createElement('a');
  //       downloadLink.href = URL.createObjectURL(pdfBlob);
  //       downloadLink.download = pdfname + '.pdf';

  //       document.body.appendChild(downloadLink);
  //       downloadLink.click();

  //       // Cleanup
  //       document.body.removeChild(downloadLink);
  //       URL.revokeObjectURL(downloadLink.href);

  //       this.checkPDFDownloadSpinner = false;

  //       if (exportButton) {
  //         exportButton.style.display = 'block';
  //       }
  //     });
  //   }
  // }


  goBack() {
    this.location.back();
  }

  onTabClick(selectedTab: any) {
    this.tabsdata.forEach(tab => tab.clicked = false);
    selectedTab.clicked = true;
    this.selectedTab = selectedTab.name;
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

  getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }


  // onChangeParent(event:any){
  //   this.selectedParent = event.target.value;
  // }

  // filterData(e:any){
  //   this.contractType = '';
  //   this.gender = '';
  //   this.jobType = '';
  //   this.tenure = '';
  //   this.lifeCycle = '';
  //   if(this.selectedParent === 'contractType'){
  //     this.contractType = e.target.value;
  //   }
  //   else if(this.selectedParent === 'gender'){
  //     this.gender = e.target.value;
  //   }
  //   else if(this.selectedParent === 'jobType'){
  //     this.jobType = e.target.value;
  //   }
  //   else if(this.selectedParent === 'tenure'){
  //     this.tenure = e.target.value;
  //   }
  //   else if(this.selectedParent === 'Lifecycle'){
  //     this.lifeCycle = e.target.value;
  //   }

  //   if (this.paramsName.trim().includes("Feel, Use, Do and See survey")) {
  //     this.executeFlowForFUDS();
  //   }
  //   else if (this.paramsName.includes('Employee Engagement survey')) {
  //     this.executeFlowForEE();
  //   }
  //   else if (this.paramsName.includes('Exit survey')) {
  //     this.executeFlowForExit();
  //   }
  //   else if (this.paramsName.includes('Onboarding feedback survey')) {
  //     this.executeFlowForOnboardingFeedback();
  //   }
  //   else if (this.paramsName.includes('On-the-job training effectiveness survey')) {
  //     this.executeFlowForOnTheJobTrainingEffectiveness();
  //   }
  //   else if (this.paramsName.includes('Induction effectiveness survey ')) {
  //     this.executeFlowForInductionEffectiveness();
  //   }
  //   else if (this.paramsName.includes(' Pulse surveys')) {
  //     this.executeFlowForPulse();
  //   }
  //   else if (this.paramsName.includes('Manager Effectiveness survey')) {
  //     this.executeFlowForManagerEffectiveness();
  //   }
  //   else if (this.paramsName.includes('eNPS survey')) {
  //     this.executeFlowForENPS();
  //   }
  //   else {
  //     this.executeFlowForOtherDynamic();
  //   }
  // }

  // onClearFilter(){
  //   this.selectedParent = '';
  //   this.contractType = '';
  //   this.gender = '';
  //   this.jobType = '';
  //   this.tenure = '';

  //   if (this.paramsName.trim().includes("Feel, Use, Do and See survey")) {
  //     this.executeFlowForFUDS();
  //   }
  //   else if (this.paramsName.includes('Employee Engagement survey')) {
  //     this.executeFlowForEE();
  //   }
  //   else if (this.paramsName.includes('Exit survey')) {
  //     this.executeFlowForExit();
  //   }
  //   else if (this.paramsName.includes('Onboarding feedback survey')) {
  //     this.executeFlowForOnboardingFeedback();
  //   }
  //   else if (this.paramsName.includes('On-the-job training effectiveness survey')) {
  //     this.executeFlowForOnTheJobTrainingEffectiveness();
  //   }
  //   else if (this.paramsName.includes('Induction effectiveness survey ')) {
  //     this.executeFlowForInductionEffectiveness();
  //   }
  //   else if (this.paramsName.includes(' Pulse surveys')) {
  //     this.executeFlowForPulse();
  //   }
  //   else if (this.paramsName.includes('Manager Effectiveness survey')) {
  //     this.executeFlowForManagerEffectiveness();
  //   }
  //   else if (this.paramsName.includes('eNPS survey')) {
  //     this.executeFlowForENPS();
  //   }
  //   else {
  //     this.executeFlowForOtherDynamic();
  //   }
  // }

}


