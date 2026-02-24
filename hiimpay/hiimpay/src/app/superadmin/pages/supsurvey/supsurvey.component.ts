import { Component, OnInit } from '@angular/core';
import { CreateSurveyComponent } from './sup-surveylist/create-survey/create-survey.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../project/services/project.service'; 
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-supsurvey',
  templateUrl: './supsurvey.component.html',
  styleUrl: './supsurvey.component.css'
})
export class SupsurveyComponent implements OnInit {
  sendSurvey: any = true;
  show: any = true;
  send: any = false;
  assign: any = false;
  info: any = false;
  main: any = true;
  total: any;
  items: any;
  completed: any;
  cancelled: any;
  pending: any;
  assignSurveyForm!: FormGroup;
  usersSelect!: FormGroup;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private service: ProjectService,
    private fb:FormBuilder,
    private tosatr:ToastrService
  ) {}
  toppings = new FormControl('');

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  ngOnInit(): void {
    const id = sessionStorage.getItem('ClientId');

    // this.service.getCount(id).subscribe((res: any) => {
  
    //   if (res.success) {
    //     this.total = res.data.total;
    //     this.completed = res.data.completed;
    //     this.pending = res.data.pending;
    //     this.cancelled = res.data.cancelled;
    //   } else {
    //   }
    // });

    // this.service.getSurveyByID(sessionStorage.getItem('ClientId')).subscribe({
    //   next: (res: any) => {
   
    //     this.items = res.data;
     
    //   },
    //   error: (err: any) => {
    //     console.log(err);
    //   },
    //   complete: () => {},
    // });

    // this.assignSurveyForm=this.fb.group({

    // })


  }

  onsend() {
    this.sendSurvey = false;
    this.send = true;
  }
  openPopup(): void {
    const dialogRef = this.dialog.open(CreateSurveyComponent, {
      width: '450px',
      height: '500px',
      disableClose: true,
      data: { name: 'create-project' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The popup was closed');
      this.router.navigate(['../assign-question-to-survey'], {
        relativeTo: this.route,
      });
    });
  }
  share: any[] = [
    {
      id: '1',
      name: 'Name 1',
      type: 'FUDS',
      description: 'survey demo descrition',
      date: '2022-01-01',
      createdby: 'kate',
      status: 'Complete',
    },
    {
      id: '2',
      name: 'Name 2',
      type: 'FUDS',
      description: 'survey demo descrition',
      date: '2022-01-01',
      createdby: 'kate',
      status: 'Pending',
    },
  ];
  sharesurvey: any[] = [
    {
      id: '1',
      name: 'Send Your Surveys',
      type: 'FUDS',
      description: 'survey demo descrition',
      date: '2022-01-01',
      createdby: 'kate',
      status: 'Complete',
    },
    {
      id: '2',
      name: 'Focus Group',
      type: 'FUDS',
      description: 'survey demo descrition',
      date: '2022-01-01',
      createdby: 'kate',
      status: 'Pending',
    },
  ];
  cardsCircle: any[] = [
    { name: 'Total Survey', count: '2' },
    { name: 'Completed survey', count: '2' },
    { name: 'Pending survey', count: '2' },
    { name: 'Cancelled survey', count: '2' },
  ];
  infoDetails() {
    this.sendSurvey = false;
    this.assign = false;
    this.show = false;
    this.main = false;
    this.info = true;
  }
  check() {
    console.log('test');
    this.main = false;
    this.sendSurvey = false;
    this.assign = true;
    this.show = false;
    const obj = {
      clientEmployeesWithSurveys: [1, 2],
      clientId: sessionStorage.getItem('ClientId'),
      end_date: '2024-04-16T09:01:44.355Z',

      instruction: 'Test Purpiose',
      loggedUserId: 1,
      phaseId: 0,
      startDate: new Date(),
      status: 'active',
      surveyId: 1,
      whyThisIsImportant: 'Madatory',
    };
    this.service.saveSurvey(obj).subscribe({
      next: (res: any) => {
        console.log(res);
      },
      error: () => {},
      complete: () => {},
    });
  }

  getSurveyByStatus(status:any){
    this.service.getSurveytListByStatus(status).subscribe((res:any)=>{
      
      if(res.success){
        console.log('Client by status=>'+res.data)
        console.log(res.message);
      }
      else{
        this.tosatr.error(res.message);
      }
    },(error)=>{
      this.tosatr.error('Clients Not Found..!!');
    })
  }
}
