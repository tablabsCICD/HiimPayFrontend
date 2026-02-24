import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent implements OnInit {

  feedback:any;
  isLoading:boolean=false;
  
  constructor(private dialogRef: MatDialogRef<FeedbackComponent>,private api:ProjectService) { }

  ngOnInit(): void {
    const clientId = parseInt(sessionStorage.getItem("ClientId")!, 10);
    this.api.getAllFeedbackByClientId(clientId).subscribe({next:(res)=>{
      this.feedback = res.data;
    },error:(err)=>{console.log(err)},complete:()=>{}})
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
