import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { StarttouchpointComponent } from './employee-touchpoint/starttouchpoint/starttouchpoint.component';
import { InfochartComponent } from './infochart/infochart.component';
import { TouchpointService } from '../../../services/touchpoint.service';
import { AssignrealitytouchpointComponent } from './assignrealitytouchpoint/assignrealitytouchpoint.component';
import { DeleteComponent } from '../../../pages/delete/delete.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FeedbackComponent } from '../feedback/feedback.component';
import { SearchService } from '../../services/search.service';
import { CreateclientComponent } from '../../../createclient/createclient.component';
import { CreateUserComponent } from '../project-admin/create-user/create-user.component';

@Component({
  selector: 'app-touchpoint',
  templateUrl: './touchpoint.component.html',
  styleUrl: './touchpoint.component.css'
})
export class TouchpointComponent implements OnInit {
  isCpoc: boolean = false;
  allRealityTouchpoinStages: any;
  isLoading: boolean = false;
  displayEnable: boolean = false;
  enableBtn: boolean = false;
  displayClientData: any;


  constructor(private dialog: MatDialog, private service: TouchpointService, private tostr: ToastrService, private router: Router, private searchService: SearchService) { }

  ngOnInit() {
    this.displayClientData = JSON.parse(sessionStorage.getItem('ClientData')!);
    this.isCpoc = sessionStorage.getItem("isCpoc") == 'true';
    this.getAllAssignedStagesByClientId();
    this.searchService.sendResults().subscribe({
      next: (res: any) => {
        console.log(res);

        if (res.length == 0) {
          this.getAllAssignedStagesByClientId();
        } else {
          console.log('executed from cpoc')
          if (res.success) {
            this.allRealityTouchpoinStages = res.data;
          } else {
            this.allRealityTouchpoinStages = [];
          }
        }
      },
      error: (err: any) => { },
      complete: () => { },
    });
  }

  getAllAssignedStagesByClientId() {
    this.isLoading = true;
    this.service.getAllAssignedStagesForRealityTouchpointByCID(sessionStorage.getItem("ClientId")).subscribe({
      next: (res: any) => {
        if (res.message === "No RealityTouchpoint Assignment found.") {
          this.isLoading = false;
        } else {
          this.allRealityTouchpoinStages = res.data;
          console.log(this.allRealityTouchpoinStages);
          if (this.allRealityTouchpoinStages.status == "not yet started") {
            this.displayEnable = true;
            console.log(this.allRealityTouchpoinStages.status == "not yet started");

          }

          this.isLoading = false;
        }

      }, error: (err) => { console.log }, complete: () => { }
    })
  }

  openPopup() {
    const dialogRef = this.dialog.open(InfochartComponent, {
      width: '1200px',
      height: '700px',
      disableClose: true,
      // data: { id: id},
    });
    dialogRef.afterClosed().subscribe(() => {
    });
  }

  openPopup2(): void {
    const dialogRef = this.dialog.open(AssignrealitytouchpointComponent, {
      width: '500px',
      height: '350px',
      disableClose: true,
      data: { name: 'Touchpoint' },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getAllAssignedStagesByClientId();
    });
  }

  openPopupForFeedBack() {
    const dialogRef = this.dialog.open(FeedbackComponent, {
      width: '1000px',
      height: '600px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(() => {
      // this.getAllAssignedStagesByClientId();
    });
  }

  openEmpTouchpoint(touchPointAssignmtId: number, stageId: any): void {
    console.log(touchPointAssignmtId);

    let url = this.router.url.replace("touch-point/emp-touchpoint", `starttouchpoint/${touchPointAssignmtId}/${stageId}`);
    this.router.navigateByUrl(url);
  }

  onDeleteRealityTouchpoint(item: any) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: {
        message: `Do you really want to deactivate the records for stage ${item.stage} ?`,
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.action == 'ok') {
        this.service.deleteAssignmentForRealityTouchpointByID(item.id).subscribe((res: any) => {
          if (res.success) {
            this.tostr.success(res.message);
            this.getAllAssignedStagesByClientId();
          }
        });
      }
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
    });
  }

}
