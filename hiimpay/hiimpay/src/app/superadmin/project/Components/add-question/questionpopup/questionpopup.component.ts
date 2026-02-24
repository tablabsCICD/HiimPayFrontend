import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-questionpopup',
  templateUrl: './questionpopup.component.html',
  styleUrl: './questionpopup.component.css'
})
export class QuestionpopupComponent {

  constructor(private dialogRef: MatDialogRef<QuestionpopupComponent>){}

  onClose(): void {
    this.dialogRef.close();
  }
}
