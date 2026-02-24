import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../../services/project.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { CreateGroupComponent } from '../create-group/create-group.component';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent {
  dept: any[] = [];
  dataId: any;
  deptDetails: any;
  emp: any;
  index: any;
  vissible: boolean = true;
  isVissible: boolean = false;
  submitted: boolean = false;
  meetingForm!: FormGroup;
  clientId: any;
  allUser: any;
  allFocusGroup:any;
  checkMeetingCreateSpinner:boolean = false;
  minStartTime: string='';
  filteredUsers!: Observable<any[]>;
  selectedUserId: any;
  isCpoc: boolean = false;

  constructor(private service: ProjectService,
    private formBuilder: FormBuilder,
    private dateAdapter: DateAdapter<Date>,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ScheduleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toster: ToastrService) {
  }

  ngOnInit(): void {
    console.log(this.data);
    const clientData = sessionStorage?.getItem('ClientData');
    this.isCpoc = sessionStorage.getItem('isCpoc') == 'true';
    const id = sessionStorage.getItem("ClientId");
    this.meetingForm = this.formBuilder.group({
      selectedOption: ['',Validators.required],
      createdDate: [''],
      consultantId:[''],
      description: ['', [Validators.required]],
      meetingDate: ['', [Validators.required]],
      meeting_link: ['', [Validators.required]],
      startTime: ['', [Validators.required, this.startTimeValidator()]],
      endTime: ['', [Validators.required, this.endTimeValidator()]],
      title: ['', [Validators.required]],
      userId: ['',],
      focusGroupId: ['',],
      location:['',[Validators.required]]
    });

    if (this.isCpoc) {
      this.meetingForm.get('selectedOption')?.setValue('group');
      this.updateValidators('group');
    }

    this.updateMinStartTime();

    this.meetingForm.get('startTime')?.valueChanges.subscribe(startTime => {
      this.validateTimes();
    });

    this.meetingForm.get('endTime')?.valueChanges.subscribe(endTime => {
      this.validateTimes();
    });


    this.meetingForm.get('selectedOption')?.valueChanges.subscribe(option => {
      this.updateValidators(option);
    });

    if(clientData){
      this.service.getUserByClientID(sessionStorage.getItem("ClientId")).subscribe({
        next: (res: any) => {
          console.log(res);
          this.allUser = res.data;
          this.filteredUsers = this.meetingForm.get('userId')!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterUsers(value))
          );
        }, error: (err: any) => {
          console.log(err);
        }, complete: () => { }
    
      });
    }

    if (this.data && this.data.id) {
      if(this.data.tableType==='Meeting'){
       this.getFocuseGroupById(this.data.id);
       this.meetingForm.get('selectedOption')?.setValue('group');
       this.updateValidators('group');
      }
      else{
      this.getInterviewById(this.data.id);
      this.meetingForm.get('selectedOption')?.setValue('employee');
       this.updateValidators('employee');
      }
      this.vissible = false;
      this.isVissible = true;
    }

   if(clientData){
    this.getAllFocuseGroupByClientID();
   }
  }

  filterUsers(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.allUser.filter((user:any) => user.name.toLowerCase().includes(filterValue));
  }

  displayUser(user: any): string {
    return user && user.name ? user.name : '';
  }

  updateValidators(option: string): void {
    const userIdControl = this.meetingForm.get('userId');
    const focusGroupIdControl = this.meetingForm.get('focusGroupId');

    if (option === 'employee') {
      userIdControl?.setValidators([Validators.required]);
      focusGroupIdControl?.clearValidators();
    } else if (option === 'group' || !this.isCpoc) {
      focusGroupIdControl?.setValidators([Validators.required]);
      userIdControl?.clearValidators();
    }

    userIdControl?.updateValueAndValidity();
    focusGroupIdControl?.updateValueAndValidity();
  }

  getUserName(userId: string): string {
    const user = this.allUser.find((user:any) => user.id === userId);
    return user ? user.name : '';
  }

  onUserSelected(user: any): void {
    // this.meetingForm.get('userId')?.setValue(user.id);
    this.selectedUserId=user.id;
  }

  updateMinStartTime() {
    const currentTime = new Date();
    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    this.minStartTime = `${hours}:${minutes}`;
    console.log(this.minStartTime);
  }

  private startTimeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const meetingDate = this.meetingForm?.get('meetingDate')?.value;
      const startTime = control.value;
      const currentDate = new Date().toISOString().split('T')[0];
      const currentTime = new Date().toTimeString().slice(0, 5);

      if (meetingDate === currentDate && startTime < currentTime) {
        return { 'invalidStartTime': true };
      }
      return null;
    };
  }

  private endTimeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const startTime = this.meetingForm?.get('startTime')?.value;
      const endTime = control.value;

      if (startTime && endTime <= startTime) {
        return { 'timeInvalid': true };
      }
      return null;
    };
  }

  validateTimes(): void {
    const startTime = this.meetingForm.get('startTime')?.value;
    const endTime = this.meetingForm.get('endTime')?.value;

    if (startTime && endTime && startTime >= endTime) {
      this.meetingForm.get('endTime')?.setValue('');
      this.meetingForm.get('endTime')?.setErrors({ timeInvalid: true });
    } else {
      this.meetingForm.get('endTime')?.setErrors(null);
    }
  }

  onEmployeeInput() {
    const inputName = this.meetingForm.get('userId')!.value;
    const selectedEmployee = this.allUser.find((user:any) => user.name === inputName);
    if (selectedEmployee) {
      this.meetingForm.get('userId')!.setValue(selectedEmployee.id, { emitEvent: false });
    }
  }


