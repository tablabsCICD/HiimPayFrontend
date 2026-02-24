import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../service/employee.service';
import { GenericDialogComponent } from '../generic-dialog/generic-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';

import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-survey-response',
  templateUrl: './survey-response.component.html',
  styleUrl: './survey-response.component.css',

})
export class SurveyResponseComponent implements OnInit {
  questionnaireForm!: FormGroup;
  filterdQuestions!: FormGroup;
  filter: any;
  surveyAssignmentId: any;
  rankquestion: any[] = [];
  data: any;
  totalQuestions: number = 0;
  attemptedQuestions: number = 0;
  unattemptedQuestions: number = 0;
  selectedEmojiIndex: any;
  questionForm!: FormGroup;
  dtos: any = [];
  instructions = [
    'First instruction here.',
    'Second instruction here.',
    'Third instruction here.',
  ];

  numbers: number[] = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
  ];

  exitSurveyList: string[] = [
    'Career change',
    'Compensation',
    'Further education',
    'Growth opportunities',
    'Health',
    'Interpersonal conflict',
    'Job Satisfaction',
    'Organisation purpose',
    'Personal/Family',
    'Promotion',
    'Relocation',
    'Work environment',
    'Work life balance',
    'Other'
  ];


  constructor(
    private route: ActivatedRoute,
    private api: EmployeeService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private tosatr: ToastrService,
    private router: Router,
    private location: Location
  ) {
    this.questionnaireForm = this.fb.group({ questions: this.fb.array([]) });
    this.filterdQuestions = this.fb.group({ questions: this.fb.array([]) });
  }

  SubphaseDesc: any;
  // ngOnInit(): void {
  //   this.surveyAssignmentId = +this.route.snapshot.paramMap.get('id')!;
  //   this.api.getSurveyBysurveyAssignmentId(this.surveyAssignmentId).subscribe({
  //     next: (res) => {
  //       this.data = res.data;
  //       console.log(this.data);
  //       let surveyQuestions: any = [];

  //       this.dtos = this.data.surveyWithDetailResponseDto?.dto;
  //     console.log(this.dtos);

  //       if (this.dtos && this.dtos.length > 0) {
  //         this.dtos.forEach((dto: any) => {
  //           const subphases = dto?.subphaseWithQuestionAnswerResponseDtos;
  //            this.SubphaseDesc=dto?.stageDescription;
  //           console.log(this.SubphaseDesc);

  //           if (subphases && subphases?.length > 0) {
  //             subphases.forEach((subphase: any) => {
  //               if (subphase?.questionsAnswerResponseDtos && subphase?.questionsAnswerResponseDtos?.length > 0) {
  //                 surveyQuestions = surveyQuestions?.concat(subphase?.questionsAnswerResponseDtos);
  //               }
  //             });
  //           }
  //         });
  //       }
  //       this.totalQuestions = surveyQuestions?.length;
  //       if (this.data?.surveyWithDetailResponseDto?.surveyName === 'Feel, Use, Do and See survey ') {
  //         this.totalQuestions = this.totalQuestions - 4
  //       }
  //       surveyQuestions.forEach((question: any) => {
  //         const questionGroup = this.fb.group({
  //           question: question,
  //           ansForDescriptive: new FormControl(null),
  //           answer: new FormControl(null),
  //           surveyQuestionId: question.questionId,
  //         });

  //         this.getSurveyDetailsFormArray().push(questionGroup);

  //         questionGroup.valueChanges.subscribe(() => {
  //           this.updateQuestionCounts();
  //         });

  //         if (question.questionType === 'Importance') {
  //           this.rankquestion.push(question);
  //         }
  //       });

  //       this.updateQuestionCounts();
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //     complete: () => { },
  //   });
  // }




  // ngOnInit(): void {
  //   this.surveyAssignmentId = +this.route.snapshot.paramMap.get('id')!;
  //   this.api.getSurveyBysurveyAssignmentId(this.surveyAssignmentId).subscribe({
  //     next: (res) => {
  //       this.data = res.data;
  //       console.log(this.data);

  //       const surveyQuestions =
  //         this.data.surveyWithDetailResponseDto.dto[0]
  //           .subphaseWithQuestionAnswerResponseDtos[0]
  //           .questionsAnswerResponseDtos;
  //       this.totalQuestions = surveyQuestions.length;
  //       surveyQuestions.forEach((question: any) => {
  //         this.getSurveyDetailsFormArray().push(
  //           this.fb.group({
  //             question: question,
  //             ansForDescriptive: new FormControl(null),
  //             answer: new FormControl(null),
  //             surveyQuestionId: question.questionAnswerId,
  //           })
  //         );
  //         if (question.questionType === 'Importance') {
  //           this.rankquestion.push(question);
  //         }
  //       });
  //       this.updateQuestionCounts();
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //     complete: () => { },
  //   });
  // }



  ngOnInit(): void {
    this.surveyAssignmentId = +this.route.snapshot.paramMap.get('id')!;
    this.api.getSurveyBysurveyAssignmentId(this.surveyAssignmentId).subscribe({
      next: (res) => {
        this.data = res.data;
        let surveyQuestions: any = [];

        this.dtos = this.data.surveyWithDetailResponseDto?.dto;

        if (this.dtos && this.dtos.length > 0) {
          this.dtos.forEach((dto: any) => {
            const subphases = dto?.subphaseWithQuestionAnswerResponseDtos;
            dto.stageDescription; // Make sure this is stored for display

            if (subphases && subphases?.length > 0) {
              subphases.forEach((subphase: any) => {
                if (subphase?.questionsAnswerResponseDtos && subphase?.questionsAnswerResponseDtos?.length > 0) {
                  surveyQuestions = surveyQuestions.concat(subphase.questionsAnswerResponseDtos.map((q: any) => {
                    return { ...q, stageDescription: dto.stageDescription };  // Attach stageDescription to questions
                  }));
                }
              });
            }
          });
        }

        this.totalQuestions = surveyQuestions.length;
        if (this.data?.surveyWithDetailResponseDto?.surveyName === 'Feel, Use, Do and See survey ') {
          this.totalQuestions = this.totalQuestions - 4
        }
        surveyQuestions.forEach((question: any) => {
          const questionGroup = this.fb.group({
            question: question,
            ansForDescriptive: new FormControl(null),
            answer: new FormControl(null),
            surveyQuestionId: question.questionId,
          });

          this.getSurveyDetailsFormArray().push(questionGroup);

          questionGroup.valueChanges.subscribe(() => {
            this.updateQuestionCounts();
          });

          if (question.questionType === 'Importance') {
            this.rankquestion.push(question);
          }
        });

        this.updateQuestionCounts();
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => { },
    });
  }


  updateQuestionCounts() {
    // console.log('execute')
    const controls = this.getSurveyDetailsFormArray().controls as FormGroup[];
    this.attemptedQuestions = controls.filter((questionGroup: FormGroup) => {
      const question = questionGroup.value.question;
      if (question.questionType === 'descriptive' && questionGroup.value.ansForDescriptive) {
        return true;
      }
      if ((question.questionType === 'mcq' || question.questionType === 'reasonForEXIT') && questionGroup.value.answer) {
        return true;
      }
      if (question.questionType === 'eNPS' && questionGroup.value.answer !== null) {
        return true;
      }
      return false;
    }).length;
    this.unattemptedQuestions = this.totalQuestions - this.attemptedQuestions;
  }
  mcqtype: any;


  getSurveyDetailsFormArray() {
    const allQuestions = this.questionnaireForm.get('questions') as FormArray;
    const allQuestionsForImportance = this.filterdQuestions.get('questions') as FormArray;

    // console.log(this.rankquestion);

    const filteredQuestions = allQuestions.controls.filter(
      (control: AbstractControl<any>) => control.value?.question?.questionType !== 'Importance'
    );


    while (allQuestions.length !== 0) {
      allQuestions.removeAt(0);
    }

    filteredQuestions.forEach((control: AbstractControl<any>) => {
      allQuestions.push(control);
    });

    // console.log(allQuestions);

    return allQuestions;

  }



  submitSurvey() {
    // console.log(this.data);
    const importanceLevels = [
      'Most important',
      'Important',
      'Slightly important',
      'Least important'
    ];

    const rankQuestionsWithImportance = this.rankquestion.map((question, index) => ({
      ansForDescriptive: question.ansForDescriptive,
      surveyQuestionId: question.questionAnswerId,
      answer: importanceLevels[index],
    }));

    const unansweredQuestions = (this.getSurveyDetailsFormArray().controls as FormGroup[]).filter(
      (questionGroup: FormGroup) => {
        const question = questionGroup.value.question;

         if (this.data?.surveyWithDetailResponseDto?.surveyName === 'EX Foundations Satisfaction Survey' && (question.questionType === 'descriptive' || question?.questionType === 'both')) {
          return false; 
        }
        
        if (question.questionType === 'descriptive' && !questionGroup.value.ansForDescriptive) {
          return true;
        }
        if ((question.questionType === 'mcq' || question.questionType === 'reasonForEXIT' || question.questionType === 'both') && !questionGroup.value.answer) {
          return true;
        }
        return false;
      }
    );

    if (unansweredQuestions.length > 0) {
      this.tosatr.error('Please answer all the questions before submitting the survey.');
      return;
    }

    const employeeAns = [...this.getSurveyDetailsFormArray().value.map(
      (val: any) => ({
        ansForDescriptive: val.ansForDescriptive,
        answer: val.answer,
        surveyQuestionId: val.surveyQuestionId,
      })),
    ...rankQuestionsWithImportance
    ]

    // console.log(employeeAns);

    const responseObject = {
      clientEmployeeId: JSON.parse(
        sessionStorage.getItem('currentLoggedInUserData')!
      ).id,
      clientId: this.data.assignmentToCLient.clientId,
      completion_date: new Date(),
      employeeAns: employeeAns,
      surveyAssignmentId: this.surveyAssignmentId,
      survey_assigned_date: this.data.assignmentToCLient.startDate,
      timeToComplete: 'string',
    };

    // console.log(responseObject);

    const dialogRef = this.dialog.open(GenericDialogComponent, {
      data: {
        message: `Do you really want to submit the survey?`,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.action == 'ok') {
        this.api
          .submitEmployeeResponse(responseObject)
          .subscribe((res: any) => {
            if (res.success && res.message === 'client Employee response created successfully.') {
              this.tosatr.success('Survey submitted successfully');
              this.router.navigate(['/clientEmployee/dashboard']);
            }
          });
      }
    });

  }

  selectEmojiSCore(score: number, index: number, emojiIndex: number) {
    console.log(score,index,emojiIndex);
    const control = this.getSurveyDetailsFormArray().at(index).get('answer');
    if (control) {
      control.setValue(score);
      this.selectedEmojiIndex = emojiIndex;
    }
  }

  goBack() {

    const dialogRef = this.dialog.open(GenericDialogComponent, {
      data: {
        message: `Do you really want to cancel the survey?`,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.action == 'ok') {
        this.location.back();
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.rankquestion, event.previousIndex, event.currentIndex);
  }
}
