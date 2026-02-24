import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-startstekholder',
  templateUrl: './startstekholder.component.html',
  styleUrl: './startstekholder.component.css'
})
export class StartstekholderComponent {

  stakeHolderOptions = [
    {
      id: 1,
      question: 'How satisfied are you with the company culture?',
      options: ['Application portal', 'Bot', 'Company Website', 'LinkedIn', 'Recruitment Team', 'Social Media']
    },
    {
      id: 2,
      question: 'Do you feel supported by your team members?',
      options: ['Application portal', 'Bot', 'Company Website', 'LinkedIn', 'Recruitment Team', 'Social Media']
    },
    {
      id: 3,
      question: 'What improvements would you suggest for the workplace environment?',
      options: ['Application portal', 'Bot', 'Company Website', 'LinkedIn', 'Recruitment Team', 'Social Media']
    },
    {
      id: 4,
      question: 'Additional comments (Optional)',
      options: ['Application portal', 'Bot', 'Company Website', 'LinkedIn', 'Recruitment Team', 'Social Media']
      
    }
    // Add more questions as needed
  ];
  

  constructor(private dialogRef: MatDialogRef<StartstekholderComponent>){}

  onClose(): void {
    this.dialogRef.close();
  }

  submitStakeHolder(){

  }
}
