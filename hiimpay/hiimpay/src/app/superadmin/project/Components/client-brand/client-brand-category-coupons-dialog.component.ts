import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-client-brand-category-coupons-dialog',
  templateUrl: './client-brand-category-coupons-dialog.component.html',
  styleUrls: ['./client-brand-category-coupons-dialog.component.css']
})
export class ClientBrandCategoryCouponsDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ClientBrandCategoryCouponsDialogComponent>
  ) {}

  close() {
    this.dialogRef.close();
  }
}
