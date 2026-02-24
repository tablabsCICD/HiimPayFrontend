import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ProjectService } from '../../../services/project.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-focusgroup-edit',
  templateUrl: './focusgroup-edit.component.html',
  styleUrl: './focusgroup-edit.component.css'
})
export class FocusgroupEditComponent implements OnInit {

  dropdownList: any[] = [];
  selectedItems: any[] = [];
  dropdownSettings: IDropdownSettings = {};
  meetingForm!:FormGroup;
  users:any;
  selectedUsers: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<FocusgroupEditComponent>,
  private service:ProjectService,
  private fb:FormBuilder,
  private toaster:ToastrService){}

  ngOnInit(): void {
    console.log(this.data);
    this.meetingForm = this.fb.group({
      title: ['', [Validators.required]],
      criteria: [''],
      description: [''],
      clientId: [''],
      loggedUserId: [''],
      id: ['']
    });
    this.getFocuseGroupById(this.data.groupId);
    this.getAllUsers();
     this.dropdownList = [
      // { id: 3, name: 'Pune' },
      //   { id: 4, name: 'Navsari' }
      ];
      this.selectedItems = [
        // { item_id: 3, item_text: 'Pune' },
        // { item_id: 4, item_text: 'Navsari' }
      ];
      this.dropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'name',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 10000,
        allowSearchFilter: true
      };
  }


  getAllUsers() {
    this.service.getAllusersByClientId(sessionStorage.getItem("ClientId")).subscribe((res: any) => {
      console.log(res);
      if (res.success) {
        this.users = res.data;
        this.dropdownList = this.users.map((user: any) => ({ id: user.id, name: user.name }));
      }
    })
  }

  getFocuseGroupById(groupId: number) {
    this.service.getFocuseGroupById(groupId).subscribe((res => {
      if (res.success) {
        const form = res.data;
        this.meetingForm.patchValue({
          title: form.focusGroup.title,
          criteria: form.focusGroup.criteria,
          description: form.focusGroup.description
        });
        this.selectedItems = res.data.listOfMember.map((user: any) =>  ({ id: user.userId, name: user.name }));
        // this.selectedUsers = res.data.listOfMember.map((user:any) =>  ({ id: user.userId, name: user.name }));
        console.log(this.selectedItems);
      }
    }));
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  updateFocusGroup() {
    console.log('its called')
    if (this.meetingForm.valid) {
      const form = this.meetingForm.value;
      console.log(this.selectedItems);
      const memberIds = this.selectedItems.map(user => user.id);
    const obj = {
      focusGroup: {
        clientId: sessionStorage.getItem("ClientId"),
        createdDate: new Date(),
        criteria: form.criteria,
        description: form.description,
        loggedUserId: JSON.parse(sessionStorage.getItem('currentLoggedInUserData')!).id,
        title: form.title
      },
      memberIds:memberIds
    }
    this.service.updateFocusGroup(this.data.groupId,obj).subscribe({
      next: (res: any) => {
        console.log(res);
        this.toaster.success('Group updated successfully');
        this.onClose();
      }, error: (err: any) => {
        console.log(err);
      }, complete: () => { }
    })
    }
  }
}
