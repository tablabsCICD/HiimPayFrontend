import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SearchService } from '../../services/search.service';
import { DeleteComponent } from '../delete/delete.component';
import { CreateConsultantComponent } from './create-consultant/create-consultant.component';
import { Info2Component } from './info/info2.component';

@Component({
  selector: 'app-ex-consultant',
  templateUrl: './ex-consultant.component.html',
  styleUrl: './ex-consultant.component.css'
})
export class ExConsultantComponent implements OnInit {
  filterToggle: boolean = false;
  details: any;
  info: any;
  file: any;
  page: any = 1;
  size: any = 10;
  sortBy: any = 'name';
  orderBy:any = 'asc';
  itemPerPage: number = 10;
  totalItems: number = 0;

  isLoading: boolean = true;

  constructor(
    public dialog: MatDialog,
    private service: ApiService,
    private toaster: ToastrService,
    private searchservice:SearchService
  ) {}

  ngOnInit(): void {
    this.searchservice.sendResults().subscribe({
      next: (res: any) => {
        if (res.length == 0) {
          this.getAllConsultant();
        } else {
          if (res.success) {
            this.details = res.data;
          } else {
            this.details = [];
          }
        }
      },
      error: (err: any) => {},
      complete: () => {},
    });

  }

  getAllConsultant() {
    this.isLoading = true;
    this.service.getAllEXwiseConsultantPagination(this.orderBy,this.page-1,this.size,this.sortBy).subscribe({next:(res)=>{
      this.isLoading = false;
          this.details = res.data;
          this.onclick(this.details[0].id);
          this.totalItems = res.totalItems;
    },error:(err)=>{console.log(err)},complete:()=>{}});
  }

  pageChangeEvent(event: number) {
    this.page = event;
    this.getAllConsultant();
  }

  onclick(id: any) {
    console.log(id);

    this.service.getByUserID(id).subscribe((res: any) => {
      // console.log(res);
      this.info = res;
      // console.log(this.info);
    });
  }
  openPopup(): void {
    const dialogRef = this.dialog.open(CreateConsultantComponent, {
      width: '800px',
      height: '650px',
      disableClose: true,
      data: { name: 'Create User'},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getAllConsultant();
    });
  }

  editUser(userId: number) {
    const dialogRef = this.dialog.open(CreateConsultantComponent, {
      width: '800px',
      height: '650px',
      disableClose: true,
      data: { name: 'edit-user', id: userId},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getAllConsultant();
    });
  }

  openPopupForEXConsultantClients(id:any){
      const dialogRef = this.dialog.open(Info2Component, {
        width: '750px',
        height: '500px',
        disableClose: true,
        data: { id: id },
      });
  }

  activeDeactiveUser(user: any) {
    const obj = {
      verified: !user.verified,
    };

    this.service.updateUser(user.id, obj).subscribe((res) => {
      if (res.success) {
        if(res?.message==='User updated successfully.'&& res?.data?.verified===true){
          this.toaster.success('Consultant activated successfully', 'Success');
        }
        else{
          this.toaster.success('Consultant Inactivated successfully', 'Success');
        }
        window.location.reload();
      }
    });
  }
 
//   deleteUser(user:any){
//     const dialogRef = this.dialog.open(DeleteComponent, {
//       data: {
//         message: `Do you really want to deactivate consultant ${user.name}?`,
//       },
//       disableClose:true
//     });

//     dialogRef.afterClosed().subscribe((result) => {
//       if (result.action == 'ok') {
//         this.service.deleteUser(user.id).subscribe((res) => {
//           if (res.success) {
//             this.toaster.success('User deactivated successfully', 'Success');
//             this.getAllConsultant();
//           }
//         });
//       }
//     });
// }

  itemsCard: any[] = [];

}
