import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AnalysecreateComponent } from './analysecreate/analysecreate.component';
import { ToastrService } from 'ngx-toastr';
import { DeleteComponent } from '../../../pages/delete/delete.component';

import { Chart, ChartConfiguration } from 'chart.js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-journey-map',
  templateUrl: './journey-map.component.html',
  styleUrl: './journey-map.component.css',
})
export class JourneyMapComponent implements OnInit {
  viewMore: boolean = false;
  share: Boolean = false;
  coCreate: Boolean = false;
  analyse: boolean = false;
  isLoading: boolean = false;
  isCpoc: boolean = false;
  data: any;
  msg: any;
  btnDisplay:boolean=false;
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
  savepdf:any;
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
  visibilityOn:boolean=false;
  display1: any;
  display2: any;
  feedbackForm: FormGroup;
  constructor(
    private service: ProjectService,
    private dialog: MatDialog,
    private router: Router,
    private toaster: ToastrService
    ,private fb: FormBuilder,
  ) {
    this.feedbackForm = this.fb.group({
      feedback: ['', Validators.required],
      rate: [0, Validators.required]
    });
  }

  ngOnInit(): void {
setTimeout(() => {
  this.isLoading=true
  this.isCpoc = sessionStorage.getItem('isCpoc') == 'true';
  this.displayClientData = JSON.parse(sessionStorage.getItem('ClientData')!);
  this.id = JSON.parse(sessionStorage.getItem('ClientData')!).id;
  this.getClientById();
  this.listen('Listen');
  this.getAllCocreate();
  this.getallreports();
  this.getAllListenCount();
  this.getAllListenList();
}, 200);

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
      this.visibleToClient2=true;
      this.toaster.success('Feedback form is visible to client succesfully..!');
    });
  }
  openInvoice(id: any) {
    this.service.getanalyseById(id).subscribe((res:any)=>{
this.savepdf=res.data;
const responseByteData = this.savepdf.document ;
const url = responseByteData;
window.open(url)
    })
  }
  doNotShareFeedbackForm() {
    console.log('Not sharing feedback form');
    const obj = {
      isSharedFeedback: false,
    };
    this.service.updateclientByID(this.id, obj).subscribe((res: any) => {
      console.log(res);
        this.visibleToClient2=false;
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
      this.visibleToClient=true;
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
      this.visibleToClient=false;
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

        this.updateBarChartData(this.listencount);
      });
  }
  listen(tab: string) {
    this.viewMore = true;
    this.share = false;
    this.coCreate = false;
    this.analyse = false;
    this.activeTab = tab;
  }
  Analyse(tab: string) {
    this.viewMore = false;
    this.share = false;
    this.coCreate = false;
    this.analyse = true;
    this.activeTab = tab;
  }
  displayShare(){
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
    this.displayShare()
  }
  cocreate(tab: string) {
    this.viewMore = false;
    this.share = false;
    this.analyse = false;
    this.coCreate = true;
    this.activeTab = tab;
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
  feedback:any;
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

  updateBarChartData(data: any) {
    console.log(data);

    console.log(Object.values(data));

    this.barChartData = {
      labels: Object.keys(data),
      datasets: [
        {
          data: Object.values(data),
          backgroundColor: '#103a7f',
          label: 'Score',
        },
      ],
    };
  }
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: '#103a7f',
      },
    ],
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

  confirmSelection(rate: any) {
    console.log(rate);
    this.rate = rate;
    // console.log(this.rate);
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
        this.data = res.data;
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
      // this.getAllMatrixData();
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
          this.toaster.success(res.message, 'Success');
          if (res.message === 'Metrics deleted successfully.') {
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

  activeTab: any;
  onclickTab(tab: string) {
    this.activeTab = tab;
  }
}
