import { Component, OnInit } from '@angular/core';
import {MatDialog } from '@angular/material/dialog';
import { CreateComponent } from '../../../project/Components/survey/create/create.component'; 
import { ToastrService } from 'ngx-toastr';
import { SurveyApiService } from '../../../project/Components/survey/service/survey-api.service'; 
@Component({
  selector: 'app-sup-stage-list',
  templateUrl: './sup-stage-list.component.html',
  styleUrl: './sup-stage-list.component.css'
})
export class SupStageListComponent {
  stageList:any;

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
