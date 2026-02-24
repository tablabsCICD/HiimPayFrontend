import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-survey-flag-popup',
  templateUrl: './survey-flag-popup.component.html',
  styleUrl: './survey-flag-popup.component.css'
})
export class SurveyFlagPopupComponent {
  items: any[] = [
    {empId: '45', empName: 'Abc', emailID: 'abc@gmail.com', city:'pune', contactNumber:'8273733256' },
    {empId: '45', empName: 'Abc', emailID: 'abc@gmail.com', city:'pune', contactNumber:'8273733256' },
    {empId: '45', empName: 'Abc', emailID: 'abc@gmail.com', city:'pune', contactNumber:'8273733256' },
  ];

  showcontainer:string='';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialogRef: MatDialogRef<SurveyFlagPopupComponent>) {
    if (data.name!==null) {
      this.showcontainer = data.name;
    }
  }


  onClose(): void {
    console.log('close')
    this.dialogRef.close();
  }
}
