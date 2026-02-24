import { Component, OnInit } from '@angular/core';
import {MatDialog } from '@angular/material/dialog';
import { CreateComponent } from '../create/create.component';
import { ToastrService } from 'ngx-toastr';
import { SurveyApiService } from '../service/survey-api.service';


@Component({
  selector: 'app-stagelist',
  templateUrl: './stagelist.component.html',
  styleUrl: './stagelist.component.css'
})
export class StagelistComponent implements OnInit {
stageList:any;
surveyDetails:any;

constructor(private dialog:MatDialog,private api:SurveyApiService,private tosatr:ToastrService){}

ngOnInit(): void {
  this.getAllStages();
}

getAllStages(){
  this.api.getAllStagesList().subscribe((res)=>{
    if(res.success){
      this.stageList=res.data;
    }
  });
}

getSurveyDetailsById(surveyId:number,isStatic:boolean){
  this.api.getSurveyDetailsById(surveyId,isStatic).subscribe({next:(res)=>{
    this.surveyDetails=res.data;
  },error:(err)=>{console.log(err)},complete:()=>{}})
}

editStage(stageId:number){
  const dialogRef = this.dialog.open(CreateComponent, {
    width: '400px',
    height: '400px',
    disableClose: true,
    data: { id: 1,stageId:stageId},
  });
  dialogRef.afterClosed().subscribe(() => {
    this.getAllStages();
  });
}

deleteStage(stageId:number){
  this.api.deleteStagebyId(stageId).subscribe((res)=>{
    if(res.success){
      this.tosatr.success(res.message);
      this.getAllStages();
    }
    else{
      this.tosatr.error(res.message);
    }
  })
}

pinStage(stageId:number){

}

openPopup(): void {
  const dialogRef = this.dialog.open(CreateComponent, {
    width: '400px',
    height: '400px',
    disableClose: true,
    data: { id: 1},
  })
}
  
}
