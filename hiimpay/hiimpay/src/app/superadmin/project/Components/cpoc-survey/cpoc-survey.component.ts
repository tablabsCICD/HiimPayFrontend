import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../../client-employee/service/employee.service';
import { Router } from '@angular/router';
import { SearchuserService } from '../../../../client-employee/service/searchuser.service';
import { Subscription, interval } from 'rxjs';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-cpoc-survey',
  templateUrl: './cpoc-survey.component.html',
  styleUrl: './cpoc-survey.component.css'
})
export class CpocSurveyComponent implements OnInit {
  attempted:any=0;
  notAttempted:any=0;
  items: any[] = [];
  orderBy:any = 'desc'; 
  page:any = 1;
  size:any =10;
  sortBy:any = 'id';
  p: number = 1;
  itemPerPage: number = 10;
  totalItems: number = 10;
  total:any;
  attemptedCount:any;
  notAttemptedCount:any;
  selectedCard:any = 'all';
  private intervalSubscription: Subscription | undefined;


  constructor(private api:EmployeeService,private router: Router, private searchservice:SearchService){}

  ngOnInit(): void {
    this.api.getCountByClientEmpId(JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id).subscribe({next:(res)=>{
      this.total=res.data.total;
      this.attempted=res.data.attempted;
      this.notAttempted=res.data.notAttempted;
    },error:(err)=>{console.log(err);},complete:()=>{}});
 
    this.fetchDataBasedOnFilter();

    this.searchservice.sendResults().subscribe({
      next: (res: any) => {
        console.log(res);
        
        if (res.length == 0) {
          this.getAllAssignedSurveyByUser();
        } else {
          console.log('executed from cpoc')
          if (res.success) {
            this.items = res.data;
          } else {
            this.items = [];
          }
        }
      },
      error: (err: any) => {},
      complete: () => {},
    });
    // this.intervalSubscription = interval(5000).subscribe(() => {
    //   this.fetchAndUpdateData();
    // });
  }
  
  fetchDataBasedOnFilter(): void {
    if (this.selectedCard === 'all') {
      this.getAllAssignedSurveyByUser();
    } else {
      this.getSurveysByStatus(this.selectedCard);
    }
  }

  getAllAssignedSurveyByUser(){
    this.api.getAllAssignedSurveyByClientEmpId(JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id ,this.page - 1, this.size, this.sortBy, this.orderBy).subscribe({next:(res)=>{
      this.items=res.data;
      this.totalItems=res?.totalItems;
    },error:(err)=>{console.log(err)},complete:()=>{}})
  }

  pageChangeEvent(event: number) {
    this.page = event;
    this.getAllAssignedSurveyByUser();
  }

  getSurveysByStatus(status:any){
    this.selectedCard = status;
    this.page=1
    if(status==='all'){
      this.getAllAssignedSurveyByUser();
      return;
    }
    this.api.getAssignedSurveyByStatus(JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id,this.page - 1, this.size, this.sortBy, this.orderBy,status).subscribe({next:(res)=>{
      this.items=res.data;
      this.totalItems=res?.totalItems;
    },error:(err)=>{console.log(err)},complete:()=>{}})
  }

  capitalizeFirstLetter(value: string): string {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  onSurveyStart(id: number): void {
    let url = this.router.url.replace("clientsurvey", `client-survey-res/${id}`);
    this.router.navigateByUrl(url);
  }

  relativePercentage(statusCount: any) {
    return (statusCount / this.total) * 100;
  }

  // fetchAndUpdateData(): void {
  //   this.api.getCountByClientEmpId(JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id).subscribe({
  //     next: (res) => {
  //       if (this.total !== res.data.total || this.attempted !== res.data.attempted || this.notAttempted !== res.data.notAttempted) {
  //         this.total = res.data.total;
  //         this.attempted = res.data.attempted;
  //         this.notAttempted = res.data.notAttempted;
  //       }
  //     },
  //     error: (err) => { console.log(err); },
  //     complete: () => {}
  //   });

  //   if (this.selectedCard === 'all') {
  //     this.api.getAllAssignedSurveyByClientEmpId(JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id, this.page - 1, this.size, this.sortBy, this.orderBy).subscribe({
  //       next: (res) => {
  //         if (JSON.stringify(this.items) !== JSON.stringify(res.data)) {
  //           this.items = res.data;
  //           this.totalItems = res?.totalItems;
  //         }
  //       },
  //       error: (err) => { console.log(err); },
  //       complete: () => {}
  //     });
  //   } else {
  //     this.api.getAssignedSurveyByStatus(JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id, this.page - 1, this.size, this.sortBy, this.orderBy, this.selectedCard).subscribe({
  //       next: (res) => {
  //         if (JSON.stringify(this.items) !== JSON.stringify(res.data)) {
  //           this.items = res.data;
  //         }
  //       },
  //       error: (err) => { console.log(err); },
  //       complete: () => {}
  //     });
  //   }
  // }
  ngOnDestroy(): void {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

}
