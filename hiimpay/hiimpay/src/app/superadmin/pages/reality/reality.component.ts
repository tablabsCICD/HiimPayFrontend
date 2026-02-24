import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reality',
  templateUrl: './reality.component.html',
  styleUrl: './reality.component.css'
})
export class RealityComponent {
  constructor(  @Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<RealityComponent>,){}

  onClose(): void {
    this.dialogRef.close();
  }
  
}
