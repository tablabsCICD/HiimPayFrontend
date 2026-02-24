import { Component, ElementRef, ViewChild, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../../services/project.service';
import { ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DeleteComponent } from '../../../../pages/delete/delete.component';
import { HttpErrorResponse } from '@angular/common/http';



@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.css'
})

export class CreateGroupComponent implements OnInit {

  showContainer: number = 1;
  loading: boolean = true;
  loadingforCreateGroup: boolean = false;
  meetingForm!: FormGroup;
  vissible: boolean = true;
  selectedUserForInfo: any;
  isVissible: boolean = false;
  name: any;
  dataId: any;
  index: any;
  groupInfoName: any;
  users: any;
  usersBeforeSearch : any;
  openGroup: any;
  // users: any[] = ['Gaurav', 'soham', 'Gotu', 'Yogesh', 'Gaurav1', 'soham1', 'Gotu1', 'Yogesh1', 'Gaurav2', 'soham2', 'Gotu2', 'Yogesh2', 'Hari', 'Rohit', 'Virat', 'Vijay', 'Sai']
  clientId: any;
  dropdownList: any;
  showMessage: boolean = false;
  selectedItems: any[] = [];
  originalFilteredUsers: any[] = [];
  filteredUsers: any;
  tenure: any;
  jobType: any;
  gender: any;
  contractType: any;
  lifeCycle: any
  selectedParent: any = '';
  @ViewChild('parentSelect') parentSelect!: ElementRef;
  addUserSpinner: boolean = false;
  selectAll: boolean = false;
  filterSelections: { [key: string]: any[] } = {};
  filteruserstored: any[] = [];

