import { Component, OnInit } from '@angular/core';
import { TouchpointService } from '../../../services/touchpoint.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

@Component({
  selector: 'app-assign-touchpoint',
  templateUrl: './assign-touchpoint.component.html',
  styleUrl: './assign-touchpoint.component.css'
})
export class AssignTouchpointComponent {
  result:any;

  questions:any[]=[];
  isCollapsed: boolean[] = [];
  isDraggedCollapsed:boolean[]=[];
  dragedQuestion: any[] = [];
  touchpointStageId:any;
  touchpointStageName:any;
  touchpointSubPhase:any;


  constructor(private api:TouchpointService,private route: ActivatedRoute,private tostr: ToastrService,private router:Router,private location:Location) {
    // this.qas.forEach(() => {
    //   this.isCollapsed.push(true);
    //   this.isDraggedCollapsed.push(true);
    // });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
     
      this.touchpointStageId=params['touchpointStageId'];
      this.touchpointStageName = params['touchpointStageName'];
      this.touchpointSubPhase=params['touchpointSubPhase'];
      console.log( this.touchpointStageId);
      console.log(  this.touchpointSubPhase);
    });
    this.api.getAllTouchPoints().subscribe((res:any)=>{
      if(res.success){
        this.questions=res.data;
        console.log(this.questions);
      }
    })
  }

  makeCollapse(index: number) {
      this.isCollapsed[index] = !this.isCollapsed[index];
  }

  makeDraggedCollapse(index: number) {
    this.isDraggedCollapsed[index] = !this.isDraggedCollapsed[index];
}


drop(event: CdkDragDrop<string[]>) {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );
  }
  console.log(this.dragedQuestion);
  this.result=this.dragedQuestion.map((data:any)=>data.id)
  console.log(this.result);
  
  
}


  onSubmit() {
    if (this.dragedQuestion.length === 0) {
      this.tostr.error('Please assign at least one touchpoint.');
      return;
    }
    const obj = {
      createdDate: new Date(),
      loggedUserId:  JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id,
      touchPointStageId: this.touchpointStageId,
      subPhaseName: this.touchpointSubPhase,
      touchPoints: this.result,
    }
    console.log(obj);
    this.api.createTouchpointAndRealitySubphaseAssignment(obj).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res.message === "TouchPoint Phases created successfully.") {
          this.tostr.success(res.message);
          this.router.navigate(['superadmin/assign-component'], {
            queryParams: {
              touchpointStageId: this.touchpointStageId,
              touchpointStageName : this.touchpointStageName,
              touchpointSubPhase: this.touchpointSubPhase,id:res.data.id
            },
          });
          // this.router.navigate(['superadmin/touchpoint'])
        }
      }, error: (err: any) => {
        console.log(err);
      }, complete: () => { }
    })
  }

  goBack(){
    this.location.back();
  }
}
