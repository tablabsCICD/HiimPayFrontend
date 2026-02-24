import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TouchpointService } from '../../services/touchpoint.service';
import { CreatetouchpointComponent } from './createtouchpoint/createtouchpoint.component';
import { ShowalltouchpointComponent } from './showalltouchpoint/showalltouchpoint.component';
import { ShowallcomponentsComponent } from './showallcomponents/showallcomponents.component';
import { AssignpopupComponent } from './assignpopup/assignpopup.component';
import { DeleteComponent } from '../delete/delete.component';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-touchpoint',
  templateUrl: './touchpoint.component.html',
  styleUrl: './touchpoint.component.css'
})
export class TouchpointComponent implements OnInit {
  touchpointStages: any;
  isLoading: boolean = false;

  constructor(
    private dialog: MatDialog,
    private api: TouchpointService,
    private toastr: ToastrService,
    private router: Router,
    private searchservice : SearchService
  ) { }

  ngOnInit(): void {
    this.getAllTouchPointStages();
    this.searchservice.sendResults().subscribe({
      next: (res: any) => {
        if (res.length == 0) {
          this.isLoading=false
          this.getAllTouchPointStages(); 
        } else {
          if (res.success) {
            this.isLoading=false
            this.touchpointStages = res.data;
          } else {
            this.touchpointStages = [];
          }
        }
      },
      error: (err: any) => {},
      complete: () => {},
    });
  }

  getAllTouchPointStages() {
    this.isLoading = true;
    this.api.getAllTouchPointsStages().subscribe({
      next: (res) => {
        this.touchpointStages = res.data;
        this.isLoading = false;
      }, error: (err) => { console.log(err) }, complete: () => { }
    })
  }

  openPopup(): void {
    const dialogRef = this.dialog.open(CreatetouchpointComponent, {
      width: '400px',
      height: '250px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getAllTouchPointStages();
    });
  }

  openPopupForTouchpoint() {
    this.dialog.open(ShowalltouchpointComponent, {
      width: '1100px',
      height: '650px',
      disableClose: true,
    });
  }

  openPopupForComponents() {
    this.dialog.open(ShowallcomponentsComponent, {
      width: '1100px',
      height: '650px',
      disableClose: true,
    });
  }

  openAssignTouchPoints(stageId: any, stageName: any) {
    const dialogRef = this.dialog.open(AssignpopupComponent, {
      width: '500px',
      height: '250px',
      disableClose: true,
      data: { stageId: stageId, stageName: stageName }
    });
    dialogRef.afterClosed().subscribe(() => {
    });
  }

  onEdit(stageId: number) {
    const dialogRef = this.dialog.open(CreatetouchpointComponent, {
      width: '400px',
      height: '250px',
      disableClose: true,
      data: { stageId: stageId }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getAllTouchPointStages();
    });
  }

  onDelete(item: any) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: {
        message: `Do you really want to deactivate the records for stage ${item.stageName} ?`,
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.action == 'ok') {
        this.api.deleteTouchpointStageById(item.id).subscribe({
          next: (res) => {
            this.toastr.success('Touchpoint stage deactivated successfully', 'Success');
            this.getAllTouchPointStages();
          }, error: (err) => { console.log(err) }, complete: () => { }
        })
      }
    });
  }

  onDetails(id:number,name:any) {
    let url = this.router.url.replace("superadmin/touchpoint", `superadmin/touchpoin-reality-details/${id}/${name}`);
    this.router.navigateByUrl(url);
  }

}
