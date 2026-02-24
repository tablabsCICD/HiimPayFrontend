import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-voucher-detail-dialog',
  templateUrl: './voucher-detail-dialog.component.html',
  styleUrls: ['./voucher-detail-dialog.component.css']
})
export class VoucherDetailDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<VoucherDetailDialogComponent>
  ) {}

  close() {
    this.dialogRef.close();
  }

  asArray(value: any): any[] {
    return Array.isArray(value) ? value : [];
  }
}

