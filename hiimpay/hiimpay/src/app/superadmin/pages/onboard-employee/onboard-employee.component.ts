import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OnboardEmployeeFormComponent } from './onboard-employee-form/onboard-employee-form.component';

@Component({
  selector: 'app-onboard-employee',
  templateUrl: './onboard-employee.component.html',
  styleUrls: ['./onboard-employee.component.css']
})
export class OnboardEmployeeComponent implements OnInit {
  employees: any[] = [];
  isLoading = false;
  itemPerPage = 10;
  page = 1;
  totalItems = 0;
  newCount: any;
  allCount: any;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.initializeStaticEmployees();
    // static counts for cards
    this.allCount = 80;
    this.newCount = 5;
  }

  initializeStaticEmployees() {
    const staticEmployees = [
      { id: 1, name: 'Rajesh Kumar', company: 'Infosys', designation: 'Software Engineer', phone: '+91-9876543210', email: 'rajesh.kumar@infosys.com', secondEmail: 'rajesh.alt@infosys.com', city: 'Bengaluru' },
      { id: 2, name: 'Priya Sharma', company: 'TCS', designation: 'Analyst', phone: '+91-9876543211', email: 'priya.sharma@tcs.com', secondEmail: 'priya.alt@tcs.com', city: 'Mumbai' },
      { id: 3, name: 'Amit Singh', company: 'Wipro', designation: 'QA Engineer', phone: '+91-9876543212', email: 'amit.singh@wipro.com', secondEmail: 'amit.alt@wipro.com', city: 'Hyderabad' },
      { id: 4, name: 'Sneha Patel', company: 'Tech Mahindra', designation: 'Project Manager', phone: '+91-9876543213', email: 'sneha.patel@techm.com', secondEmail: 'sneha.alt@techm.com', city: 'Pune' },
      { id: 5, name: 'Vikram Roy', company: 'HCL Technologies', designation: 'DevOps Engineer', phone: '+91-9876543214', email: 'vikram.roy@hcl.com', secondEmail: 'vikram.alt@hcl.com', city: 'Chennai' }
    ];
    this.employees = staticEmployees;
    this.totalItems = staticEmployees.length;
  }

  openOnboardForm() {
    const ref = this.dialog.open(OnboardEmployeeFormComponent, {
      width: '700px',
      disableClose: true,
      data: { company: 'Infosys' }
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        // assign a new id
        const nextId = (this.employees.length ? Math.max(...this.employees.map(e => e.id)) : 0) + 1;
        const newEmp = { id: nextId, ...result };
        this.employees = [newEmp, ...this.employees];
        this.totalItems = this.employees.length;
      }
    });
  }

  relativePercentage(statusCount: any) {
    if (!this.allCount || this.allCount === 0) return 0;
    return (statusCount / this.allCount) * 100;
  }
}
