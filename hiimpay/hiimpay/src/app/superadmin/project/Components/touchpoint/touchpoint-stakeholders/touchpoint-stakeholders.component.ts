import { Component } from '@angular/core';
import { StartstekholderComponent } from './startstekholder/startstekholder.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-touchpoint-stakeholders',
  templateUrl: './touchpoint-stakeholders.component.html',
  styleUrl: './touchpoint-stakeholders.component.css'
})
export class TouchpointStakeholdersComponent {
  // stakeholder:any;

  constructor(private dialog:MatDialog){}

  stakeholder: any[] = [
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

  openStakeholder(): void {
    const dialogRef = this.dialog.open(StartstekholderComponent, {
      width: '1100px',
      height: '650px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(() => {
    });
  }

}
