import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GraphService } from '../../services/graph.service';
import { SearchService } from '../../services/search.service';
import { CreateUserComponent } from '../project-admin/create-user/create-user.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit {
  orderBy:any = 'desc'; 
  page:any = 1;
  size:any = 10;
  sortBy:any = 'id';
  p: number = 1;
  itemPerPage: number = 10;
  totalItems: any;
  details: any[] = [];
  isLoading:boolean=false;
  displayMesg:boolean=false;
  displayClientData: any;
  
constructor(private router:Router,private service:GraphService,private searchservice: SearchService,public dialog: MatDialog,) {}

ngOnInit(): void {
    // this.getAllSurveyAssignmentByClientID();
    this.displayClientData = JSON.parse(sessionStorage.getItem('ClientData')!);
    this.searchservice.sendResults().subscribe({
      next: (res: any) => {
        if (res.length == 0) {
            this.getAllSurveyAssignmentByClientID();
        } else {
          if (res.success) {
            this.details = res.data;
          } else {
            this.details = [];
          }
        }
      },
      error: (err: any) => { },
      complete: () => { },
    });
}
surveyName:any;
getAllSurveyAssignmentByClientID(){
  this.isLoading=true
    this.service.getAllSurveyAssignmentByClientID(sessionStorage.getItem("ClientId")).subscribe({next:(res)=>{
 
      if(res.message==="Failed to retrieve survey assignments."){
        this.isLoading=false
        this.displayMesg=true
      }else{
        this.details=res.data;

        this.isLoading=false
        this.totalItems=res.totalItems
        console.log(this.details);
      }
   
      
    },error:(err)=>{console.log(err)
      this.isLoading=false
      this.displayMesg=true
    },complete:()=>{}})
}

onClick(id: number, surveyName: any,isStaticSurvey:boolean) {   
  let url = this.router.url.replace("report", `chartReport/${id}/${surveyName}/${isStaticSurvey}`);
  this.router.navigateByUrl(url);
}

  pageChangeEvent(event: number) {
    this.page = event;
    this.getAllSurveyAssignmentByClientID();
  }

  navigateToDemographic(surveyId: number, isStaticSurvey: boolean,surveyName:any) {
    let url = this.router.url.replace("report", `survey-demographic`);
    console.log(surveyId,isStaticSurvey,surveyName);
    this.router.navigate([url], { queryParams: { surveyId: surveyId, isStaticSurvey: isStaticSurvey , surveyName:surveyName } });
  }
  
  stopPropagation(event: MouseEvent) {
    if ((<HTMLElement>event.target).classList.contains('ellipsis-button')) {
      event.stopPropagation();
    }
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
}
