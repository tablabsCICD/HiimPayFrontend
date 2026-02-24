import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AnalysecreateComponent } from '../journey-map/analysecreate/analysecreate.component';
import { ToastrService } from 'ngx-toastr';
import { DeleteComponent } from '../../../pages/delete/delete.component';
import { CategoryScale, LinearScale, BarController, BarElement, Tooltip, Legend, registerables } from 'chart.js/auto';
import { Chart } from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
// import { Chart, ChartConfiguration } from 'chart.js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { Observable } from 'rxjs';
import { SearchService } from '../../services/search.service';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { CreateGroupComponent } from '../meetings/create-group/create-group.component';
import dayjs from 'dayjs';
import { PhasetwoComponent } from '../dashboard/phasetwo/phasetwo.component';

import * as moment from "moment";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexGrid,
  ApexYAxis,
  ApexAnnotations,
  ApexTitleSubtitle
} from "ng-apexcharts";
import { SurveyIdInfoComponent } from './survey-id-info/survey-id-info.component';
import { EXDiagnosticDetailsComponent } from './exdiagnostic-details/exdiagnostic-details.component';
import { CreateUserComponent } from '../project-admin/create-user/create-user.component';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  grid: ApexGrid;
  annotations: ApexAnnotations,
  title: any,
  subtitle : any
};

Chart.register(...registerables);
Chart.register(zoomPlugin);


@Component({
  selector: 'app-projectdash',
  templateUrl: './projectdash.component.html',
  styleUrl: './projectdash.component.css',
  providers: [DatePipe]
})
export class ProjectdashComponent implements OnInit {
  viewMore: boolean = true;
  share: Boolean = false;
  coCreate: Boolean = false;
  analyse: boolean = false;
  isLoading: boolean = false;
  isCpoc: boolean = false;
  data: any;
  msg: any;
  btnDisplay: boolean = false;
  details: any;
  listendata: any;
  listencount: any;
  oneToOneInterview: any;
  focusGroupMeeting: any;
  clientEmployee: any;
  focusGroup: any;
  assignedStagesOfSurvey: any;
  numberOfRespinses: any;
  barChart: any = [];
  savepdf: any;
  public barChartLegend = true;
  public barChartPlugins = [];
  displayClientData: any;
  rate = 0;
  feedbackFormShared: boolean = false;
  JourneyMap: boolean = false;
  clientData: any;
  id: any;
  visibleToClient: boolean = false;
  visibleToClient2: boolean = false;
  visibilityOn: boolean = false;
  display1: any;
  display2: any;
  feedbackForm: FormGroup;
  reminderSurveyList: any;
  tabsdata: any[] = [
    { name: 'All', clicked: true },
    { name: 'Open', clicked: false },
    { name: 'Close', clicked: false }
  ];
  activeTab: any;
  employeeResponsesLineChart: Chart | undefined;
  focuseGroupLineChart: Chart | undefined;
  focuseGroupMeetingLineChart: Chart | undefined;
  oneToOneInterviewLineChart: Chart | undefined;
  surveyAssignmentLineChart: Chart | undefined;
  onboardingLineChart: Chart | undefined;

  filterToggle: boolean = false;
  interviewCount: any;
  schedulecount: number = 0;
  reschedulecount: number = 0;
  cancelcount: number = 0;
  columnSelection: any = '';
  filterTable: any = '';
  dept: any[] = [];
  deptToFilter: any[] = [];
  highlightDate: MatCalendarCellCssClasses = [];
  isDataLoaded: Observable<any> = new Observable<any>();
  dataId: any;
  deptDetails: any;
  emp: any;
  index: any;
  vissible: boolean = true;
  isVissible: boolean = false;
  submitted: boolean = false;
  departmentForm!: FormGroup;
  isTableVisible: boolean = true;
  p: number = 1;
  a: number = 1;
  itemPerPage: number = 10;
  sortDir: any = 'asc';
  totalItems: number = 0;
  selected: Date | null | undefined;
  highlightedDates: Date[] = [new Date('2024-04-15'), new Date('2024-04-20')];
  cardsCircle2: any;
  meetingDay: any;
  meetingMonth: any;
  meetingDate2: any;
  allUser: any;
  upcomingTimeline:any;
  completeTimeLine:any;
  // selectedCard:any = "schedule"
  clientId: any;
  selectedOption: any = '';
  reminders: any;
  form!: FormGroup;
  isLoading2: boolean = false;
  isLoadingReminder: boolean = false;
  allDates: any;
  typeOfUser: any;
  consultinghaseName:any;
  surveys: any[] = [];
  filteredSurveys: any;

  tabsdataForAnalyse: any[] = [
    { name: 'EX-dignostic report', clicked: true },
    { name: 'Timeline', clicked: false }
  ];

  tabsdataForShare: any[] = [
    { name: 'Share', clicked: true },
    { name: 'Timeline', clicked: false }
  ];

