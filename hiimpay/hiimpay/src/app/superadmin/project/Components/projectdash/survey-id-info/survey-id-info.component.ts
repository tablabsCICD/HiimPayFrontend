import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { ToastrService } from 'ngx-toastr';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-survey-id-info',
  templateUrl: './survey-id-info.component.html',
  styleUrl: './survey-id-info.component.css'
})
export class SurveyIdInfoComponent implements OnInit {
id:any;
isLoading: boolean = false;
isStatic:any;
clientId:any;
dataInfo:any;
  constructor(
    @Inject(DIALOG_DATA) public data: {clientId:number, isStaticSurvey: any, surveyName:any, id: number },
    private router: Router,
    private route: ActivatedRoute,
    private dialogRef: MatDialogRef<SurveyIdInfoComponent>,
    private service: ProjectService,
    private tosatr: ToastrService
  ) {}
ngOnInit(): void {
this.isStatic=this.data.isStaticSurvey
  this.id=this.data.id
  this.clientId= this.data.clientId
  console.log(this.clientId);
  console.log(this.isStatic);
  console.log(this.id);

this.getInfo();
}
getInfo(){
  this.service.getSurveyIdInfo(this.clientId,this.isStatic,this.id).subscribe({next:(res:any)=>{
    this.isLoading=false
    this.dataInfo=res.data;
    console.log(this.dataInfo);
    
  },error:(err:any)=>{console.log(err);
  },complete:()=>{}})
}
onClose(): void {
  this.dialogRef.close();
}

onClick(){
  this.onClose();
  let url = this.router.url.replace("project-dash", `chartReport/${this.data?.id}/${this.data?.surveyName}/${this.data?.isStaticSurvey}`);
  this.router.navigateByUrl(url);
}
}
