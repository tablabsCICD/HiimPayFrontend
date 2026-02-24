import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'; 
import { ToastrService } from 'ngx-toastr';
import { TouchpointService } from '../../../services/touchpoint.service';

@Component({
  selector: 'app-createtouchpoint',
  templateUrl: './createtouchpoint.component.html',
  styleUrl: './createtouchpoint.component.css'
})
export class CreatetouchpointComponent implements OnInit{
  SurveyId: number = 0;
  buttonName: any = 'Create stage';
  createTouchpointStageForm!: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
  private dialogRef: MatDialogRef<CreatetouchpointComponent>, 
  private fb: FormBuilder,
  private tostr: ToastrService,
  private service:TouchpointService) {
    if(data){
      this.buttonName='Update stage';
    }
    else{
      this.buttonName='Create stage';
    }
  }

  ngOnInit(): void {
    if(this.buttonName==='Update stage'){
      console.log('check'+this.data.stageId)
      this.getTouchpointStageById(this.data.stageId);
    }
    this.createTouchpointStageForm = this.fb.group({
      stageName: ['', Validators.required],
      loggedUserId: [''],
    });
  }

  onCreateStage(){
    if(this.buttonName==='Create stage'){
      if(this.createTouchpointStageForm.valid){
        const form = this.createTouchpointStageForm.value;
        const obj = {
          stageName:form.stageName,
          loggedUserId: JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id,
        }
        this.service.createTouchPointStage(obj).subscribe({next:(res)=>{
          this.tostr.success(res.message,'Success');
          this.onClose();
        },error:(err)=>{console.log(err)},complete:()=>{}})
      }
      else{
        this.createTouchpointStageForm.markAllAsTouched();
      }
    }
    else if(this.buttonName==='Update stage'){
      if(this.createTouchpointStageForm.valid){
        const form = this.createTouchpointStageForm.value;
        const obj = {
          stageName:form.stageName,
          loggedUserId: JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id,
        }
        this.service.updateTouchpointStageById(this.data.stageId,obj).subscribe({next:(res)=>{
          this.tostr.success(res.message,'Success');
          this.onClose();
        },error:(err)=>{console.log(err)},complete:()=>{}})
      }
      else{
        this.createTouchpointStageForm.markAllAsTouched();
      }
    }
  }

  getTouchpointStageById(stageId:number){
    this.service.getTouchpointStageById(stageId).subscribe({next:(res)=>{
      const form=res.data;
      this.createTouchpointStageForm.patchValue({
        stageName:form.stageName,
      })
    },error:(err)=>{console.log(err)},complete:()=>{}})
  }

  isNumber(evt: any) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onClose() {
    this.dialogRef.close();
  }

}