  tabsdataForCocreate: any[] = [
    { name: 'Suggestions', clicked: true },
    { name: 'Timeline', clicked: false }
  ];

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  constructor(
    private service: ProjectService,
    private dialog: MatDialog,
    private router: Router,
    private toaster: ToastrService,
    private fb: FormBuilder,
    private searchservice: SearchService,
    private datePipe: DatePipe,
    private api: ApiService
  ) {
    this.feedbackForm = this.fb.group({
      feedback: ['', Validators.required],
      rate: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.activeTab = 'Listen'
    this.exeCuteTimeLine()
    this.showAllSurveys()


    const currentDate = new Date();
    this.getAllMeetingDatesByMonthForAdmin(currentDate.getMonth() + 1, currentDate.getFullYear());

    setTimeout(() => {
      this.isLoading = true
      this.isCpoc = sessionStorage.getItem('isCpoc') == 'true';
      this.displayClientData = JSON.parse(sessionStorage.getItem('ClientData')!);
      this.id = JSON.parse(sessionStorage.getItem('ClientData')!).id;
      this.consultinghaseName = JSON.parse(sessionStorage.getItem('ClientData')!).consultinghaseName;
      console.log(this.consultinghaseName);
      
      this.getClientById();
      this.listen('Listen');
      this.getAllCocreate();
      this.getallreports();
      this.getAllListenCount();
      this.getAllListenList();
      this.getTimeline();
    }, 200);

    const clientId = parseInt(sessionStorage.getItem("ClientId")!, 10)
    this.getAllReminderSurveys(clientId);
    setTimeout(() => {
      this.executeEmployeeResponseGraph(clientId);
      this.executeFocuseGroupGraph(clientId);
      this.executeFocuseGroupMeetingGraph(clientId);
      this.executeOneToOneInterviewGraph(clientId);
      this.executeSurveyAssignmentGraph(clientId);
      this.executeOnboardingGraph(clientId);
    }, 500);
  }

  getTimeline(){
    this.upcomingTimeline='';
    this.completeTimeLine='';
  this.service.gettimelineById(this.id,this.activeTab).subscribe({next:(res:any)=>{console.log(res);
    this.upcomingTimeline=res?.data?.upcoming;
    this.completeTimeLine=res?.data?.completed;

  },complete:()=>{},error:(err:any)=>{console.log(err);
  }})
  }
  // getTimeline2(){
  //   this.service.gettimelineById(this.id,this.activeTab).subscribe({next:(res:any)=>{console.log(res);
  //     this.upcomingTimeline=res.data.completed
  
  //   },complete:()=>{},error:(err:any)=>{console.log(err);
  //   }})
  //   }
  taskUpdate(timeline:any){
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: {
        message: `Are you done with task '${timeline.activity}' ?`,
      },
      disableClose:true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.action == 'ok') {
        this.service.updateTimelineByID(timeline.id).subscribe({next:(res:any)=>{console.log(res);
          this.toaster.success(res?.message)
          this.getTimeline();
        }})
      }
    });
  }
  // exeCuteTimeLine() {
  //   const clientId = parseInt(sessionStorage.getItem("ClientId")!, 10);
  //   this.service.getAllForTimeLine(clientId).subscribe({
  //     next: (res) => {
  //       const timelineData: { x: string; y: [number, number], task: string }[] = res.data.timelineLIst.map((item: any) => {
  //         return {
  //           x: `${item.task} (${new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${item.endTime ? new Date(item.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Ongoing'})`,
  //           y: [
  //             new Date(item.startTime).getTime(),
  //             item.endTime ? new Date(item.endTime).getTime() : new Date().getTime()
  //           ],
  //           task: item.task
  //         };
  //       });

  //       const allDates = timelineData.flatMap(item => [item.y[0], item.y[1]]);
  //       const minDate = Math.min(...allDates);
  //       const maxDate = Math.max(...allDates);

  //       const dateRange = [];
  //       for (let date = minDate; date <= maxDate; date += 24 * 60 * 60 * 1000) {
  //         dateRange.push(date);
  //       }

  //       this.chartOptions = {
  //         series: [
  //           {
  //             data: timelineData
  //           }
  //         ],
  //         chart: {
  //           height: 300,
  //           type: "rangeBar"
  //         },
  //         plotOptions: {
  //           bar: {
  //             horizontal: true,
  //             barHeight: '80%'
  //           }
  //         },
  //         xaxis: {
  //           type: "datetime",
  //           min: minDate,
  //           max: maxDate,
  //           labels: {
  //             formatter: function (value, timestamp, opts) {
  //               const date = new Date(value);
  //               return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  //             }
  //           },
  //           tickAmount: dateRange.length
  //         },
  //         dataLabels: {
  //           enabled: true,
  //           formatter: function (val, opts) {
  //             const startDate = new Date(opts.w.globals.seriesRangeStart[opts.seriesIndex][opts.dataPointIndex]);
  //             const endDate = new Date(opts.w.globals.seriesRangeEnd[opts.seriesIndex][opts.dataPointIndex]);
  //             return `${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  //           },
  //           style: {
  //             colors: ['#fff']
  //           }
  //         },
  //         tooltip: {
  //           y: {
  //             formatter: function (val, opts) {
  //               const startDate = new Date(opts.w.globals.seriesRangeStart[opts.seriesIndex][opts.dataPointIndex]);
  //               const endDate = new Date(opts.w.globals.seriesRangeEnd[opts.seriesIndex][opts.dataPointIndex]);
  //               return `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString()} - ${endDate.toLocaleDateString()} ${endDate.toLocaleTimeString()}`;
  //             }
  //           }
  //         },
  //         grid: {
  //           row: {
  //             colors: ['#f3f4f5', '#fff'],
  //             opacity: 0.5
  //           }
  //         }
  //       };
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //     complete: () => {}
  //   });
  // }

  

  // exeCuteTimeLine() {
  //   const clientId = parseInt(sessionStorage.getItem("ClientId")!, 10);
  //   this.service.getAllForTimeLine(clientId).subscribe({
  //     next: (res) => {
  //       const timelineData = res.data.timelineLIst.map((item: any) => {
  //         // Calculate the start and end times, ensuring they are within the same day
  //         const startTime = new Date(item.startTime);
  //         const endTime = new Date(item.endTime);

  //         // Ensure end time does not cross into the next day
  //         const endTimeAdjusted = endTime.getDate() !== startTime.getDate()
  //           ? new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), 23, 59, 59)
  //           : endTime;

  //         return {
  //           x: item.task,
  //           y: [
  //             startTime.getTime(),
  //             endTimeAdjusted.getTime()
  //           ],
  //           task: item.task
  //         };
  //       });

  //       const allDates = timelineData.flatMap((item:any) => [item.y[0], item.y[1]]);
  //       const minDate = Math.min(...allDates);
  //       const maxDate = Math.max(...allDates);

  //       const dateRange = [];
  //       for (let date = minDate; date <= maxDate; date += 24 * 60 * 60 * 1000) {
  //         dateRange.push(date);
  //       }

  //       this.chartOptions = {
  //         series: [
  //           {
  //             data: timelineData
  //           }
  //         ],
  //         chart: {
  //           height: 300,
  //           type: "rangeBar"
  //         },
  //         plotOptions: {
  //           bar: {
  //             horizontal: true,
  //             barHeight: '80%'
  //           }
  //         },
  //         xaxis: {
  //           type: "datetime",
  //           min: minDate,
  //           max: maxDate,
  //           labels: {
  //             formatter: function (value) {
  //               const date = new Date(value);
  //               return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  //             }
  //           },
  //           tickAmount: dateRange.length
  //         },
  //         dataLabels: {
  //           enabled: true,
  //           formatter: function (val, opts) {
  //             const startDate = new Date(opts.w.globals.seriesRangeStart[opts.seriesIndex][opts.dataPointIndex]);
  //             const endDate = new Date(opts.w.globals.seriesRangeEnd[opts.seriesIndex][opts.dataPointIndex]);
  //             return `${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  //           },
  //           style: {
  //             colors: ['#fff']
  //           }
  //         },
  //         tooltip: {
  //           y: {
  //             formatter: function (val, opts) {
  //               const startDate = new Date(opts.w.globals.seriesRangeStart[opts.seriesIndex][opts.dataPointIndex]);
  //               const endDate = new Date(opts.w.globals.seriesRangeEnd[opts.seriesIndex][opts.dataPointIndex]);
  //               return `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString()} - ${endDate.toLocaleDateString()} ${endDate.toLocaleTimeString()}`;
  //             }
  //           }
  //         },
  //         grid: {
  //           row: {
  //             colors: ['#f3f4f5', '#fff'],
  //             opacity: 0.5
  //           }
  //         }
  //       };
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //     complete: () => {}
  //   });
  // }


  // exeCuteTimeLine() {
  //   const clientId = parseInt(sessionStorage.getItem("ClientId")!, 10);
  //   this.service.getAllForTimeLine(clientId).subscribe({
  //     next: (res) => {
  //       const timelineData: { x: string; y: [number, number], task: string }[] = res?.data?.timelineLIst?.map((item: any) => {
  //         const startTime = new Date(item?.startTime).getTime();
  //         let endTime = item?.endTime ? new Date(item?.endTime).getTime() : new Date().getTime();

  //         // Ensure the task does not cross over into the next day
  //         if (new Date(item?.startTime).getDate() !== new Date(item?.endTime).getDate()) {
  //           endTime = new Date(new Date(item.startTime).setHours(23, 59, 59, 999)).getTime();
  //         }

  //         return {
  //           x: `${item?.task} (${new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
  //           y: [startTime, endTime],
  //           task: item?.task
  //         };
  //       });

  //       const allDates = timelineData.flatMap(item => [item?.y[0], item?.y[1]]);
  //       const minDate = Math.min(...allDates);
  //       const maxDate = Math.max(...allDates);

  //       const uniqueDates = [...new Set(timelineData?.flatMap(item => [new Date(item?.y[0]).setHours(0, 0, 0, 0), new Date(item?.y[1]).setHours(0, 0, 0, 0)]))];

  //       this.chartOptions = {
  //         series: [
  //           {
  //             data: timelineData
  //           }
  //         ],
  //         chart: {
  //           height: 300,
  //           type: "rangeBar",
  //           toolbar: {
  //             show: true
  //           }
  //         },
  //         plotOptions: {
  //           bar: {
  //             horizontal: true,
  //             barHeight: '50%',
  //             rangeBarGroupRows: true
  //           }
  //         },
  //         xaxis: {
  //           type: "datetime",
  //           min: minDate,
  //           max: maxDate,
  //           labels: {
  //             formatter: function (value) {
  //               const date = new Date(value);
  //               return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  //             },
  //             offsetX: 0,
  //           }
  //         },
  //         yaxis: {
  //           labels: {
  //             align: 'left',
  //             style: {
  //               fontSize: '12px'
  //             }
  //           }
  //         },
  //         dataLabels: {
  //           enabled: true,
  //           formatter: function (val, opts) {
  //             const startDate = new Date(opts.w.globals.seriesRangeStart[opts.seriesIndex][opts.dataPointIndex]);
  //             const endDate = new Date(opts.w.globals.seriesRangeEnd[opts.seriesIndex][opts.dataPointIndex]);
  //             return `${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  //           },
  //           style: {
  //             colors: ['#fff']
  //           }
  //         },
  //         tooltip: {
  //           enabled: true,
  //           shared: false,
  //           custom: function ({ series, seriesIndex, dataPointIndex, w }) {
  //             const task = w.globals.initialSeries[seriesIndex].data[dataPointIndex].task;
  //             const startDate = new Date(w.globals.seriesRangeStart[seriesIndex][dataPointIndex]);
  //             const endDate = new Date(w.globals.seriesRangeEnd[seriesIndex][dataPointIndex]);
  //             return `<div class="apexcharts-tooltip-title">${task}</div>
  //                     <div class="apexcharts-tooltip-content">
  //                       <span>${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString()}</span> - 
  //                       <span>${endDate.toLocaleDateString()} ${endDate.toLocaleTimeString()}</span>
  //                     </div>`;
  //           }
  //         },
  //         grid: {
  //           row: {
  //             colors: ['#f3f4f5', '#fff'],
  //             opacity: 0.5
  //           }
  //         },
  //         annotations: {
  //           xaxis: uniqueDates.map(date => ({
  //             x: date,
  //             borderColor: '#775DD0',
  //             label: {
  //               style: {
  //                 color: '#775DD0'
  //               },
  //               text: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  //             }
  //           }))
  //         }
  //       };
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //     complete: () => { }
  //   });
  // }


  exeCuteTimeLine() {
    const clientId = parseInt(sessionStorage.getItem("ClientId")!, 10);
    // this.service.getAllForTimeLine(clientId,this.activeTab).subscribe({
    //   next: (res) => {
    //     const timelineData: { x: string; y: [number, number], task: string }[] = res?.data?.timelineLIst?.map((item: any) => {
    //       const startTime = new Date(item?.startTime).getTime();
    //       let endTime = item?.endTime ? new Date(item?.endTime).getTime() : new Date().getTime();
  
    //       // Ensure the task does not cross over into the next day
    //       if (new Date(item?.startTime).getDate() !== new Date(item?.endTime)?.getDate()) {
    //         endTime = new Date(new Date(item.startTime).setHours(23, 59, 59, 999)).getTime();
    //       }
  
    //       return {
    //         x: `${item?.task} (${new Date(startTime)?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(endTime)?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
    //         y: [startTime, endTime],
    //         task: item?.task
    //       };
    //     });
  
    //     const startDate = new Date(res?.data?.startDate)?.setHours(0, 0, 0, 0);
    //     const endDate = new Date(res?.data?.endDate)?.setHours(23, 59, 59, 999);
  
    //     const uniqueDates = Array.from(new Set(
    //       timelineData.flatMap(item => [
    //         new Date(item.y[0])?.setHours(0, 0, 0, 0),
    //         new Date(item.y[1])?.setHours(0, 0, 0, 0)
    //       ])
    //     ));
  
    //     // Filter out null and undefined values before assigning to annotations.xaxis
    //     const xAxisAnnotations = uniqueDates.map((date, index, arr) => {
    //       if (index === 0 || new Date(arr[index - 1])?.toLocaleDateString() !== new Date(date)?.toLocaleDateString()) {
    //         return {
    //           x: date as number, // Ensure this is a number
    //           borderColor: '#775DD0',
    //           label: {
    //             style: {
    //               color: '#775DD0'
    //             },
    //             text: new Date(date)?.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    //           }
    //         };
    //       }
    //       return null;
    //     }).filter((annotation): annotation is Exclude<typeof annotation, null> => annotation !== null);
  
    //     this.chartOptions = {
    //       series: [
    //         {
    //           data: timelineData
    //         }
    //       ],
    //       chart: {
    //         height: 300,
    //         type: "rangeBar",
    //         toolbar: {
    //           show: true
    //         }
    //       },
    //       plotOptions: {
    //         bar: {
    //           horizontal: true,
    //           barHeight: '50%',
    //           rangeBarGroupRows: true
    //         }
    //       },
    //       xaxis: {
    //         type: "datetime",
    //         min: startDate,
    //         max: endDate,
    //         labels: {
    //           formatter: function (value) {
    //             const date = new Date(value);
    //             return date?.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    //           },
    //           datetimeFormatter: {
    //             year: 'yyyy',
    //             month: "MMM 'yy",
    //             day: 'dd MMM',
    //             hour: 'HH:mm'
    //           },
    //           offsetX: 0,
    //         }
    //       },
    //       yaxis: {
    //         labels: {
    //           align: 'left',
    //           style: {
    //             fontSize: '12px'
    //           }
    //         }
    //       },
    //       dataLabels: {
    //         enabled: true,
    //         formatter: function (val, opts) {
    //           const startDate = new Date(opts?.w?.globals?.seriesRangeStart[opts?.seriesIndex][opts?.dataPointIndex]);
    //           const endDate = new Date(opts?.w?.globals.seriesRangeEnd[opts?.seriesIndex][opts?.dataPointIndex]);
    //           return `${startDate?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDate?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    //         },
    //         style: {
    //           colors: ['#fff']
    //         }
    //       },
    //       tooltip: {
    //         enabled: true,
    //         shared: false,
    //         custom: function ({ series, seriesIndex, dataPointIndex, w }) {
    //           const task = w?.globals?.initialSeries[seriesIndex]?.data[dataPointIndex]?.task;
    //           const startDate = new Date(w?.globals?.seriesRangeStart[seriesIndex][dataPointIndex]);
    //           const endDate = new Date(w?.globals?.seriesRangeEnd[seriesIndex][dataPointIndex]);
    //           return `<div class="apexcharts-tooltip-title">${task}</div>
    //                   <div class="apexcharts-tooltip-content">
    //                     <span>${startDate?.toLocaleDateString()} ${startDate?.toLocaleTimeString()}</span> - 
    //                     <span>${endDate?.toLocaleDateString()} ${endDate?.toLocaleTimeString()}</span>
    //                   </div>`;
    //         }
    //       },
    //       grid: {
    //         row: {
    //           colors: ['#f3f4f5', '#fff'],
    //           opacity: 0.5
    //         }
    //       },
    //       annotations: {
    //         xaxis: xAxisAnnotations 
    //       }
    //     };
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   },
    //   complete: () => { }
    // });

    // this.service.getAllForTimeLine(clientId, this.activeTab).subscribe({
    //   next: (res) => {
    //     const timelineData: { x: string; y: number[]; task: any; }[] = [];
    
    //     res?.data?.timelineLIst?.forEach((item: any) => {
    //       const startTime = new Date(item?.startTime);
    //       const endTime = new Date(item?.endTime);
    
    //       let currentStartTime = new Date(startTime);
    //       while (currentStartTime <= endTime) {
    //         const isFirstDay = currentStartTime.toDateString() === startTime.toDateString();
    //         const isLastDay = currentStartTime.toDateString() === endTime.toDateString();
    
    //         // Determine start and end times for the current segment
    //         const segmentStartTime = isFirstDay ? startTime : new Date(currentStartTime.setHours(0, 0, 0, 0));
    //         const segmentEndTime = isLastDay
    //           ? endTime
    //           : new Date(currentStartTime.setHours(23, 59, 59, 999));
    
    //         // Add the segment to the timeline data
    //         timelineData.push({
    //           x: `${item?.task} (${segmentStartTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${segmentEndTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
    //           y: [segmentStartTime.getTime(), segmentEndTime.getTime()],
    //           task: item?.task,
    //         });
    
    //         // Move to the next day
    //         currentStartTime = new Date(currentStartTime.setDate(currentStartTime.getDate() + 1));
    //       }
    //     });
    
    //     const startDate = new Date(res?.data?.startDate);
    //     const endDate = new Date(res?.data?.endDate);
    
    //     // Generate all dates between startDate and endDate
    //     const allDates = [];
    //     let currentDate = new Date(startDate);
    //     while (currentDate <= endDate) {
    //       allDates.push(new Date(currentDate)); // Add the date to the list
    //       currentDate.setDate(currentDate.getDate() + 1); // Increment the date
    //     }
    
    //     // Set annotations for all dates
    //     const xAxisAnnotations = allDates.map((date) => ({
    //       x: date.getTime(),
    //       borderColor: "#775DD0",
    //       label: {
    //         style: {
    //           color: "#775DD0",
    //         },
    //         text: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    //       },
    //     }));
    
    //     this.chartOptions = {
    //       series: [
    //         {
    //           data: timelineData,
    //         },
    //       ],
    //       chart: {
    //         height: 300,
    //         type: "rangeBar",
    //         toolbar: {
    //           show: true,
    //         },
    //       },
    //       plotOptions: {
    //         bar: {
    //           horizontal: true,
    //           barHeight: "50%",
    //           rangeBarGroupRows: true,
    //         },
    //       },
    //       xaxis: {
    //         type: "datetime",
    //         min: startDate.getTime(),
    //         max: endDate.getTime(),
    //         labels: {
    //           formatter: function (value) {
    //             const date = new Date(value);
    //             return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    //           },
    //           datetimeFormatter: {
    //             year: "yyyy",
    //             month: "MMM 'yy",
    //             day: "dd MMM",
    //             hour: "HH:mm",
    //           },
    //           offsetX: 0,
    //         },
    //       },
    //       yaxis: {
    //         labels: {
    //           align: "left",
    //           style: {
    //             fontSize: "12px",
    //           },
    //         },
    //       },
    //       dataLabels: {
    //         enabled: true,
    //         formatter: function (val, opts) {
    //           const startDate = new Date(opts?.w?.globals?.seriesRangeStart[opts?.seriesIndex][opts?.dataPointIndex]);
    //           const endDate = new Date(opts?.w?.globals.seriesRangeEnd[opts?.seriesIndex][opts?.dataPointIndex]);
    //           return `${startDate?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${endDate?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    //         },
    //         style: {
    //           colors: ["#fff"],
    //         },
    //       },
    //       tooltip: {
    //         enabled: true,
    //         shared: false,
    //         custom: function ({ series, seriesIndex, dataPointIndex, w }) {
    //           const task = w?.globals?.initialSeries[seriesIndex]?.data[dataPointIndex]?.task;
    //           const startDate = new Date(w?.globals?.seriesRangeStart[seriesIndex][dataPointIndex]);
    //           const endDate = new Date(w?.globals?.seriesRangeEnd[seriesIndex][dataPointIndex]);
    //           return `<div class="apexcharts-tooltip-title">${task}</div>
    //                   <div class="apexcharts-tooltip-content">
    //                     <span>${startDate?.toLocaleDateString()} ${startDate?.toLocaleTimeString()}</span> - 
    //                     <span>${endDate?.toLocaleDateString()} ${endDate?.toLocaleTimeString()}</span>
    //                   </div>`;
    //         },
    //       },
    //       grid: {
    //         row: {
    //           colors: ["#f3f4f5", "#fff"],
    //           opacity: 0.5,
    //         },
    //       },
    //       annotations: {
    //         xaxis: xAxisAnnotations,
    //       },
    //     };
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   },
    //   complete: () => {},
    // });
    
    // this.service.getAllForTimeLine(clientId, this.activeTab).subscribe({
    //   next: (res) => {
    //     const timelineData: any[] = [];
    //     const uniqueEntries = new Set<string>(); // To track unique entries
    
    //     res?.data?.timelineLIst?.forEach((item: any) => {
    //       const startTime = new Date(item?.startTime);
    //       const endTime = new Date(item?.endTime);
    
    //       let currentStartTime = new Date(startTime);
    
    //       while (currentStartTime <= endTime) {
    //         const isFirstDay = currentStartTime.toDateString() === startTime.toDateString();
    //         const isLastDay = currentStartTime.toDateString() === endTime.toDateString();
    
    //         // Determine start and end times for the current segment
    //         const segmentStartTime = isFirstDay ? startTime : new Date(currentStartTime.setHours(0, 0, 0, 0));
    //         const segmentEndTime = isLastDay
    //           ? endTime
    //           : new Date(currentStartTime.setHours(23, 59, 59, 999));
    
    //         // Create a unique key for this segment to avoid duplicates
    //         const uniqueKey = `${item?.task}-${segmentStartTime.toISOString()}-${segmentEndTime.toISOString()}`;
    
    //         if (!uniqueEntries.has(uniqueKey)) {
    //           uniqueEntries.add(uniqueKey); // Mark this segment as added
    //           timelineData.push({
    //             x: `${item?.task} (${segmentStartTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${segmentEndTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
    //             y: [segmentStartTime.getTime(), segmentEndTime.getTime()],
    //             task: item?.task,
    //           });
    //         }
    
    //         // Move to the next day
    //         currentStartTime = new Date(currentStartTime.setDate(currentStartTime.getDate() + 1));
    //       }
    //     });
    
    //     const startDate = new Date(res?.data?.startDate);
    //     const endDate = new Date(res?.data?.endDate);
    
    //     // Generate all dates between startDate and endDate
    //     const allDates = [];
    //     let currentDate = new Date(startDate);
    //     while (currentDate <= endDate) {
    //       allDates.push(new Date(currentDate)); // Add the date to the list
    //       currentDate.setDate(currentDate.getDate() + 1); // Increment the date
    //     }
    
    //     // Set annotations for all dates
    //     const xAxisAnnotations = allDates.map((date) => ({
    //       x: date.getTime(),
    //       borderColor: "#775DD0",
    //       label: {
    //         style: {
    //           color: "#775DD0",
    //         },
    //         text: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    //       },
    //     }));
    
    //     this.chartOptions = {
    //       series: [
    //         {
    //           data: timelineData,
    //         },
    //       ],
    //       chart: {
    //         height: 300,
    //         type: "rangeBar",
    //         toolbar: {
    //           show: true,
    //         },
    //       },
    //       plotOptions: {
    //         bar: {
    //           horizontal: true,
    //           barHeight: "50%",
    //           rangeBarGroupRows: true,
    //         },
    //       },
    //       xaxis: {
    //         type: "datetime",
    //         min: startDate.getTime(),
    //         max: endDate.getTime(),
    //         labels: {
    //           formatter: function (value) {
    //             const date = new Date(value);
    //             return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    //           },
    //           datetimeFormatter: {
    //             year: "yyyy",
    //             month: "MMM 'yy",
    //             day: "dd MMM",
    //             hour: "HH:mm",
    //           },
    //           offsetX: 0,
    //         },
    //       },
    //       yaxis: {
    //         labels: {
    //           align: "left",
    //           style: {
    //             fontSize: "12px",
    //           },
    //         },
    //       },
    //       dataLabels: {
    //         enabled: true,
    //         formatter: function (val, opts) {
    //           const startDate = new Date(opts?.w?.globals?.seriesRangeStart[opts?.seriesIndex][opts?.dataPointIndex]);
    //           const endDate = new Date(opts?.w?.globals.seriesRangeEnd[opts?.seriesIndex][opts?.dataPointIndex]);
    //           return `${startDate?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${endDate?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    //         },
    //         style: {
    //           colors: ["#fff"],
    //         },
    //       },
    //       tooltip: {
    //         enabled: true,
    //         shared: false,
    //         custom: function ({ series, seriesIndex, dataPointIndex, w }) {
    //           const task = w?.globals?.initialSeries[seriesIndex]?.data[dataPointIndex]?.task;
    //           const startDate = new Date(w?.globals?.seriesRangeStart[seriesIndex][dataPointIndex]);
    //           const endDate = new Date(w?.globals?.seriesRangeEnd[seriesIndex][dataPointIndex]);
    //           return `<div class="apexcharts-tooltip-title">${task}</div>
    //                   <div class="apexcharts-tooltip-content">
    //                     <span>${startDate?.toLocaleDateString()} ${startDate?.toLocaleTimeString()}</span> - 
    //                     <span>${endDate?.toLocaleDateString()} ${endDate?.toLocaleTimeString()}</span>
    //                   </div>`;
    //         },
    //       },
    //       grid: {
    //         row: {
    //           colors: ["#f3f4f5", "#fff"],
    //           opacity: 0.5,
    //         },
    //       },
    //       annotations: {
    //         xaxis: xAxisAnnotations,
    //       },
    //     };
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   },
    //   complete: () => {},
    // });
    
    // this.service.getAllForTimeLine(clientId, this.activeTab).subscribe({ //proper date format
    //   next: (res) => {
    //     const timelineData: { x: string; y: number[]; task: any }[] = [];
    
    //     // Process the timeline list to consolidate tasks spanning multiple days
    //     res?.data?.timelineLIst?.forEach((item: any) => {
    //       const startTime = new Date(item?.startTime);
    //       const endTime = new Date(item?.endTime);
    
    //       timelineData.push({
    //         x: `${item?.task}`,
    //         y: [startTime.getTime(), endTime.getTime()],
    //         task: item?.task,
    //       });
    //     });
    
    //     const startDate = new Date(res?.data?.startDate);
    //     const endDate = new Date(res?.data?.endDate);
    
    //     // Generate all dates between startDate and endDate
    //     const allDates = [];
    //     let currentDate = new Date(startDate);
    //     while (currentDate <= endDate) {
    //       allDates.push(new Date(currentDate)); // Add the date to the list
    //       currentDate.setUTCDate(currentDate.getUTCDate() + 1); // Increment the date
    //     }
    
    //     // Set annotations for all dates
    //     const xAxisAnnotations = allDates.map((date) => ({
    //       x: date.getTime(),
    //       borderColor: "#775DD0",
    //       label: {
    //         style: {
    //           color: "#775DD0",
    //         },
    //         text: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }), // Format as 'Dec 2'
    //       },
    //     }));
    
    //     // Define chart options
    //     this.chartOptions = {
    //       series: [
    //         {
    //           data: timelineData,
    //         },
    //       ],
    //       chart: {
    //         height: 300,
    //         type: "rangeBar",
    //         toolbar: {
    //           show: true,
    //         },
    //       },
    //       plotOptions: {
    //         bar: {
    //           horizontal: true,
    //           barHeight: "50%",
    //           rangeBarGroupRows: true,
    //         },
    //       },
    //       xaxis: {
    //         type: "datetime",
    //         min: startDate.getTime(),
    //         max: endDate.getTime(),
    //         labels: {
    //           formatter: function (value) {
    //             const date = new Date(value);
    //             // Format the x-axis label to show month and day only, e.g., "Dec 2"
    //             return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    //           },
    //           offsetX: 0,
    //         },
    //       },
    //       yaxis: {
    //         labels: {
    //           align: "left",
    //           style: {
    //             fontSize: "12px",
    //           },
    //         },
    //       },
    //       dataLabels: {
    //         enabled: true,
    //         formatter: function (val, opts) {
    //           const startDate = new Date(
    //             opts?.w?.globals?.seriesRangeStart[opts?.seriesIndex][opts?.dataPointIndex]
    //           );
    //           const endDate = new Date(
    //             opts?.w?.globals.seriesRangeEnd[opts?.seriesIndex][opts?.dataPointIndex]
    //           );
    
    //           // Format the start date with time
    //           const startDateStr = `${startDate.getUTCDate()} ${startDate.toLocaleString('default', { month: 'short' })} (${startDate.getUTCHours().toString().padStart(2, '0')}:${startDate.getUTCMinutes().toString().padStart(2, '0')})`;
    //           // Format the end date with time
    //           const endDateStr = `${endDate.getUTCDate()} ${endDate.toLocaleString('default', { month: 'short' })} (${endDate.getUTCHours().toString().padStart(2, '0')}:${endDate.getUTCMinutes().toString().padStart(2, '0')})`;
    
    //           // Return the consolidated date range
    //           return `${startDateStr} - ${endDateStr}`;
    //         },
    //         style: {
    //           colors: ["#fff"],
    //         },
    //       },
    //       tooltip: {
    //         enabled: true,
    //         shared: false,
    //         custom: function ({ series, seriesIndex, dataPointIndex, w }) {
    //           const task = w?.globals?.initialSeries[seriesIndex]?.data[dataPointIndex]?.task;
    //           const startDate = new Date(
    //             w?.globals?.seriesRangeStart[seriesIndex][dataPointIndex]
    //           );
    //           const endDate = new Date(
    //             w?.globals?.seriesRangeEnd[seriesIndex][dataPointIndex]
    //           );
    
    //           // Show time in UTC without conversion
    //           return `<div class="apexcharts-tooltip-title">${task}</div>
    //                           <div class="apexcharts-tooltip-content">
    //                             <span>${startDate?.toISOString().slice(0, 19).replace('T', ' ')}</span> - 
    //                             <span>${endDate?.toISOString().slice(0, 19).replace('T', ' ')}</span>
    //                           </div>`;
    //         },
    //       },
    //       grid: {
    //         row: {
    //           colors: ["#f3f4f5", "#fff"],
    //           opacity: 0.5,
    //         },
    //       },
    //       annotations: {
    //         xaxis: xAxisAnnotations,
    //       },
    //     };
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   },
    //   complete: () => {},
    // });
    
