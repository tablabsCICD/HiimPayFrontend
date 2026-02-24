import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DATE } from 'ngx-bootstrap/chronos/units/constants';
import { ProjectService } from '../../../services/project.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-matrics',
  templateUrl: './create-matrics.component.html',
  styleUrl: './create-matrics.component.css',
})
export class CreateMatricsComponent implements OnInit {
  showcontainer: string = '';
  clientId: any;
  createForm!: FormGroup;
  addMatrixForm!: FormGroup;
  buttonName: any = 'Add metric';
  selectedOption: any = '';
  file: any;
  isSelectedFileValid: boolean = false;
  formData: any;
  isLoading: any;
  checkDownloadExcelSpinner:boolean = false;

  constructor(
    private dialogRef: MatDialogRef<CreateMatricsComponent>,
    private fb: FormBuilder,
    @Inject(DIALOG_DATA) public data: { name: string; id: number },
    private service: ProjectService,
    private tosatr: ToastrService
  ) { }

  ngOnInit(): void {
    this.createForm = this.fb.group({
      value: ['', Validators.required],
      phaseId: [''],
      nextDataDueDate: [''],
      metricsName: ['', [Validators.required]],
      frequencyOfDataCollection: [''],
      calculationsOrDefination: [''],
      additionalInformation: [''],
      loggedUserId: '',
      selectedOption: [''],
      dataPoint: [''],
      listOfData: this.fb.array([]),
    });

    this.addMatrixForm = this.fb.group({});

    if (this.data?.name === 'edit-Matrix' && this.data.id !== null) {
      console.log(this.data.id);

      this.buttonName = 'Update';
      this.onEdit();
    }
  }

  createProject() {
    if (this.buttonName === 'Add metric') {
      if (this.createForm.valid) {
      const form = this.createForm.value;
      console.log(form);

      if (form.selectedOption === 'excel') {
        console.log('excel');

        const obj = {
          additionalInformation: form.additionalInformation,
          file: this.file,
          clientId: sessionStorage.getItem('ClientId'),
          metricsName: form.metricsName,
          phaseId: form.phaseId,
          getFromExcel: true,
          frequencyOfDataCollection: form.frequencyOfDataCollection,
          calculationsOrDefination: form.calculationsOrDefination,
          nextDataDueDate: form.nextDataDueDate,
          value: form.value,
          dataPoint: form.dataPoint,
          loggedUserId: JSON.parse(
            sessionStorage.getItem('currentLoggedInUserData')!
          ).id,
        };

        const formData = new FormData();
        Object.entries(obj).forEach((val) => {
          formData.append(val[0], val[1]);
        });

        this.service
          .addPeopleMetricsWithExcel(formData)
          .subscribe((res: any) => {
            console.log(res);
            if (res.message === 'Metrics created successfully.') {
              console.log('Metrics created successfully.');
              this.tosatr.success(res.message);
              this.createForm.reset();
              this.onClose();
            } else {
            }
          });
      } else if (form.selectedOption === 'manually') {
        const obj = {
          additionalInformation: form.additionalInformation,
          calculationsOrDefination: form.calculationsOrDefination,
          clientId: sessionStorage.getItem('ClientId'),
          createdDate: new Date(),
          getFromExcel: false,
          dataPoint: form.dataPoint,
          frequencyOfDataCollection: form.frequencyOfDataCollection,
          listOfData: form.listOfData,
          loggedUserId: JSON.parse(
            sessionStorage.getItem('currentLoggedInUserData')!
          ).id,
          metricsName: form.metricsName,
          nextDataDueDate: form.nextDataDueDate,
          phaseId: form.phaseId,
          value: form.value,
        };

        console.log(obj);

        this.service.peoplemetrics(obj).subscribe((res: any) => {
          console.log(res);
          if (res.message === 'Metrics created successfully.') {
            console.log('Metrics created successfully.');
            this.tosatr.success(res.message);
            this.createForm.reset();
            this.onClose();
          } else {
          }
        });
      }
    }
    else{
      this.createForm.markAllAsTouched();
      this.tosatr.error('Please enter valid data');
    }
    } else if (this.buttonName === 'Update') {
      if(this.createForm.valid){
      const form = this.createForm.value;
      console.log(form);
      const obj = {
        additionalInformation: form.additionalInformation,
        calculationsOrDefination: form.calculationsOrDefination,
        clientId: sessionStorage.getItem('ClientId'),
        createdDate: new Date(),
        getFromExcel: false,
        dataPoint: form.dataPoint,
        frequencyOfDataCollection: form.frequencyOfDataCollection,
        listOfData: form.listOfData,
        loggedUserId: JSON.parse(
          sessionStorage.getItem('currentLoggedInUserData')!
        ).id,
        metricsName: form.metricsName,
        nextDataDueDate: form.nextDataDueDate,
        phaseId: form.phaseId,
        value: form.value,
      };

      console.log(obj);

      this.service.updateMetric(this.data.id, obj).subscribe((res: any) => {
        console.log(res);
        if (res.message === 'People matrix updated successfully.') {
          console.log('Metrics updated successfully.');
          this.tosatr.success(res.message);
          this.createForm.reset();
          this.onClose();
        } else {
        }
      });
    }
    else{
      this.createForm.markAllAsTouched();
      this.tosatr.error('Please enter valid data')
    }
  }
  }

