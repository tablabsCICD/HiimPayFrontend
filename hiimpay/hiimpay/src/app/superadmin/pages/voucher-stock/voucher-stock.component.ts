import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-voucher-stock',
  templateUrl: './voucher-stock.component.html',
  styleUrls: ['./voucher-stock.component.css']
})
export class VoucherStockComponent implements OnInit {
  form: FormGroup;
  loading = true;
  brands: any[] = [];
  filteredBrands: any[] = [];
  selectedBrand: any = null;
  denominationOptions: any[] = [];
  available = -1; // -1 = not checked yet
  checking = false;
  error: string | null = null;

  // sample static data — replace with real service later
  staticBrands = [
    { id: 'b1', code: 'BR-001', name: 'Acme Stores', logo: 'assets/images/servey1.jfif', denomination: 'Fixed', fixedValues: [100,500,1000], stockByDenom: { '100': 5, '500': 20, '1000': 10 } , totalStock: 35},
    { id: 'b2', code: 'BR-002', name: 'Techify', logo: 'assets/images/servey3.jfif', denomination: 'Dynamic', min: 10, max: 1000, totalStock: 2 }
  ];

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      brand: [null, Validators.required],
      denomination: [{ value: null, disabled: true }, Validators.required]
    });
  }

  ngOnInit(): void {
    // simulate async load
    setTimeout(() => {
      this.brands = this.staticBrands;
      this.filteredBrands = this.brands.slice();
      this.loading = false;
    }, 400);

    // react to brand changes
    this.form.get('brand')?.valueChanges.subscribe((bId) => {
      this.selectedBrand = this.brands.find(b => b.id === bId) || null;
      this.setupDenomination();
      this.available = -1;
      this.error = null;
    });
  }

  setupDenomination() {
    const ctrl = this.form.get('denomination');
    if (!this.selectedBrand) {
      ctrl?.disable();
      return;
    }
    if (this.selectedBrand.denomination === 'Fixed') {
      this.denominationOptions = this.selectedBrand.fixedValues || [];
      ctrl?.enable();
      ctrl?.setValue(this.denominationOptions[0] ?? null);
    } else {
      this.denominationOptions = [];
      ctrl?.enable();
      ctrl?.setValue(this.selectedBrand.min ?? null);
      ctrl?.setValidators([Validators.required]);
    }
  }

  filterBrands(q: string) {
    const s = (q || '').toLowerCase();
    this.filteredBrands = this.brands.filter(b => b.name.toLowerCase().includes(s) || b.code.toLowerCase().includes(s));
  }

  async checkStock() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.checking = true;
    this.available = -1;
    this.error = null;

    // simulate API lookup
    await new Promise(r => setTimeout(r, 700));

    try {
      // simple logic: if Fixed, read stockByDenom; else use totalStock
      if (this.selectedBrand.denomination === 'Fixed') {
        const denom = String(this.form.get('denomination')?.value);
        const stock = this.selectedBrand.stockByDenom ? (this.selectedBrand.stockByDenom[denom] ?? 0) : 0;
        this.available = stock;
      } else {
        this.available = this.selectedBrand.totalStock ?? 0;
      }
    } catch (e: any) {
      this.error = 'Unable to fetch stock. Try again.';
      this.available = -1;
    }

    this.checking = false;
  }

  refresh() { this.checkStock(); }

  proceedToPull() {
    if (this.available <= 0) return;
    // navigate to pull with brand and denom
    const params: any = { brandId: this.selectedBrand.id, brandCode: this.selectedBrand.code };
    if (this.selectedBrand.denomination === 'Fixed') params.fixed = this.form.get('denomination')?.value;
    this.router.navigate(['superadmin','voucher','pull'], { queryParams: params });
  }

  // UI helpers
  getStockLevel(): 'healthy'|'low'|'critical'|'empty'|'unknown' {
    if (this.available < 0) return 'unknown';
    if (this.available === 0) return 'empty';
    if (this.available <= 3) return 'critical';
    if (this.available <= 10) return 'low';
    return 'healthy';
  }

  get denomTotal(): number {
    if (!this.selectedBrand) return 0;
    if (this.selectedBrand.denomination === 'Fixed') {
      const denom = String(this.form.get('denomination')?.value);
      return this.selectedBrand.stockByDenom ? (this.selectedBrand.stockByDenom[denom] ?? (this.selectedBrand.totalStock ?? 0)) : (this.selectedBrand.totalStock ?? 0);
    }
    return this.selectedBrand.totalStock ?? 0;
  }

  get percentAvailable(): number {
    const total = this.denomTotal;
    if (!total || this.available < 0) return 0;
    return Math.round((this.available / total) * 100);
  }
}
