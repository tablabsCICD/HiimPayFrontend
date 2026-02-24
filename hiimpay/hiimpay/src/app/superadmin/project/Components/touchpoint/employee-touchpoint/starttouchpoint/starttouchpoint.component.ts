import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TouchpointService } from '../../../../../services/touchpoint.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { DeleteComponent } from '../../../../../pages/delete/delete.component';
import { MatStepper } from '@angular/material/stepper';
@Component({
  selector: 'app-starttouchpoint',
  templateUrl: './starttouchpoint.component.html',
  styleUrl: './starttouchpoint.component.css'
})
export class StarttouchpointComponent implements OnInit {
  internalOwners: string[] = [
    'External Communications', 'Facilities Management', 'HR Shared Services', 'HR', 'Internal Communications', 'IT',
    'Learning & Development', 'Line Manager', 'Onboarding Team', 'Operations', 'Other', 'Recruitment Team', 'Security'
  ];
  formResponses: any = {};
  realityQuality: any;
  extouchpoints: any;
  reality!: FormGroup;
  touchpoint!: FormGroup;
  quality!: FormGroup;
  starttouchpointId: any;
  touchPoints: any;
  realityComponent: any;
  feedbackText: string = '';
  selectedRating: any;
  stageId: any;
  isValueChanged: boolean = false;
  isAllAnsweredForReality: boolean = false;
  isAllTouchpointAnswered: boolean = false;
  isAllowToGoNextByStepper: boolean = false;
  @ViewChild('stepper') stepper!: MatStepper;

