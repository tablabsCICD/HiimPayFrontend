import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from '../../../services/project.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-surveyresponses',
  templateUrl: './surveyresponses.component.html',
  styleUrls: ['./surveyresponses.component.css']
})
export class SurveyresponsesComponent implements OnInit {

  @Input() surveyResponses: any[] = [];
  surveyassignmentId: any;
  surveyName : any;
  isLoading: boolean = false;
  selectedTab: string = 'MCQ';
  checkDownloadExcelSpinner : boolean = false;

  tabsdata: any[] = [
    { name: 'MCQ', clicked: true },
    { name: 'Descriptive', clicked: false }
  ];

  constructor(private dialogRef: MatDialogRef<SurveyresponsesComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private api: ProjectService, private toaster : ToastrService) {}

  ngOnInit(): void {
    if (this.data) {
      this.surveyassignmentId = this.data?.id;
      this.surveyName = this.data?.name;
    }
    this.isLoading = true;
    this.api.getAllSurveyResponseDetailsByAssignmentId(this.surveyassignmentId).subscribe({
      next: (res) => {
        this.surveyResponses = res.data;
        this.isLoading = false;
      },
      error: (err) => { console.log(err); this.isLoading = false; },
      complete: () => {}
    });
  }

  getOptions(item: any): string[] {
    console.log(this.surveyResponses)
    return Object.keys(item.optionsWiseCount);
  }

  getMCQResponses(): any[] {
    return this.surveyResponses.filter(item => {
      const questionType = item.question.typeOfQuestion.toLowerCase();
      return questionType === 'mcq' || questionType === 'reasonforexit' || questionType === 'enps' || questionType === 'both';
    });
  }
  

  getDescriptiveResponses(): any[] {
    const allowedTypes = ['descriptive', 'both'];
    return this.surveyResponses.filter(item => 
      allowedTypes.includes(item.question.typeOfQuestion.toLowerCase())
    );
  }

  downloadExcelFormat() {
    this.checkDownloadExcelSpinner = true;
    this.api.getExcelForDescriptiveResponsesOfSurveyByAssignmentId(this.surveyassignmentId).subscribe((blob: Blob) => {

      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = this.surveyName+'descriptive_responses.xlsx'; 
      a.click();
      this.checkDownloadExcelSpinner = false;
      window.URL.revokeObjectURL(url);
    }, error => {
      this.toaster.error('Error downloading the file')
      console.error('Error downloading the file', error);
      this.checkDownloadExcelSpinner = false;
    });
  }
  
  

  onClose(): void {
    this.dialogRef.close();
  }

  onTabClick(selectedTab: any) {
    this.tabsdata.forEach(tab => tab.clicked = false);
    selectedTab.clicked = true;
    this.selectedTab = selectedTab.name;
  }
}
