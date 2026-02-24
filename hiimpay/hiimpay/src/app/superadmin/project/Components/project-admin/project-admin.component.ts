import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from '../../services/project.service';
import { ToastrService } from 'ngx-toastr';
import { CreateUserComponent } from './create-user/create-user.component';
import { SearchService } from '../../services/search.service';
import { DeleteComponent } from '../../../pages/delete/delete.component';
import { jsPDF } from "jspdf";
import { getDate } from 'date-fns';

@Component({
  selector: 'app-project-admin',
  templateUrl: './project-admin.component.html',
  styleUrl: './project-admin.component.css',
})
export class ProjectAdminComponent implements OnInit {
  filterToggle: boolean = false;
  details: any;
  info: any;
  file: any;
  page: any = 1;
  size: any = 10;
  sortBy: any = 'name';
  orderBy: any = 'asc';
  itemPerPage: number = 10;
  totalItems: number = 0;
  isSelectedFileValid: boolean = false;
  checkDownloadExcelSpinner: boolean = false;
  checkuploadExcelSpinner: boolean = false;
  displayClientData: any;

  isLoading: boolean = true;
  constructor(
    public dialog: MatDialog,
    private service: ProjectService,
    private toaster: ToastrService,
    private searchservice: SearchService
  ) { }

  ngOnInit(): void {
    this.displayClientData = JSON.parse(sessionStorage.getItem('ClientData')!);
    this.searchservice.sendResults().subscribe({
      next: (res: any) => {
        if (res.length == 0) {
          this.getAllUsers();
        } else {
          if (res.success) {
            this.details = res.data;
          } else {
            this.details = [];
          }
        }
      },
      error: (err: any) => { },
      complete: () => { },
    });
    this.getAllUsers();
  }

  getAllUsers() {
    this.isLoading = true;
    this.service.getUserByClientIDWithPagination(sessionStorage.getItem('ClientId'), this.orderBy, this.page - 1, this.size, this.sortBy).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.details = res.data;
        // this.onclick(this.details[0].id);
        this.totalItems = res.totalItems;
      }, error: (err) => { console.log(err) }, complete: () => { }
    });
  }

  pageChangeEvent(event: number) {
    this.page = event;
    this.getAllUsers();
  }

  // onclick(id: any) {
  //   console.log(id);

  //   this.service.getByUserID(id).subscribe((res: any) => {
  //     // console.log(res);
  //     this.info = res;
  //     // console.log(this.info);
  //   });
  // }
  openPopup(): void {
    const dialogRef = this.dialog.open(CreateUserComponent, {
      width: '800px',
      height: '600px',
      disableClose: true,
      data: { name: 'Create User', isConsultant: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getAllUsers();
    });
  }

  editUser(userId: number) {
    console.log(userId);

    const dialogRef = this.dialog.open(CreateUserComponent, {
      width: '800px',
      height: '600px',
      disableClose: true,
      data: { name: 'edit-user', id: userId, isConsultant: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // this.getAllUsers();
      window.location.reload();
    });
  }

  activeDeactiveUser(user: any) {
    const obj = {
      verified: !user.verified,
    };

    this.service.updateUser(user.id, obj).subscribe((res) => {
      if (res.success) {
        if (res?.message === 'User updated successfully.' && res?.data?.verified === true) {
          this.toaster.success('User activated successfully', 'Success');
        }
        else {
          this.toaster.success('User Inactivated successfully', 'Success');
        }
        // this.getAllUsers();
        window.location.reload();
      }
    });
  }


  //   deleteUser(user:any){
  //     const dialogRef = this.dialog.open(DeleteComponent, {
  //       data: {
  //         message: `Do you really want to deactivate user ${user.name}?`,
  //       },
  //       disableClose:true
  //     });

  //     dialogRef.afterClosed().subscribe((result) => {
  //       if (result.action == 'ok') {
  //         this.service.deleteUser(user.id).subscribe((res) => {
  //           if (res.success) {
  //             this.toaster.success('User deactivated successfully', 'Success');
  //             // this.getAllUsers();
  //             window.location.reload();
  //           }
  //         });
  //       }
  //     });
  // }

  itemsCard: any[] = [];

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
    }
  }

  getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  generateErrorPdf(errors: string[]) {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Bulk upload errors :: Client name - " + this.displayClientData?.clientName + " :: Date - " + this.getCurrentDate(), 10, 10);

    // Bulk upload errors :: Client name - <client name> :: Date - <date>


    let yPos = 20;
    const pageHeight = doc.internal.pageSize.height;
    const lineHeight = 10;

    errors.forEach((error, index) => {
      if (yPos + lineHeight > pageHeight - 10) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(error, 10, yPos);
      yPos += lineHeight;
    });

    doc.save("upload_errors.pdf");
  }


  uploadFile() {
    const formData = new FormData();
    formData.append('file', this.file);
    console.log(formData);
    this.checkuploadExcelSpinner = true;
    this.service.uploadUserfromExcel(sessionStorage.getItem('ClientId'), formData).subscribe({
      next: (res: any) => {
        this.checkuploadExcelSpinner = false;
        console.log(res);
        if (res?.savedUsers?.length > 0) {
          this.getAllUsers();
          this.toaster.success('Users registered suceessfully');
        }
        this.isSelectedFileValid = false;
        if (res?.errors?.length > 0) {
          const errorMessage = res.errors.join('\n');
          // this.toaster.error(errorMessage);
          // this.toaster.error(errorMessage, 'Error', {
          //   timeOut: 12000, // 12 seconds for error messages
          // });
          this.generateErrorPdf(res.errors);
        }

        if (res.message === "Some records were skipped due to validation errors.") {
          this.toaster.error("Some records were skipped due to validation errors.");
          this.isSelectedFileValid = false;
        } else if (res.message === "File uploaded and user data saved successfully!") {
          this.toaster.success("File uploaded and user data saved successfully!");
          this.isSelectedFileValid = false;
          this.getAllUsers()
        } else { }
        // window.location.reload();
      },
      error: (err) => { this.checkuploadExcelSpinner = false; },
    });
  }

  // onFileBrowse(event: any) {
  //   const inputElement = event.target as HTMLInputElement;
  //   this.file = inputElement?.files?.[0]; // Get the selected file
  //   if (this.file) {
  //     this.validateFile();
  //   }
  // }

  onFileBrowse(event: any) {
    const inputElement = event.target as HTMLInputElement;
    this.file = inputElement?.files?.[0]; // Get the selected file
    if (this.file) {
      this.validateFile();
      if (this.isSelectedFileValid) {
        this.uploadFile();  // Automatically upload file if valid
      }
      inputElement.value = '';
    }
  }


  downloadExcelFormat() {
    this.checkDownloadExcelSpinner = true;

    this.service.getExcelFileUrl().subscribe((response: any) => {
      if (response?.url) {
        this.service.downloadExcelFile(response.url).subscribe((blob: any) => {
          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(blob);
          a.href = objectUrl;
          a.download = 'userUploadFormat.xlsx';
          a.click();
          URL.revokeObjectURL(objectUrl);
        }, (error: any) => {
          console.error('Download error:', error);
        });
      } else {
        console.error('Invalid response from API');
      }
      this.checkDownloadExcelSpinner = false;
    }, (error: any) => {
      console.error('Error fetching Excel URL:', error);
      this.checkDownloadExcelSpinner = false;
    });
  }

}
