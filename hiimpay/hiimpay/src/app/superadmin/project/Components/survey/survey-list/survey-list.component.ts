import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SurveyCreateComponent } from './survey-create/survey-create.component';
import { SurveyApiService } from '../service/survey-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrl: './survey-list.component.css'
})
export class SurveyListComponent implements OnInit {
  surveyList:any;
  p: number = 0;
  page:number=1;
  totalPages: number = 1;
  size:number=10;
  orderBy:any='asc';
  sortBy:any='id';

  constructor(private dialog:MatDialog,private api:SurveyApiService,private toastr:ToastrService){}

  ngOnInit(): void {
    this.getSurveyList();
  }

  getSurveyList(){
    this.api.getAllSurveyPagination(this.p,this.size,this.orderBy,this.sortBy).subscribe((res)=>{
      if(res.success){
        this.surveyList=res.data;
        console.log(res.data);
        this.totalPages = Math.ceil(res.totalItems / this.size);
      }
    })
  }

  editSurvey(surveyId:number){
    const dialogRef = this.dialog.open(SurveyCreateComponent, {
      width: '700px',
      height: '700px',
      disableClose: true,
      data: { surveyId: surveyId},
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getSurveyList();
    });
  }

  deleteSurvey(surveyId:number){
    let obj = {
      "assignmentToCLient": {
        "active": false
      }
    }
    this.api.deleteSurveyById(surveyId,obj).subscribe((res)=>{
      console.log(res)
      if(res.success){
        this.toastr.success('Survey deleted successfully...!!');
      }
    })
  } 

  pinSurvey(surveyId:number){

  }

  openPopup(): void {
    const dialogRef = this.dialog.open(SurveyCreateComponent, {
      width: '850px',
      height: '650px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getSurveyList();
    });
  }

  onPageChange(pageNumber: number): void {
    this.p = pageNumber;
    this.getSurveyList();
  }

}
