import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TouchpointService } from '../../../services/touchpoint.service'; 
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import { DeleteComponent } from '../../delete/delete.component';

@Component({
  selector: 'app-showalltouchpoint',
  templateUrl: './showalltouchpoint.component.html',
  styleUrl: './showalltouchpoint.component.css'
})
export class ShowalltouchpointComponent implements OnInit {
  touchpoints:any;
  btnName:any='Create touchpoint';
  isLoading:boolean=false;
  collapseCreateTouchpoint:any;
  createTouchPointForm!:FormGroup;
  touchpointId:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
   private dialogRef: MatDialogRef<ShowalltouchpointComponent>,
    private fb: FormBuilder,
    private tostr: ToastrService,
    private service:TouchpointService,
    private dialog: MatDialog,){}

  ngOnInit(): void {
    this.getAllTouchpoints();
    this.createTouchPointForm = this.fb.group({
      touchpoints: ['', Validators.required],
      created_date:[''],
      weightage:[''],
      loggedUserId: [''],
      status: ['']
    });
  }

  getAllTouchpoints(){
    this.isLoading=true;
    this.service.getAllTouchPoints().subscribe({next:(res)=>{
      this.touchpoints=res.data;
      this.isLoading=false;
    },error:(err)=>{console.group(err)},complete:()=>{}});
  }

  onClose() {
    this.dialogRef.close();
  }

  toggleTouchpointForm() {
    this.btnName='Create touchpoint'
    const touchPointRef = document.getElementById('touchpoint')!;
    this.collapseCreateTouchpoint = new bootstrap.Collapse(touchPointRef);
    this.collapseCreateTouchpoint.toggle();
  }

  createTouchpoint(){
   if(this.btnName==='Create touchpoint'){
    if (this.createTouchPointForm.valid) {
      const form = this.createTouchPointForm.value;
      const obj = {
        touchpoints:form.touchpoints,
        weightage:form.weightage,
        created_date:new Date(),
        loggedUserId: JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id,
      }

      this.service.createTouchpoint(obj).subscribe({
        next: (res) => {
          this.tostr.success(res.message, 'Success');
          this.createTouchPointForm.reset();
          this.getAllTouchpoints();
          this.collapseCreateTouchpoint.hide();
        }, error: (err) => { console.log(err) }, complete: () => { }
      });
    }
    else {
      this.createTouchPointForm.markAllAsTouched();
    }
   }

   else if(this.btnName==='Update touchpoint'){
    if (this.createTouchPointForm.valid) {
      const form = this.createTouchPointForm.value;
      const obj = {
        touchpoints:form.touchpoints,
        weightage:form.weightage,
        loggedUserId: JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id,
        created_date:form.created_date,
        status : form.status
      }

      this.service.updateToucpointById(this.touchpointId,obj).subscribe({
        next: (res) => {
          this.tostr.success(res.message, 'Success');
          this.createTouchPointForm.reset();
          this.getAllTouchpoints();
          this.collapseCreateTouchpoint.hide();
        }, error: (err) => { console.log(err) }, complete: () => { }
      });
    }
    else {
      this.createTouchPointForm.markAllAsTouched();
    }
   }
  }

  onEdit(touchpointId:any){
    this.btnName='Update touchpoint';
    this.touchpointId=touchpointId;
    this.service.getTouchpointById(touchpointId).subscribe({next:(res)=>{
      const form=res.data;
      this.createTouchPointForm.patchValue({
        touchpoints:form.touchpoints,
        created_date:form.created_date,
        weightage:form.weightage,
        status:form.status,
      });
    },error:(err)=>{console.log(err);},complete:()=>{}});

    const touchPointRef = document.getElementById('touchpoint')!;
    this.collapseCreateTouchpoint = new bootstrap.Collapse(touchPointRef);
    this.collapseCreateTouchpoint.show();
  }

 

  onDelete(touchpointId: any) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: {
        message: `Do you really want to deactivate the records for ${touchpointId.touchpoints} ?`,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.action == 'ok') {

        this.service.getTouchpointById(touchpointId).subscribe({next:(res)=>{
          const form=res.data;
          this.createTouchPointForm.patchValue({
            touchpoints:form.touchpoints,
            created_date:form.created_date,
            weightage:form.weightage,
            status:"false",
          });
        },error:(err)=>{console.log(err);},complete:()=>{}});
   
        this.service.deleteTouchpointById(touchpointId.id).subscribe({next:(res)=>{
          this.tostr.success(res.message,'Success');
          this.getAllTouchpoints();
        },error:(err)=>{console.log(err)},complete:()=>{}})

        this.createTouchPointForm.reset();
      }
    });
  }

  isNumber(evt: any) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

}
