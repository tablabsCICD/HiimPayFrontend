import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-voucher-pull',
  templateUrl: './voucher-pull.component.html',
  styleUrls: ['./voucher-pull.component.css']
})
export class VoucherPullComponent implements OnInit {
  brand: any = null;
  loading = false;
  success: any = null;
  form: FormGroup;

  // sample static brands (should be replaced by service)
  staticBrands = [
    { id: 'b1', code: 'BR-001', name: 'Acme Stores', categories: ['Retail'], redemption: 'Both', denomination: 'Fixed', fixedValues: [100,500,1000], min: 0, max: 0, stock: 120, logo: 'assets/images/servey1.jfif' },
    { id: 'b2', code: 'BR-002', name: 'Techify', categories: ['E-commerce / Technology'], redemption: 'Online', denomination: 'Dynamic', fixedValues: [], min: 10, max: 1000, stock: 0, logo: 'assets/images/servey3.jfif' }
  ];

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder) {
    this.form = this.fb.group({
      externalOrderId: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_-]+$')]],
      quantity: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      denominationValue: [{value: '', disabled: false}, []]
    });
  }

  ngOnInit(): void {
    const q = this.route.snapshot.queryParamMap;
    const brandId = q.get('brandId');
    const brandCode = q.get('brandCode');
    this.brand = this.staticBrands.find(b => b.id === brandId || b.code === brandCode) || this.staticBrands[0];

    // Configure denomination field based on brand
    if (this.brand.denomination === 'Fixed') {
      this.form.get('denominationValue')?.setValue(this.brand.fixedValues[0]);
      this.form.get('denominationValue')?.disable();
    } else {
      this.form.get('denominationValue')?.setValidators([Validators.required, Validators.min(this.brand.min), Validators.max(this.brand.max)]);
      this.form.get('denominationValue')?.enable();
      this.form.get('denominationValue')?.setValue(this.brand.min);
    }
  }

  // use a flexible type so strict-template/index signature checks don't complain
  get f(): any { return this.form.controls; }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.success = null;
    const payload = {
      brandId: this.brand.id,
      externalOrderId: this.f['externalOrderId'].value,
      quantity: this.f['quantity'].value,
      denomination: this.brand.denomination === 'Fixed' ? this.brand.fixedValues[0] : this.f['denominationValue'].value
    };

    // simulate API
    setTimeout(() => {
      this.loading = false;
      this.success = {
        message: 'Voucher pulled successfully',
        details: payload
      };
    }, 900);
  }

  cancel() { this.router.navigate(['superadmin','voucher','brands']); }
}
