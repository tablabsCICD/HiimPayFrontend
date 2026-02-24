import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { CreateclientComponent } from '../../createclient/createclient.component';
import { DeleteComponent } from '../delete/delete.component';

@Component({
  selector: 'app-pinned',
  templateUrl: './pinned.component.html',
  styleUrls: ['./pinned.component.css'],
})
export class PinnedComponent {
  data: any[] = [];
  pinClients: any[] = [];
  isPopupOpen: boolean = false;
  page: any = 1;
  size: any = 10;
  sortBy: any = 'id';
  p: number = 1;
  itemPerPage: number = 9;
  status: string = '';
  phases: any[] = ['Listen', 'Analyse', 'Share', 'Co-Create'];
  totalElements: number = 10;
  isLoading:boolean=false
  orderBy:any='desc'
  constructor(
    private api: ApiService,
    private router: Router,
    private tosatr: ToastrService,
    private dialog: MatDialog
  ) {}

  togglePopup() {
    this.isPopupOpen = !this.isPopupOpen;
  }
  pageChangeEvent(event: number) {
    this.page = event;
    this.getPinnedClients();
  }
  ngOnInit(): void {
    this.initializeStaticData();
    this.getPinnedClients();
  }

  initializeStaticData() {
    const staticCompanies = [
      {
        id: 1,
        clientName: 'Amazon',
        contactPhone: '+91-9876543210',
        mobileNumber1: '+91-9876543210',
        mobileNumber2: '+91-9876543215',
        landlineNumber: '0801234567',
        contactEmail: 'contact@amazon.com',
        secondContactEmail: 'hr@amazon.com',
        consultinghaseName: 'Listen',
        consultantName: 'John Doe'
      },
      {
        id: 2,
        clientName: 'Flipkart',
        contactPhone: '+91-9876543211',
        mobileNumber1: '+91-9876543211',
        mobileNumber2: '+91-9876543216',
        landlineNumber: '0801234568',
        contactEmail: 'contact@flipkart.com',
        secondContactEmail: 'hr@flipkart.com',
        consultinghaseName: 'Analyse',
        consultantName: 'Jane Smith'
      },
      {
        id: 3,
        clientName: 'Myntra',
        contactPhone: '+91-9876543212',
        mobileNumber1: '+91-9876543212',
        mobileNumber2: '+91-9876543217',
        landlineNumber: '0801234569',
        contactEmail: 'contact@myntra.com',
        secondContactEmail: 'hr@myntra.com',
        consultinghaseName: 'Share',
        consultantName: 'Mike Johnson'
      },
      {
        id: 4,
        clientName: 'Gargi',
        contactPhone: '+91-9876543213',
        mobileNumber1: '+91-9876543213',
        mobileNumber2: '+91-9876543218',
        landlineNumber: '0801234570',
        contactEmail: 'contact@gargi.com',
        secondContactEmail: 'hr@gargi.com',
        consultinghaseName: 'Co-Create',
        consultantName: 'Sarah Wilson'
      },
      {
        id: 5,
        clientName: 'P&G',
        contactPhone: '+91-9876543214',
        mobileNumber1: '+91-9876543214',
        mobileNumber2: '+91-9876543219',
        landlineNumber: '0801234571',
        contactEmail: 'contact@pg.com',
        secondContactEmail: 'hr@pg.com',
        consultinghaseName: 'Listen',
        consultantName: 'David Brown'
      }
    ];
    this.pinClients = staticCompanies;
    this.totalElements = staticCompanies.length;
  }

  getPinnedClients() {
    this.api.getAllPinClients(this.orderBy, this.page - 1, this.size, this.sortBy).subscribe((res: any) => {
      console.log(res);
      this.isLoading=false
      console.log(res.message);
      if (res) {
        this.pinClients = res.content;
        console.log(this.pinClients);
        this.totalElements=res.totalElements;
      }
    });
  }

  setClientId(event: MouseEvent, id: any) {
    if ((<HTMLElement>event.target).classList.contains('ellipsis-button')) {
      event.stopPropagation();
    } else {
      this.router.navigate(['superadmin/project/', id, 'project-admin']);
    }
  }

  openMenu(event: MouseEvent) {
    event.stopPropagation();
  }

  editClient(clientId: any) {
    const dialogRef = this.dialog.open(CreateclientComponent, {
      width: '700px',
      height: '550px',
      disableClose: true,
      data: { name: 'create-project', clientId: clientId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The popup was closed');
    });
  }

  deleteClient(client: any) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: {
        message: `Do you really want to delete the records for ${client.clientName} ?`,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.action == 'ok') {
        this.api.deleteClient(client.id).subscribe((res: any) => {
          if (res.success) {
            this.tosatr.success(res.message);
            this.getPinnedClients();
          }
        });
      }
    });
  }

  pinClient(clientId: number) {
    this.api.pinClinet(clientId).subscribe(
      (res: any) => {
        if (res.success) {
          console.log(res.message);
          this.tosatr.success(res.message);
        }
      },
      (error) => {
        this.tosatr.error('Cliet Already Pinned');
      }
    );
  }

  unpinClient(clientId: number) {
    this.api.unPinClient(clientId).subscribe((res: any) => {
      if (res.success) {
        console.log(res.message);
        this.getPinnedClients();
      }
    });
  }

  getClientsByStatus(status: any) {
    this.api.getClientListByStatus(status).subscribe(
      (res: any) => {
        this.pinClients = [];
        if (res.success) {
          this.pinClients = res.data;
          console.log('Client by status=>' + res.data);
          console.log(res.message);
        } else {
          this.tosatr.error(res.message);
        }
      },
      (error) => {
        this.tosatr.error('Clients Not Found..!!');
      }
    );
  }

  changeablePhases(phase: any): any {
    return this.phases.filter((val) => val != phase);
  }

  changePhase(item: any, phase: any) {
    const obj = {
      clientId: item.id,
      createdDate: null,
      description: null,
      doc: null,
      endDate: null,
      id: 0,
      loggedUserId: JSON.parse(
        sessionStorage.getItem('currentLoggedInUserData')!
      ).id,
      phaseName: phase,
      startDate: null,
    };
    this.api.createPhase(obj).subscribe({
      next: (val) => {
        if (val.success) {
          this.tosatr.success(val.message);
          const dataIndex = this.pinClients.findIndex(
            (data) => data.id == val.data.clientId
          );
          this.pinClients[dataIndex].consultinghaseName = val.data.phaseName;
        }
      },
      error: (err) => {
        this.tosatr.error(err);
      },
    });
  }
}