  constructor(
    private api: TouchpointService, private route: ActivatedRoute, private _formBuilder: FormBuilder,
    private router: Router, private location: Location, private dialog: MatDialog,
    private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.starttouchpointId = params.get('id');
      this.stageId = params.get('stageId');
    });

    this.reality = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.touchpoint = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });

    this.api.getAssignFormById(this.starttouchpointId).subscribe((res: any) => {
      this.realityComponent = res.data.realityComponent;
      this.touchPoints = res.data.touchPoints;

      console.log(this.realityComponent)
      console.log(this.touchPoints)

      this.formResponses = {};

      if (!this.formResponses.reality) {
        this.formResponses.reality = {};
      }

      // Iterate over the realityComponent array and populate the reality object
      res.data.realityComponent.forEach((componentData: any) => {
        const component = componentData.componentForReality; // Extract component details

        // Assign `yes_no` based on `isPresent` value
        this.formResponses.reality[component.id] = {
          yes_no: componentData?.isPresent || ""
        };
      });

      // Iterate over the touchPoints array
      res.data.touchPoints.forEach((touchPointData: any, index: number) => {
        const touchpoint = touchPointData.touchpoint;

        // Construct formResponses for each touchpoint
        this.formResponses[touchpoint.id] = {
          yes_no: touchPointData?.touchPointSelection,
          internalExternal: touchPointData?.touchPointSystem,
          automated: touchPointData?.touchPointAutomation,
          owners: touchPointData?.touchpointStakeholders
        };
      });

      console.log(this.formResponses);
      this.checkAllAnswered();
      
    });
  }

  // checkAllAnswered() {
  //   this.isAllAnsweredForReality = this.realityComponent.every((reality: any) =>{ console.log(reality.isPresent); reality?.isPresent === 'Yes' || reality?.isPresent === 'No'});
  //   console.log(this.isAllAnsweredForReality)
  //   this.isAllowToGoNextByStepper = this.isAllAnsweredForReality;
  // }

  checkAllAnswered() {
    this.isAllAnsweredForReality = this.realityComponent.every((reality: any) => {
      console.log(reality.isPresent);
      return reality?.isPresent === 'Yes' || reality?.isPresent === 'No';
    });
  
    console.log(this.isAllAnsweredForReality);
    if(this.isAllAnsweredForReality){
      this.checkAllTouchPointAnswered();
    }
    this.isAllowToGoNextByStepper = this.isAllAnsweredForReality;
  }
  

  isTouchpointValid(): boolean {
    return this.touchPoints.every((touch: any) =>
      touch?.touchPointSelection && touch?.touchPointAutomation && touch?.touchPointSystem
    );
  }

  checkAllTouchPointAnswered(): boolean {
    const allTouchpointsAnswered = this.touchPoints.every((point: any) => {
      return this.formResponses[point?.touchpoint?.id]?.yes_no !== "";
    });

    if (!allTouchpointsAnswered) {
      this.isAllTouchpointAnswered = false;
      return false;
    }

    const allValid = this.touchPoints.every((point: any) => {
      const touchpointId = point?.touchpoint?.id;
      const yesNoAnswer = this.formResponses[touchpointId]?.yes_no;

      if (yesNoAnswer === "Yes") {
        const efficiencyValid = this.formResponses[touchpointId]?.automated !== null && this.formResponses[touchpointId]?.internalExternal !== null;
        const stakeholderValid = this.formResponses[touchpointId]?.owners?.length > 0;
        // console.log(this.formResponses[touchpointId]?.automated);
        // console.log(this.formResponses[touchpointId]?.internalExternal);
        if (efficiencyValid && stakeholderValid) {
          return true;
        } else {
          this.isAllTouchpointAnswered = false;
          return false;
        }
      } else if (yesNoAnswer === 'No') {
        return true;
      }
      return;
    });

    this.isAllTouchpointAnswered = allValid;
    this.isAllowToGoNextByStepper = this.isAllTouchpointAnswered;
    return allValid;
  }

  onStepClick(event: any) {
    if (event.selectedIndex === 2 && (!this.isAllAnsweredForReality || !this.isAllTouchpointAnswered)) {
      setTimeout(() => this.stepper.selectedIndex = 1, 0); // Force back to Step 2
    }

    console.log(event);

    console.log(this.isAllowToGoNextByStepper);
    if (this.isAllowToGoNextByStepper === false && event?.previouslySelectedIndex === 1) {
      this.isAllowToGoNextByStepper = true;
    }
    else if (this.isAllowToGoNextByStepper === true && event?.selectedIndex === 1 && !this.isAllTouchpointAnswered) {
      this.isAllowToGoNextByStepper = false;
    }
    else if (this.isAllowToGoNextByStepper === false && event?.selectedIndex === 1 && this.isAllTouchpointAnswered) {
      this.isAllowToGoNextByStepper = true;
    }

    console.log(this.isAllowToGoNextByStepper);
  }

  submitForm() {
    console.log(this.formResponses);

    const obj = {
      clientId: sessionStorage.getItem("ClientId"),
      createdDate: new Date().toISOString(),
      realityTouchpointStageId: this.stageId,
      loggedUserId: JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id,
      phaseId: JSON.parse(sessionStorage.getItem("ClientData")!).phaseid,
      realityTouchpointAssignmentId: this.starttouchpointId,
      quality: {
        note: this.feedbackText,
        selectedOption: this.selectedRating
      },
      reality: this.realityComponent.map((component: any) => ({
        componentId: component?.componentForReality?.id,
        componentName: component?.componentForReality?.componentName,
        present: this.formResponses?.reality?.[component?.componentForReality?.id]?.yes_no || ""
      })),
      efficiency: this.touchPoints.map((point: any) => ({
        touchPointId: point?.touchpoint?.id,
        selectedOption: this.formResponses[point?.touchpoint?.id]?.automated || "",
        touchPointName: point?.touchpoint?.touchpoints,
        selectedOption2: this.formResponses[point?.touchpoint?.id]?.internalExternal || ""
      })),
      stakeholder: this.touchPoints.map((point: any) => ({
        touchPointId: point?.touchpoint?.id,
        touchPointName: point?.touchpoint?.touchpoints,
        selectedOption: this.formResponses[point?.touchpoint?.id]?.owners || []
      })),
      touchpoint: this.touchPoints.map((point: any) => ({
        isPresent: this.formResponses[point?.touchpoint?.id]?.yes_no || "",
        touchPointId: point?.touchpoint?.id,
        touchPointName: point?.touchpoint?.touchpoints,
      }))
    };

    console.log('Form submission object:', obj);
    const isRealityValid = obj.reality.every((item: any) => item.present !== "");
    const isTouchpointValid = obj.touchpoint.every((item: any) => item.isPresent !== "");

    // Efficiency & Stakeholder validation only for selected touchpoints
    const isEfficiencyValid = obj.efficiency.every((item: any) =>
      obj.touchpoint.find((tp: any) => tp.touchPointId === item.touchPointId)?.isPresent === "Yes"
        ? item.selectedOption !== "" && item.selectedOption2 !== ""
        : true
    );

    const isStakeholderValid = obj.stakeholder.every((item: any) =>
      obj.touchpoint.find((tp: any) => tp.touchPointId === item.touchPointId)?.isPresent === "Yes"
        ? item.selectedOption.length > 0
        : true
    );

    if (!isRealityValid || !isEfficiencyValid || !isStakeholderValid || !isTouchpointValid) {
      let errorMessage = 'All answers are required. Please check the following:\n';

      if (!isRealityValid) {
        const missingReality = obj.reality.filter((item: any) => item.present === "").map((item: any) => item.componentName);
        errorMessage += `- Missing reality responses for: ${missingReality.join(", ")}\n`;
      }
      if (!isTouchpointValid) {
        const missingTouchpoints = obj.touchpoint.filter((item: any) => item.isPresent === "").map((item: any) => item.touchPointName);
        errorMessage += `- Missing touchpoint selection for: ${missingTouchpoints.join(", ")}\n`;
      }
      if (!isEfficiencyValid) {
        const missingEfficiency = obj.efficiency
          .filter((item: any) => obj.touchpoint.find((tp: any) => tp.touchPointId === item.touchPointId)?.isPresent === "Yes" && (item.selectedOption === "" || item.selectedOption2 === ""))
          .map((item: any) => item.touchPointName);
        errorMessage += `- Missing efficiency data for: ${missingEfficiency.join(", ")}\n`;
      }
      if (!isStakeholderValid) {
        const missingStakeholders = obj.stakeholder
          .filter((item: any) => obj.touchpoint.find((tp: any) => tp.touchPointId === item.touchPointId)?.isPresent === "Yes" && item.selectedOption.length === 0)
          .map((item: any) => item.touchPointName);
        errorMessage += `- Missing stakeholder selection for: ${missingStakeholders.join(", ")}\n`;
      }

      this.toastr.error(errorMessage);
    }

    // const isRealityValid = obj.reality.every((item: any) => item.present !== "");
    // const isEfficiencyValid = obj.efficiency.every((item: any) => item.selectedOption !== "" && item.selectedOption2 !== "");
    // const isStakeholderValid = obj.stakeholder.every((item: any) => item.selectedOption.length > 0);
    // const isTouchpointValid = obj.touchpoint.every((item: any) => item.isPresent !== "");

    // if (!isRealityValid || !isEfficiencyValid || !isStakeholderValid || !isTouchpointValid) {
    //   this.toastr.error('All answers are required please check again');
    // }
    else {
      const dialogRef = this.dialog.open(DeleteComponent, {
        data: {
          message: `Do you really want to submit the reality touchpoint?`,
        },
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result.action == 'ok') {
          console.log('Form submission object:', obj);
          this.api.assignFormResonce(obj).subscribe((res: any) => {
            console.log(res);
            if (res.message === "RealityTouchpoint response captured successfully.") {
              this.toastr.success('RealityTouchpoint response captured successfully.');
              this.clearForm();
              this.router.navigate(['../../../touch-point'], { relativeTo: this.route });
              // this.navigateBack();
            } else {
              this.toastr.error(res?.message);
            }
          });
        }
      });
    }
  }


  isValueChange(value: boolean) {
    console.log(value);

  }

  navigateBack() {
    this.location.back();
  }


  clearForm() {
    // Reset form groups
    this.reality.reset();
    this.touchpoint.reset();

    // Clear additional state
    this.feedbackText = "";
    this.selectedRating = "";
    this.formResponses = {};

    // Optionally, reset nested form controls if they exist
    this.realityComponent.forEach((component: any) => {
      const controlId = String(component.id);
      const control = this.reality.get(controlId);
      if (control) {
        control.reset();
      }
    });

    this.touchPoints.forEach((point: any) => {
      const controlId = String(point.id);
      const control = this.touchpoint.get(controlId);
      if (control) {
        control.reset();
      }
    });
  }


  onRatingChange(rating: string) {
    this.selectedRating = rating;
  }

  onInputScoreChange(event: any) {
    this.selectedRating = event?.target?.value;
    console.log(this.selectedRating);

  }

  isNumber(evt: any) {
    evt = evt ? evt : window.event;
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }

    const inputValue = evt.target.value + String.fromCharCode(charCode);

    if (parseInt(inputValue) > 100) {
      evt.preventDefault();
      return false;
    }

    return true;
  }


  onFeedbackChange(event: any) {
    this.feedbackText = event.target.value;
  }

  onOptionChange(item: any, field: string, value: string) {
    if (!this.formResponses[item.id]) {
      this.formResponses[item.id] = {};
    }
    this.formResponses[item?.id][field] = value;
    console.log(this.formResponses);
  }

  onChangeYesNo(touch: any, field: string, value: string) {
    // console.log(touch,field,value)
    const index = this.touchPoints.findIndex((tp: any) => tp.touchpoint.id === touch.touchpoint.id);
    if (index !== -1) {
      this.touchPoints[index].touchPointSelection = value;
    }

    // console.log('Updated touchPoints:', this.touchPoints);s

  }


  onOptionChangeForReality(item: any, field: string, value: string) {
    if (!this.formResponses.reality) {
      this.formResponses.reality = {};
    }
    if (!this.formResponses.reality[item.id]) {
      this.formResponses.reality[item.id] = {};
    }
    this.formResponses.reality[item.id][field] = value;
    console.log(this.formResponses);
  }

  onOwnerChange(item: any, owner: string, event: any) {
    const isChecked = event.target.checked;
    if (!this.formResponses[item.id]) {
      this.formResponses[item.id] = {};
    }
    if (!this.formResponses[item.id].owners) {
      this.formResponses[item.id].owners = [];
    }
    if (isChecked) {
      this.formResponses[item.id].owners.push(owner);
    } else {
      const index = this.formResponses[item.id].owners.indexOf(owner);
      if (index > -1) {
        this.formResponses[item.id].owners.splice(index, 1);
      }
    }
  }

  goBack() {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: {
        message: `Do you really want to cancel the reality touchpoint?`,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.action == 'ok') {
        this.location.back();
      }
    });
  }
}
