import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ClientCouponDialogComponent } from './client-coupon-dialog.component';

@Component({
  selector: 'app-client-coupon-list',
  templateUrl: './client-coupon-list.component.html',
  styleUrls: ['./client-coupon-list.component.css']
})
export class ClientCouponListComponent implements OnInit {
  brandId = '';
  clientId = '';
  coupons: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.brandId = this.route.snapshot.paramMap.get('brandId') || '';
    this.clientId = sessionStorage.getItem('ClientId') || '';
    this.seedCoupons();
  }

  seedCoupons() {
    const staticCoupons = [
      {
        id: 1,
        external_product_id: 'GYFTR-AMZ-500',
        provider_name: 'GYFTR',
        product_name: `Brand ${this.brandId} Welcome Voucher`,
        brand_name: 'Amazon',
        description: 'Welcome voucher for employees',
        category: 'Lifestyle',
        image_url: 'amazon-logo.png',
        redemption_type: 'Online',
        denominations: [500],
        min_value: 500,
        max_value: 500,
        discount_percent: 2,
        currency_code: 'INR',
        country_code: 'IN',
        expiry_date: '2026-12-31',
        is_active: true
      },
      {
        id: 2,
        external_product_id: 'XOXO-BATA-1000',
        provider_name: 'XOXODAY',
        product_name: `Brand ${this.brandId} Festive Voucher`,
        brand_name: 'Bata',
        description: 'Festive voucher offer',
        category: 'Footwear',
        image_url: 'bata-logo.png',
        redemption_type: 'Offline',
        denominations: [500, 1000],
        min_value: 500,
        max_value: 1000,
        discount_percent: 4,
        currency_code: 'INR',
        country_code: 'IN',
        expiry_date: '2026-11-30',
        is_active: true
      }
    ];

    this.coupons = staticCoupons.map((coupon) => this.enrichCouponSku(coupon));
  }

  editCoupon(coupon: any) {
    const ref = this.dialog.open(ClientCouponDialogComponent, {
      width: '900px',
      maxHeight: '90vh',
      disableClose: true,
      data: { mode: 'update', coupon }
    });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      const idx = this.coupons.findIndex((item) => item.id === coupon.id);
      if (idx >= 0) this.coupons[idx] = this.enrichCouponSku({ ...this.coupons[idx], ...result });
    });
  }

  private enrichCouponSku(coupon: any) {
    const brandSku = this.generateBrandSku(coupon.brand_name || '');
    const categoryNo = this.getCategoryNumber(coupon.category || '');
    const productCode = this.getProductCode(coupon.external_product_id || '');
    return {
      ...coupon,
      brand_sku: brandSku,
      coupon_sku: `${brandSku}-${categoryNo}-${productCode}`
    };
  }

  private generateBrandSku(name: string): string {
    const cleaned = (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const prefix = (cleaned.slice(0, 3) || 'brn').padEnd(3, 'x');
    const hash = Array.from(cleaned || 'brand').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const num = ((hash % 900) + 100).toString();
    return `${prefix}${num}`;
  }

  private getCategoryNumber(category: string): string {
    const map: { [key: string]: number } = {
      clothing: 1,
      footwear: 2,
      electronics: 3,
      lifestyle: 4,
      'food&beverages': 5,
      ecommerce: 6
    };
    const key = (category || '').toLowerCase().replace(/[^a-z]/g, '');
    const value = map[key] || 9999;
    return value.toString().padStart(4, '0');
  }

  private getProductCode(externalId: string): string {
    const cleaned = (externalId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    return (cleaned.slice(-4) || 'xxxx').padStart(4, '0');
  }
}