//     this.service.getAllForTimeLine(clientId, this.activeTab).subscribe({
//   next: (res) => {
//     const timelineData: { x: string; y: number[]; task: any }[] = [];
//     res?.data?.timelineLIst?.forEach((item: any) => {
//       const startTime = new Date(item.startTime);
//       const endTime = new Date(item.endTime);

//       // Calculate start and end times relative to the day
//       const startOfDay = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate());
//       const endOfDay = new Date(endTime.getFullYear(), endTime.getMonth(), endTime.getDate() + 1);

//       const startTimeOffset = startTime.getTime() - startOfDay.getTime(); // Offset from 12 AM
//       const endTimeOffset = endTime.getTime() - startOfDay.getTime();   // Offset from 12 AM

//       timelineData.push({
//         x: `${item?.task}`,
//         y: [startOfDay.getTime() + startTimeOffset, startOfDay.getTime() + endTimeOffset],
//         task: item?.task,
//       });
//     });

//     const startDate = new Date(res?.data?.startDate);
//     const endDate = new Date(res?.data?.endDate);

//     // Generate all dates between startDate and endDate
//     const allDates = [];
//     let currentDate = new Date(startDate);
//     while (currentDate <= endDate) {
//       allDates.push(new Date(currentDate)); // Add the date to the list
//       currentDate.setUTCDate(currentDate.getUTCDate() + 1); // Increment the date
//     }

