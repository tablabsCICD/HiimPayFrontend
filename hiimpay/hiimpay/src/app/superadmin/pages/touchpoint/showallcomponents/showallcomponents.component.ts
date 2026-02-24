import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TouchpointService } from '../../../services/touchpoint.service';
import * as bootstrap from 'bootstrap';
import { DATE } from 'ngx-bootstrap/chronos/units/constants';
import { DeleteComponent } from '../../delete/delete.component';

@Component({
  selector: 'app-showallcomponents',
  templateUrl: './showallcomponents.component.html',
  styleUrl: './showallcomponents.component.css'
})
export class ShowallcomponentsComponent implements OnInit {
  allComponents: any;
  isLoading:boolean=false;
  collapseCreateComponent: any;
  createComponentForm!: FormGroup;
  btnName:any='Create component';
  componentId:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ShowallcomponentsComponent>,
    private fb: FormBuilder,
    private tostr: ToastrService,
    private dialog: MatDialog,
    private service: TouchpointService,) { }

  ngOnInit(): void {
    this.getAllComponents();
    this.createComponentForm = this.fb.group({
      componentName: ['', Validators.required],
      created_date:[''],
      weightage: [''],
      description: [''],
      loggedUserId: [''],
    });
  }

  getAllComponents() {
    this.isLoading=true;
    this.service.getAllComponents().subscribe({
      next: (res) => {
        this.allComponents = res.data;
        this.isLoading=false;
      }, error: (err) => {
        console.log(err)
      }, complete: () => { }
    })
  }

  onClose() {
    this.dialogRef.close();
  }

  toggleComponentForm() {
    this.btnName='Create component'
    const componentRef = document.getElementById('component')!;
    this.collapseCreateComponent = new bootstrap.Collapse(componentRef);
    this.collapseCreateComponent.toggle();
    this.createComponentForm.reset();
  }

  createComponent() {
   if(this.btnName==='Create component'){
    if (this.createComponentForm.valid) {
      const form = this.createComponentForm.value;
      const obj = {
        componentName: form.componentName,
        weightage: form.weightage,
        description: form.description,
        created_date: new Date(),
        loggedUserId: JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id,
      }

      this.service.createComponentForReality(obj).subscribe({
        next: (res) => {
          this.tostr.success(res.message, 'Success');
          this.createComponentForm.reset();
          this.getAllComponents();
          this.collapseCreateComponent.hide();
        }, error: (err) => { console.log(err) }, complete: () => { }
      });
    }
    else {
      this.createComponentForm.markAllAsTouched();
    }
   }
   else if(this.btnName==='Update component'){
    if (this.createComponentForm.valid) {
      const form = this.createComponentForm.value;
      const obj = {
        componentName: form.componentName,
        weightage: form.weightage,
        description: form.description,
        loggedUserId: JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id,
      }

      this.service.updateComponentForRealityById(this.componentId,obj).subscribe({
        next: (res) => {
          this.tostr.success(res.message, 'Success');
          this.getAllComponents();
          this.createComponentForm.reset();
          this.collapseCreateComponent.hide();
        }, error: (err) => { console.log(err) }, complete: () => { }
      });
    }
    else {
      this.createComponentForm.markAllAsTouched();
    }
   }
  }

  onEdit(componentId: any) {
    this.btnName='Update component';
    this.componentId=componentId;
    this.service.getComponentForRealityById(componentId).subscribe({
      next: (res) => {
        const form = res.data;
        this.createComponentForm.patchValue({
          componentName: form.componentName,
          weightage: form.weightage,
          description: form.description,
        })
      }, error: (err) => { console.log(err) }, complete: () => { }
    })

    const componentRef = document.getElementById('component')!;
    this.collapseCreateComponent = new bootstrap.Collapse(componentRef);
    this.collapseCreateComponent.show();
  }


  onDelete(componenetId: any) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: {
        message: `Do you really want to deactivate the records for ${componenetId.componentName} ?`,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.action == 'ok') {
        this.collapseCreateComponent.hide();
        this.service.deleteComponentForRealityById(componenetId.id).subscribe({
          next: (res) => {
            this.tostr.success(res.message, 'Success');
            this.getAllComponents();
          }, error: (err) => { console.log(err) }, complete: () => { }
        })
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
