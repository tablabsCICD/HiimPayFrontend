import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from '../../../services/project.service';
import { DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'app-pinned',
  templateUrl: './pinned.component.html',
  styleUrl: './pinned.component.css'
})
export class PinnedComponent {
  filterToggle: boolean = false;
  // details: any;
  info: any;
  details: any[] = [
    {
      surveyName: 'Survey 1',
      description: 'Description',
      status: 'Active',
      createdDate: '2024-04-22',
      id: 1
    },
    {
      surveyName: 'Survey 2',
      description: 'Description',
      status: 'Inactive',
      createdDate: '2024-04-20',
      id: 2 
    },
  ]
  constructor(public dialog: MatDialog, private service: ProjectService,private dialogRef: MatDialogRef<PinnedComponent>,@Inject(DIALOG_DATA) public data: {name: string,id:number},) { }

  ngOnInit(): void {
    this.service.getUserByClientID(sessionStorage.getItem("ClientId")).subscribe((res: any) => {
      console.log(res);
      this.details = res.data;
      this.onclick(this.details[0].id)
    })
  }
  onclick(id: any) {
    console.log(id);

    this.service.getByUserID(id).subscribe((res: any) => {
      console.log(res);
      this.info = res;
      console.log(this.info);

    })
  }
  onClose(): void {
    this.dialogRef.close();
  }


  next(){
    this.dialogRef.close();
  }
  editSurvey(surveyId: any) {

  }

  changePhase(surveyId: any) {

  }

  deleteSurvey(surveyId: any) {

  }

}