  onEdit() {
    this.isLoading = true;
    this.service.getMatrixById(this.data.id).subscribe((res) => {
      console.log(res);

      this.isLoading = false;
      const form = res.data.peopleMetrics;
      const historicData = res.data.matrixDatas;
      this.createForm.patchValue({
        additionalInformation: form.additionalInformation,
        calculationsOrDefination: form.calculationsOrDefination,
        dataPoint: form.dataPoint,
        createdDate: new Date(),
        getFromExcel: false,
        frequencyOfDataCollection: form.frequencyOfDataCollection,
        listOfData: form.listOfData,

        metricsName: form.metricsName,
        nextDataDueDate: form.nextDataDueDate,
        phaseId: form.phaseId,
        value: form.value,
        selectedOption: 'manually',
      });
      const listOfData = this.createForm.get('listOfData') as FormArray;
      historicData.forEach((data: any) => {
        listOfData.push(
          this.fb.group({
            monthYear: [data.monthYear, Validators.required],
            value: [data.value, Validators.required],
          })
        );
      });
    });
  }

  listOfData(): FormArray {
    return this.createForm.get('listOfData') as FormArray;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  addRow() {
    const dataItem = this.fb.group({
      monthYear: ['', Validators.required],
      value: ['', Validators.required],
    });
    this.listOfData().push(dataItem);
  }

  deleteRow(i: number) {
    this.listOfData().removeAt(i);
  }

  validateFile() {
    if (
      ![
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ].includes(this.file.type)
    ) {
      this.isSelectedFileValid = false;
    } else {
      this.isSelectedFileValid = true;
      // const formData = new FormData();
      // formData.append('file', this.file);
      // this.formData = formData;
    }
  }

  uploadFile() {
    // this.service.uploadHolidayFile(this.formData).subscribe({
    //   next: (val) => {
    //     const { data, message, success } = val;
    //     success
    //       ? (this.notificationService.showSuccess(message, ''),
    //         location.reload())
    //       : this.notificationService.showError(message, '');
    //   },
    //   error: (err) => {
    //     this.notificationService.showError(
    //       'Error uploading holiday file',
    //       'Please try again'
    //     );
    //   },
    // });
  }
  onFileBrowse(event: any) {
    const inputElement = event.target as HTMLInputElement;
    this.file = inputElement?.files?.[0]; // Get the selected file
    if (this.file) {
      this.validateFile();
    }
  }

  downloadExcelFormat() {
    this.checkDownloadExcelSpinner=true;
    this.service.getExcelFileForPeopleMatrix().subscribe(blob => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = 'HistoricDataUploadFormat.xlsx';
      a.click();
      URL.revokeObjectURL(objectUrl);
      this.checkDownloadExcelSpinner=false;
    }, error => {
      console.error('Download error:', error);
    });
  }
}
