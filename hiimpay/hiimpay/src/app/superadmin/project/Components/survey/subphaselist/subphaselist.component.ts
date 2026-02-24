import { Component, OnInit } from '@angular/core';
import {MatDialog } from '@angular/material/dialog';
import { CreateComponent } from '../create/create.component';
import { SurveyApiService } from '../service/survey-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-subphaselist',
  templateUrl: './subphaselist.component.html',
  styleUrl: './subphaselist.component.css'
})
export class SubphaselistComponent implements OnInit {
subphaseList:any;

constructor(private dialog:MatDialog,private api:SurveyApiService,private tosatr:ToastrService){}

ngOnInit(): void {
  this.getAllSubphases();
}

getAllSubphases(){
  this.api.getAllSubPhasesList().subscribe((res)=>{
    if(res.success){
      this.subphaseList=res.data;
    }
  });
}

editSubphase(subPhaseId:number){
  const dialogRef = this.dialog.open(CreateComponent, {
    width: '400px',
    height: '400px',
    disableClose: true,
    data: { id: 2 ,subPhaseId:subPhaseId},
  });
  dialogRef.afterClosed().subscribe(() => {
    this.getAllSubphases();
  });
}

deleteSubphase(subPhaseId:number){
  this.api.deleteSubphaseById(subPhaseId).subscribe((res)=>{
    if(res.success){
      this.tosatr.success(res.message);
      this.getAllSubphases();
    }
    else{
      this.tosatr.error(res.message);
    }
  })
}

pinSubphase(subPhaseId:number){

}


openPopup(): void {
  const dialogRef = this.dialog.open(CreateComponent, {
    width: '400px',
    height: '400px',
    disableClose: true,
    data: { id: 2},
  });
}


}
