import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreateclientComponent } from '../../createclient/createclient.component';
import { SearchService } from '../../services/search.service';
import { DeleteComponent } from '../delete/delete.component';

@Component({
  selector: 'app-open',
  templateUrl: './open.component.html',
  styleUrl: './open.component.css'
})
export class OpenComponent {
  data:any[]=[];
  pinClients: any;
  newCount: any;
  allCount: any;
  orderBy:any = 'asc'; 
  page:any = 1;
  size:any = 10;
  sortBy:any = 'id';
  p: number = 1;
  itemPerPage: number = 9;
  totalItems: number = 10;

  constructor(private api:ApiService, private router:Router,private tosatr:ToastrService,private dialog:MatDialog,private service:SearchService){}

  ngOnInit(): void {
  
    this.service.sendResults().subscribe({
      next: (res: any) => {
        if (res.length == 0) {
          this.openClients();
        } else {
          if (res.success) {
            this.data = res.data;
          } else {
            this.data = [];
          }
        }
      },
      error: (err: any) => {},
      complete: () => {},
    });

    // this.pinnedClients();

    // Ensure at least 5 static records are available for the Open view
    const staticData = this.getStaticData();
    if (!this.data || this.data.length === 0) {
      this.data = staticData;
      this.totalItems = this.data.length;
    }

    // Static counts used by the template (remove dynamic integration)
    this.allCount = 20;
    this.newCount = 5;
  }


  openClients(){
    this.api.getAllOpenClient(this.orderBy, this.page - 1, this.size, this.sortBy).subscribe((res:any)=>{
      if(res.success){
        this.data=res.data;
        this.totalItems=res.totalItems;
      }
      console.log(res.data)
    })
  }

  setClientId(event: MouseEvent, id: any) {
    
    if ((<HTMLElement>event.target).classList.contains('ellipsis-button')) {
      event.stopPropagation();
    } else {
      // sessionStorage.setItem('clientId', id.toString());
      this.router.navigate(['superadmin/project/', id, 'project-admin']);
    }
  }

  pageChangeEvent(event: number) {
    this.page = event;
    this.openClients();
  }

  openMenu(event: MouseEvent) {
    event.stopPropagation(); 
}

editClient(clientId:any) {
    const dialogRef = this.dialog.open(CreateclientComponent, {
      width: '700px',
      height: '550px',
      disableClose: true,
      data: { name: 'create-project',clientId:clientId}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The popup was closed');
    });
}

// deleteClient(clientId:any) {
//   this.api.deleteClient(clientId).subscribe((res:any)=>{
//     if(res.success){
//       this.tosatr.success(res.message);
//       window.location.reload();
//     }
//   })
// }
deleteClient(client: any) {
  const dialogRef = this.dialog.open(DeleteComponent, {
    data: {
      message: `Do you really want to delete the records for ${client.clientName} ?`,
    },
    disableClose:true
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result.action == 'ok') {
      this.api.deleteClient(client.id).subscribe((res:any)=>{
        if(res.success){
          this.tosatr.success(res.message);
          window.location.reload();
        }
      })
    }
  });
}

pinClient(clientId:number) {
  this.api.pinClinet(clientId).subscribe((res:any)=>{
    if(res.success){
      console.log(res.message);
      this.tosatr.success(res.message);
    }
  },(error)=>{
    this.tosatr.error('Cliet Already Pinned')
  })
}


unpinClient(clientId:number){
  this.api.unPinClient(clientId).subscribe((res:any)=>{
    if(res.success){
      console.log(res.message);
    }
  })
}
  
  relativePercentage(statusCount: any) {
    if (!this.allCount || this.allCount === 0) return 0;
    return (statusCount / this.allCount) * 100;
  }
  
  // Provide static sample records (at least 10) for the Open dashboard
  getStaticData(): any[] {
    const logos = [
      'assets/images/servey1.jfif',
      'assets/images/servey3.jfif'
    ];

    const companyNames = [
      'Infosys',
      'Tata Consultancy Services (TCS)',
      'Tech Mahindra',
      'Wipro',
      'HCL Technologies',
      'Cognizant',
      'IBM India',
      'Capgemini',
      'Oracle India',
      'L&T Infotech'
    ];

    const records: any[] = [];
    for (let i = 1; i <= 5; i++) {
      const name = companyNames[(i - 1) % companyNames.length];
      records.push({
        id: i,
        clientName: name,
        companyName: name,
        registeredAddress: `${100 + i} Corporate Park, Business District`,
        city: i % 2 === 0 ? 'Bengaluru' : 'Hyderabad',
        state: i % 2 === 0 ? 'Karnataka' : 'Telangana',
        country: 'India',
        pincode: (560001 + i).toString(),
        contactPhone: `+91-80-5550${(10 + i).toString().padStart(2, '0')}`,
        mobileNumber1: `98${(76543000 + i).toString().padStart(8, '0')}`,
        mobileNumber2: `98${(76544000 + i).toString().padStart(8, '0')}`,
        landlineNumber: `08055${(5000 + i).toString().padStart(4, '0')}`,
        contactEmail: `info@${name.replace(/[^a-zA-Z]/g, '').toLowerCase()}.com`,
        secondContactEmail: `hr@${name.replace(/[^a-zA-Z]/g, '').toLowerCase()}.com`,
        totalEmployees: 10000 + i * 100,
        ceoName: `Mr. ${name.split(' ')[0]} CEO`,
        companyLogo: logos[i % logos.length],
        consultinghaseName: 'Open'
      });
    }

    return records;
  }
}
