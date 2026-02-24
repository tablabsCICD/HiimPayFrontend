// import { Component, OnInit } from '@angular/core';
// import { MatDialogRef } from '@angular/material/dialog';
// import { TouchpointService } from '../../../../services/touchpoint.service';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ToastrService } from 'ngx-toastr';

// @Component({
//   selector: 'app-assignrealitytouchpoint',
//   templateUrl: './assignrealitytouchpoint.component.html',
//   styleUrl: './assignrealitytouchpoint.component.css'
// })
// export class AssignrealitytouchpointComponent implements OnInit {
//   whyThisIsImportant: any;
//   selectedOption: string = '';
//   allRealityToucpoint: any;
//   realityTouchpointID: any;
//   displaydropDown: boolean = false;
//   subphaseId: any;
//   listSubphase: any;
//   assignRealityTouchpointForm!: FormGroup;
//   // errorMessage: boolean = false;
//   showErrors: boolean = false;

//   constructor(private dialogRef: MatDialogRef<AssignrealitytouchpointComponent>, private service: TouchpointService, private fb: FormBuilder, private tostr: ToastrService) { }

//   ngOnInit() {
//     this.getAllTouchPointsStages();
//     this.assignRealityTouchpointForm = this.fb.group({

//       realityTouchpointStageId: ['', Validators.required],


//     });
//   }

//   getAllTouchPointsStages() {
//     this.service.getAllTouchPointsStages().subscribe({
//       next: (res) => {
//         this.allRealityToucpoint = res.data;
//         console.log(this.allRealityToucpoint);

//         console.log(res);

//       }, error: (err) => { console.log(err) }, complete: () => { }
//     })
//   }

//   onClose(): void {
//     this.dialogRef.close();
//   }

//   onChangeOfStage(event: any) {
//     this.realityTouchpointID = event.target.value;
//     this.showErrors = false;
//     console.log(event.target.value);
//     this.displaydropDown = true;
//     this.getSubphase();
//   }
//   getSubphase() {
//     this.service.getRealitysubphase(this.realityTouchpointID).subscribe((res: any) => {
//       console.log(res);
//       this.listSubphase = res.data
//     })
//   }
//   onChangeOfSuhphase(event: any) {
//     this.subphaseId = event.target.value;
//     this.showErrors = false;
//   }

//   assign() {
//     this.showErrors = true;
//     if (this.realityTouchpointID && this.subphaseId) {
//       const obj = {
//         active: true,
//         clientId: sessionStorage.getItem("ClientId"),
//         loggedUserId: JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id,
//         realityTouchpointStageId: this.realityTouchpointID,
//         realityTouchpointSubphaseId: this.subphaseId,
//         startDate: new Date(),
//         status: "active",

//         whyThisIsImportant: this.whyThisIsImportant
//       }

//       console.log(obj);

//       this.service.createRealityTouchpointStageAssignment(obj).subscribe({
//         next: (res) => {
//           if (res.message == "already assigned this stage for this client.") {
//             this.tostr.error(res.message)
//           } else {
//             this.tostr.success(res.message);
//             this.onClose();
//             this.getAllTouchPointsStages()
//           }


//         }, error: (err) => { console.log(err) }, complete: () => { }
//       })
//     }

//   }
// }
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TouchpointService } from '../../../../services/touchpoint.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-assignrealitytouchpoint',
  templateUrl: './assignrealitytouchpoint.component.html',
  styleUrl: './assignrealitytouchpoint.component.css'
})
export class AssignrealitytouchpointComponent implements OnInit {
  whyThisIsImportant: any;
  selectedOption: string = '';
  allRealityToucpoint: any;
  realityTouchpointID: any;
  displaydropDown: boolean = false;
  subphaseId: any;
  listSubphase: any;
  assignRealityTouchpointForm!: FormGroup;
  showErrors: boolean = false;

  phasesLoaded: boolean = false; 

  constructor(private dialogRef: MatDialogRef<AssignrealitytouchpointComponent>, private service: TouchpointService, private fb: FormBuilder, private tostr: ToastrService) { }

  ngOnInit() {
    this.getAllTouchPointsStages();
    this.assignRealityTouchpointForm = this.fb.group({
      realityTouchpointStageId: ['', Validators.required],
      subphaseId: ['', Validators.required],
    });
  }

  getAllTouchPointsStages() {
    this.service.getAllTouchPointsStages().subscribe({
      next: (res) => {
        this.allRealityToucpoint = res.data;
        console.log(this.allRealityToucpoint);
      },
      error: (err) => { console.log(err); },
      complete: () => { }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onChangeOfStage(event: any) {
    this.realityTouchpointID = event.target.value;
    this.showErrors = false;
    this.displaydropDown = true;
    this.assignRealityTouchpointForm.get('subphaseId')?.reset('');
    this.getSubphase();
  }

  getSubphase() {
    this.phasesLoaded = false;
    this.service.getRealitysubphase(this.realityTouchpointID).subscribe((res: any) => {
      console.log(res);
      if(res.success){
      this.listSubphase = res.data;
      this.phasesLoaded = true;
      }
    });
  }

  onChangeOfSubphase(event: any) {
    this.subphaseId = event.target.value;
    this.showErrors = false;
  }

  assign() {
    this.showErrors = true;
    if (this.realityTouchpointID && this.subphaseId) {
      const obj = {
        active: true,
        clientId: sessionStorage.getItem("ClientId"),
        loggedUserId: JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id,
        realityTouchpointStageId: this.realityTouchpointID,
        realityTouchpointSubphaseId: this.subphaseId,
        startDate: new Date(),
        status: "active",
        whyThisIsImportant: this.whyThisIsImportant
      };

      console.log(obj);

      this.service.createRealityTouchpointStageAssignment(obj).subscribe({
        next: (res) => {
          if (res.message == "already assigned this stage for this client.") {
            this.tostr.error(res.message);
          } else {
            this.tostr.success(res.message);
            this.onClose();
            this.getAllTouchPointsStages();
          }
        },
        error: (err) => { console.log(err); },
        complete: () => { }
      });
    }
  }
}
