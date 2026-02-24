import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from '../../../services/project.service';

@Component({
  selector: 'app-phaseone',
  templateUrl: './phaseone.component.html',
  styleUrl: './phaseone.component.css'
})
export class PhaseoneComponent {
  filterToggle: boolean = false;
  // details: any;
  info: any;
  @Input() parentId =''
  details: any[] = [
    {
      surveyName: 'Survey 1',
      description: 'Description',
      status: 'Active',
      createdDate: '2024-04-22',
      id: 1
    },
    {
      surveyName: 'Survey 2',
      description: 'Description',
      status: 'Inactive',
      createdDate: '2024-04-20',
      id: 2 
    },
  ]
  constructor(public dialog: MatDialog, private service: ProjectService) { }

  ngOnInit(): void {
    this.service.getUserByClientID(sessionStorage.getItem("ClientId")).subscribe((res: any) => {
      console.log(res);
      this.details = res.data;
      this.onclick(this.details[0].id)
    })
  }
  onclick(id: any) {
    console.log(id);

    this.service.getByUserID(id).subscribe((res: any) => {
      console.log(res);
      this.info = res;
      console.log(this.info);

    })
  }

  editSurvey(surveyId: any) {

  }

  changePhase(surveyId: any) {
//     this.barChart1 = new Chart('barChartCanvas', {
//       type: 'bar',
//       data: {
//         labels: ['Partially Automated', 'Automated', 'Internal', 'External'],
//         datasets: [
//           {
//             data: [50, 80, 40, 70],
//             label: 'Value',
//             borderColor: "#103a7f",
//             backgroundColor: '#103a7f', 
//             barThickness: 15, 
//             barPercentage: 0.8,
//             categoryPercentage: 0.8,
// borderRadius:15
//           },
//         ],
//       },
//       options: {
//         scales: {
//           y: {
//             beginAtZero: true,
//             max: 100, 
//             min: 10,
//           },
//         },
//       },
//     });
  }

  deleteSurvey(surveyId: any) {

  }

  // {
  //   "message": "Journey map fetch for client successfully.",
  //   "data": {
  //     "clientId": 7,
  //     "surveyPhaseScore": [
  //       {
  //         "survey": {
  //           "id": 2,
  //           "createdForClientId": 0,
  //           "survey_Type": "string",
  //           "status": "active",
  //           "survey_name": "test data",
  //           "survey_description": "string",
  //           "loggedUserId": 0,
  //           "created_date": "2024-06-04T09:08:36.000+00:00",
  //           "addInJourneyMap": true
  //         },
  //         "listOfPhase": [
  //           {
  //             "stage": "stage1",
  //             "score": 64,
  //             "listOfSubPhase": [
  //               {
  //                 "subPhase": "Emp experiencing phase",
  //                 "phaseScore": 64,
  //                 "questionScoreForSurveyResponseDtos": [
  //                   {
  //                     "question": "1.\tOur organisation’s purpose makes a positive contribution to wider society ",
  //                     "optionWithCount": {
  //                       "other": 0,
  //                       "Strongly disagree": 0,
  //                       "Strongly agree": 0,
  //                       "Agree": 0,
  //                       "Neither agree": 0,
  //                       "Disagree": 0
  //                     },
  //                     "totalScore": 0,
  //                     "weightage": 5,
  //                     "totalResponses": 0
  //                   },
  //                   {
  //                     "question": "2.\tThe organisational culture that our leaders describe reflects what I experience everyday",
  //                     "optionWithCount": {
  //                       "Very satisfied ": 0,
  //                       "Satisfied": 0,
  //                       "Very dissatisfied": 0,
  //                       "Neither satisfied or dissatisfied": 0,
  //                       "Dissatisfied": 1,
  //                       "Other": 0
  //                     },
  //                     "totalScore": 4,
  //                     "weightage": 5,
  //                     "totalResponses": 1
  //                   },
  //                   {
  //                     "question": "3.\tI see our organisation’s values when colleagues are working or interacting together",
  //                     "optionWithCount": {
  //                       "Very satisfied ": 0,
  //                       "Satisfied": 0,
  //                       "Very dissatisfied": 0,
  //                       "Neither satisfied or dissatisfied": 0,
  //                       "Dissatisfied": 1,
  //                       "Other": 0
  //                     },
  //                     "totalScore": 4,
  //                     "weightage": 5,
  //                     "totalResponses": 1
  //                   }
  //                 ]
  //               }
  //             ]
  //           }
  //         ]
  //       }
  //     ],
  //     "reality": {
  //       "clientId": 7,
  //       "realityScore": 0,
  //       "qualityScore": [],
  //       "componentScore": []
  //     },
  //     "touchPointEfficiency": {
  //       "clientId": 7,
  //       "phaseId": null,
  //       "clientName": "string",
  //       "stages": [
  //         {
  //           "stageName": "see",
  //           "subphase": []
  //         },
  //         {
  //           "stageName": "do",
  //           "subphase": []
  //         },
  //         {
  //           "stageName": "use",
  //           "subphase": []
  //         },
  //         {
  //           "stageName": "feel",
  //           "subphase": []
  //         },
  //         {
  //           "stageName": "stage1",
  //           "subphase": []
  //         }
  //       ]
  //     },
  //     "stakeholderScore": {
  //       "clientId": 7,
  //       "phaseId": null,
  //       "clientName": "string",
  //       "stages": [
  //         {
  //           "stageName": "see",
  //           "subphase": []
  //         },
  //         {
  //           "stageName": "do",
  //           "subphase": []
  //         },
  //         {
  //           "stageName": "use",
  //           "subphase": []
  //         },
  //         {
  //           "stageName": "feel",
  //           "subphase": []
  //         },
  //         {
  //           "stageName": "stage1",
  //           "subphase": []
  //         }
  //       ]
  //     },
  //     "touchPoint": {
  //       "clientId": 7,
  //       "phaseId": null,
  //       "clientName": "string",
  //       "stages": [
  //         {
  //           "stageName": "see",
  //           "subphase": []
  //         },
  //         {
  //           "stageName": "do",
  //           "subphase": []
  //         },
  //         {
  //           "stageName": "use",
  //           "subphase": []
  //         },
  //         {
  //           "stageName": "feel",
  //           "subphase": []
  //         },
  //         {
  //           "stageName": "stage1",
  //           "subphase": []
  //         }
  //       ]
  //     }
  //   },
  //   "success": true
  // }


}
