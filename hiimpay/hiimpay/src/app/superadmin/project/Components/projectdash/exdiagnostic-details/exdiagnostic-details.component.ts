import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from '../../../services/project.service';

@Component({
  selector: 'app-exdiagnostic-details',
  templateUrl: './exdiagnostic-details.component.html',
  styleUrl: './exdiagnostic-details.component.css'
})
export class EXDiagnosticDetailsComponent implements OnInit {
  exDiagnosticReport:any;
  isLoading: boolean = false;
  displayMesg: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<EXDiagnosticDetailsComponent>,
    @Inject(DIALOG_DATA) public data: { id: number },
    private service: ProjectService
  ) {}

  ngOnInit(): void {
    this.getEXDiagnosticDetailsById();
  }

  getEXDiagnosticDetailsById(){
    this.service.getanalyseById(this.data?.id).subscribe({next:(res:any)=>{
      if(res?.message==='EXDiagnosticReport found.' && res?.success){
        this.exDiagnosticReport=res?.data;
        console.log('Executed', res?.data);
        
      }
    },error:(err)=>{console.log(err)},complete:()=>{}})
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
