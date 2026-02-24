import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectService } from '../../../services/project.service';

@Component({
  selector: 'app-whoassigned',
  templateUrl: './whoassigned.component.html',
  styleUrl: './whoassigned.component.css'
})
export class WhoassignedComponent implements OnInit {

  surveyassignmentId : any;
  whohasassigned : any;
  isLoading : boolean = false;

  constructor(private dialogRef: MatDialogRef<WhoassignedComponent>,@Inject(MAT_DIALOG_DATA) public data: any, private api : ProjectService){}

  ngOnInit(): void {
    if(this.data){
      this.surveyassignmentId=this.data.id
    }
    this.isLoading=true;
    this.api.getAllWhoHasAssignedByAssignmentId(this.surveyassignmentId).subscribe({next:(res)=>{
      this.whohasassigned=res.data;
      this.isLoading=false;
    },error:(err)=>{console.log(err) ;this.isLoading = false},complete:()=>{}})

  }

  onClose(): void {
    this.dialogRef.close();
  }
}
