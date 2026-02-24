import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SurveyApiService } from '../../service/survey-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-survey-create',
  templateUrl: './survey-create.component.html',
  styleUrl: './survey-create.component.css'
})
export class SurveyCreateComponent implements OnInit {
  SurveyId: number = 0;
  buttonName: any = 'Create ';
  createSurveyForm!: FormGroup;
  isChecked: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<SurveyCreateComponent>, private fb: FormBuilder, private api: SurveyApiService, private tostr: ToastrService) {
    if (data) {
      this.SurveyId = data.surveyId;
      this.buttonName = 'Update survey'
    }
    // else {
    //   this.buttonName = 'Create survey'
    // }
  }

  ngOnInit(): void {
    console.log(this.SurveyId);
    
    this.createSurveyForm = this.fb.group({
      survey_name: ['', [Validators.required]],
      survey_Type: [''],
      survey_description: [''],
      endDescription : [''],
      addInJourneyMap:[false],
   
     
      stages: this.fb.array([])
    });

    if (this.SurveyId > 0) {
      this.getSurveyByClientId();
    }
  }

  stages(): FormArray {
    return this.createSurveyForm.get('stages') as FormArray;
  }
  addRow() {
    const formControl = new FormControl('');
    this.stages().push(formControl);
  }

  addRows(value: string = ''): void {
    const formControl = new FormControl(value, Validators.required);
    this.stages().push(formControl);
  }

  deleteRow(i: number) {
    this.stages().removeAt(i)
  }

  onClose() {
    this.dialogRef.close();
  }

  // isNumber(evt: any) {
  //   evt = (evt) ? evt : window.event;
  //   var charCode = (evt.which) ? evt.which : evt.keyCode;
  //   if (charCode > 31 && (charCode < 48 || charCode > 57)) {
  //     return true;
  //   }
  //   return false;
  // }

  handleChange(event: any) {
console.log(event);

  }
  onSubmit() {
console.log(this.createSurveyForm.value);

    if (this.buttonName === 'Create ') {
      if (this.createSurveyForm.valid) {
        const form = this.createSurveyForm.value;
        const stagesData = form.stages && form.stages.length > 0 ? form.stages : null;
        const assignmentToCLient = {
          created_date:new Date(),
          survey_name: form.survey_name,
          survey_Type: form.survey_Type,
          survey_description: form.survey_description,
          endDescription : form.endDescription,
          createdForClientId: '',
          
          addInJourneyMap:form.addInJourneyMap,
          loggedUserId: JSON.parse(
            sessionStorage.getItem('currentLoggedInUserData')!
          ).id,
          id: this.SurveyId,
        }
        console.log(assignmentToCLient)        
        const obj = {
          assignmentToCLient,
          stages: stagesData
        }


        console.log(obj);
        this.api.createSurvey(obj).subscribe((res) => {
          if (res.success) {
            console.log(res.message);
            this.onClose();
            this.tostr.success(res.message);
          }
          else {
            this.tostr.error(res.message);
          }
        })
      }
      else {
        this.createSurveyForm.markAllAsTouched();
        this.tostr.error('Please enter required data');
      }
    }
    else if (this.buttonName === 'Update survey') {
      if (this.createSurveyForm.valid) {
        const form = this.createSurveyForm.value;
        const assignmentToCLient = {
          survey_name: form.survey_name,
          survey_Type: form.survey_Type,
          survey_description: form.survey_description,
          endDescription : form.endDescription,
          createdForClientId: '',
          loggedUserId: JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id,
          id: this.SurveyId,
        }
        const obj = {
          assignmentToCLient,
          stages: form.stages
        }
        console.log(obj);
        
        this.api.updateSurveyById(this.SurveyId, obj).subscribe((res) => {
          if (res.success) {
            this.onClose();
            this.tostr.success(res.message);
            this.createSurveyForm.reset();
          }
          else {
            this.tostr.error(res.message);
          }
        });
      }
      else {
        this.createSurveyForm.markAllAsTouched();
        this.tostr.error('Please enter required data');
      }
    }
    else{
      console.log("Something is wrong"); 
    }
  }

  getSurveyByClientId() {
    this.api.getSurveyById(this.SurveyId).subscribe((res) => {
      if (res.success) {
        const surveyData = res.data.assignmentToCLient;
        this.createSurveyForm.patchValue({
          survey_name: surveyData.survey_name,
          survey_Type: surveyData.survey_Type,
          survey_description: surveyData.survey_description,
          endDescription : surveyData.endDescription,
          createdForClientId: '',
          loggedUserId: JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id,
          id: this.SurveyId,
        });

        res.data.stages.forEach((stage: any) => {
          this.addRows(stage.stageName);
        });
      }
    });
  }
}
