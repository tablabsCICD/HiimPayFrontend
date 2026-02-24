import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  activeIcon: string = 'add-circle-outline';
  data: any;
  attract: any = 20;
  onboard: any = 20;
  develop: any = 20;
  retain: any = 20;
  seperate: any = 20;
  detailInfo: any;
  subphase: any;
  stages: any;
  substageQuestions: any = [];
  isCpoc:boolean=false;
  constructor(private api: ProjectService, private tosatr: ToastrService) {}

  ngOnInit(): void {
    this.isCpoc=sessionStorage.getItem("isCpoc")=='true';
    this.api.getDetailSurveyList(4).subscribe((res: any) => {
      this.detailInfo = res.data;
      console.log(this.detailInfo);
      
      this.detailInfo.dto[0].clicked = true;
      this.subphase = this.detailInfo.dto[0].subphaseWithQuestionAnswerResponseDtos;
      this.substage(this.subphase[0]);
    });
  }
  stage(stageDetail: any) {
    this.detailInfo.dto.forEach(
      (val: any) => (val.clicked = val.stageId == stageDetail.stageId)
    );
    this.stages = stageDetail;
    this.subphase = this.stages.subphaseWithQuestionAnswerResponseDtos;
  }

  substage(sub: any) {
    this.subphase.forEach(
      (val: any) => (val.clicked = val.subphaseId == sub.subphaseId)
    );
    this.substageQuestions = sub;
  }
  change(iconName: string) {
    this.activeIcon = iconName;
  }

  
}
