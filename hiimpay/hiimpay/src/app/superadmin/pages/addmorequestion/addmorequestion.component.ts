import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from '../../project/services/project.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addmorequestion',
  templateUrl: './addmorequestion.component.html',
  styleUrl: './addmorequestion.component.css'
})
export class AddmorequestionComponent implements OnInit {

  curruntQuetionIds:any;
  fectchedQuestions:any;
  selectedQuestions: any[] = [];
  subPhaseId: any;
  subPhaseName: any;
  stageName: any;
  

  constructor(private dialogRef: MatDialogRef<AddmorequestionComponent>, @Inject(MAT_DIALOG_DATA) public data: any,private api:ProjectService,private toaster:ToastrService){}

  ngOnInit(): void {
    console.log(this.data)
    if (this.data && this.data.questionsAnswerResponseDtos) {
      this.curruntQuetionIds = this.data?.questionsAnswerResponseDtos?.map((q: any) => q.questionId);
      this.selectedQuestions = [...this.curruntQuetionIds];
      console.log(this.curruntQuetionIds);
      this.subPhaseId = this.data?.subphaseId;
      this.subPhaseName = this.data?.subPhaseName;
      this.stageName = this.data?.stageName;
    }
    this.getAllQuestions();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  getAllQuestions() {
    this.api.getAllQuestionsWIthOptions().subscribe({
      next: (res: any) => {
        this.fectchedQuestions = res?.data?.map((question: any) => {
          return {
            id: question?.questionId,
            question: question?.question,
            options: question?.options,
            questionType: question?.questionType,
            checked: this.curruntQuetionIds?.includes(question?.questionId)
          };
        });
      },
      error: (err: any) => console.log(err)
    });
  }

  searchQuestion(e: any) {
    const keyword = e.target.value.trim();
    if (keyword.length > 0) {
      this.api.searchQuestion(keyword).subscribe({
        next: (res: any) => {
          console.log(res);
          if (res.message === "question found." && res.data) {
            this.fectchedQuestions = res?.data?.map((question: any) => {
              return {
                id: question?.questionId,
                question: question?.question,
                options: question?.options,
                checked: this.curruntQuetionIds?.includes(question.questionId)
              };
            });
          } else {
            this.fectchedQuestions = [];
          }
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          if (err.error.message === "Question not found.") {
            this.fectchedQuestions = [];
          }
        }
      });
    } else {
      this.getAllQuestions();
    }
  }

  updateSelectedQuestions() {
    this.fectchedQuestions.forEach((question:any) => {
      if (this.curruntQuetionIds?.includes(question.id)) {
        question.checked = true;
      }
    });
  }

  toggleQuestionSelection(question: any) {
    if (question.checked) {
      this.selectedQuestions.push(question.id);
    } else {
      const index = this.selectedQuestions.indexOf(question.id);
      if (index > -1) {
        this.selectedQuestions.splice(index, 1);
      }
    }
  }

  onSubmit() {
    const obj ={
      surveyQuestionId:this.selectedQuestions
    }
    this.api.updateSurveyQuestions(this.subPhaseId,obj).subscribe({
      next: (res: any) => {
        // console.log('Questions submitted successfully', res);
        this.toaster.success(res.message);
        this.dialogRef.close();
      },
      error: (err: any) => console.log('Error submitting questions', err)
    });
  }

}
