import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../project/services/project.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-assign',
  templateUrl: './assign.component.html',
  styleUrl: './assign.component.css'
})
export class AssignComponent implements OnInit{
  items:any;
  surveyList:any;
  assignSurveyForm!:FormGroup;

  constructor(private dialogRef: MatDialogRef<AssignComponent>,@Inject(DIALOG_DATA) public data: {name: string,id:number},
   private router:Router,
   private route: ActivatedRoute,
   private service:ProjectService,
  private fb:FormBuilder,
  private tostr:ToastrService){}

  onClose(): void {
    this.dialogRef.close();
  }


  next(){
    this.dialogRef.close();
  }

ngOnInit(): void {
  this.getAllSurvey();
  this.assignSurveyForm = this.fb.group({
    clientId: ['', Validators.required],
    surveyId: ['', Validators.required],
    id: [''],
    phaseId:[''],
    loggedUserId: [''],
  });

  
// console.log(this.data.id);
  this.service.getSurveyByID(this.data.id).subscribe({
    next: (res: any) => {
      this.items = res.data;
      console.log(res);
      
    },
    error: (err: any) => {
      console.log(err);
    },
    complete: () => {},
  });
}

getAllSurvey(){
  this.service.getAllSurvey().subscribe((res)=>{
    if(res.success){
      this.surveyList=res.data;
    }
    else{
      console.log(res.message);
    }
  },((error)=>{
    console.log('error');
  }))
}

surveyId(event: any) {
  const surveyId = event.target.value;
  this.assignSurveyForm.get('surveyId')?.setValue(surveyId);
}

 assignSurvey(){
  const obj = this.assignSurveyForm.value;
  if (obj.surveyId) {
    obj.clientId = this.data.id;
    obj.id = 1;
    obj.phaseId = 1;
    obj.loggedUserId = 1;
    this.service.assignSurveyToClient(obj).subscribe((res) => {
      if (res.success) {
        this.tostr.success(res.message);
        this.onClose();
      } else {
        this.tostr.error(res.message);
      }
    })
  } else {
    this.tostr.error('Please select a survey.');
  }
}

}
