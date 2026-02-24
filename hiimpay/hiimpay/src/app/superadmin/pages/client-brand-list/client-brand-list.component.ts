import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BrandCategoryCouponsDialogComponent } from '../voucher-brand-list/brand-category-coupons-dialog/brand-category-coupons-dialog.component';

interface ClientBrand {
  clientId: string;
  clientName: string;
  brandId: string;
  brandName: string;
  brandProductCode: string;
  brandSku: string;
  categories: string[];
  epayMinValue: number;
  epayMaxValue: number;
  stockAvailable: boolean;
}

@Component({
  selector: 'app-superadmin-client-brand-list',
  templateUrl: './client-brand-list.component.html',
  styleUrls: ['./client-brand-list.component.css']
})
export class ClientBrandListPageComponent implements OnInit {
  rows: ClientBrand[] = [];
  filtered: ClientBrand[] = [];
  q = '';
  selectedClient = 'ALL';
  inStockOnly = false;

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.rows = [
      {
        clientId: '101',
        clientName: 'Infosys',
        brandId: 'BATA001',
        brandName: 'Bata',
        brandProductCode: 'BATA001',
        brandSku: this.generateBrandSku('Bata'),
        categories: ['Footwear', 'Lifestyle'],
        epayMinValue: 10,
        epayMaxValue: 1050,
        stockAvailable: true
      },
      {
        clientId: '102',
        clientName: 'TCS',
        brandId: 'AMZN001',
        brandName: 'Amazon',
        brandProductCode: 'AMZN001',
        brandSku: this.generateBrandSku('Amazon'),
        categories: ['Lifestyle', 'Electronics'],
        epayMinValue: 100,
        epayMaxValue: 10000,
        stockAvailable: true
      },
      {
        clientId: '103',
        clientName: 'Wipro',
        brandId: 'FLPK001',
        brandName: 'Flipkart',
        brandProductCode: 'FLPK001',
        brandSku: this.generateBrandSku('Flipkart'),
        categories: ['Clothing', 'Electronics'],
        epayMinValue: 50,
        epayMaxValue: 5000,
        stockAvailable: false
      }
    ];
    this.applyFilters();
  }

  get clientOptions(): string[] {
    return ['ALL', ...Array.from(new Set(this.rows.map((item) => item.clientName)))];
  }

  applyFilters() {
    const query = this.q.trim().toLowerCase();
    this.filtered = this.rows.filter((item) => {
      if (this.selectedClient !== 'ALL' && item.clientName !== this.selectedClient) {
        return false;
      }
      if (this.inStockOnly && !item.stockAvailable) {
        return false;
      }
      if (!query) {
        return true;
      }
      return (
        item.clientName.toLowerCase().includes(query) ||
        item.brandName.toLowerCase().includes(query) ||
        item.brandProductCode.toLowerCase().includes(query)
      );
    });
  }

  openCoupons(item: ClientBrand) {
    this.router.navigate(['superadmin', 'project', item.clientId, 'client-coupons', item.brandId]);
  }

  openBrandCategoryCoupons(item: ClientBrand, event: MouseEvent) {
    event.stopPropagation();

    this.dialog.open(BrandCategoryCouponsDialogComponent, {
      width: '980px',
      maxHeight: '90vh',
      disableClose: false,
      data: {
        brand: {
          name: item.brandName,
          brandSku: item.brandSku,
          categories: item.categories
        },
        categoryCoupons: this.buildCategoryCoupons(item)
      }
    });
  }

  private generateBrandSku(name: string): string {
    const cleaned = (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const prefix = (cleaned.slice(0, 3) || 'brn').padEnd(3, 'x');
    const hash = Array.from(cleaned || 'brand').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const num = ((hash % 900) + 100).toString();
    return `${prefix}${num}`;
  }

  private buildCategoryCoupons(item: ClientBrand) {
    const providers = ['GYFTR', 'XOXODAY', 'MYHUMBLE'];

    return item.categories.map((category, index) => {
      const categoryNo = (index + 1).toString().padStart(4, '0');
      const coupons = [1, 2].map((serial) => {
        const productCode = `${category.replace(/[^a-z]/gi, '').toLowerCase().slice(0, 2) || 'ct'}${serial}`.padEnd(4, 'x');
        const valueMin = serial === 1 ? item.epayMinValue : Math.max(item.epayMinValue, 500);
        const valueMax = serial === 1 ? Math.min(item.epayMaxValue, 1000) : item.epayMaxValue;

        return {
          product_name: `${item.brandName} ${category} Voucher ${serial}`,
          provider_name: providers[(index + serial - 1) % providers.length],
          coupon_sku: `${item.brandSku}-${categoryNo}-${productCode}`,
          min_value: valueMin,
          max_value: valueMax,
          discount_percent: serial === 1 ? 5 : 10,
          is_active: item.stockAvailable
        };
      });

      return { category, coupons };
    });
  }
}
