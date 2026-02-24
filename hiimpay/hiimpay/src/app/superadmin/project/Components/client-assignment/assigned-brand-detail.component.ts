import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-assigned-brand-detail',
  templateUrl: './assigned-brand-detail.component.html',
  styleUrls: ['./assigned-brand-detail.component.css']
})
export class AssignedBrandDetailComponent implements OnInit {
  record: any;
  recordType: 'coupon' | 'amount' = 'coupon';
  brandWiseRows: any[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.recordType = (this.route.snapshot.queryParamMap.get('type') as 'coupon' | 'amount') || 'coupon';

    if (this.recordType === 'amount') {
      const amountAssignmentsRaw = sessionStorage.getItem('clientAmountAssignments');
      const amountAssignments = amountAssignmentsRaw ? JSON.parse(amountAssignmentsRaw) : [];
      this.record = amountAssignments.find((item: any) => item.id === id);
      this.brandWiseRows = [];
      return;
    }

    const couponAssignmentsRaw = sessionStorage.getItem('clientBrandCouponAssignments');
    const couponAssignments = couponAssignmentsRaw ? JSON.parse(couponAssignmentsRaw) : [];
    this.record = couponAssignments.find((item: any) => item.id === id);
    this.brandWiseRows = this.buildBrandWiseRows(this.record);
  }

  private buildBrandWiseRows(record: any): any[] {
    if (!record) return [];

    const mapped = Array.isArray(record.brandAssignments) ? record.brandAssignments : [];
    if (mapped.length > 0) {
      return mapped.map((row: any) => ({
        brandName: row?.brand?.name || row?.brandName || '-',
        coupons: Array.isArray(row?.coupons) ? row.coupons : [],
        employees: Array.isArray(row?.employees) ? row.employees : []
      }));
    }

    const brands = Array.isArray(record.brands) ? record.brands : [];
    const coupons = Array.isArray(record.coupons) ? record.coupons : [];
    const employees = Array.isArray(record.employees) ? record.employees : [];

    return brands.map((brand: any) => ({
      brandName: brand?.name || '-',
      coupons,
      employees
    }));
  }
}
