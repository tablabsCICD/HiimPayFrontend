import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-onboard-employee-form',
  templateUrl: './onboard-employee-form.component.html',
  styleUrls: ['./onboard-employee-form.component.css']
})
export class OnboardEmployeeFormComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<OnboardEmployeeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      secondEmail: ['', Validators.email],
      phone: ['', Validators.required],
      designation: ['', Validators.required],
      company: [{ value: data?.company || '', disabled: true }],
      startDate: ['', Validators.required],
      employeeId: [{ value: this.generateEmployeeId(), disabled: true }],
      photo: [null]
    });
  }

  ngOnInit(): void {}

  generateEmployeeId() {
    const rnd = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `EMP-${rnd}`;
  }

  onFileChange(ev: any) {
    const file = ev.target.files && ev.target.files[0];
    if (file) this.form.patchValue({ photo: file });
  }

  submit() {
    if (this.form.invalid) return;
    const payload = { ...this.form.getRawValue() };
    this.dialogRef.close(payload);
  }

  cancel() {
    this.dialogRef.close();
  }
}