//     // Set annotations for all dates
//     const xAxisAnnotations = allDates.map((date) => ({
//       x: date.getTime(),
//       borderColor: "#775DD0",
//       label: {
//         style: {
//           color: "#775DD0",
//         },
//         text: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }), // Format as 'Dec 2'
//       },
//     }));

//     // Define chart options
//     this.chartOptions = {
//       series: [
//         {
//           data: timelineData,
//         },
//       ],
//       chart: {
//         height: 300,
//         type: "rangeBar",
//         toolbar: {
//           show: true,
//         },
//       },
//       plotOptions: {
//         bar: {
//           horizontal: true,
//           barHeight: "50%",
//           rangeBarGroupRows: true,
//         },
//       },
//       xaxis: {
//         type: "datetime",
//         min: startDate.getTime(),
//         max: endDate.getTime(),
//         labels: {
//           formatter: function (value) {
//             const date = new Date(value);
//             // Format the x-axis label to show month and day only, e.g., "Dec 2"
//             return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
//           },
//           offsetX: 0,
//         },
//       },
//       yaxis: {
//         labels: {
//           align: "left",
//           style: {
//             fontSize: "12px",
//           },
//         },
//       },
//       dataLabels: {
//         enabled: true,
//         formatter: function (val, opts) {
//           const startDate = new Date(
//             opts?.w?.globals?.seriesRangeStart[opts?.seriesIndex][opts?.dataPointIndex]
//           );
//           const endDate = new Date(
//             opts?.w?.globals.seriesRangeEnd[opts?.seriesIndex][opts?.dataPointIndex]
//           );

