import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TouchpointService } from '../../services/touchpoint.service';
import { ChangeDetectorRef } from '@angular/core';
import { DeleteComponent } from '../delete/delete.component';
import { MatDialog } from '@angular/material/dialog';
import { AddmoreTouchRealityComponent } from '../addmore-touch-reality/addmore-touch-reality.component';

@Component({
  selector: 'app-touch-reality-details',
  templateUrl: './touch-reality-details.component.html',
  styleUrls: ['./touch-reality-details.component.css']
})
export class TouchRealityDetailsComponent implements OnInit {
  touchpointReality: any;
  tabs: any = ['Touchpoint', 'Reality component'];
  selectedTab: string = 'Touchpoint';
  selectedSubphase: any;
  subphases: any[] = [];
  stageId: any;
  stageName: any;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private service: TouchpointService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.stageId = +params['id'];
      this.stageName = params['name'];
      console.log(`ID: ${this.stageId}, Name: ${this.stageName}`);
      this.loadTouchpointRealityDetails(this.stageId);
    });
    this.selectTab('Touchpoint');
  }

  loadTouchpointRealityDetails(id: number): void {
    this.service.getTouchpointRealityDetailsById(id).subscribe({
      next: (res) => {
        this.touchpointReality = res;
        this.subphases = this.touchpointReality.data;
        this.selectedSubphase = this.subphases[0];
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {}
    });
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
    if (this.touchpointReality) {
      this.subphases = this.touchpointReality.data;
      this.selectedSubphase = this.subphases[0];
    }
  }

  selectSubphase(subphase: any): void {
    this.selectedSubphase = subphase;
  }

  goBack() {
    this.location.back();
  }

  openAddmoreRealityTouchPoint() {
    const selectedData = {
      subphase: this.selectedSubphase,
      tabName: this.selectedTab
    };
  
    const dialogRef = this.dialog.open(AddmoreTouchRealityComponent, {
      width: '1200px',
      height: '600px',
      disableClose: true,
      data: selectedData
    });
    dialogRef.afterClosed().subscribe(() => {
      this.loadTouchpointRealityDetails(this.stageId);
    });
  }

  onRemoveTouchpoint(touchpoint: any): void {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: {
        message: `Do you really want to remove the touchpoint ${touchpoint.touchpoints}?`,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.action == 'ok') {
        this.selectedSubphase.touchPoints = this.selectedSubphase.touchPoints.filter((tp:any) => tp !== touchpoint);
        this.updateBackend(this.selectedSubphase.subphaseId, { touchPoints: this.selectedSubphase.touchPoints.map((tp:any) => tp.id) });
      }
    });
  }

  onRemoveComponent(component: any): void {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: {
        message: `Do you really want to remove the component ${component.componentName}?`,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.action == 'ok') {
        this.selectedSubphase.realityComponent = this.selectedSubphase.realityComponent.filter((rc:any) => rc !== component);
        this.updateBackend(this.selectedSubphase.subphaseId, { realityComponent: this.selectedSubphase.realityComponent.map((rc:any) => rc.id) });
      }
    });
  }

  updateBackend(id: number, updatedData: any): void {
    this.service.updateTouchpointAndRealitySubphaseAssignment(id, updatedData).subscribe({
      next: (res) => {
        console.log('Update successful', res);
        this.loadTouchpointRealityDetails(this.stageId);
      },
      error: (err) => {
        console.log('Update failed', err);
      }
    });
  }
}
