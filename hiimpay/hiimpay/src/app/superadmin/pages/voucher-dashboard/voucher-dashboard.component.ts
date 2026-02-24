import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Order { id: string; date: string; total: number; status: string }

@Component({
  selector: 'app-voucher-dashboard',
  templateUrl: './voucher-dashboard.component.html',
  styleUrls: ['./voucher-dashboard.component.css']
})
export class VoucherDashboardComponent implements OnInit {
  totalBrands = 12;
  availableVouchers = 524;
  activeTokens = 128;
  recentOrders: Order[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.recentOrders = [
      { id: 'ORD-1001', date: '2026-01-28', total: 49.99, status: 'Completed' },
      { id: 'ORD-1002', date: '2026-01-27', total: 19.99, status: 'Pending' }
    ];
  }

  getBrands() { this.router.navigate(['superadmin','voucher','brands']); }
  pullVoucher() { console.log('Pull Voucher'); }
  checkStatus() { console.log('Check Status'); }
  getStock() { console.log('Get Stock'); }
  storeList() { console.log('Store List'); }
}