//           // Format the start date with time
//           const startDateStr = `${startDate.getUTCDate()} ${startDate.toLocaleString('default', { month: 'short' })} (${startDate.getUTCHours().toString().padStart(2, '0')}:${startDate.getUTCMinutes().toString().padStart(2, '0')})`;
//           // Format the end date with time
//           const endDateStr = `${endDate.getUTCDate()} ${endDate.toLocaleString('default', { month: 'short' })} (${endDate.getUTCHours().toString().padStart(2, '0')}:${endDate.getUTCMinutes().toString().padStart(2, '0')})`;

//           // Return the consolidated date range
//           return `${startDateStr} - ${endDateStr}`;
//         },
//         style: {
//           colors: ["#fff"],
//         },
//       },
//       tooltip: {
//         enabled: true,
//         shared: false,
//         custom: function ({ series, seriesIndex, dataPointIndex, w }) {
//           const task = w?.globals?.initialSeries[seriesIndex]?.data[dataPointIndex]?.task;
//           const startDate = new Date(
//             w?.globals?.seriesRangeStart[seriesIndex][dataPointIndex]
//           );
//           const endDate = new Date(
//             w?.globals?.seriesRangeEnd[seriesIndex][dataPointIndex]
//           );

//           // Show time in UTC without conversion
//           return `<div class="apexcharts-tooltip-title">${task}</div>
//                           <div class="apexcharts-tooltip-content">
//                             <span>${startDate?.toISOString().slice(0, 19).replace('T', ' ')}</span> - 
//                             <span>${endDate?.toISOString().slice(0, 19).replace('T', ' ')}</span>
//                           </div>`;
//         },
//       },
//       grid: {
//         row: {
//           colors: ["#f3f4f5", "#fff"],
//           opacity: 0.5,
//         },
//       },
//       annotations: {
//         xaxis: xAxisAnnotations,
//       },
//     };
//   },
//   error: (err) => {
//     console.log(err);
//   },
//   complete: () => {},
// });

// this.service.getAllForTimeLine(clientId, this.activeTab).subscribe({
//   next: (res) => {
//     const timelineData: { x: string; y: number[]; task: string }[] = [];
//     res?.data?.timelineLIst?.forEach((item: any) => {
//       const startTime = new Date(item.startTime).getTime();
//       const endTime = item.endTime ? new Date(item.endTime).getTime() : null;

//       // Push each record as a separate bar
//       timelineData.push({
//         x: `${item.task} (${new Date(item.startTime).toLocaleString()} - ${item.endTime ? new Date(item.endTime).toLocaleString() : "Ongoing"})`, // Include start and end time
//         y: [startTime, endTime || startTime + 3600000], // If endTime is null, set a default duration of 1 hour
//         task: item.task,
//       });      
//     });

//     const startDate = new Date(res?.data?.startDate).getTime();
//     const endDate = new Date(res?.data?.endDate).getTime();

//     // Set chart options
//     this.chartOptions = {
//       series: [
//         {
//           data: timelineData,
//         },
//       ],
//       chart: {
//         height: 300,
//         type: "rangeBar",
//         toolbar: {
//           show: true,
//         },
//       },
//       plotOptions: {
//         bar: {
//           horizontal: true,
//           barHeight: "100%",
//           rangeBarGroupRows: true, // Prevent grouping of rows
//         },
//       },
//       xaxis: {
//         type: "datetime",
//         min: startDate,
//         max: endDate,
//         labels: {
//           formatter: function (value) {
//             const date = new Date(value);
//             return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
//           },
//         },
//       },
//       yaxis: {
//         labels: {
//           align: "left",
//           style: {
//             fontSize: "12px",
//           },
//         },
//       },
//       dataLabels: {
//                 enabled: true,
//                 formatter: function (val, opts) {
//                   const startDate = new Date(
//                     opts?.w?.globals?.seriesRangeStart[opts?.seriesIndex][opts?.dataPointIndex]
//                   );
//                   const endDate = new Date(
//                     opts?.w?.globals.seriesRangeEnd[opts?.seriesIndex][opts?.dataPointIndex]
//                   );
        
//                   // Format the start date with time
//                   const startDateStr = `${startDate.getUTCDate()} ${startDate.toLocaleString('default', { month: 'short' })} (${startDate.getUTCHours().toString().padStart(2, '0')}:${startDate.getUTCMinutes().toString().padStart(2, '0')})`;
//                   // Format the end date with time
//                   const endDateStr = `${endDate.getUTCDate()} ${endDate.toLocaleString('default', { month: 'short' })} (${endDate.getUTCHours().toString().padStart(2, '0')}:${endDate.getUTCMinutes().toString().padStart(2, '0')})`;
        
//                   // Return the consolidated date range
//                   return `${startDateStr} - ${endDateStr}`;
//                 },
//                 style: {
//                   colors: ["#fff"],
//                 },
//               },
//       tooltip: {
//         enabled: true,
//         custom: function ({ series, seriesIndex, dataPointIndex, w }) {
//           const task = w?.globals?.initialSeries[seriesIndex]?.data[dataPointIndex]?.task;
//           const startDate = new Date(
//             w?.globals?.seriesRangeStart[seriesIndex][dataPointIndex]
//           );
//           const endDate = new Date(
//             w?.globals?.seriesRangeEnd[seriesIndex][dataPointIndex]
//           );

