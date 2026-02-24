import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css'
})
export class AdminProfileComponent {

  constructor(private dialogRef: MatDialogRef<AdminProfileComponent>){}

  onClose(): void {
    this.dialogRef.close();
  }

}
