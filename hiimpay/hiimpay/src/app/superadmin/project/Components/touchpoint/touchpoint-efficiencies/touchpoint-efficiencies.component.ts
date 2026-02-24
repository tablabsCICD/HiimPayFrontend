import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StartefficiencyComponent } from './startefficiency/startefficiency.component';

@Component({
  selector: 'app-touchpoint-efficiencies',
  templateUrl: './touchpoint-efficiencies.component.html',
  styleUrl: './touchpoint-efficiencies.component.css'
})
export class TouchpointEfficienciesComponent {

  constructor(private dialog:MatDialog){}
  // efficiency:any;

  efficiency: any[] = [
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

  openSEfficiency(): void {
    const dialogRef = this.dialog.open(StartefficiencyComponent, {
      width: '1100px',
      height: '650px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(() => {
    });
  }

}
