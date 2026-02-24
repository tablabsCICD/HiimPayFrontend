import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../../services/project.service';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements OnInit {
  items: any;
  isPopupOpen: boolean = false;
  show: boolean = false;
  surveyList: any;
  btnName: any = 'Create User';
  createForm!: FormGroup;
  isLoading: boolean = false;
  updateD: any;
  isAdmin: boolean = false;
  isCpoc: boolean = false;

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



  constructor(private dialogRef: MatDialogRef<CreateUserComponent>,
    @Inject(DIALOG_DATA) public data: { name: string, id: number },
    private router: Router,
    private route: ActivatedRoute,
    private service: ProjectService,
    private fb: FormBuilder,
    private toster: ToastrService) { }


  ngOnInit(): void {

    const loggedInUserData = JSON.parse(
      sessionStorage.getItem('currentLoggedInUserData')!
    );

    if(loggedInUserData?.typeOfUser === 1){
      this.isCpoc = true;
    }

    if (loggedInUserData.typeOfUser === 0) {
      this.isAdmin = true;
      console.log(this.isAdmin)
    } else {
      this.isAdmin = false;
    }

    this.createForm = this.fb.group({
      address: [''],
      birthDate: [''],
      age: ['', Validators.required],
      city: ['', Validators.required],
      tenure: ['', [Validators.required]],
      // contactNumber: ['',[Validators.required, Validators.pattern('^[6-9]\\d{9}$')]],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      gender: ['', Validators.required],
      jobType: ['', Validators.required],
      name: ['', Validators.required],
      loggedUserId: [''],
      typeOfUser: ['', Validators.required],
      country: ['', [Validators.required]],
      departmentName: ['', [Validators.required]],
      contractType: ['', [Validators.required]],
      preferred_Communication_Channels: ['', Validators.required],
      state: ['', Validators.required],
      workLocation: ['', Validators.required],
      verified: ['', Validators.required],
      workFlexibility: ['', Validators.required],
      lifeCycle: ['', Validators.required]
    });

    if (this.data?.name === 'edit-user' && this.data.id !== null) {
      this.btnName = 'Update User'
      this.updateD = this.data.id;
      console.log(this.updateD);
      this.onEdit();
    }
  }

  isFormValid(): boolean {
    return !!(this.createForm.get('email')?.valid) &&
      !!(this.createForm.get('state')?.valid) &&
      !!(this.createForm.get('gender')?.valid) &&
      !!(this.createForm.get('name')?.valid) &&
      !!(this.createForm.get('country')?.valid) &&
      !!(this.createForm.get('jobType')?.valid) &&
      !!(this.createForm.get('contactNumber')?.valid) &&
      // !!(this.createForm.get('typeOfUser')?.valid) &&
      !!(this.createForm.get('city')?.valid) && 
      !!(this.createForm.get('workLocation')?.valid) && 
      (this.isAdmin ? !!(this.createForm.get('typeOfUser')?.valid) : true);
  }


  createUser() {

    if (this.btnName === 'Create User') {
      if (this.isCpoc) {
        this.createForm.patchValue({ typeOfUser: 2 });
      }
      console.log(this.createForm.value);
      console.log('Called')
      if (this.createForm.valid) {
        const form = this.createForm.value;
        const obj = {
          address: form.address,
          birthDate: form.birthDate,
          city: form.city,
          client_id: sessionStorage.getItem("ClientId"),
          contactNumber: form.contactNumber,
          email: form.email.toLowerCase(),
          gender: form.gender,
          grade: "A",
          jobType: form.jobType,
          loggedUserId: JSON.parse(sessionStorage.getItem('currentLoggedInUserData')!).loggedUserId,
          name: form.name,
          password: "string@123",
          typeOfUser: form.typeOfUser,
          verified: form.verified,
          workLocation: form.workLocation,
          workFlexibility: form.workFlexibility,
          tenure: form.tenure,
          age: form.age,
          contractType: form.contractType,
          preferred_Communication_Channels: form.preferred_Communication_Channels,
          state: form.state,
          departmentName: form.departmentName,
          country: form.country,
          lifeCycle: form.lifeCycle

        }
        console.log(obj);

        this.service.createUser(obj).subscribe((res) => {
          if (res.success && res.message === 'User registered successfully...!!') {
            this.isLoading = false;
            if (res.message == "Mobile number is already registered.") {
              this.toster.error(res.message);
            }
            this.toster.success(res.message, 'Success');
            this.onClose();
          }
          else if (res.message === 'Mobile number is already registered.') {
            this.toster.error('Mobile number is already registered.');
          }
          else if (res.message === 'Email Id is already registered.') {
            this.toster.error('Email Id is already registered.');
          }
        })
      }
      else {
        this.createForm.markAllAsTouched();
        this.toster.error('Please enter valid data!!', 'error');
      }
    }
    else if (this.btnName === 'Update User') {
      if (this.createForm.valid) {
        this.isLoading = true;
        const form = this.createForm.value;
        const obj = {
          address: form.address,
          birthDate: form.birthDate,
          city: form.city,
          client_id: sessionStorage.getItem("ClientId"),
          contactNumber: form.contactNumber,
          email: form.email.toLowerCase(),
          gender: form.gender,
          tenure: form.tenure,
          age: form.age,
          grade: "A",
          jobType: form.jobType,
          loggedUserId: JSON.parse(sessionStorage.getItem('currentLoggedInUserData')!).loggedUserId,
          name: form.name,
          password: "string@123",
          typeOfUser: form.typeOfUser,
          verified: form.verified,
          workLocation: form.workLocation,
          workFlexibility: form.workFlexibility,
          contractType: form.contractType,
          preferred_Communication_Channels: form.preferred_Communication_Channels,
          state: form.state,
          departmentName: form.departmentName,
          country: form.country,
          lifeCycle: form.lifeCycle

        }
        console.log(obj);

        this.service.updateUser(this.updateD, obj).subscribe((res) => {
          if (res.success && res.message === 'User updated successfully.') {
            this.isLoading = false;
            this.toster.success(res.message, 'Success');
            if (!this.isAdmin) {
              sessionStorage.removeItem('currentLoggedInUserData');
              sessionStorage.setItem(
                'currentLoggedInUserData',
                JSON.stringify(res.data)
              );
            }
            this.onClose();
          }
          else if (res.message === 'Mobile number is already registered.') {
            this.toster.error('Mobile number is already registered.');
          }
          else if (res.message === 'Email Id is already registered.') {
            this.toster.error('Email Id is already registered.');
          }
        })
      }
      else {
        this.createForm.markAllAsTouched();
        this.toster.error('Please enter valid data !!', 'error');
      }
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }


  next() {
    this.dialogRef.close();
  }

  onEdit() {

    this.service.getByUserID(this.data.id).subscribe((res) => {
      this.isLoading = false;
      const form = res;
      console.log(form)
      const birthDate = new Date(form.birthDate).toISOString().split('T')[0];
      this.createForm.patchValue({
        address: form.address,
        birthDate: birthDate,
        city: form.city,
        client_id: sessionStorage.getItem("ClientId"),
        contactNumber: form.contactNumber,

        email: form.email,
        gender: form.gender,
        grade: "A",
        jobType: form.jobType,
        loggedUserId: 1,
        name: form.name,
        password: "string",
        tenure: form.tenure,
        age: form.age,
        typeOfUser: form.typeOfUser,
        verified: form.verified,
        contractType: form.contractType,
        preferred_Communication_Channels: form.preferred_Communication_Channels,
        state: form.state,
        departmentName: form.departmentName,
        country: form.country,
        workLocation: form.workLocation,
        workFlexibility: form.workFlexibility,
        lifeCycle: form.lifeCycle
      })
    })
  }


  file: any;
  isSelectedFileValid: boolean = false;
  formData: any;
  onDrop(event: any) {
    event.preventDefault();
    [...event.dataTransfer.items].forEach((item, i) => {
      // If dropped items aren't files, reject them
      if (item.kind === 'file') {
        this.file = item.getAsFile();
        this.validateFile();
      }
    });
    document.getElementById('dropzone')!.style.background = 'white';
  }
  validateFile() {
    if (
      ![
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ].includes(this.file.type)
    ) {
      this.isSelectedFileValid = false;
    } else {
      this.isSelectedFileValid = true;
      const formData = new FormData();
      formData.append('file', this.file);
      this.formData = formData;
    }
  }

  onDragOver(event: any) {
    event.stopPropagation();
    event.preventDefault();
    document.getElementById('dropzone')!.style.background = '#c8dadf';
  }
  ondragleave(event: any) {
    document.getElementById('dropzone')!.style.background = 'white';
  }

  uploadFile() {

  }
  onFileBrowse(event: any) {
    const inputElement = event.target as HTMLInputElement;
    this.file = inputElement?.files?.[0]; // Get the selected file
    if (this.file) {
      this.validateFile();
    }
  }

  changeContent() {
    this.show = !this.show;
  }

}
