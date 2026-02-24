import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CreateUserComponent } from '../../../project/Components/project-admin/create-user/create-user.component';
import { ProjectService } from '../../../project/services/project.service';

@Component({
  selector: 'app-create-consultant',
  templateUrl: './create-consultant.component.html',
  styleUrl: './create-consultant.component.css'
})
export class CreateConsultantComponent implements OnInit {
  items:any;
  isPopupOpen: boolean=false;
  show:boolean=false;
  surveyList:any;
  btnName:any='Create consultant';
  createForm!:FormGroup;
  isLoading:boolean=false;
  updateD:any;

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

      this.createForm = this.fb.group({
          address: [''],
          birthDate:[''],
          age:[''],
          city: ['',Validators.required],
          tenure:[''],
          // contactNumber: ['',[Validators.required, Validators.pattern('^[6-9]\\d{9}$')]],
          contactNumber: ['',[Validators.required, Validators.pattern('^[0-9]{10}$')]],
          email: ['',[Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
          gender: ['',Validators.required],
          jobType: ['',Validators.required],
          name: ['',Validators.required],
          loggedUserId:[''],
          typeOfUser: [''],
          verified :['',Validators.required],
          country:['',[Validators.required]],
          departmentName:[''],
          contractType:[''],  
          preferred_Communication_Channels:[''],
          state:['',Validators.required],
          workLocation:['',Validators.required],
          workFlexibility:['']
      });
  
      if(this.data?.name==='edit-user' && this.data.id!==null){
        this.btnName='Update consultant'
        this.updateD=this.data.id;
  console.log(this.updateD);
        this.onEdit();
      }
    }
  
    createUser(){
    
     if(this.btnName==='Create consultant'){
      console.log(this.createForm.value);
      
      console.log('Called')
      if(this.createForm.valid){
        const form=this.createForm.value;
        const obj = {
          address: form.address,
          birthDate: form.birthDate,
          city: form.city,
          client_id: sessionStorage.getItem("ClientId"),
          contactNumber: form.contactNumber,
          email: form.email,
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
          tenure:form.tenure,
          age:form.age,
          contractType:form.contractType,
          preferred_Communication_Channels:form.preferred_Communication_Channels,
          state:form.state,
          departmentName:form.departmentName,
          country:form.country,

        }
        console.log(obj);
        
        this.service.createUser(obj).subscribe((res)=>{
          if(res.success && res.message==='User registered successfully...!!'){
            this.isLoading=false;
            if(res.message=="Mobile number is already registered."){
              this.toster.error(res.message);
            }
            this.toster.success(res.message,'Success');
            this.onClose();
          }
          else if(res.message==='Mobile number is already registered.'){
            this.toster.error('Mobile number is already registered.');
          }
          else if(res.message==='Email Id is already registered.'){
            this.toster.error('Email Id is already registered.');
          }
        })
      }
      else{
        this.createForm.markAllAsTouched();
        this.toster.error('Please enter valid data!!','error');
      }
     }
     else if(this.btnName==='Update consultant'){
      if(this.createForm.valid){
        this.isLoading=true;
        const form=this.createForm.value;
        const obj = {
          address: form.address,
          birthDate: form.birthDate,
          city: form.city,
          client_id: sessionStorage.getItem("ClientId"),
          contactNumber: form.contactNumber,
          email: form.email,
          gender: form.gender,
          tenure:form.tenure,
          age:form.age,
          grade: "A",
          jobType: form.jobType,
          loggedUserId: JSON.parse(sessionStorage.getItem('currentLoggedInUserData')!).loggedUserId,
          name: form.name,
          password: "string@123",
          typeOfUser: form.typeOfUser,
          verified: form.verified,
          workLocation: form.workLocation,
          workFlexibility:form.workFlexibility,
          contractType:form.contractType,
          preferred_Communication_Channels:form.preferred_Communication_Channels,
          state:form.state,
          departmentName:form.departmentName,
          country:form.country,
  
  
        }
        console.log(obj);
        
        this.service.updateUser(this.updateD,obj).subscribe((res)=>{
          if(res.success && res.message==='User updated successfully.'){
            this.isLoading=false;
            this.toster.success(res.message,'Success');
              // sessionStorage.removeItem('currentLoggedInUserData');
              // sessionStorage.setItem(
              //   'currentLoggedInUserData',
              //   JSON.stringify(res.data)
              // );
            this.onClose();
          }
          else if(res.message==='Mobile number is already registered.'){
            this.toster.error('Mobile number is already registered.');
          }
          else if(res.message==='Email Id is already registered.'){
            this.toster.error('Email Id is already registered.');
          }
        })
      }
      else{
        this.createForm.markAllAsTouched();
        this.toster.error('Please enter valid data !!','error');
      }
     }
    }
  
    onClose(): void {
      this.dialogRef.close();
    }
  
  
    next(){
      this.dialogRef.close();
    }
  
    onEdit(){
   
      this.service.getByUserID(this.data.id).subscribe((res)=>{
        this.isLoading=false;
          const form = res;
          console.log(form)
          const birthDate = new Date(form.birthDate).toISOString().split('T')[0];
          this.createForm.patchValue({
            address: form.address,
            birthDate:birthDate,
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
            age:form.age,
            typeOfUser: form.typeOfUser,
            verified: form.verified,
            contractType:form.contractType, 
            preferred_Communication_Channels:form.preferred_Communication_Channels,
            state:form.state,
            departmentName:form.departmentName,
            country:form.country,
            workLocation:form.workLocation,
            workFlexibility:form.workFlexibility
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
  
  
  changeContent(){
    this.show=!this.show;
  }

}
