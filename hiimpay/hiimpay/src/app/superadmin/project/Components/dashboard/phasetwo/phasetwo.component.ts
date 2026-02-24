import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from '../../../services/project.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BackgroundProcessService } from '../background-process.service';


@Component({
  selector: 'app-phasetwo',
  templateUrl: './phasetwo.component.html',
  styleUrl: './phasetwo.component.css',
})
export class PhasetwoComponent {
  isDropdownVisible: boolean = true;
  isEmployeeDropdownVisible: boolean = true;
  items: any;
  SurveyListFromBackend: any;
  surveyList: any;
  stageList: any;
  assignSurveyForm!: FormGroup;
  surveyId: any;
  showstages: boolean = false;
  showSubphase: boolean = false;
  stageId: any;
  isStatic: boolean = true;
  subsstageId: any;
  whyThisIsImportant: any;
  subphaseList: any;
  employeeList: any;
  allFocusGroup: any;
  surveyAssignSpinner: boolean = false;
  allUser: any;
  // selectedStage: any;
  stageIsDefault: boolean = false;
  selectedSurveys: any[] = [];
  selectedSubphases: any[] = [];
  selectedEmployees: any[] = [];
  selectedStage: any[] = [];
  showWhomeToAssign: boolean = false;
  surveyName: any;
  focusGroupId: any;
  dropdownList: any[] = [];
  selectedItems: any[] = [];
  dropdownSettings: IDropdownSettings = {};
  dropdownSettingsForSurveys: IDropdownSettings = {};

  constructor(
    private dialogRef: MatDialogRef<PhasetwoComponent>,
    @Inject(DIALOG_DATA) public data: { name: string; id: number },
    private router: Router,
    private route: ActivatedRoute,
    private service: ProjectService,
    private fb: FormBuilder,
    private tostr: ToastrService,
    private backgroundProcessService: BackgroundProcessService
  ) { }

  onClose(): void {
    this.dialogRef.close();
  }

