import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TouchpointService } from '../../../services/touchpoint.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assignpopup',
  templateUrl: './assignpopup.component.html',
  styleUrl: './assignpopup.component.css'
})
export class AssignpopupComponent implements OnInit {
  touchpointStageId: any;
  touchpointStageName:any
  selecetdSubPhase: any;
  subphasename: any;
  createTouchpointForm!: FormGroup;
  isNavigated:boolean=false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AssignpopupComponent>,
    private fb: FormBuilder,
    private tostr: ToastrService,
    private service: TouchpointService,
    private router: Router) { }

  ngOnInit(): void {
    this.touchpointStageId = this.data.stageId;
    this.touchpointStageName = this.data.stageName;
    this.createTouchpointForm = this.fb.group({
      subPhaseName: ['', Validators.required],
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  next(id: any) {
    console.log(this.subphasename);
    console.log(this.touchpointStageId);
    if (id === 1) {
      if (this.createTouchpointForm.valid) {
        this.isNavigated = true;
        const form=this.createTouchpointForm.value;
        this.onClose();
        this.router.navigate(['superadmin/assign-touchpoint'], {
          queryParams: {
            touchpointStageId: this.touchpointStageId,
            touchpointStageName : this.touchpointStageName,
            touchpointSubPhase: form.subPhaseName
          },
        });
        this.isNavigated=false;
      }
      else {
        this.createTouchpointForm.markAllAsTouched();
        this.isNavigated=false;
      }
    }
    else if (id === 2) {
      if (this.createTouchpointForm.valid) {
        const form=this.createTouchpointForm.value;
        console.log(form.subPhaseName)
        this.onClose();
        this.router.navigate(['superadmin/assign-component'], {
          queryParams: {
            touchpointStageId: this.touchpointStageId,
            touchpointStageName : this.touchpointStageName,
            touchpointSubPhase: form.subPhaseName
          },
        });
      }
      else {
        this.createTouchpointForm.markAllAsTouched();
      }
    }
  }
}
