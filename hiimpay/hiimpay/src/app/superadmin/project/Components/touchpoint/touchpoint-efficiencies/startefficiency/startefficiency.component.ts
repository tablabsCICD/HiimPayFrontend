import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-startefficiency',
  templateUrl: './startefficiency.component.html',
  styleUrl: './startefficiency.component.css'
})
export class StartefficiencyComponent {
  
  
  efficiencyOptions = [
    {
      id: 1,
      question: 'How satisfied are you with the company culture?',
      options: ['Manual', 'Partially automated', 'Automated', 'Internal system', 'External system']
    },
    {
      id: 2,
      question: 'Do you feel supported by your team members?',
      options: ['Manual', 'Partially automated', 'Automated', 'Internal system', 'External system']
    },
    {
      id: 3,
      question: 'What improvements would you suggest for the workplace environment?',
      options: ['Manual', 'Partially automated', 'Automated', 'Internal system', 'External system']
    },
    {
      id: 4,
      question: 'Additional comments (Optional)',
      options: ['Manual', 'Partially automated', 'Automated', 'Internal system', 'External system']
      
    }
    // Add more questions as needed
  ];
  
  
  constructor(private dialogRef: MatDialogRef<StartefficiencyComponent>){}

onClose(): void {
    this.dialogRef.close();
}

submitEfficiency(){

}
}