onDateChange(){
  const startTimeControl = this.meetingForm.get('startTime');
    const endTimeControl = this.meetingForm.get('endTime');
    startTimeControl?.setValue(null);
    endTimeControl?.setValue(null);
}

  getAllFocuseGroupByClientID() {
    this.service.getAllFocusGroupByClientId(sessionStorage.getItem("ClientId")).subscribe({
      next: (res: any) => {
        console.log(res);
        this.allFocusGroup = res.data;
      }, error: (err: any) => {
        console.log(err);
      }, complete: () => { }
    });
  }


  createMeeting() {
    console.log(this.meetingForm.value);
    if (this.meetingForm.valid) {
      this.checkMeetingCreateSpinner=true;
      const form = this.meetingForm.value;
      let obj;
      if (form.selectedOption === 'employee') {
       obj = {
        active: true,
        clientId: sessionStorage.getItem("ClientId"),
        consultantId: JSON.parse(sessionStorage.getItem("ClientData")!).consultantId,
         createdDate: new Date(),
        description: form.description,
        // id: 0,
        location: form.location,
        loggedUserId: JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id,
        meetingDate: form.meetingDate,
        meeting_link: form.meeting_link,
        startTime:form.startTime,
        endTime:form.endTime,
        // timeDuration: form.timeDuration,
        title: form.title,
        userId: this.selectedUserId
      }
     
    }else if (form.selectedOption === 'group') {
      obj = {
        active: true,
        clientId: sessionStorage.getItem("ClientId"),
        consultantId: JSON.parse(sessionStorage.getItem("ClientData")!).consultantId,
        // createdDate: new Date(),
        description: form.description,
        // id: 0,
        location: form.location,
        loggedUserId: JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id,
        meetingDate: form.meetingDate,
        meetingLink: form.meeting_link,
        startTime:form.startTime,
        endTime:form.endTime,
        // timeDuration: form.timeDuration,
        title: form.title,
        focusGroupId: form.focusGroupId
      }
    }
    console.log(obj);
      const id = this.clientId
      if(form.selectedOption === 'employee'){
        this.service.createMeeting(obj).subscribe({
          next: (res: any) => {
            console.log(res);
            this.toster.success(res.message, 'Success');
            this.checkMeetingCreateSpinner=false;
            this.onClose();
            window.location.reload();
            this.meetingForm.reset();
          }, error: () => { }, complete: () => { }
        })
      }
      else if(form.selectedOption === 'group'){
        this.service.createFocuseGroupMeeting(obj).subscribe({
          next: (res: any) => {
            console.log(res);
            this.toster.success(res.message, 'Success');
            this.checkMeetingCreateSpinner=false;
            this.onClose();
            window.location.reload();
            this.meetingForm.reset();
          }, error: () => { }, complete: () => { }
        })
      }
    } else {
      this.meetingForm.markAllAsTouched();
      this.toster.error('Please enter valid data')
    }
  }
  
  updateMeeting() {
    console.log(this.meetingForm.value);
    if (this.meetingForm.valid) {
      this.checkMeetingCreateSpinner=true;
      const form = this.meetingForm.value;
      let obj 
      
      if(this.data.tableType==='Interview'){
        obj = {
        active: true,
        clientId: sessionStorage.getItem("ClientId"),
        consultantId: JSON.parse(sessionStorage.getItem("ClientData")!)?.consultantId,
        createdDate: new Date(),
        description: form.description,
        id: form.id,
        location: form.location,
        loggedUserId: JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!)?.id,
        meetingDate: form.meetingDate,
        meeting_link: form.meeting_link,
        startTime:form.startTime,
        endTime:form.endTime,
        // timeDuration: form.timeDuration,
        title: form.title,
        userId: form.userId
        }
      }
      else if(this.data.tableType==='Meeting'){
        obj = {
          active: true,
          clientId: sessionStorage.getItem("ClientId"),
          consultantId: JSON.parse(sessionStorage.getItem("ClientData")!)?.consultantId,
          // createdDate: new Date(),
          description: form.description,
          id: form.id,
          location: form.location,
          loggedUserId: JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!)?.id,
          meetingDate: form.meetingDate,
          meeting_link: form.meetingLink,
          startTime:form.startTime,
          endTime:form.endTime,
          // timeDuration: form.timeDuration,
          title: form.title,
          focusGroupId: form.focusGroupId
        }
      }
      const id = this.data.id
      if(this.data?.tableType==='Interview'){
        console.log(this.data, id)
        this.service.updateInterview(id,obj).subscribe({
          next: (res: any) => {
            console.log(res);
            this.toster.success(res.message, 'Success');
            this.checkMeetingCreateSpinner=false;
            window.location.reload();
            this.onClose();
          }, error: () => { }, complete: () => { }
        });
      }
      else if(this.data?.tableType==='Meeting'){
        this.service.updateMeeting(id,obj).subscribe({
          next: (res: any) => {
            console.log(res);
            this.toster.success(res.message, 'Success');
            this.checkMeetingCreateSpinner=false;
            window.location.reload();
            this.onClose();
          }, error: () => { }, complete: () => { }
        })
      }
    } else {
      this.meetingForm.markAllAsTouched();
      this.toster.error('Please enter valid data');
     }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onGroupChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    if (selectedValue === 'createGroup') {
      this.createGroups();
      selectElement.value = 'Select group';
    }
  }


  createGroups() {
    const dialogRef = this.dialog.open(CreateGroupComponent, {
      width: '1100px',
      height: '700px',
      disableClose: true,
      data: { name: 'createGroup' }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getAllFocuseGroupByClientID();
    })

  }

  getFocuseGroupById(id:number){
    this.service.getFocuseGroupMeetingById(id).subscribe({next:(res)=>{
      if(res.success){
        const form = res.data.focusGroupMeeting;
        const meetingDate = form.meetingDate ? new Date(form.meetingDate).toISOString().split('T')[0] : null;
        this.meetingForm.patchValue({
          active: true,
          clientId: sessionStorage.getItem("ClientId"),
          consultantId: JSON.parse(sessionStorage.getItem("ClientData")!)?.consultantId,
          // createdDate: new Date(),
          description: form.description,
          id: form.id,
          location: form.location,
          loggedUserId: JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!)?.id,
          meetingDate: meetingDate,
          meeting_link: form.meetingLink,
          startTime:form.startTime,
          endTime:form.endTime,
          // timeDuration: form.timeDuration,
          title: form.title,
          focusGroupId: form.focusGroupId,
        })
      }
    },error:(err)=>{console.log(err)},complete:()=>{}})
  }

  getInterviewById(id: any) {
    this.service.getOneToOneInterviewById(id).subscribe((res) => {
      if (res.success) {
        const form = res.data;
        const meetingDate = form.meetingDate ? new Date(form.meetingDate).toISOString().split('T')[0] : null;
        this.meetingForm.patchValue({
          createdDate: form.createdDate,
          description: form.description,
          meetingDate: meetingDate,
          meeting_link: form.meeting_link,
          startTime:form.startTime,
          endTime:form.endTime,
          // timeDuration: form.timeDuration,
          title: form.title,
          userId: form.userId,
          location:form.location,
        });
      }
    })
  }


  getToday(): string {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const dd = String(today.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
  }

}
