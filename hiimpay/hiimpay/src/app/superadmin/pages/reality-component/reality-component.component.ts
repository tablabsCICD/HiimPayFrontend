import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { RealityComponent } from '../reality/reality.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reality-component',
  templateUrl: './reality-component.component.html',
  styleUrl: './reality-component.component.css'
})
export class RealityComponentComponent {
  data: any;
  pinClients: any;
  isPopupOpen: boolean = false;
  pendingCount: any;
  newCount: any;
  closedCount: any;
  openCount: any;
  cardsCircle: any[] = [];
  orderBy:any = 'desc'; 
  page:any = 1;
  size:any =10;
  sortBy:any = 'id';
  p: number = 1;
  itemPerPage: number = 9;

  totalItems: number = 10;
  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private tosatr: ToastrService,
private router:Router
  ) {}

  togglePopup() {
    this.isPopupOpen = !this.isPopupOpen;
  }
  pageChangeEvent(event: number) {
    this.page = event;

  }
  ngOnInit(): void {
    this.api.getAllRealityComponent().subscribe((res: any) => {
      if (res.success) {
        this.data = res.data;
    console.log(this.data);
    
      }
    });

  }

  openPopup(): void {
    const dialogRef = this.dialog.open(RealityComponent, {
      width: '450px',
      height: '450px',
      disableClose: true,
    });
   dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['superadmin/component']);
    });
  }
  edit(surveyId: number) {
    const dialogRef = this.dialog.open(RealityComponent, {
      width: '800px',
      height: '530px',
      disableClose: true,
      data: { surveyId: surveyId },
    });
    dialogRef.afterClosed().subscribe(() => {
 
    });
  }

  deleteComponent(surveyId: number) {
    this.api.deleteCompoent(surveyId).subscribe((res:any) => {
      console.log(res);
      window.location.reload();
      if (
        res.message ===
        'ComponentForReality deleted successfully.'
      ) {
        this.tosatr.success(
          'Survey type and associated stages deleted successfully.'
        );
        window.location.reload();
      }
    });
  }
}
