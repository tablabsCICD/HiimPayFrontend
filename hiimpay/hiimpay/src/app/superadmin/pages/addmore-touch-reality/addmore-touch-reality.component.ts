import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { TouchpointService } from '../../services/touchpoint.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addmore-touch-reality',
  templateUrl: './addmore-touch-reality.component.html',
  styleUrls: ['./addmore-touch-reality.component.css']
})
export class AddmoreTouchRealityComponent implements OnInit {
  selectedSubphase: any;
  tabName: string;
  fetchedTouchpoints: any[] = [];
  fetchedRealityComponents: any[] = [];
  selectedTouchpoints: number[] = [];
  selectedComponents: number[] = [];
  initialTouchpoints: Set<number> = new Set();
  initialComponents: Set<number> = new Set();

  constructor(
    public dialogRef: MatDialogRef<AddmoreTouchRealityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: TouchpointService,
    private toaster: ToastrService
  ) {
    this.selectedSubphase = data.subphase;
    this.tabName = data.tabName;
    if (this.tabName === 'Touchpoint') {
      this.initialTouchpoints = new Set(data.subphase.touchPoints.map((item: any) => item.id));
      this.selectedTouchpoints = [...this.initialTouchpoints];
    } else if (this.tabName === 'Reality component') {
      this.initialComponents = new Set(data.subphase.realityComponent.map((item: any) => item.id));
      this.selectedComponents = [...this.initialComponents];
    }
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData() {
    if (this.tabName === 'Touchpoint') {
      this.api.getAllTouchPoints().subscribe(response => {
        this.fetchedTouchpoints = response.data.map((tp: any) => ({
          ...tp,
          checked: this.initialTouchpoints.has(tp.id)
        }));
      });
    } else if (this.tabName === 'Reality component') {
      this.api.getAllComponents().subscribe(response => {
        this.fetchedRealityComponents = response.data.map((rc: any) => ({
          ...rc,
          checked: this.initialComponents.has(rc.id)
        }));
      });
    }
  }

  searchTouchPoint(event: any) {
    const keyword = event.target.value.trim();
    if (keyword.length > 0) {
      this.api.searchTouchpoint(keyword).subscribe(response => {
        this.fetchedTouchpoints = response.data.map((tp: any) => ({
          ...tp,
          checked: this.initialTouchpoints.has(tp.id)
        }));
      });
    } else {
      this.loadInitialData();
    }
  }

  searchRealityComponent(event: any) {
    const keyword = event.target.value.trim();
    if (keyword.length > 0) {
      this.api.searchComponent(keyword).subscribe(response => {
        this.fetchedRealityComponents = response.data.map((rc: any) => ({
          ...rc,
          checked: this.initialComponents.has(rc.id)
        }));
      });
    } else {
      this.loadInitialData();
    }
  }

  toggleTouchpointSelection(touchpoint: any) {
    // touchpoint.checked = !touchpoint.checked;
    if (touchpoint.checked) {
      this.selectedTouchpoints.push(touchpoint.id);
    } else {
      const index = this.selectedTouchpoints.indexOf(touchpoint.id);
      if (index > -1) {
        this.selectedTouchpoints.splice(index, 1);
      }
    }
  }

  toggleRealityComponentSelection(component: any) {
    // component.checked = !component.checked;
    if (component.checked) {
      this.selectedComponents.push(component.id);
    } else {
      const index = this.selectedComponents.indexOf(component.id);
      if (index > -1) {
        this.selectedComponents.splice(index, 1);
      }
    }
  }

  onSubmit() {
    if (this.tabName === 'Touchpoint') {
      const selectedTouchpoints = this.fetchedTouchpoints
        .filter(tp => tp.checked)
        .map(tp => tp.id);
      this.updateTouchpointAndRealitySubphaseAssignment(this.selectedSubphase.subphaseId, { touchPoints: selectedTouchpoints });
    } else if (this.tabName === 'Reality component') {
      const selectedComponents = this.fetchedRealityComponents
        .filter(rc => rc.checked)
        .map(rc => rc.id);
      this.updateTouchpointAndRealitySubphaseAssignment(this.selectedSubphase.subphaseId, { realityComponent: selectedComponents });
    }
  }

  updateTouchpointAndRealitySubphaseAssignment(id: number, obj: any) {
    this.api.updateTouchpointAndRealitySubphaseAssignment(id, obj).subscribe({
      next: (response: any) => {
        this.toaster.success(response.message);
        this.dialogRef.close(response);
      },
      error: (err: any) => {
        console.log('Error submitting data', err);
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
