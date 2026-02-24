import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-brand',
  templateUrl: './create-brand.component.html',
  styleUrls: ['./create-brand.component.css']
})
export class CreateBrandComponent {
  brand: any = {};
  logoPreview: string | ArrayBuffer | null = null;
  logoFile: File | null = null;

  constructor(
    private dialogRef: MatDialogRef<CreateBrandComponent>,
    private toastr: ToastrService
  ) {
    // prefill example data
    this.brand = {
      name: 'Amazon',
      description: 'Global e-commerce and technology company',
      website: 'https://www.amazon.com',
      category: 'E-commerce / Technology',
      email: '',
      phone: '',
      active: true,
      foundedYear: 1994,
      country: 'USA',
    };
  }

  onLogoSelected(event: any) {
    const file: File = event.target.files && event.target.files[0];
    if (file) {
      this.logoFile = file;
      const reader = new FileReader();
      reader.onload = (e) => (this.logoPreview = e.target?.result || null);
      reader.readAsDataURL(file);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files && event.dataTransfer.files[0];
    if (file) {
      this.logoFile = file;
      const reader = new FileReader();
      reader.onload = (e) => (this.logoPreview = e.target?.result || null);
      reader.readAsDataURL(file);
    }
  }

  save() {
    const newBrand = {
      name: this.brand.name,
      description: this.brand.description,
      website: this.brand.website,
      category: this.brand.category,
      email: this.brand.email,
      phone: this.brand.phone,
      active: !!this.brand.active,
      foundedYear: this.brand.foundedYear,
      country: this.brand.country,
      logo: this.logoPreview || null,
    };
    this.toastr.success('Brand created');
    this.dialogRef.close(newBrand);
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
