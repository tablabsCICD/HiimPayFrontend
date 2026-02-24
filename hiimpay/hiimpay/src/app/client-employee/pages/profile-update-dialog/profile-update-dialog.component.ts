import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../service/employee.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile-update-dialog',
  templateUrl: './profile-update-dialog.component.html',
  styleUrl: './profile-update-dialog.component.css',
})
export class ProfileUpdateDialogComponent implements OnInit {
  updateRecordsForm!: FormGroup;
  profileInfo: any;
  formDataMatched: boolean = true;

  departmentOptions: string[] = [
    'Compliance and legal',
    'External Communications',
    'Facilities Management',
    'Finance',
    'HR Shared Services',
    'HR',
    'Internal Communications',
    'IT',
    'Learning & Development',
    'Operations',
    'Procurement',
    'Security',
    'Other'
  ];
  

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProfileUpdateDialogComponent>,
    private fb: FormBuilder,
    private service: EmployeeService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // let parsedProfileInfo : any;
    // let id = JSON.parse(sessionStorage.getItem('currentLoggedInUserData')!).id;
    // this.service.getUserById(id).subscribe({next:(res:any)=>{
    //   parsedProfileInfo = res;
    // },error:(err)=>{console.log(err)},complete:()=>{}})
    let parsedProfileInfo = JSON.parse(
      sessionStorage.getItem('currentLoggedInUserData')!
    );

    this.profileInfo = {
      name: parsedProfileInfo?.name,
      workLocation: parsedProfileInfo?.workLocation,
      jobType: parsedProfileInfo?.jobType,
      departmentName: parsedProfileInfo?.departmentName,
      email: parsedProfileInfo?.email,
      contactNumber: parsedProfileInfo?.contactNumber,
    };

    this.updateRecordsForm = this.fb.group({
      name: [this.profileInfo.name, [Validators.required]],
      workLocation: [this.profileInfo.workLocation, [Validators.required]],
      jobType: [this.profileInfo.jobType, [Validators.required]],
      departmentName: [this.profileInfo.departmentName, [Validators.required]],
      verified: [true],
      email: [
        this.profileInfo.email,
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      contactNumber: [
        this.profileInfo.contactNumber,
        [Validators.required, Validators.pattern('^[6-9]\\d{9}$')],
      ],
    });
    this.onFormChange();
  }

  onFormChange() {
    this.updateRecordsForm.valueChanges.subscribe((val) => {
      this.formDataMatched =
        JSON.stringify(val) === JSON.stringify(this.profileInfo);
    });
  }

  onNoClick() {
    this.dialogRef.close({ action: 'no' });
    this.updateRecordsForm.reset();
  }

  onSubmit() {
    let id = JSON.parse(sessionStorage.getItem('currentLoggedInUserData')!).id;

    let finalObj = Object.entries(this.updateRecordsForm.value).reduce(
      (current: any, next: any) => {
        next[1] !== this.profileInfo[next[0]]
          ? (current[next[0]] = next[1])
          : '';
        return current;
      },
      {}
    );

    this.service.updateUser(id, finalObj).subscribe({
      next: (val: any) => {
        sessionStorage.setItem(
          'currentLoggedInUserData',
          JSON.stringify(val.data)
        );
        this.toastr.success('Profile updated successfully');
        this.dialogRef.close({ action: 'ok' });
      },
      error: (err: any) => {
        this.toastr.error('Something went wrong. Please try again');
      },
    });
  }
}
