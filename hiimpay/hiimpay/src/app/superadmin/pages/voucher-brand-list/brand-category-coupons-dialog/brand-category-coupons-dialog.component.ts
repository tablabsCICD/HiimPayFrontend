import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-brand-category-coupons-dialog',
  templateUrl: './brand-category-coupons-dialog.component.html',
  styleUrls: ['./brand-category-coupons-dialog.component.css']
})
export class BrandCategoryCouponsDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<BrandCategoryCouponsDialogComponent>
  ) {}

  close() {
    this.dialogRef.close();
  }
}

