import { Component } from '@angular/core';

@Component({
  selector: 'app-taskdashboard',
  templateUrl: './taskdashboard.component.html',
  styleUrl: './taskdashboard.component.css'
})
export class TaskdashboardComponent {
  activeIcon: string = 'add-circle-outline';
  items: any[] = [
    { name: 'Name 1', date: '2022-01-01', status: 'Complete' },
    { name: 'Name 2', date: '2022-01-02', status: 'Outsatnding' },
    { name: 'Name 3', date: '2022-01-03', status: 'Postponded to future' }
  ];

  cardsCircle:any[]=[
    { name: 'Listen', count: '2' },
    { name: 'Analyse', count: '2' },
    { name: 'Share', count: '2' },
    { name: 'create', count: '2' },
  ]
  constructor() { }

  change(iconName: string) {
    this.activeIcon = iconName;
  }
}