//           return `<div>
//                     <strong>Task:</strong> ${task}<br/>
//                     <strong>Start:</strong> ${startDate.toLocaleString()}<br/>
//                     <strong>End:</strong> ${endDate.toLocaleString()}
//                   </div>`;
//         },
//       },
//       grid: {
//         row: {
//           colors: ["#f3f4f5", "#fff"],
//           opacity: 0.5,
//         },
//       },
//     };
//   },
//   error: (err) => {
//     console.error(err);
//   },
// });
this.service.getAllForTimeLine(clientId, this.activeTab).subscribe({
  next: (res) => {
    const timelineData: { x: string; y: number[]; task: string }[] = [];
    res?.data?.timelineLIst?.forEach((item: any) => {
      const startTime = new Date(item.startTime).getTime();
      const endTime = item.endTime ? new Date(item.endTime).getTime() : null;

      timelineData.push({
        x: `${item.task} (${formatDateTimeRange(item.startTime, item.endTime)})`, // Use the same formatting logic as in the formatter function
        y: [startTime, endTime || startTime + 3600000], // If endTime is null, set a default duration of 1 hour
        task: item.task,
      });
      
      // Function to format start and end date/time range
      function formatDateTimeRange(startTime: string, endTime: string | null): string {
        const startDate = new Date(startTime);
        const endDate = endTime ? new Date(endTime) : null;
      
        // Format the start date with time
        const startDateStr = `${startDate.getUTCDate()} ${startDate.toLocaleString("default", {
          month: "short",
        })} (${startDate.getUTCHours().toString().padStart(2, "0")}:${startDate
          .getUTCMinutes()
          .toString()
          .padStart(2, "0")})`;
      
        // Format the end date with time, or use "Ongoing" if null
        const endDateStr = endDate
          ? `${endDate.getUTCDate()} ${endDate.toLocaleString("default", {
              month: "short",
            })} (${endDate.getUTCHours().toString().padStart(2, "0")}:${endDate
              .getUTCMinutes()
              .toString()
              .padStart(2, "0")})`
          : "Ongoing";
      
        return `${startDateStr} - ${endDateStr}`;
      }       
    });

    const startDate = new Date(res?.data?.startDate).getTime();
    const endDate = new Date(res?.data?.endDate).getTime();

    // Generate annotations for each day
    const annotations = [];
    for (let time = startDate; time <= endDate; time += 86400000) {
      const dayStart = new Date(time).setHours(0, 0, 0, 0); // 12:00 AM of the day
      annotations.push({
        x: dayStart,
        strokeDashArray: 0,
        borderColor: "#2980b9",
        label: {
          borderColor: "#2980b9",
          style: {
            color: "#fff",
            background: "#2980b9",
          },
          text: `Day Start: ${new Date(dayStart).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}`,
        },
      });
    }

    const currentDate = `Generated on: ${this.getCurrentDate()}`;

    // Set chart options
    this.chartOptions = {
      series: [
        {
          data: timelineData,
        },
      ],
      chart: {
        height: 300,
        type: "rangeBar",
        toolbar: {
          show: true,
          export: {
           csv: {
  filename: "EXwise_Timeline_Summary",
  columnDelimiter: ",",
  headerCategory:
    "Client name :," +
    this.displayClientData?.clientName +
    "\n" +
    currentDate +
    "\nTask",
  headerValue: "Value",
},

            svg: {
              filename: "EXwise_Timeline_Summary",
            },
            png: {
              filename: "EXwise_Timeline_Summary",
            },
          },
        },
      },
      title: {
        text: "Task details",
        align: "center",
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
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "100%",
          rangeBarGroupRows: true, // Prevent grouping of rows
        },
      },
      xaxis: {
        type: "datetime",
        min: startDate,
        max: endDate,
        labels: {
          formatter: function (value) {
            const date = new Date(value);
            return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
          },
        },
      },
      yaxis: {
        labels: {
          align: "left",
          style: {
            fontSize: "12px",
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          const startDate = new Date(
            opts?.w?.globals?.seriesRangeStart[opts?.seriesIndex][opts?.dataPointIndex]
          );
          const endDate = new Date(
            opts?.w?.globals.seriesRangeEnd[opts?.seriesIndex][opts?.dataPointIndex]
          );

          // Format the start date with time
          const startDateStr = `${startDate.getUTCDate()} ${startDate.toLocaleString("default", {
            month: "short",
          })} (${startDate.getUTCHours().toString().padStart(2, "0")}:${startDate
            .getUTCMinutes()
            .toString()
            .padStart(2, "0")})`;
          // Format the end date with time
          const endDateStr = `${endDate.getUTCDate()} ${endDate.toLocaleString("default", {
            month: "short",
          })} (${endDate.getUTCHours().toString().padStart(2, "0")}:${endDate
            .getUTCMinutes()
            .toString()
            .padStart(2, "0")})`;

          // Return the consolidated date range
          return `${startDateStr} - ${endDateStr}`;
        },
        style: {
          colors: ["#fff"],
        },
      },
      tooltip: {
        enabled: true,
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          const task = w?.globals?.initialSeries[seriesIndex]?.data[dataPointIndex]?.task;
          const startDate = new Date(
            w?.globals?.seriesRangeStart[seriesIndex][dataPointIndex]
          );
          const endDate = new Date(
            w?.globals?.seriesRangeEnd[seriesIndex][dataPointIndex]
          );

          return `<div>
                    <strong>Task:</strong> ${task}<br/>
                    <strong>Start:</strong> ${startDate.toLocaleString()}<br/>
                    <strong>End:</strong> ${endDate.toLocaleString()}
                  </div>`;
        },
      },
      grid: {
        row: {
          colors: ["#f3f4f5", "#fff"],
          opacity: 0.5,
        },
      },
      annotations: {
        xaxis: annotations, // Add annotations to the X-axis
      },
    };
  },
  error: (err) => {
    console.error(err);
  },
});


  }
  


  showAllSurveys() {
    const clientId = parseInt(sessionStorage.getItem("ClientId")!, 10);
    this.service.getAllSurveyAssignmentByClientID(clientId).subscribe({
      next: (res) => {
        this.surveys = res.data;
        this.filterSurveys();
      },
      error: (err) => { console.log(err); },
      complete: () => { }
    });
  }

  filterSurveys() {
    const activeTab = this.tabsdata.find(tab => tab.clicked);
    
    if (activeTab.name === 'All') {
      this.filteredSurveys = this.surveys;
      console.log('All surveys:', this.filteredSurveys);
    
    } else if (activeTab.name === 'Open') {
      this.filteredSurveys = this.surveys.filter(survey => survey.assignmentToCLient.active === true);
      console.log('Open surveys:', this.filteredSurveys, 'Count:', this.filteredSurveys.length);
    
    } else if (activeTab.name === 'Close') {
      this.filteredSurveys = this.surveys.filter(survey => survey.assignmentToCLient.active !== true);
      console.log('Closed surveys:', this.filteredSurveys);
    }
  }


  executeEmployeeResponseGraph(clientId: number) {
    this.service.getClientEmployeeResponsePercentage(clientId).subscribe({
      next: (res) => {
        const chartData = this.transformBackendData(res);

        if (this.employeeResponsesLineChart) {
          this.employeeResponsesLineChart.destroy();
        }

        this.employeeResponsesLineChart = new Chart('emloyeeResponseChartCanvas', {
          type: 'line',
          data: {
            labels: chartData.labels,
            datasets: [
              {
                data: chartData.data,
                label: 'Score',
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
                text: 'Employee responses',
                font: {
                  size: 10,
                },
                padding: {
                  top: 5,
                  bottom: 10
                }
              },
            }
          },
        });
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => { }
    });
  }

  executeFocuseGroupGraph(clientId: number) {
    this.service.getFocusGroupPercentage(clientId).subscribe({
      next: (res) => {
        const chartData = this.transformBackendData(res);

        if (this.focuseGroupLineChart) {
          this.focuseGroupLineChart.destroy();
        }

        this.focuseGroupLineChart = new Chart('focuseGroupChartCanvas', {
          type: 'line',
          data: {
            labels: chartData.labels,
            datasets: [
              {
                data: chartData.data,
                label: 'Score',
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
                text: 'Focus group',
                font: {
                  size: 10,
                },
                padding: {
                  top: 5,
                  bottom: 10
                }
              },
            }
          },
        });
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => { }
    });
  }

  executeFocuseGroupMeetingGraph(clientId: number) {
    this.service.getFocusGroupMeetingPercentage(clientId).subscribe({
      next: (res) => {
        const chartData = this.transformBackendData(res);

        if (this.focuseGroupMeetingLineChart) {
          this.focuseGroupMeetingLineChart.destroy();
        }

        this.focuseGroupMeetingLineChart = new Chart('focuseGroupMeetingChartCanvas', {
          type: 'line',
          data: {
            labels: chartData.labels,
            datasets: [
              {
                data: chartData.data,
                label: 'Score',
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
                text: 'Focuse group meeting',
                font: {
                  size: 10,
                },
                padding: {
                  top: 5,
                  bottom: 10
                }
              },
            }
          },
        });
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => { }
    });
  }


  executeOneToOneInterviewGraph(clientId: number) {
    this.service.getOneToOneInterviewPercentage(clientId).subscribe({
      next: (res) => {
        const chartData = this.transformBackendData(res);

        if (this.oneToOneInterviewLineChart) {
          this.oneToOneInterviewLineChart.destroy();
        }

        this.oneToOneInterviewLineChart = new Chart('oneToOneInterviewChartCanvas', {
          type: 'line',
          data: {
            labels: chartData.labels,
            datasets: [
              {
                data: chartData.data,
                label: 'Score',
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
                text: 'Interviews',
                font: {
                  size: 10,
                },
                padding: {
                  top: 5,
                  bottom: 10
                }
              },
            }
          },
        });
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => { }
    });
  }

  openPopup(isStaticSurvey: any, surveyName:any, id: any): void {
    console.log(id);
    console.log(isStaticSurvey);
    const clientId = parseInt(sessionStorage.getItem("ClientId")!, 10);
    const dialogRef = this.dialog.open(SurveyIdInfoComponent, {
      width: '750px',
      height: '500px',
      disableClose: true,
      data: { id: id, isStaticSurvey: isStaticSurvey, surveyName:surveyName, clientId: clientId },
    });

    dialogRef.afterClosed().subscribe((result) => {

      // this.router.navigate(['/people-matrix'], {

      // });
    });
  }

  openPopupForShowMoreDetailsOfEXDiagnosticReport(id:number){
    const dialogRef = this.dialog.open(EXDiagnosticDetailsComponent, {
      width: '750px',
      height: '500px',
      disableClose: true,
      data: { id: id },
    });
  }

  executeSurveyAssignmentGraph(clientId: number) {
    this.service.getSurveyAssignmentPercentage(clientId).subscribe({
      next: (res) => {
        const chartData = this.transformBackendData(res);

        if (this.surveyAssignmentLineChart) {
          this.surveyAssignmentLineChart.destroy();
        }

        this.surveyAssignmentLineChart = new Chart('surveyAssignmentChartCanvas', {
          type: 'line',
          data: {
            labels: chartData.labels,
            datasets: [
              {
                data: chartData.data,
                label: 'Score',
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
                text: 'Survey assignment',
                font: {
                  size: 10,
                },
                padding: {
                  top: 5,
                  bottom: 10
                }
              },
            }
          },
        });
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => { }
    });
  }



  executeOnboardingGraph(clientId: number) {
    this.service.getOnboardingScore(clientId).subscribe({
      next: (res) => {
        const chartData = this.transformBackendData(res);

        if (this.onboardingLineChart) {
          this.onboardingLineChart.destroy();
        }

        this.onboardingLineChart = new Chart('onboardingChartCanvas', {
          type: 'line',
          data: {
            labels: chartData.labels,
            datasets: [
              {
                data: chartData.data,
                label: 'Score',
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
                text: 'Onboarding',
                font: {
                  size: 10,
                },
                padding: {
                  top: 5,
                  bottom: 10
                }
              },
            }
          },
        });
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => { }
    });
  }

  transformBackendData(response: any): { labels: string[], data: number[] } {
    const labels: string[] = [];
    const data: number[] = [];

    for (const [key, value] of Object.entries(response)) {
      const date = new Date(key + '-01');
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      labels.push(month);
      data.push(value as number);
    }

    return { labels, data };
  }

  getClientById() {
    this.service.clientByID(this.id).subscribe((res: any) => {
      if (res.success) {
        this.clientData = res.data;
        console.log(this.clientData);


        this.feedbackFormShared = this.clientData.isSharedFeedback;
        this.JourneyMap = this.clientData.isSharedJourneyMap;
        console.log(this.feedbackFormShared);
      }
    });
  }


  onTabClick(selectedTab: any) {
    this.tabsdata.forEach(tab => tab.clicked = false);
    selectedTab.clicked = true;
    this.filterSurveys();
  }

  onTabClickForAnalyse(selectedTabForAnalyse: any) {
    this.tabsdataForAnalyse.forEach(tab => tab.clicked = false);
    selectedTabForAnalyse.clicked = true;
  }

  onTabClickForShare(selectedTabForShare: any) {
    this.tabsdataForShare.forEach(tab => tab.clicked = false);
    selectedTabForShare.clicked = true;
  }

  onTabClickForCoCreate(selectedTabForCoCreate: any) {
    this.tabsdataForCocreate.forEach(tab => tab.clicked = false);
    selectedTabForCoCreate.clicked = true;
  }


  toggleFeedbackForm(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.feedbackFormShared = checkbox.checked;

    if (this.feedbackFormShared) {
      this.shareFeedbackForm();
    } else {
      this.doNotShareFeedbackForm();
    }
  }

  shareFeedbackForm() {
    console.log('Sharing feedback form');
    const obj = {
      isSharedFeedback: true,
    };
    this.service.updateclientByID(this.id, obj).subscribe((res: any) => {
      console.log(res);
      this.visibleToClient2 = true;
      this.toaster.success('Feedback form is visible to client succesfully..!');
    });
  }
  openInvoice(id: any) {
    this.service.getanalyseById(id).subscribe((res: any) => {
      this.savepdf = res?.data;
      if (this.savepdf?.document) {
      const responseByteData = this.savepdf?.document;
      const url = responseByteData;
      window.open(url)
      }
      else{
        this.toaster.error('Attachment not found')
      }
    })
  }
  doNotShareFeedbackForm() {
    console.log('Not sharing feedback form');
    const obj = {
      isSharedFeedback: false,
    };
    this.service.updateclientByID(this.id, obj).subscribe((res: any) => {
      console.log(res);
      this.visibleToClient2 = false;
      this.toaster.success('Feedback form is not visible to client succesfully..!');
    });
  }
  toggleJourneyMap(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.JourneyMap = checkbox.checked;

    if (this.JourneyMap) {
      this.shareJourneyMap();
    } else {
      this.doNotShareJourneyMap();
    }
  }

  shareJourneyMap() {
    console.log('Sharing feedback form');
    const obj = {
      isSharedJourneyMap: true,
    };
    this.service.updateclientByID(this.id, obj).subscribe((res: any) => {
      console.log(res);
      this.visibleToClient = true;
      this.toaster.success('update phase');
    });
  }

  doNotShareJourneyMap() {
    console.log('Not sharing feedback form');
    const obj = {
      isSharedJourneyMap: false,
    };
    this.service.updateclientByID(this.id, obj).subscribe((res: any) => {
      console.log(res);
      this.visibleToClient = false;
      this.toaster.success('update phase');
    });
  }

  getAllListenCount() {
    this.isLoading = true;
    this.service
      .getListenCount(sessionStorage.getItem('ClientId'))
      .subscribe((res: any) => {
        this.isLoading = false;
        console.log(res);
        this.listencount = res.data;
        console.log(this.listencount);

        this.assignedStagesOfSurvey = res.data.assignedStagesOfSurvey;
        this.oneToOneInterview = res.data.oneToOneInterview;
        this.numberOfRespinses = res.data.numberOfRespinses;
        this.focusGroupMeeting = res.data.focusGroupMeeting;
        this.focusGroup = res.data.focusGroup;
        this.clientEmployee = res.data.clientEmployee;

        // this.updateBarChartData(this.listencount);
      });
  }
  listen(tab: string) {
    this.viewMore = true;
    this.share = false;
    this.coCreate = false;
    this.analyse = false;
    this.activeTab = tab;
    this.getTimeline();
    this.showAllSurveys();
    // this.chartOptions = {};
    const clientId = parseInt(sessionStorage.getItem("ClientId")!, 10)
    this.getAllReminderSurveys(clientId);
    setTimeout(() => {
      this.executeEmployeeResponseGraph(clientId);
      this.executeFocuseGroupGraph(clientId);
      this.executeFocuseGroupMeetingGraph(clientId);
      this.executeOneToOneInterviewGraph(clientId);
      this.executeSurveyAssignmentGraph(clientId);
      this.executeOnboardingGraph(clientId);
      this.exeCuteTimeLine();
    }, 500);
  }
  Analyse(tab: string) {
    this.viewMore = false;
    this.share = false;
    this.coCreate = false;
    this.analyse = true;
    this.activeTab = tab;
    // this.chartOptions = {};
    this.getTimeline();
    this.exeCuteTimeLine();
  }
  displayShare() {
    this.display1 = JSON.parse(
      sessionStorage.getItem('ClientData')!
    ).isSharedJourneyMap;
    if (this.display1 == true) {
      this.visibleToClient = true;
    } else {
      this.visibleToClient = false;
    }
    this.display2 = JSON.parse(
      sessionStorage.getItem('ClientData')!
    ).isSharedFeedback;

    if (this.display2 == true) {
      this.visibleToClient2 = true;
    } else {
      this.visibleToClient2 = false;
    }
  }
  Share(tab: string) {
    this.viewMore = false;
    this.share = true;
    this.coCreate = false;
    this.analyse = false;
    this.activeTab = tab;
    // this.chartOptions = {};
    this.displayShare();
    this.getTimeline();
    this.exeCuteTimeLine();
  }
  cocreate(tab: string) {
    this.viewMore = false;
    this.share = false;
    this.analyse = false;
    this.coCreate = true;
    this.activeTab = tab;
    // this.chartOptions = {};
    this.getTimeline();
    this.exeCuteTimeLine();
  }
  getAllListenList() {
    this.isLoading = true;
    this.service
      .getListen(sessionStorage.getItem('ClientId'))
      .subscribe((res: any) => {
        this.isLoading = false;
        console.log(res);
        this.listendata = res.data;
      });
  }
  feedback: any;
  feedbackMessage: string = '';
  feedbackMessageVisible: boolean = false;
  submitFeedback() {
    if (this.feedbackForm.invalid) {
      return;
    }

    const obj = {
      clientId: JSON.parse(sessionStorage.getItem('ClientData')!).id,
      feedback: this.feedbackForm.get('feedback')?.value,
      rating: this.feedbackForm.get('rate')?.value,
      userid: JSON.parse(sessionStorage.getItem('currentLoggedInUserData')!).id
    };

    console.log(obj);

    this.btnDisplay = true;

    this.service.createFeedback(obj).subscribe(
      (res: any) => {
        console.log(res);
        if (res.message === "Email sent successfully...!!") {
          this.feedbackForm.reset({ rate: 0 });
          this.btnDisplay = false;
          this.feedbackMessage = "Thank you for your feedback!";
          this.feedbackMessageVisible = true;
        }
      },
      (error) => {
        console.error('Error:', error);
        this.btnDisplay = false;
      }
    );
  }

  // updateBarChartData(data: any) {
  //   console.log(data);

  //   console.log(Object.values(data));

  //   this.barChartData = {
  //     labels: Object.keys(data),
  //     datasets: [
  //       {
  //         data: Object.values(data),
  //         backgroundColor: '#103a7f',
  //         label: 'Score',
  //       },
  //     ],
  //   };
  // }
  // public barChartData: ChartConfiguration<'bar'>['data'] = {
  //   labels: [],
  //   datasets: [
  //     {
  //       data: [],
  //       backgroundColor: '#103a7f',
  //     },
  //   ],
  // };

  // public barChartOptions: ChartConfiguration<'bar'>['options'] = {
  //   responsive: true,
  // };

  confirmSelection(rate: any) {
    console.log(rate);
    this.rate = rate;
  }
  onCocreateData() {
    if (this.msg !== null && this.msg !== undefined) {
      const obj = {
        clientId: sessionStorage.getItem('ClientId'),
        createdDate: new Date(),
        doc: 'string',

        loggedUserId: JSON.parse(
          sessionStorage.getItem('currentLoggedInUserData')!
        ).id,
        msg: this.msg,
      };
      console.log(obj);
      this.service.Cocreate(obj).subscribe((res: any) => {
        console.log(res);
        this.msg = '';
        this.getAllCocreate();
      });
    } else {
      this.toaster.error('please enter valid data');
    }
  }

  getAllCocreate() {
    this.isLoading = true;
    this.service
      .getAllCoCreate(sessionStorage.getItem('ClientId'))
      .subscribe((res: any) => {
        this.isLoading = false;
        console.log(res);
        this.data = res?.data;
      });
  }
  withcpoc: any;
  getallreports() {
    this.isLoading = true;
    this.service
      .getAllanalyseById(sessionStorage.getItem('ClientId'))
      .subscribe((res: any) => {
        console.log(res);
        this.isLoading = false;
        this.details = res.data;
        console.log(this.details);
        if (sessionStorage.getItem('isCpoc') == 'true') {
          this.details = res.data.filter(
            (report: any) => report.isSharedWithCPOC === true
          );

          console.log(this.details);
        }
      });
  }

  createAnalyse() {
    const dialogRef = this.dialog.open(AnalysecreateComponent, {
      width: '650px',
      height: '650px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getallreports();
    });
  }

  updateanalyse(id: number) {
    console.log(id);

    const dialogRef = this.dialog.open(AnalysecreateComponent, {
      width: '650px',
      height: '650px',
      disableClose: true,
      data: { name: 'edit-report', id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getallreports();
    });
  }

  deleteanalyse(id: any) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: {
        message: `Do you really want to delete the records ?`,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.action == 'ok') {
        this.service.deleteanalyse(id).subscribe((res: any) => {
          console.log(res);
          // this.toaster.success(res.message, 'Success');
          if (res.message === 'EXDiagnosticReport deleted successfully.') {
            this.toaster.success(res.message, 'Success');
            this.getallreports();
          }
        });
      }
    });
  }

  shareAnalyse(id: any) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: {
        message: `Do you really want to share report to client ?`,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.action == 'ok') {
        const obj = {
          isSharedWithCPOC: true,
        };
        this.service.updateanalysetById(id, obj).subscribe((res: any) => {
          console.log(res);
          this.toaster.success(res.message, 'Success');
          if (res.message === 'report share successfully.') {
            this.toaster.success(res.message, 'Success');
            this.getallreports();
          }
        });
      }
    });
  }

  onclickTab(tab: string) {
    this.activeTab = tab;
  }




  isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }


  getAllMeetingDatesByMonthForAdmin(month: number, year: number) {
    this.isLoading = true;
    const clientId = parseInt(sessionStorage.getItem("ClientId")!, 10);
    const userID = JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id
    this.api.getMeetingsByMonthForAdmin(clientId, month, userID, year).subscribe({
      next: (res: any) => {
        this.allDates = res.data;
        this.allDates.sort((a: string, b: string) => {
          return new Date(a).getTime() - new Date(b).getTime();
        });

        if (this.allDates.length > 0) {
          this.getEventOnDateForAdmin(this.allDates[0]);
        }
        // this.getEventOnDateForAdmin(this.allDates[0])
        this.isLoading = false;
        this.isDataLoaded = new Observable((subscriber) => {
          subscriber.next(this.allDates);
        });
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => { },
    });
  }

  getEventOnDateForAdmin(date: any) {
    const clientId = parseInt(sessionStorage.getItem("ClientId")!, 10);
    this.api.getEventOnDateForAdmin(clientId, date, JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id).subscribe({
      next: (res) => {
        this.reminders = res.data;
      }, error: (err) => { console.log(err) }, complete: () => { }
    })
  }

  modelChangeFn(event: any) {

  }
  openMeeting(link: string) {
    window.open(link, '_blank');
  }
  getAllMeeting() {
    this.service.getAllOnetoOneInterview().subscribe({
      next: (res: any) => {
        console.log(res);
        this.allUser = res.data;
      }, error: (err: any) => {
        console.log(err);
      }, complete: () => { }

    })
  }

  formatTime(time: string): string | null {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return this.datePipe.transform(date, 'hh:mm a');
  }

  getAllMeetingDatesByMonth(month: number, year: number): void {
    this.service.getMeetingsDateByMonth(month, year, JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id).subscribe({
      next: (res: any) => {
        this.allDates = res.data;
        console.log(res.data);
        this.isDataLoaded = new Observable((subscriber) => {
          subscriber.next(this.allDates);
        });
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => { },
    });
  }

  onDateSelected(selectedDate: Date | null): void {
    if (selectedDate) {
      this.selected = selectedDate;
      const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');
      // if(this.typeOfUser===0){
      this.getEventOnDateForAdmin(formattedDate);
      // }
      // else{
      //   this.getEventOnDateByUserID(formattedDate);
      // }
    }
  }

  onMonthSelected(event: Date): void {
    // if(this.typeOfUser===0){
    this.getAllMeetingDatesByMonthForAdmin(event.getMonth() + 1, event.getFullYear());
    // }
    // this.getAllMeetingDatesByMonth(event.getMonth() + 1, event.getFullYear());
  }

  onYearSelected(event: Date): void {
    // this.getAllMeetingDatesByMonth(event.getMonth() + 1, event.getFullYear());
  }


  getEventOnDateByUserID(date: any) {
    this.service.getEventOnDateByUserID(date, JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id).subscribe({
      next: (res) => {
        this.reminders = res.data;
      }, error: (err) => { console.log(err) }, complete: () => { }
    })
  }

  createGroups() {
    const dialogRef = this.dialog.open(CreateGroupComponent, {
      width: '1100px',
      height: '700px',
      disableClose: true,
      data: { name: 'createGroup' }
    });
    dialogRef.afterClosed().subscribe(() => {
      // this.getAllFocusGroup();
    })

  }

  openMeetingInBrowser(link: string) {
    window.open(link, '_blank');
  }

  dateClass = (date: Date): MatCalendarCellCssClasses => {
    let isHighlighted = false;
    isHighlighted = this.allDates.some(
      (data: any) =>
        dayjs(data).format('DD/MM/YYYY') ==
        dayjs(date).format('DD/MM/YYYY')
    );
    return isHighlighted ? 'highlightDate' : '';
  };

  toggleDisplay() {
    this.isTableVisible = !this.isTableVisible;
  }

  openPopup2(): void {
    const dialogRef = this.dialog.open(PhasetwoComponent, {
      width: '550px',
      height: '400px',
      disableClose: true,
      data: { name: 'Survey List' },
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  getAllReminderSurveys(clientId: number) {
    this.service.getAllReminderSurveyByClientId(clientId).subscribe({
      next: (res) => {
        this.reminderSurveyList = res.data;
      }, error: (err) => { console.log(err) }, complete: () => { }
    });
  }

  editUser(userId: number) {
    console.log(userId);
    
    const dialogRef = this.dialog.open(CreateUserComponent, {
      width: '800px',
      height: '600px',
      disableClose: true,
      data: { name: 'edit-user', id: userId ,  isConsultant:true },
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}
