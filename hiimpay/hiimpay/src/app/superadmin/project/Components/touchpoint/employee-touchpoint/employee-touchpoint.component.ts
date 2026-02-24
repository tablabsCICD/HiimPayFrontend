import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { StarttouchpointComponent } from './starttouchpoint/starttouchpoint.component';

@Component({
  selector: 'app-employee-touchpoint',
  templateUrl: './employee-touchpoint.component.html',
  styleUrl: './employee-touchpoint.component.css',
})
export class EmployeeTouchpointComponent implements OnInit {

  // employeeTouchpoint:any;
  
  employeeTouchpoint: any[] = [
    {
      touchpoints: 'Touchpoint 1',
      status: 'Completed',
      created_date: new Date()
    },
    {
      touchpoints: 'Touchpoint 2',
      status: 'Not Completed',
      created_date: new Date()
    },
  
  ];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    
  }
  openEmpTouchpoint(): void {
    const dialogRef = this.dialog.open(StarttouchpointComponent, {
      width: '1100px',
      height: '650px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(() => {
    });
  }

}
