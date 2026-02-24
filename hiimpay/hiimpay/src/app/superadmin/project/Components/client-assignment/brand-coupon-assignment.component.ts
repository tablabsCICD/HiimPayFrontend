import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-brand-coupon-assignment',
  templateUrl: './brand-coupon-assignment.component.html',
  styleUrls: ['./brand-coupon-assignment.component.css']
})
export class BrandCouponAssignmentComponent implements OnInit {
  activeTab: 'coupon' | 'amount' = 'coupon';
  amountEntryMode: 'manual' | 'excel' = 'manual';

  brands: any[] = [];
  coupons: any[] = [];
  employees: any[] = [];

  selectedBrands: any[] = [];
  selectedCoupons: any[] = [];
  selectedEmployees: any[] = [];
  selectedAmountEmployees: any[] = [];

  brandDropdownSettings: any = {};
  couponDropdownSettings: any = {};
  employeeDropdownSettings: any = {};

  notes = '';
  amountValue: number | null = null;
  amountNotes = '';
  amountExcelFileName = '';

  constructor(private toastr: ToastrService) {}

  ngOnInit(): void {
    this.brands = [
      { id: 'B1', name: 'Amazon' },
      { id: 'B2', name: 'Bata' },
      { id: 'B3', name: 'Flipkart' }
    ];

    this.coupons = [
      { id: 'C1', name: 'WELCOME10' },
      { id: 'C2', name: 'FESTIVE500' },
      { id: 'C3', name: 'SUPER20' }
    ];

    this.employees = [
      { id: 'E1', name: 'Amit Sharma' },
      { id: 'E2', name: 'Priya Singh' },
      { id: 'E3', name: 'Rahul Verma' }
    ];

    const common = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.brandDropdownSettings = { ...common };
    this.couponDropdownSettings = { ...common };
    this.employeeDropdownSettings = { ...common };
  }

  assignCouponNow() {
    if (
      this.selectedBrands.length === 0 ||
      this.selectedCoupons.length === 0 ||
      this.selectedEmployees.length === 0
    ) {
      this.toastr.error('Please select at least one brand, coupon and employee.');
      return;
    }

    const assignmentsRaw = sessionStorage.getItem('clientBrandCouponAssignments');
    const assignments = assignmentsRaw ? JSON.parse(assignmentsRaw) : [];

    const payload = {
      id: Date.now().toString(),
      clientId: sessionStorage.getItem('ClientId'),
      brands: this.selectedBrands,
      coupons: this.selectedCoupons,
      employees: this.selectedEmployees,
      notes: this.notes,
      assignedDate: new Date().toISOString(),
      assignedBy: JSON.parse(sessionStorage.getItem('currentLoggedInUserData') || '{}')?.id || ''
    };

    assignments.unshift(payload);
    sessionStorage.setItem('clientBrandCouponAssignments', JSON.stringify(assignments));
    this.toastr.success('Brand and coupon assigned successfully.');

    this.selectedBrands = [];
    this.selectedCoupons = [];
    this.selectedEmployees = [];
    this.notes = '';
  }

  onAmountExcelSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.amountExcelFileName = file?.name || '';
  }

  assignAmountNow() {
    if (this.amountEntryMode === 'manual') {
      if (this.selectedAmountEmployees.length === 0 || !this.amountValue || this.amountValue <= 0) {
        this.toastr.error('Please select employees and enter a valid amount.');
        return;
      }
    } else if (!this.amountExcelFileName) {
      this.toastr.error('Please upload an Excel file to assign amounts.');
      return;
    }

    const assignmentsRaw = sessionStorage.getItem('clientAmountAssignments');
    const assignments = assignmentsRaw ? JSON.parse(assignmentsRaw) : [];

    const payload = {
      id: Date.now().toString(),
      clientId: sessionStorage.getItem('ClientId'),
      source: this.amountEntryMode === 'manual' ? 'MANUAL' : 'EXCEL',
      amount: this.amountEntryMode === 'manual' ? Number(this.amountValue) : null,
      employees: this.selectedAmountEmployees,
      fileName: this.amountEntryMode === 'excel' ? this.amountExcelFileName : '',
      notes: this.amountNotes,
      assignedDate: new Date().toISOString(),
      assignedBy: JSON.parse(sessionStorage.getItem('currentLoggedInUserData') || '{}')?.id || ''
    };

    assignments.unshift(payload);
    sessionStorage.setItem('clientAmountAssignments', JSON.stringify(assignments));
    this.toastr.success('Amount assigned successfully.');

    this.selectedAmountEmployees = [];
    this.amountValue = null;
    this.amountNotes = '';
    this.amountExcelFileName = '';
  }
}
