import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateMatricsComponent } from '../create-matrics/create-matrics.component';
import { Chart, ChartConfiguration } from 'chart.js';
import { ProjectService } from '../../../services/project.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-info-matrix',
  templateUrl: './info-matrix.component.html',
  styleUrl: './info-matrix.component.css',
})
export class InfoMatrixComponent implements OnInit {
  items: any;
  isPopupOpen: boolean = false;
  surveyList: any;
  isLoading: boolean = false;
id:any;
public chart: Chart | undefined;

monthArray:any[]=[];




  constructor(
    @Inject(DIALOG_DATA) public data: { name: string; id: number },
    private router: Router,
    private route: ActivatedRoute,
    private dialogRef: MatDialogRef<CreateMatricsComponent>,
    private service: ProjectService,
    private tosatr: ToastrService
  ) {}

  ngOnInit(): void {
    this.id=this.data.id
    console.log(this.id);
    this.isLoading=true;
    this.service.getMatrixById(this.id).subscribe((res:any)=>{console.log(res);
    this.isLoading=false;
      const monthArray = res.data.matrixDatas;

      const labels = monthArray.map((item:any) => item.monthYear);
      const dataValues = monthArray.map((item:any) => parseInt(item.value)); 

      console.log(labels);
      console.log(dataValues);
      this.barChartData.labels = labels;
      this.barChartData.datasets[0].data = dataValues;

    })
  }

  
 

  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [
    ],
    datasets: [
      {
        data: [],
    label:"score",
        backgroundColor: '#103a7f',
      },
     
    ],
    
  };


  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

  onClose(): void {
    this.dialogRef.close();
  }
}
