import { Component } from '@angular/core';

interface Admin {
  name: string;
  email: string;
  contact: string;
  address: string;
  active: boolean;
  permissions: {
    dashboard: boolean;
    brands: boolean;
    coupons: boolean;
    clients: boolean;
    employees: boolean;
    reports: boolean;
  };
}

@Component({
  selector: 'app-manage-admin',
  templateUrl: './manage-admin.component.html',
  styleUrls: ['./manage-admin.component.scss']
})
export class ManageAdminComponent {

  admins: Admin[] = [
    {
      name: 'Super Admin',
      email: 'admin@himpay.com',
      contact: '9999999999',
      address: 'Mumbai',
      active: true,
      permissions: {
        dashboard: true,
        brands: true,
        coupons: true,
        clients: true,
        employees: true,
        reports: true
      }
    }
  ];

  showCreatePopup = false;
  showAccessPopup = false;
  selectedAdmin!: Admin;

  newAdmin: Admin = this.getEmptyAdmin();

  getEmptyAdmin(): Admin {
    return {
      name: '',
      email: '',
      contact: '',
      address: '',
      active: true,
      permissions: {
        dashboard: false,
        brands: false,
        coupons: false,
        clients: false,
        employees: false,
        reports: false
      }
    };
  }

  openCreateAdmin() {
    this.newAdmin = this.getEmptyAdmin();
    this.showCreatePopup = true;
  }

  createAdmin() {
    this.admins.push({ ...this.newAdmin });
    this.showCreatePopup = false;
  }

  openAccessPopup(admin: Admin) {
    this.selectedAdmin = admin;
    this.showAccessPopup = true;
  }
}