  next() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.getAllSurvey();
    this.getAllFocuseGroupByClientID();
    this.getAllUsersByClientId();
    this.assignSurveyForm = this.fb.group({
      active: [''],
      clientEmployeesWithSurveys: [[], Validators.required],
      clientId: [''],
      end_date: [''],
      id: [''],
      instruction: [''],
      loggedUserId: [''],
      phaseId: [''],
      stageId: [null],
      startDate: [''],
      status: [''],
      subPhaseId: [[]],
      focusGroupId: [''],
      surveyId: ['', Validators.required],
      whyThisIsImportant: [''],
      isStaticSurvey: [''],
      selectedOption: ['', Validators.required],
    });


    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10000,
      allowSearchFilter: true
    };

    this.dropdownSettingsForSurveys = {
      singleSelection: false,
      idField: 'index',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10000,
      allowSearchFilter: true
    };


  }
  getAllSurveyByClientId() {
    this.service.getAllSurveyByClientID(sessionStorage.getItem("ClientId"), 'desc', 1 - 1, 10, 'id').subscribe({
      next: (res) => {
      }, error: (err) => {
        console.log(err)
      }, complete: () => { }
    })
  }

  getSurveySategByID() {
    console.log(this.isStatic);

    this.service
      .getSurveySategByID(this.surveyList[this.surveyId]?.id, this.isStatic)
      .subscribe((res: any) => {
        console.log(res);
        this.surveyName = res?.data?.surveyName;
        console.log(this.surveyName);
        this.stageList = res?.data?.dto?.map((stage: any) => ({
          id: stage?.stageId,
          name: stage?.stageName
        }));
        console.log(this.stageList);
      });
  }
  getSubphaseByID() {
    console.log(this.isStatic);
    this.service
      .getSatebysubphasegByID(this.stageId, this.isStatic)

      .subscribe((res: any) => {
        console.log(res);
        // this.subphaseList = res.data;
        this.subphaseList = res.data.map((subphase: any) => ({
          id: subphase.subphaseId,
          name: subphase.subPhaseName
        }));

        console.log(this.subphaseList);
      });
  }

  getAllSurvey() {
    this.service.getAllSurvey().subscribe((res) => {
      if (res.success) {
        this.SurveyListFromBackend = res.data.data;
        console.log(this.SurveyListFromBackend)
        this.surveyList = res?.data?.data?.map((survey: any, index: any) => ({
          index: index,
          id: survey?.id,
          name: survey?.survey_name,
          tableName: survey?.tableName
        }));
        console.log(this.surveyList);
      } else {
        console.log(res.message);
      }
    });
  }

  //   getsurveyId(event:any){
  // console.log(event.target.value);

  //   }

  onDropDownClose() {
    this.isDropdownVisible = true;
  }
  isDefaultOpen() {
    this.isDropdownVisible = false;

  }
  isHide() {
    console.log('222222');

    this.isEmployeeDropdownVisible = false;
  }


  onSurveySelect(event: any) {


    if (this.selectedSurveys?.length === 1) {
      this.surveyId = event.index;
      console.log(event);
      this.stageList = [];
      this.selectedStage = [];
      this.subphaseList = [];
      this.showWhomeToAssign = true;

      const selectedSurveyFromBackend = this.SurveyListFromBackend?.find(
        (survey: any) => survey?.id == this.surveyList[this.surveyId]?.id && survey?.survey_name.toLowerCase() === this.selectedSurveys[0]?.name.toLowerCase());

      console.log(selectedSurveyFromBackend)

      const tableName = selectedSurveyFromBackend?.tableName;
      console.log(this.surveyId, tableName);

      const selectedSurvey = this.SurveyListFromBackend?.data?.find((item: any) => item?.id == this.surveyList[this.surveyId].id);
      console.log(selectedSurvey);

      const stage = selectedSurvey?.stages[0];
      this.showstages = false;
      this.selectedStage = [];

      // if (stage.stageName === 'default') {
      //   this.selectedStage = stage.id;
      //   console.log(this.selectedStage)
      //   this.getStageId({ target: { value: this.selectedStage } });
      // }

      if (tableName === 'static_survey') {
        this.isStatic = true;
      } else if (tableName === 'dynamic_survey') {
        this.isStatic = false;
      }
      this.assignSurveyForm.patchValue({
        surveyId: this.surveyId,
        isStaticSurvey: this.isStatic
      });
      // if (selectedSurvey?.tableName === 'static_survey') {
      //   this.isStatic = true;
      // } else if (selectedSurvey?.tableName === 'dynamic_survey') {
      //   this.isStatic = false;
      // }
      this.showstages = true;
      this.getSurveySategByID();
    }
    else {
      this.stageList = [];
    }
  }
  // selectedSurveyFromBackend(selectedSurveyFromBackend: any) {
  //   throw new Error('Method not implemented.');
  // }


  onSelectAllSurveys(event: any) {
    this.stageList = [];
    this.showWhomeToAssign = true;
  }

  onSurveyDselect(event: any) {
    this.stageList = [];
    console.log(event ,this.selectedSurveys);
    
    if (this.selectedSurveys?.length === 1 && this.selectedSurveys[0]?.name!=='Feel, Use, Do and See survey ') {
      this.surveyId = this.selectedSurveys[0]?.index;
      this.stageList = [];
      this.selectedStage = [];
      this.subphaseList = [];
      this.showWhomeToAssign = true;

      const selectedSurveyFromBackend = this.SurveyListFromBackend?.find(
        (survey: any) => survey?.id == this.surveyList[this.surveyId].id);

      const tableName = selectedSurveyFromBackend?.tableName;
      console.log(this.surveyId, tableName);


      if (tableName === 'static_survey') {
        this.isStatic = true;
      } else if (tableName === 'dynamic_survey') {
        this.isStatic = false;
      }
      this.assignSurveyForm.patchValue({
        surveyId: this.surveyList[this.surveyId].id,
        isStaticSurvey: this.isStatic
      });
      this.showstages = true;
      this.getSurveySategByID();
    }
    else {
      this.stageList = [];
    }
  }

  onDselectAllSureys(event: any) {
    this.stageList = [];
    this.showWhomeToAssign = false;
  }

  getStageId(event: any) {
    this.stageId = event.target.value;
    this.subphaseList = []
    this.showSubphase = true;
    if (this.stageList.dto[0].stageName !== 'default') {
      this.assignSurveyForm.patchValue({
        stageId: this.stageId
      });
    }
    this.getSubphaseByID()
  }


  getSubStageId(event: any) {
    this.subsstageId = event.target.value;
    this.assignSurveyForm.patchValue({
      subPhaseId: this.subsstageId
    });
    this.showSubphase = true;
  }

  AssignSuvreyTOclient() {
    // const selectedEmployees = this.selectedEmployees?.map((employee:any) => employee?.id);
    const selectedStages = this.selectedStage?.map((stage: any) => stage?.id);
    const selectedSubphaseIds = this.selectedSubphases?.map((subphase: any) => subphase?.id)
    const objects = this.selectedSurveys.map(survey => {
      return {
        active: true,
        clientEmployeesWithSurveys: this.assignSurveyForm.value.clientEmployeesWithSurveys,
        // clientEmployeesWithSurveys : selectedEmployees,
        clientId: sessionStorage.getItem('ClientId'),
        end_date: '',
        instruction: '',
        loggedUserId: JSON.parse(sessionStorage.getItem('currentLoggedInUserData')!).id,
        phaseId: JSON.parse(sessionStorage.getItem('ClientData')!).phaseid,
        stageId: selectedStages,
        startDate: new Date(),
        status: 'Active',
        subPhaseId: selectedSubphaseIds,
        focusGroupId: this.focusGroupId,
        surveyId: this.surveyList[survey?.index].id,
        whyThisIsImportant: this.whyThisIsImportant,
        isStaticSurvey: this.isStatic,
      };
    });

    console.log(objects);

    if (this.assignSurveyForm.valid) {
      this.surveyAssignSpinner = true;
      this.backgroundProcessService.showBackgroundMessage();
      this.dialogRef?.close();
      this.service.surveyAssignToClient(objects).subscribe((res: any) => {
        console.log(res);
        this.surveyAssignSpinner = false;
        if (res?.overallErrors && res?.overallErrors?.length > 0) {
          this.backgroundProcessService.hideBackgroundMessage();
          this.surveyAssignSpinner = false;
          res?.overallErrors?.forEach((error: string) => {
            this.tostr.error(error);
          });
        } else if (res.message == 'All survey assignments processed successfully') {
          this.tostr.success('Survey assigned successfully');
          this.backgroundProcessService.hideBackgroundMessage();
        } else if (res?.responses) {
          res.responses.forEach((response: any) => {
            if (response.errors && response.errors.length > 0) {
              response.errors.forEach((error: string) => {
                this.tostr.error(error);
              });
            }
          });
        }
      });
    }
    else {
      this.tostr.error('please enter valid data');
      this.assignSurveyForm.markAllAsTouched();
    }
  }

  getAllFocuseGroupByClientID() {
    this.service.getAllFocusGroupByClientId(sessionStorage.getItem("ClientId")).subscribe({
      next: (res: any) => {
        console.log(res);
        this.allFocusGroup = res.data;
      }, error: (err: any) => {
        console.log(err);
      }, complete: () => { }
    });
  }


  getAllUsersByClientId() {
    this.service.getUserByClientID(sessionStorage.getItem("ClientId")).subscribe({
      next: (res: any) => {
        console.log(res);
        this.allUser = res.data;
        this.employeeList = res.data.map((user: any) => ({
          id: user?.id,
          name: user?.name
        }));


      }, error: (err: any) => {
        console.log(err);
      }, complete: () => { }

    });
  }

  onOptionChange(event: any): void {
    const selectedOption = event.target.value;
    this.assignSurveyForm.patchValue({ selectedOption });
    const clientEmployeesControl = this.assignSurveyForm.get('clientEmployeesWithSurveys');
    clientEmployeesControl?.setValue([]);
    if (selectedOption === 'all') {
      this.assignSurveyForm.patchValue({ clientEmployeesWithSurveys: [] });
      this.assignSurveyForm.get('clientEmployeesWithSurveys')!.clearValidators();
    } else {
      this.assignSurveyForm.get('clientEmployeesWithSurveys')!.setValidators(Validators.required);
    }
    this.assignSurveyForm.get('clientEmployeesWithSurveys')!.updateValueAndValidity();
  }

  onEmployeeChange(event: any): void {
    const selectedEmployee = parseInt(event.target.value, 10);
    this.assignSurveyForm.patchValue({
      clientEmployeesWithSurveys: [selectedEmployee],
    });
  }

  onFocuseGroupChange(event: any): void {
    const selectedFocuseGroupId = parseInt(event.target.value, 10);
    this.focusGroupId = selectedFocuseGroupId;
    const selectedFocuseGroup = this.allFocusGroup.find(
      (group: any) => group.focusGroup.id === selectedFocuseGroupId
    );
    if (selectedFocuseGroup) {
      const memberIds = selectedFocuseGroup.listOfMember.map((member: any) => member.userId);
      this.assignSurveyForm.patchValue({
        clientEmployeesWithSurveys: memberIds,
      });
    }
  }

  onSubphaseSelect(item: any) {
    console.log(item)
  }

  onSelectAllSubphases(items: any) {
    console.log(items)
  }

  onStageSelect(items: any) {

    if (this.selectedStage.length === 1) {
      console.log(items);
      this.stageId = items.id;
      this.subphaseList = []
      this.selectedSubphases = [];
      this.showSubphase = true;
      if (this.stageList[0]?.name !== 'default') {
        this.assignSurveyForm.patchValue({
          stageId: this.stageId
        });
      }
      this.getSubphaseByID()
    } else {
      this.showSubphase = false;
      this.subphaseList = [];
    }
  }

  onSelectAllStages(items: any) {
    if (items?.length === 1) {
      const selectedStage = items[0];
      this.stageId = selectedStage.id;
      this.selectedSubphases = [];
      this.subphaseList = [];
      this.showSubphase = true;

      if (this.stageList[0]?.name !== 'default') {
        this.assignSurveyForm.patchValue({
          stageId: this.stageId
        });
      }
      this.getSubphaseByID();
    } else {
      this.showSubphase = false;
      this.subphaseList = [];
    }
  }

  onStageDselect(items: any) {
    if (this.selectedStage.length === 1) {
      console.log(items);
      this.selectedSubphases = [];
      this.stageId = this.selectedStage[0]?.id;
      this.subphaseList = []
      this.showSubphase = true;
      if (this.stageList[0]?.name !== 'default') {
        this.assignSurveyForm.patchValue({
          stageId: this.stageId
        });
      }
      this.getSubphaseByID()
    } else {
      this.showSubphase = false;
      this.subphaseList = [];
    }
  }

  onDselectAllStages(items: any) {
    this.showSubphase = false;
    this.subphaseList = [];
  }

  onSelectEmployee(event: any) {
    const selectedEmployeeIds = this.selectedEmployees.map((employee: any) => employee.id);
    this.assignSurveyForm.patchValue({
      clientEmployeesWithSurveys: selectedEmployeeIds
    });
  }

  onSelectAllEmployees(event: any) {
    const allEmployeeIds = this.employeeList.map((employee: any) => employee.id);
    this.assignSurveyForm.patchValue({
      clientEmployeesWithSurveys: allEmployeeIds
    });
  }


}