  dropdownSettings: IDropdownSettings = {};
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreateGroupComponent>,
    private toaster: ToastrService,
    private service: ProjectService,
    private dialog: MatDialog,
    private fb: FormBuilder) { }

  ngOnInit(): void {

    if (this.data.name === 'openGroup') {
      this.getFocusGroupById(this.data.id);
    }

    this.meetingForm = this.fb.group({
      title: ['', [Validators.required]],
      criteria: [''],
      description: [''],
      active: [''],
      clientId: [''],
      loggedUserId: [''],
      id: ['']
    });
    this.getAllUsers();
  }

  getAllUsers() {
    this.loading = true;
    this.service.getAllusersByClientId(sessionStorage.getItem("ClientId")).subscribe((res: any) => {
      console.log(res);
      // this.dropdownList = [res.id,res.name]
      if (res.success) {
        this.dropdownList = res.data;
        this.loading = false;
        this.users = this.dropdownList.map((user: any) => {
          return {
            id: user.id,
            name: user.name
          };
        });
        this.usersBeforeSearch = this.users;
      }
    });
  }

  getFocusGroupById(id: number) {
    this.service.getFocusGroupByID(id).subscribe({
      next: (res) => {
        this.openGroup = res.data.listOfMember;
        this.groupInfoName = res.data.focusGroup;
      }, error: (err) => { console.log(err) }, complete: () => { }
    })
  }

  isSelected(user: any): boolean {
    return this.selectedUsers.some(u => u.id === user.id);
  }

  searchGroup(e: any) {
    console.log(e);
    const keyword = e.target.value.toLowerCase();
  
    if (keyword.length > 0) {
      this.users = this.usersBeforeSearch.filter((user: any) =>
        user.name.toLowerCase().includes(keyword)
      );
    } else {
      this.users = [...this.usersBeforeSearch]; // Reset to original user list
    }
    // if (e.target.value.length > 0) {
    //   const obj = {
    //     clientId: sessionStorage.getItem("ClientId"),
    //     keyword: e.target.value
    //   }
    //   console.log(obj); 
    //   this.service.searchGroup(obj).subscribe({
    //     next: (res: any) => {
    //       console.log(res);
    //       if (res.success) {
    //         this.users = res.data.map((user: any) => {
    //           return {
    //             id: user.id,
    //             name: user.name
    //           };
    //         });
    //       }
    //     },
    //     error: (err: HttpErrorResponse) => {
    //       console.log(err);
    //       if (err.error.message == "User not found.") {
    //         this.users = []
    //       }
    //     },
    //     complete: () => {

    //     }
    //   })
    // }
    // else {
    //   this.getAllUsers()
    // }

  }

  onChangeParent(event: any) {
    this.selectedParent = event.target.value;
  }

  filterUser(e: any) {
    this.users = [];
    this.loading = true;
    this.filteruserstored = [];
    if (this.selectedParent === 'contractType') {
      this.contractType = e.target.value;
    }
    else if (this.selectedParent === 'gender') {
      this.gender = e.target.value;
    }
    else if (this.selectedParent === 'jobType') {
      this.jobType = e.target.value;
    }
    else if (this.selectedParent === 'tenure') {
      this.tenure = e.target.value;
    }
    else if (this.selectedParent === 'Lifecycle') {
      this.lifeCycle = e.target.value;
    }
    console.log(e);
    if (e.target.value.length > 0) {
      // this.selectAll = false;
      const obj = {
        clientId: sessionStorage.getItem("ClientId"),
        selectedParent: this.selectedParent,
        selectedChild: e.target.value
      }
      console.log(obj);
      this.service.searchUserByFilter(obj).subscribe({
        next: (res: any) => {
          console.log(res);
          if (res.success) {
            this.loading = false;
            this.filteruserstored = res.data;
            this.users = res.data.map((user: any) => {
              return {
                id: user.id,
                name: user.name
              };
            });
            this.usersBeforeSearch = this.users;
            // if(this.users===this.selectedUsers){
            //   this.selectedUsers = [...this.users];
            //   this.selectAll = true;
            // }
            this.selectAll = this.users.every((user: any) =>
              this.selectedUsers.some(selected => selected.id === user.id)
            );
            // if (this.filterSelections[this.selectedParent] &&
            //   this.filterSelections[this.selectedParent].length === this.users.length) {
            //   this.selectedUsers = [...this.users];
            //   this.selectAll = true;
            // }
          }
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          if (err.error.message == "User not found.") {
            this.users = []
            this.filteruserstored = [];
          }
        },
        complete: () => {

        }
      })
    }
    else {
      this.getAllUsers()
    }

  }


  filterUserForAdduserTemplate(e: any) {
    this.filteredUsers = [];
    this.loading = true;
  
    if (this.selectedParent === 'contractType') {
      this.contractType = e.target.value;
    } else if (this.selectedParent === 'gender') {
      this.gender = e.target.value;
    } else if (this.selectedParent === 'jobType') {
      this.jobType = e.target.value;
    } else if (this.selectedParent === 'tenure') {
      this.tenure = e.target.value;
    } else if (this.selectedParent === 'Lifecycle') {
      this.lifeCycle = e.target.value;
    }
  
    if (e.target.value.length > 0) {
      const obj = {
        clientId: sessionStorage.getItem("ClientId"),
        selectedParent: this.selectedParent,
        selectedChild: e.target.value
      };
      
      this.service.searchUserByFilter(obj).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.loading = false;
            this.users = res.data.map((user: any) => ({
              id: user.id,
              name: user.name
            }));
            
            this.filterUsers();
  
            setTimeout(() => {
              this.getAllUsers();
            }, 100);
  
            // ✅ Ensure "Select All" is checked when all users are selected
            this.selectAll = this.filteredUsers.every((user: any) =>
              this.selectedUsers.some(selected => selected.id === user.id)
            );
          }
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          if (err.error.message == "User not found.") {
            this.users = [];
          }
        }
      });
    } else {
      this.getAllUsers();
    }
  }

  // filterUserForAdduserTemplate(e: any) {
  //   this.filteredUsers = [];
  //   this.loading = true;
  //   if (this.selectedParent === 'contractType') {
  //     this.contractType = e.target.value;
  //   }
  //   else if (this.selectedParent === 'gender') {
  //     this.gender = e.target.value;
  //   }
  //   else if (this.selectedParent === 'jobType') {
  //     this.jobType = e.target.value;
  //   }
  //   else if (this.selectedParent === 'tenure') {
  //     this.tenure = e.target.value;
  //   }
  //   else if (this.selectedParent === 'Lifecycle') {
  //     this.lifeCycle = e.target.value;
  //   }
  //   console.log(e);
  //   if (e.target.value.length > 0) {
  //     const obj = {
  //       clientId: sessionStorage.getItem("ClientId"),
  //       selectedParent: this.selectedParent,
  //       selectedChild: e.target.value
  //     }
  //     console.log(obj);
  //     this.service.searchUserByFilter(obj).subscribe({
  //       next: (res: any) => {
  //         console.log(res);
  //         if (res.success) {
  //           this.loading = false;
  //           this.users = res.data.map((user: any) => {
  //             return {
  //               id: user.id,
  //               name: user.name
  //             };
  //           });
  //           this.filterUsers();
  //           setTimeout(() => {
  //             this.getAllUsers();
  //           }, 100);
  //           this.selectAll = this.filteredUsers.every((user: any) =>
  //             this.selectedUsers.some(selected => selected.id === user.id)
  //           );
  //         }
  //       },
  //       error: (err: HttpErrorResponse) => {
  //         console.log(err);
  //         if (err.error.message == "User not found.") {
  //           this.users = []
  //         }
  //       },
  //       complete: () => {

  //       }
  //     })
  //   }
  //   else {
  //     this.getAllUsers()
  //   }

  // }


  removeMember(user: any) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: {
        message: `Do you really want to remove the user ${user.name} from ${this.groupInfoName?.title} group ?`,
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.action == 'ok') {
        this.service.removeFocusFocusGroupMamberByID(user.id).subscribe((res: any) => {
          if (res.success) {
            this.toaster.success(res.message);
            this.getFocusGroupById(this.data.id);
          }
        });
      }
    });
  }

  filterUsers() {
    const openGroupIds = this.openGroup.map((group: any) => group.userId);
    this.filteredUsers = this.users.filter((user: any) => !openGroupIds.includes(user.id));
    this.originalFilteredUsers = [...this.filteredUsers];
  }

  searchUsers(event: any) {
    const searchTerm = event.target.value.trim().toLowerCase();
    if (searchTerm) {
      this.filteredUsers = this.originalFilteredUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredUsers = [...this.originalFilteredUsers];
    }
  }


  deleteFocuseGroup(id: number, title: any) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: {
        message: `Do you really want to deactivate the records for ${title} group ?`,
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.action == 'ok') {
        let obj = {
          "focusGroup": {
            "active": false,
          }
        };
        this.service.deleteFocuseGroupByID(id, obj).subscribe((res: any) => {
          if (res.success) {
            this.onClose();
            this.toaster.success(res.message);
          }
        });
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onClearFilter() {
    this.users = [];
    this.filteruserstored = [];
    this.selectedParent = '';
    this.contractType = '';
    this.gender = '';
    this.jobType = '';
    this.tenure = '';
    if (this.parentSelect) {
      this.parentSelect.nativeElement.value = '';
    }
    console.log(this.selectedParent);
    this.selectAll = false;
    // this.getAllUsers();
    this.loading = true;
    this.service.getAllusersByClientId(sessionStorage.getItem("ClientId")).subscribe((res: any) => {
      console.log(res);
      // this.dropdownList = [res.id,res.name]
      if (res.success) {
        this.dropdownList = res.data;
        this.loading = false;
        this.users = this.dropdownList.map((user: any) => {
          return {
            id: user.id,
            name: user.name
          };
        });
        this.usersBeforeSearch = this.users;
        this.selectAll = this.users.length > 0 && this.users.every((user:any) =>
        this.selectedUsers.some(selected => selected.id === user.id)
      );
      }
    });
    // setTimeout(() => {
    //   this.selectAll = this.users.length > 0 && this.selectedUsers.length === this.users.length;
    // }, 100);
     
  }

  onClearFilterOfAddUsers() {
    this.filteredUsers = [];
    this.filteruserstored = [];
    this.filterUsers();
    this.selectedParent = '';
    this.contractType = '';
    this.gender = '';
    this.jobType = '';
    this.tenure = '';
    if (this.parentSelect) {
      this.parentSelect.nativeElement.value = '';
    }
    console.log(this.selectedParent);
    // this.filteredUsers = this.originalFilteredUsers;
    this.selectAll = this.filteredUsers.length > 0 && this.filteredUsers.every((user: any) =>
      this.selectedUsers.some(selected => selected.id === user.id)
    );
  }

  selectedUsers: any[] = [];

  toggleSelectAllUser() {
    this.selectAll = !this.selectAll;
    console.log(this.filteruserstored.length);

    if (this.filteruserstored?.length > 0) {
      console.log(this.selectAll);
      if (this.selectAll) {
        // Store unique selected users for the current filter
        const uniqueUsers = new Map(this.selectedUsers.map(user => [user.id, user]));
        this.users.forEach((user: any) => uniqueUsers.set(user.id, user));
        this.selectedUsers = Array.from(uniqueUsers.values());

        this.filterSelections[this.selectedParent] = [...this.users];
      } else {
        // Remove only the users related to this filter from selectedUsers
        this.selectedUsers = this.selectedUsers.filter(
          selectedUser => !this.users.some((user: any) => user.id === selectedUser.id)
        );
        this.filterSelections[this.selectedParent] = [];
      }
    } else {
      if (this.selectAll) {
        const uniqueUsers = new Map(this.selectedUsers.map(user => [user.id, user]));
        this.users.forEach((user: any) => uniqueUsers.set(user.id, user));
        this.selectedUsers = Array.from(uniqueUsers.values());

        this.filterSelections[this.selectedParent] = [...this.users];
      } else {
        this.selectedUsers = this.selectedUsers.filter(
          selectedUser => !this.users.some((user: any) => user.id === selectedUser.id)
        );
        this.filterSelections[this.selectedParent] = [];
      }
    }
  }


  // toggleSelectAllUser() {
  //   this.selectAll = !this.selectAll;
  //    console.log(this.filteruserstored.length)
  //   if(this.filteruserstored?.length>0){
  //     console.log(this.selectAll);
  //      if(this.selectAll){
  //       this.selectedUsers = [...this.users];
  //       this.filterSelections[this.selectedParent] = [...this.users];
  //      }
  //      else{
  //       console.log(this.users);
  //       console.log(this.selectedUsers);
  //       this.selectedUsers = this.selectedUsers.filter(
  //         selectedUser => !this.users.some((user:any) => user.id === selectedUser.id)
  //       );
  //       this.filterSelections[this.selectedParent] = [...this.selectedUsers];

  //       // this.selectedUsers = this.selectedUsers.filter(user => !this.users.includes(user));
  //      }

  //   }else{
  //     if (this.selectAll) {
  //       this.selectedUsers = [...this.users];
  //       // Save this selection state
  //       this.filterSelections[this.selectedParent] = [...this.users];
  //     } else {
  //       this.selectedUsers = [];
  //       this.filterSelections[this.selectedParent] = [];
  //     }
  //   }
  // }

  toggleSelectedUser(user: any) {
    const index = this.selectedUsers.findIndex(u => u.id === user.id);

    if (index !== -1) {
        this.selectedUsers.splice(index, 1);
    } else {
        this.selectedUsers.push(user);
    }

    
  // ✅ Save selection state for the current filter
  this.filterSelections[this.selectedParent] = this.selectedUsers.filter(selectedUser =>
    this.filteruserstored.some((user: any) => user.id === selectedUser.id)
  );

  // ✅ Handle selectAll update for current view (whether filtered or not)
  if (this.filteruserstored && this.filteruserstored.length > 0) {
    this.selectAll = this.filteruserstored.every((user: any) =>
      this.selectedUsers.some(selected => selected.id === user.id)
    );
  } else {
    // When no filter is applied, fallback to checking all users
    this.selectAll = this.users.every((user: any) =>
      this.selectedUsers.some(selected => selected.id === user.id)
    );
  }

    // // ✅ Save selection state for the current filter
    // this.filterSelections[this.selectedParent] = this.selectedUsers.filter(selectedUser =>
    //     this.filteruserstored.some((user: any) => user.id === selectedUser.id)
    // );

    // // ✅ Check if all users **in the current filter** are selected
    // this.selectAll = this.filteruserstored.length > 0 &&
    //     this.filteruserstored.every((user: any) =>
    //         this.selectedUsers.some(selected => selected.id === user.id)
    //     );
}

  // toggleSelectedUser(user: any) {
  //   const index = this.selectedUsers.findIndex(u => u.id === user.id);

  //   if (index !== -1) {
  //     this.selectedUsers.splice(index, 1);
  //   } else {
  //     this.selectedUsers.push(user);
  //   }

  //   // Check if all users are selected, update Select All state
  //   this.selectAll = this.selectedUsers.length === this.users.length;

  //   // Save selection state
  //   this.filterSelections[this.selectedParent] = [...this.selectedUsers];
  // }

  // toggleSelectedUser(user: any) {
  //   if (this.showMessage === true) {
  //     this.showMessage = false;
  //   }
  //   const index = this.selectedUsers.findIndex(u => u.id === user.id);
  //   if (index !== -1) {
  //     this.selectedUsers.splice(index, 1);
  //   } else {
  //     this.selectedUsers.push(user);
  //   }
  //   this.selectAll = this.selectedUsers.length === this.users.length;
  // }

  // toggleSelectAllUser(){
  //   if (this.selectAll) {
  //     this.selectedUsers = [];
  //   } else {
  //     this.selectedUsers = [...this.users];
  //   }

  //   this.selectAll = !this.selectAll;
  // }

  toggleSelectedUserForAddUsers(user: any) {
    const index = this.selectedUsers.findIndex(u => u.id === user.id);
  
    if (index !== -1) {
      this.selectedUsers.splice(index, 1);
    } else {
      this.selectedUsers.push(user);
    }
  
    // Ensure selectedUsers does not contain duplicates
    this.selectedUsers = Array.from(new Set(this.selectedUsers.map(u => JSON.stringify(u)))).map(u => JSON.parse(u));
  
    // ✅ Automatically check/uncheck "Select All"
    this.selectAll = this.filteredUsers.every((user: any) =>
      this.selectedUsers.some(selected => selected.id === user.id)
    );
  
    this.filterSelections[this.selectedParent] = [...this.selectedUsers];
  }

  // toggleSelectedUserForAddUsers(user: any) {
  //   const index = this.selectedUsers.findIndex(u => u.id === user.id);

  //   if (index !== -1) {
  //     this.selectedUsers.splice(index, 1);
  //   } else {
  //     this.selectedUsers.push(user);
  //   }

  //   this.selectAll = this.selectedUsers.length === this.filteredUsers.length;

  //   this.filterSelections[this.selectedParent] = [...this.selectedUsers];
  // }


  toggleSelectAllUserOfAddUsers() {
    this.selectAll = !this.selectAll;
  
    if (this.selectAll) {
      this.selectedUsers = Array.from(new Set([...this.selectedUsers, ...this.filteredUsers]));
    } else {
      this.selectedUsers = this.selectedUsers.filter(
        selectedUser => !this.filteredUsers.some((user:any) => user.id === selectedUser.id)
      );
    }
  
    this.filterSelections[this.selectedParent] = [...this.selectedUsers];
  }

  // toggleSelectAllUserOfAddUsers() {
  //   this.selectAll = !this.selectAll;

  //   if (this.selectAll) {
  //     this.selectedUsers = [...this.filteredUsers];
  //     // Save this selection state
  //     this.filterSelections[this.selectedParent] = [...this.filteredUsers];
  //   } else {
  //     this.selectedUsers = [];
  //     this.filterSelections[this.selectedParent] = [];
  //   }
  // }

  onBackToGroupInfo() {
    this.data.name === 'openGroup';
  }

  onNext() {
    if (this.selectedUsers.length > 0) {
      this.showContainer = 2;
      this.showMessage = false;
    } else {
      this.showMessage = true;
    }
  }

  loadDataForSecondContainer() {
    this.selectedUserForInfo = ['User1', 'User2', 'User3'];
    this.selectedUserForInfo = this.selectedUsers;
  }

  clearSearch(input: HTMLInputElement) {
    input.value = '';
    this.searchUsers({ target: { value: '' } });
  }

  onBack() {
    this.showContainer = 1;
    this.data.name = 'createGroup'
  }

  onAddUser() {
    this.getAllUsers();
    this.filterUsers();
    this.data.name = 'add-user'
  }

  onBackFromAddUser() {
    this.data.name = 'openGroup'
  }

  createGroup() {
    this.loadingforCreateGroup = true;
    if (this.meetingForm.valid) {
      const form = this.meetingForm.value;
      const memberIds = this.selectedUsers.map(user => user.id);
      const obj = {
        focusGroup: {
          clientId: sessionStorage.getItem("ClientId"),
          createdDate: new Date(),
          criteria: form.criteria,
          description: form.description,
          active: true,
          loggedUserId: JSON.parse(sessionStorage.getItem('currentLoggedInUserData')!).id,
          title: form.title
        },
        memberIds: memberIds
      }
      this.service.createGroup(obj).subscribe({
        next: (res: any) => {
          console.log(res);
          this.meetingForm.reset();
          // document.getElementById('closeOffCanvas')?.click();
          this.toaster.success('Group Created Successfully');
          this.onClose();
        }, error: (err: any) => {
          console.log(err);
          setTimeout(() => {
            this.loadingforCreateGroup = false;
          }, 5000);
        }, complete: () => {
          this.loadingforCreateGroup = false;
        }
      })
    }
    else {
      this.loadingforCreateGroup = false;
      this.meetingForm.markAllAsTouched();
      this.toaster.error('Please enter valid data')
    }
  }

  updateGroup() {
    const form = this.groupInfoName;
    const openGroupIds = this.openGroup.map((group: any) => group.userId);
    const memberIds = this.selectedUsers.map(user => user.id);
    const combinedIds = [...openGroupIds, ...memberIds];
    const obj = {
      focusGroup: {
        clientId: sessionStorage.getItem("ClientId"),
        createdDate: new Date(),
        criteria: form.criteria,
        description: form.description,
        loggedUserId: JSON.parse(sessionStorage.getItem('currentLoggedInUserData')!).id,
        title: form.title
      },
      memberIds: combinedIds
    }
    this.addUserSpinner = true;
    this.service.updateFocusGroup(this.data.id, obj).subscribe({
      next: (res: any) => {
        console.log(res);
        this.meetingForm.reset();
        this.addUserSpinner = false;
        // document.getElementById('closeOffCanvas')?.click();
        this.toaster.success('Group updated successfully');
        this.onBackFromAddUser();
        this.selectedUsers = [];
        this.getFocusGroupById(this.data.id);
      }, error: (err: any) => {
        console.log(err);
      }, complete: () => { }
    })
  }

  onUpdate(id: any) {
    this.index = id;
    this.vissible = false;
    this.isVissible = true;
    this.service.getMeetingByID(id).subscribe((res: any) => {
      this.dataId = res.data;
      const offcanvasElement = document.getElementById('offcanvasRight3');
      const offcanvas = new (window as any).bootstrap.Offcanvas(
        offcanvasElement
      );
      offcanvas.toggle();
      this.meetingForm.patchValue({
        active: true,
        name: this.dataId.name,
        employeeId: parseInt(this.dataId.employeeId),
        contact: this.dataId.contact,
      });
    });
  }


  updateMeeting() {
    if (this.meetingForm.valid) {
      const form = this.meetingForm.value;
      const obj = {
        active: true,
        clientId: 0,
        consultantId: 0,
        createdDate: new Date(),
        description: form.description,
        id: 0,
        location: "nashik",
        loggedUserId: 0,
        meetingDate: form.meetingDate,
        meeting_link: form.meeting_link,
        status: "active",
        timeDuration: form.timeDuration,
        title: form.title,
        userId: form.userId
      }
      const id = this.clientId
      this.service.updateMeeting(obj, id).subscribe({
        next: (res: any) => {
          console.log(res);
        }, error: () => { }, complete: () => { }
      })
    } else { }
  }


}

