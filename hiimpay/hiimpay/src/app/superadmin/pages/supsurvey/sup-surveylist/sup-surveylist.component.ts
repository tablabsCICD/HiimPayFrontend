import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SurveyApiService } from '../../../project/Components/survey/service/survey-api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SearchService } from '../../../services/search.service';
import { DeleteComponent } from '../../delete/delete.component';
import { CreateCouponComponent } from './create-coupon/create-coupon.component';
import { VoucherDetailDialogComponent } from './voucher-detail-dialog/voucher-detail-dialog.component';

@Component({
  selector: 'app-sup-surveylist',
  templateUrl: './sup-surveylist.component.html',
  styleUrl: './sup-surveylist.component.css',
})
export class SupSurveylistComponent implements OnInit {
  surveyList: any;
  p: number = 0;
  page: number = 1;
  totalPages: any;
  size: number = 10;
  orderBy: any = 'desc';
  sortBy: any = 'id';
  isLoading = false;
  itemPerPage: number = 10;
  totalItems: any;

  constructor(
    private dialog: MatDialog,
    private api: SurveyApiService,
    private toastr: ToastrService,
    private router: Router,
    private searchservice: SearchService
  ) {}

  openCreateCoupon(): void {
    const dialogRef = this.dialog.open(CreateCouponComponent, {
      width: '900px',
      maxHeight: '90vh',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      this.toastr.success('Coupon created (local)');
      const selectedBrand = this.getCompanyNameById(result.companyId);

      const createdCoupon = {
        id: Date.now(),
        external_product_id: `EXT-${Date.now()}`,
        provider_name: 'GYFTR',
        product_name: result.title || 'Voucher Product',
        brand_name: selectedBrand,
        description: result.title ? `${result.title} voucher` : 'Voucher description',
        category: result.category || 'Lifestyle',
        image_url: result.poster ? result.poster.name : '',
        redemption_type: 'Online / Offline',
        denominations: result.discountValue ? [result.discountValue] : [],
        min_value: Number(result.discountValue || 0),
        max_value: Number(result.discountValue || 0),
        discount_percent: result.discountType === 'Percentage' ? Number(result.discountValue || 0) : 0,
        currency_code: 'INR',
        country_code: 'IN',
        expiry_date: result.expiryDate || '2026-12-31',
        is_active: true,
        terms_conditions: [
          'Voucher is valid until expiry date.',
          'Voucher cannot be exchanged for cash.'
        ],
        redeem_steps: [
          'Open partner app/website.',
          'Choose voucher and add to cart.',
          'Apply coupon/voucher code at checkout.'
        ]
      };

      this.surveyList = [this.enrichCouponSku(createdCoupon), ...(this.surveyList || [])];
      this.totalItems = (this.totalItems || 0) + 1;
    });
  }

  ngOnInit(): void {
    this.initializeStaticCouponData();

    this.searchservice.sendResults().subscribe({
      next: (res: any) => {
        if (!res || (Array.isArray(res) && res.length === 0)) {
          this.isLoading = false;
        } else if (res.success) {
          this.isLoading = false;
          this.surveyList = res.data;
          this.totalItems = res.totalItems || this.totalItems;
        }
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  initializeStaticCouponData() {
    const staticCoupons = [
      {
        id: 1,
        external_product_id: 'GYFTR-AMZ-500',
        provider_name: 'GYFTR',
        product_name: 'Amazon Gift Card - Rs 500',
        brand_name: 'Amazon',
        description: 'Amazon gift card with value Rs 500',
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
        is_active: true,
        terms_conditions: [
          'Applicable on eligible products only.',
          'Single use per transaction.'
        ],
        redeem_steps: [
          'Login to Amazon account.',
          'Go to gift card redemption page.',
          'Enter code and confirm.'
        ]
      },
      {
        id: 2,
        external_product_id: 'XOXO-BATA-1000',
        provider_name: 'XOXODAY',
        product_name: 'Bata Voucher',
        brand_name: 'Bata',
        description: 'Bata footwear voucher',
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
        is_active: true,
        terms_conditions: [
          'Valid only in selected Bata stores.',
          'Not valid with other promotions.'
        ],
        redeem_steps: [
          'Visit nearest store.',
          'Show voucher at billing counter.',
          'Complete redemption before expiry.'
        ]
      },
      {
        id: 3,
        external_product_id: 'HMBL-FLPK-VAR',
        provider_name: 'MYHUMBLE',
        product_name: 'Flipkart Variable Voucher',
        brand_name: 'Flipkart',
        description: 'Flipkart variable value voucher',
        category: 'Clothing',
        image_url: 'flipkart-logo.png',
        redemption_type: 'Online / Offline',
        denominations: [100, 200, 500, 1000],
        min_value: 100,
        max_value: 1000,
        discount_percent: 3,
        currency_code: 'INR',
        country_code: 'IN',
        expiry_date: '2026-10-31',
        is_active: false,
        terms_conditions: [
          'Redeemable for eligible categories only.',
          'Cannot be revalidated after expiry.'
        ],
        redeem_steps: [
          'Select product on Flipkart.',
          'Proceed to payment page.',
          'Apply code and place order.'
        ]
      }
    ];

    this.surveyList = staticCoupons.map((coupon) => this.enrichCouponSku(coupon));
    this.totalItems = staticCoupons.length;
  }

  getAllSurveyTypes() {
    this.isLoading = true;
    this.api
      .getAllSurveyPagination(this.page - 1, this.size, this.orderBy, this.sortBy)
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.surveyList = res.data;
          this.totalItems = res.totalItems;
        },
        error: () => {
          this.toastr.error('Internal server error');
          this.isLoading = false;
        },
      });
  }

  deleteSurvey(coupon: any) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: {
        message: `Do you really want to deactivate the records for ${coupon.product_name || coupon.external_product_id} ?`,
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.action !== 'ok') return;

      this.surveyList = (this.surveyList || []).filter((x: any) => x.id !== coupon.id);
      this.totalItems = Math.max((this.totalItems || 1) - 1, 0);
      this.toastr.success('Coupon deactivated successfully.');
    });
  }

  openViewCoupon(coupon: any) {
    this.dialog.open(VoucherDetailDialogComponent, {
      width: '900px',
      maxHeight: '90vh',
      disableClose: false,
      data: coupon
    });
  }

  pageChangeEvent(event: number) {
    this.page = event;
    this.getAllSurveyTypes();
  }

  private getCompanyNameById(companyId: number): string {
    const companies = [
      { id: 1, name: 'Amazon' },
      { id: 2, name: 'Flipkart' },
      { id: 3, name: 'Bata' }
    ];

    return companies.find((company) => company.id === Number(companyId))?.name || 'Unknown';
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
