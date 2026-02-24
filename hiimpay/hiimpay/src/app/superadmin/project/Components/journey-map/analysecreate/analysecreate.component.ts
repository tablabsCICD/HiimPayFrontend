import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from '../../../services/project.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-analysecreate',
  templateUrl: './analysecreate.component.html',
  styleUrls: ['./analysecreate.component.css'],
})
export class AnalysecreateComponent implements OnInit {
  showcontainer: string = '';
  clientId: any;
  createForm!: FormGroup;
  addMatrixForm!: FormGroup;
  buttonName: any = 'Create';
  selectedOption: any = '';
  file: any;
  isSelectedFileValid: boolean = false;
  isFileTypeInvalid: boolean = false;
  formData: any;
  isLoading: any;
  details: any;
  orderBy: any = 'desc';
  page: any = 1;
  size: any = 10;
  sortBy: any = 'id';
  ids: any[] = [];
  formResponses: any;

  constructor(
    private dialogRef: MatDialogRef<AnalysecreateComponent>,
    private fb: FormBuilder,
    @Inject(DIALOG_DATA) public data: { name: string; id: number },
    private service: ProjectService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllSurveyByClientId();
    this.createForm = this.fb.group({
      surveyAssignment: this.fb.array([]),
      recommendedNextSteps: ['', [Validators.required]],
      executiveSummary: ['', [Validators.required]],
      exHighlights: ['', [Validators.required]],
      isSharedWithCPOC: [''],
      document: [''],
      description: ['', [Validators.required]],
    });

    if (this.data?.name === 'edit-report' && this.data.id !== null) {
      this.buttonName = 'Update';
      this.onEdit();
    }
  }

  surveyAssignment(): FormArray {
    return this.createForm.get('surveyAssignment') as FormArray;
  }

  addRow() {
    const dataItem = this.fb.group({
      monthYear: ['', Validators.required],
      value: ['', Validators.required],
    });
    this.surveyAssignment().push(dataItem);
  }

  onOptionChange(item: any, field: string, value: string) {
    if (!this.formResponses[item.id]) {
      this.formResponses[item.id] = {};
    }
    this.formResponses[item.id][field] = value;
  }

  onOwnerChange(item: any, event: any) {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.ids.push(item);
    } else {
      this.ids = this.ids.filter(id => id !== item);
    }
  }

  getallreports() {
    this.service.getAllanalyseById(sessionStorage.getItem('ClientId')).subscribe((res: any) => {
      this.details = res.data;
    });
  }

  getAllSurveyByClientId() {
    this.service.getAllWthSurveyByClientID(sessionStorage.getItem('ClientId')).subscribe({
      next: (res) => {
        if (res.message !== 'Failed to retrieve survey assignments.') {
          this.details = res.data;
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  createProject() {
    console.log(this.createForm.value)
    if (this.createForm.valid) {
      const form = this.createForm.value;
      const obj = {
        clientId: sessionStorage.getItem('ClientId'),
        description: form.description,
        document: this.file,
        isSharedWithCPOC: false,
        exHighlights: form.exHighlights,
        executiveSummary: form.executiveSummary,
        recommendedNextSteps: form.recommendedNextSteps,
        surveyAssignment: this.ids,
      };

      if (this.buttonName === 'Create') {
        this.service.createanalyse(obj).subscribe((res: any) => {
          this.getallreports()
          if (res.message === 'EXDiagnosticReport created successfully.') {
            this.toastr.success(res.message);
            this.getallreports()
            this.createForm.reset();
            this.onClose();
          }
        });
      } else if (this.buttonName === 'Update') {
        this.service.updateanalysetById(this.data.id, obj).subscribe((res: any) => {
          this.getallreports()
          if (res.message === 'EXDiagnosticReport updated successfully.') {
            this.toastr.success(res.message);
            this.createForm.reset();
            this.getallreports()
            this.onClose();
          }
        });
      }
    } else {
      this.createForm.markAllAsTouched();
    }
  }

  onEdit() {
    this.isLoading = true;
    this.service.getanalyseById(this.data.id).subscribe((res) => {
      console.log(res);
      
      const form = res.data;
      this.createForm.patchValue({
        clientId: sessionStorage.getItem('ClientId'),
        description: form.description,
        document: form.document,
        exHighlights: form.exHighlights,
        executiveSummary: form.executiveSummary,
        recommendedNextSteps: form.recommendedNextSteps,
        surveyAssignment: form.surveyAssignment,
      });
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  validateFile() {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];

    this.isSelectedFileValid = validTypes.includes(this.file.type);
    this.isFileTypeInvalid = !this.isSelectedFileValid;
    if (this.isSelectedFileValid) {
      const formData = new FormData();
      formData.append('profilePicture', this.file);
      this.formData = formData;
      this.service.saveeDoc(this.formData).subscribe({
        next: (val) => {
          this.file = val;
          console.log(this.file)
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }

  onFileBrowse(event: any) {
    const inputElement = event.target as HTMLInputElement;
    this.file = inputElement?.files?.[0]; 
    if (this.file) {
      console.log(this.file);
      this.validateFile();
    }
  }
}
