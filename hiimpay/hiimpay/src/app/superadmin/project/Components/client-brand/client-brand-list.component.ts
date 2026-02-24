import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientBrandDialogComponent } from './client-brand-dialog.component';
import { ClientBrandCategoryCouponsDialogComponent } from './client-brand-category-coupons-dialog.component';

interface Brand {
  id: string;
  brandProductCode: string;
  brandSku: string;
  name: string;
  brandType: string;
  onlineRedemptionUrl: string;
  brandImage: string;
  epayMinValue: number;
  epayMaxValue: number;
  epayDiscount: number;
  stockAvailable: boolean;
  categories: string[];
}

@Component({
  selector: 'app-client-brand-list',
  templateUrl: './client-brand-list.component.html',
  styleUrls: ['./client-brand-list.component.css']
})
export class ClientBrandListComponent implements OnInit {
  clientId = '';
  brands: Brand[] = [];
  filtered: Brand[] = [];
  q = '';
  inStockOnly = false;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.clientId = sessionStorage.getItem('ClientId') || '';
    this.seedBrands();
    this.applyFilters();
  }

  seedBrands() {
    this.brands = [
      {
        id: '1',
        brandProductCode: 'BATA001',
        brandSku: this.generateBrandSku('Bata'),
        name: 'Bata',
        brandType: 'VOUCHER',
        onlineRedemptionUrl: 'https://www.bata.in/',
        brandImage: 'https://cdn.gyftr.com/comm_engine/stag/images/brands/1593693691875_u3qtc3vzkc4s2qqr.png',
        epayMinValue: 10,
        epayMaxValue: 1050,
        epayDiscount: 10,
        stockAvailable: true,
        categories: ['Lifestyle']
      },
      {
        id: '2',
        brandProductCode: 'AMZN001',
        brandSku: this.generateBrandSku('Amazon'),
        name: 'Amazon',
        brandType: 'VOUCHER',
        onlineRedemptionUrl: 'https://www.amazon.in/',
        brandImage: '',
        epayMinValue: 100,
        epayMaxValue: 10000,
        epayDiscount: 5,
        stockAvailable: true,
        categories: ['E-Commerce']
      }
    ];
  }

  applyFilters() {
    const query = this.q.toLowerCase();
    this.filtered = this.brands.filter((brand) => {
      if (this.inStockOnly && !brand.stockAvailable) return false;
      if (!query) return true;
      return (
        brand.name.toLowerCase().includes(query) ||
        brand.brandProductCode.toLowerCase().includes(query)
      );
    });
  }

  openUpdateBrand() {
    const brand = this.filtered[0];
    if (!brand) return;
    const ref = this.dialog.open(ClientBrandDialogComponent, {
      width: '800px',
      maxHeight: '90vh',
      disableClose: true,
      data: { mode: 'update', brand }
    });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      const idx = this.brands.findIndex((item) => item.id === brand.id);
      if (idx < 0) return;
      this.brands[idx] = {
        ...this.brands[idx],
        brandProductCode: result.BrandProductCode || this.brands[idx].brandProductCode,
        brandSku: this.generateBrandSku(result.BrandName || this.brands[idx].name),
        name: result.BrandName || this.brands[idx].name,
        onlineRedemptionUrl: result.OnlineRedemptionUrl || this.brands[idx].onlineRedemptionUrl,
        brandImage: result.BrandImage || this.brands[idx].brandImage,
        epayMinValue: Number(result.EpayMinValue ?? this.brands[idx].epayMinValue),
        epayMaxValue: Number(result.EpayMaxValue ?? this.brands[idx].epayMaxValue),
        epayDiscount: Number(result.EpayDiscount ?? this.brands[idx].epayDiscount),
        categories: Array.isArray(result.categories) ? result.categories : this.brands[idx].categories
      };
      this.applyFilters();
    });
  }

  openCoupons(brand: Brand) {
    this.router.navigate(['../client-coupons', brand.id], { relativeTo: this.route });
  }

  openBrandCategoryCoupons(brand: Brand, event: MouseEvent) {
    event.stopPropagation();

    this.dialog.open(ClientBrandCategoryCouponsDialogComponent, {
      width: '980px',
      maxHeight: '90vh',
      disableClose: false,
      data: {
        brand: {
          name: brand.name,
          brandSku: brand.brandSku,
          categories: brand.categories
        },
        categoryCoupons: this.buildCategoryCoupons(brand)
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

  private buildCategoryCoupons(brand: Brand) {
    const providers = ['GYFTR', 'XOXODAY', 'MYHUMBLE'];

    return brand.categories.map((category, index) => {
      const categoryNo = (index + 1).toString().padStart(4, '0');
      const coupons = [1, 2].map((serial) => {
        const productCode = `${category.replace(/[^a-z]/gi, '').toLowerCase().slice(0, 2) || 'ct'}${serial}`.padEnd(4, 'x');
        const valueMin = serial === 1 ? brand.epayMinValue : Math.max(brand.epayMinValue, 500);
        const valueMax = serial === 1 ? Math.min(brand.epayMaxValue, 1000) : brand.epayMaxValue;

        return {
          product_name: `${brand.name} ${category} Voucher ${serial}`,
          provider_name: providers[(index + serial - 1) % providers.length],
          coupon_sku: `${brand.brandSku}-${categoryNo}-${productCode}`,
          min_value: valueMin,
          max_value: valueMax,
          discount_percent: serial === 1 ? 5 : 10,
          is_active: brand.stockAvailable
        };
      });

      return { category, coupons };
    });
  }
}
