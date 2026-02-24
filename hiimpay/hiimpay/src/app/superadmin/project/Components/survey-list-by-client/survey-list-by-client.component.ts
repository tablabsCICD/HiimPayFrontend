import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SurveyFlagPopupComponent } from './survey-flag-popup/survey-flag-popup.component';  

@Component({
  selector: 'app-survey-list-by-client',
  templateUrl: './survey-list-by-client.component.html',
  styleUrl: './survey-list-by-client.component.css'
})
export class SurveyListByClientComponent {
  items: any[] = [
    { surveyName: 'FUDS', surveyType:'FUDS', dateCreated: '2022-01-01', description: 'FUDS survey description', createdBy:'Kate',completionstatus:'Completed'},
    { surveyName: 'FUDS', surveyType:'FUDS', dateCreated: '2022-01-01', description: 'FUDS survey description', createdBy:'Kate',completionstatus:'Not completed'},
    { surveyName: 'FUDS', surveyType:'FUDS', dateCreated: '2022-01-01', description: 'FUDS survey description', createdBy:'Kate',completionstatus:'Completed'},
  ];

  constructor(public dialog: MatDialog) {}

  openPopup(name:any): void {
    const dialogRef = this.dialog.open(SurveyFlagPopupComponent, {
      width: '1200px',
      height: '600px',
      disableClose: true,
      data: { name: name}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The popup was closed');
    });
  }
}
