import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SurveyApiService } from '../service/survey-api.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent implements OnInit {
  showContainer: any;
  stageButton:any='';
  stageId:any;
  subPhaseId:any;
  subPhaseButton:any='';
  createStageForm!: FormGroup;
  createSubPhaseForm!: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<CreateComponent>, private fb: FormBuilder, private api: SurveyApiService, private toastr: ToastrService) {
    this.showContainer = data.id;
    if(data.id===1){
      if (data.stageId) {
        this.stageButton='Update stage';
        this.stageId=data.stageId;
      }
      else{
        this.stageButton='Create stage';
      }
    }else if(data.id===2){
      if (data.subPhaseId) {
        this.subPhaseButton='Update subphase';
        this.subPhaseId=data.subPhaseId;
      }
      else{
        this.subPhaseButton='Create subphase';
      }
    }
  }

  ngOnInit(): void {

    if(this.showContainer===1){
      this.createStageForm = this.fb.group({
        stageName: ['', Validators.required],
        description: [''],
        id: [''],
        loggedUserId: [''],
        surveyId: ['']
      });
      if(this.stageButton==='Update stage'){
        this.getStageById(this.stageId);
      }
    }
    else if(this.showContainer===2){
      this.createSubPhaseForm = this.fb.group({
        subPhaseName: ['', Validators.required],
        description: [''],
        id: [''],
        stageId: [''],
        loggedUserId: [''],
        surveyQuestionId: ['']
      });
      if(this.subPhaseButton==='Update subphase'){
        this.getSubPhaseById(this.subPhaseId);
      }
    }
  }

  getStageById(stageId:number){
    this.api.getStageById(stageId).subscribe((res)=>{
      if(res.success){
        const form = res.data;
        this.createStageForm.patchValue({
          stageName:form.stageName,
          description:form.description,
          id:1,
          loggedUserId:1,
          surveyId:1,
        })
      }
    });
  }

  getSubPhaseById(subPhaseId:number){
    this.api.getSubphaseById(subPhaseId).subscribe((res)=>{
      if(res.success){
        const form = res.data;
        this.createSubPhaseForm.patchValue({
          subPhaseName:form.subPhaseName,
          description:form.description,
          id: 1,
          stageId:1,
          loggedUserId:1,
          surveyQuestionId:[1] ,
        })
      }
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  onStageSubmit() {
    if(this.stageButton==='Create stage'){
      if (this.createStageForm.valid) {
        const form = this.createStageForm.value;
        const obj = {
          stageName: form.stageName,
          description: form.description,
          id: 1,
          loggedUserId: 1,
          surveyId: 1
        }
        console.log('stage data' + obj)
        this.api.createStage(obj).subscribe((res) => {
          if (res.success) {
            this.toastr.success(res.message);
            this.onClose();
          }
          else {
            this.toastr.error(res.message);
          }
        })
      }
      else{
        this.createStageForm.markAllAsTouched();
      }
    }
    else if(this.stageButton==='Update stage'){
      if(this.createStageForm.valid) {
        const form = this.createStageForm.value;
        const obj = {
          stageName: form.stageName,
          description: form.description,
          id: 1,
          loggedUserId: 1,
          surveyId: 1,
        }
        
        this.api.updateStageById(this.stageId,obj).subscribe((res)=>{
          if(res.success){
            this.toastr.success(res.message);
            this.onClose();
            this.createStageForm.reset();
          }
          else{
            this.toastr.error(res.message);
          }
        });
      }
      else{
        this.createStageForm.markAllAsTouched();
      }
    }
  }


  onSubphaseSubmit() {
    if(this.subPhaseButton==='Create subphase'){
      if (this.createSubPhaseForm.valid) {
        const form = this.createSubPhaseForm.value;
        const obj = {
          subPhaseName: form.subPhaseName,
          description:form.description,
          id: 1,
          stageId:1,
          loggedUserId:1,
          surveyQuestionId:[1]
        }
  
        console.log(obj);
        this.api.createSubphase(obj).subscribe((res)=>{
          if(res.success){
            this.toastr.success(res.message);
            this.onClose();
          }
          else{
            this.toastr.error(res.message);
          }
        })
      }
      else{
        this.createSubPhaseForm.markAllAsTouched();
      }
    }
    else if(this.subPhaseButton==='Update subphase'){
      if(this.createSubPhaseForm.valid){
        const form = this.createSubPhaseForm.value;
        const obj = {
          subPhaseName: form.subPhaseName,
          description:form.description,
          id: 1,
          stageId:1,
          loggedUserId:1,
          surveyQuestionId:[1]
        }

        this.api.updateSubPhasebyId(this.subPhaseId,obj).subscribe((res)=>{
          if(res.success){
            this.toastr.success(res.message);
            this.onClose();
            this.createSubPhaseForm.reset();
          }
          else{
            this.toastr.error(res.message);
          }
        });
      }
      else{
        this.createSubPhaseForm.markAllAsTouched();
      }
    }
  }
}
