import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GraphService } from '../../services/graph.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexFill,
  ApexLegend
} from "ng-apexcharts";
import { Colors } from 'chart.js';
import { CreateUserComponent } from '../project-admin/create-user/create-user.component';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  fill: ApexFill;
  legend: ApexLegend;
};



@Component({
  selector: 'app-demographic-charts',
  templateUrl: './demographic-charts.component.html',
  styleUrl: './demographic-charts.component.css'
})
export class DemographicChartsComponent implements OnInit {
  chartOptionsage: any;
  chartOptionsTenure: any;
  chartOptionsGender: any;
  chartOptionsWorkFlexibility: any;
  chartOptionsContractType: any;
  displayClientData: any;

  constructor(private api: GraphService, public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.displayClientData = JSON.parse(sessionStorage.getItem('ClientData')!);
    const clientId = parseInt(sessionStorage.getItem('ClientId')!, 10);
    this.api.getDemographicGraphDetails(clientId).subscribe({
      next: (res) => {
        if (res?.success) {
          this.showDemographicAgeChart(res);
          this.showDemographicTenureChart(res);
          this.showDemographicGenderChart(res);
          this.showDemographicWorkFlexibilityChart(res);
          this.showDemographicContractTypeChart(res);
        }
      }, error: (err) => { console.log(err) }, complete: () => { }
    });
  }


  showDemographicAgeChart(res: any) {
    const demographicAgeResponse = res?.data?.demographicAgeResponse;
    if (!demographicAgeResponse) {
      return;
    }
    const ageCategories = [
      "<25",
      "26-30",
      "31-40",
      "41-50",
      "51-60",
      ">60"
    ];

    const ageData = [
      demographicAgeResponse?.lessThan25Years,
      demographicAgeResponse?.twentySixTo30Year,
      demographicAgeResponse?.thirtyOneTo40Years,
      demographicAgeResponse?.fourtyOneTo50Years,
      demographicAgeResponse?.fiftyOneTo60Years,
      demographicAgeResponse?.aboveSixtyYears
    ];

    const highestValue = Math.max(...ageData);


    let yAxisMax;
    let tickAmount;
    if (highestValue <= 10) {
      yAxisMax = 10;
      tickAmount = 4;
    } else if (highestValue <= 20) {
      yAxisMax = 20;
      tickAmount = 4;
    } else if (highestValue <= 30) {
      yAxisMax = 30;
      tickAmount = 4;
    } else if (highestValue <= 40) {
      yAxisMax = 40;
      tickAmount = 6;
    } else if (highestValue <= 50) {
      yAxisMax = 50;
      tickAmount = 6;
    } else if (highestValue <= 60) {
      yAxisMax = 60;
      tickAmount = 8;
    } else if (highestValue <= 70) {
      yAxisMax = 70;
      tickAmount = 8;
    } else if (highestValue <= 80) {
      yAxisMax = 80;
      tickAmount = 10;
    } else if (highestValue <= 90) {
      yAxisMax = 90;
      tickAmount = 10;
    } else if (highestValue <= 100) {
      yAxisMax = 100;
      tickAmount = 10;
    } else {
      yAxisMax = highestValue;
      tickAmount = 10;
    }

    const currentDate = `Generated on: ${this.getCurrentDate()}`;

    this.chartOptionsage = {
      series: [{
        name: "Number of Users",
        data: ageData
      }],
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: true,
          export: {
            csv: {
              filename: "EXwise_Demographic_Age_Summary",
              columnDelimiter: ",",
              headerCategory: "Client name :,"+this.displayClientData?.clientName+"\n"+currentDate+"\n Age",
              headerValue: "Value",
              customFormatter: (options: any) => {
                let csvData = "Age, Value\n";
                options.series.forEach((series: any, index: number) => {
                  csvData += `${options.xaxis.categories[index]}, ${series.data.join(", ")}\n`;
                });
                csvData += `\n\n${currentDate}`;
                return csvData;
              },
            },
            svg: {
              filename: "EXwise_Demographic_Age_Summary",
              afterDownload: () => {
                console.log(currentDate);
              }
            },
            png: {
              filename: "EXwise_Demographic_Age_Summary",
              afterDownload: () => {
                console.log(currentDate);
              }
            },
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      colors: ['#2980b9'],
      xaxis: {
        categories: ageCategories
      },
      yaxis: {
        title: {
          text: "Number of Users"
        },
        min: 0,
        max: yAxisMax,
        tickAmount: tickAmount,
        labels: {
          formatter: function (val: number) {
            return Math.round(val).toString();
          }
        }
      },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return val + " users";
          }
        }
      },
      title: {
        text: 'Demographic Age Distribution',
        align: 'center',
        style: {
          fontSize: '15px',
          fontWeight: 'bold'
        }
      }
    };
  }





  showDemographicTenureChart(res: any) {
    const demographicTenureResponse = res?.data?.demographicTenureResponse;
    if (!demographicTenureResponse) {
      return;
    }
    const tenureCategories = [
      "<3 months",
      "3-11 months",
      "1-2 years",
      "3-5 years",
      "5-10 years",
      ">10 years"
    ];

    const tenureData = [
      demographicTenureResponse?.lessThreeMonthTenure,
      demographicTenureResponse?.threeto11MonthTenure,
      demographicTenureResponse?.oneTo2YearTenure,
      demographicTenureResponse?.threeTo5YearTenure,
      demographicTenureResponse?.fiveTo10YearTenure,
      demographicTenureResponse?.greater10Tenure
    ];

    const highestValue = Math.max(...tenureData);


    let yAxisMax;
    let tickAmount;
    if (highestValue <= 10) {
      yAxisMax = 10;
      tickAmount = 4;
    } else if (highestValue <= 20) {
      yAxisMax = 20;
      tickAmount = 4;
    } else if (highestValue <= 30) {
      yAxisMax = 30;
      tickAmount = 4;
    } else if (highestValue <= 40) {
      yAxisMax = 40;
      tickAmount = 6;
    } else if (highestValue <= 50) {
      yAxisMax = 50;
      tickAmount = 6;
    } else if (highestValue <= 60) {
      yAxisMax = 60;
      tickAmount = 8;
    } else if (highestValue <= 70) {
      yAxisMax = 70;
      tickAmount = 8;
    } else if (highestValue <= 80) {
      yAxisMax = 80;
      tickAmount = 10;
    } else if (highestValue <= 90) {
      yAxisMax = 90;
      tickAmount = 10;
    } else if (highestValue <= 100) {
      yAxisMax = 100;
      tickAmount = 10;
    } else {
      yAxisMax = highestValue;
      tickAmount = 10;
    }

    const currentDate = `Generated on: ${this.getCurrentDate()}`;

    this.chartOptionsTenure = {
      series: [{
        name: "Number of Users",
        data: tenureData
      }],
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: true,
          export: {
            csv: {
              filename: "EXwise_Demographic_Tenure_Summary",
              columnDelimiter: ",",
              headerCategory: "Client name :,"+this.displayClientData?.clientName+"\n"+currentDate+"\n Tenure",
              headerValue: "Value",
              customFormatter: (options: any) => {
                let csvData = "Tenure, Value\n";
                options.series.forEach((series: any, index: number) => {
                  csvData += `${options.xaxis.categories[index]}, ${series.data.join(", ")}\n`;
                });
                csvData += `\n\n${currentDate}`; 
                return csvData;
              },
            },
            svg: {
              filename: "EXwise_Demographic_Tenure_Summary",
              afterDownload: () => {
                console.log(currentDate); 
              }
            },
            png: {
              filename: "EXwise_Demographic_Tenure_Summary",
              afterDownload: () => {
                console.log(currentDate); 
              }
            },
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      colors: ['#2B3A67'],
      xaxis: {
        categories: tenureCategories
      },
      yaxis: {
        title: {
          text: "Number of Users"
        },
        min: 0,
        max: yAxisMax,
        tickAmount: tickAmount,
        labels: {
          formatter: function (val: number) {
            return Math.round(val).toString();
          }
        }
      },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return val + " users";
          }
        }
      },
      title: {
        text: 'Demographic Tenure Distribution',
        align: 'center',
        style: {
          fontSize: '15px',
          fontWeight: 'bold'
        }
      }
    };
  }


  showDemographicGenderChart(res: any) {
    const demographicGenderResponse = res?.data?.demographicGenderResponse;
    if (!demographicGenderResponse) {
      return;
    }
    const genderLabels = ["Male", "Female", "Other", "Not Answered"];
    const genderData = [
      demographicGenderResponse?.maleUser,
      demographicGenderResponse?.femaleUser,
      demographicGenderResponse?.otherUser,
      demographicGenderResponse?.notAnwseredUser
    ];
    const colors = ['#2B3A67', '#747687', '#069de0', '#103a7f'];

    this.chartOptionsGender = {
      series: genderData,
      chart: {
        type: "donut",
        height: 350
      },
      labels: genderLabels,
      colors: colors,
      title: {
        text: 'Demographic Gender Distribution',
        align: 'center',
        style: {
          fontSize: '15px',
          fontWeight: 'bold'
        }
      },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return val + " users";
          }
        }
      },
      legend: {
        position: 'bottom'
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          return Math.round(val) + "%";
        },
        style: {
          fontSize: '12px',
          fontWeight: 'bold',
          colors: ['#fff']
        }
      },
      stroke : {
        show:false
      },
      plotOptions: {
        pie: {
          dataLabels: {
            minAngleToShowLabel: 1
          }
        }
      }    

    };
  }

  showDemographicWorkFlexibilityChart(res: any) {
    const demographicWorkFlexibilityResponse = res?.data?.demographicWorkFlexibilityResponse;
    if (!demographicWorkFlexibilityResponse) {
      return;
    }
    const flexibilityLabels = ["Work From Office", "Work From Home", "Hybrid", "Other"];
    const flexibilityData = [
      demographicWorkFlexibilityResponse?.workFromOffice,
      demographicWorkFlexibilityResponse?.workFromHome,
      demographicWorkFlexibilityResponse?.hybrid,
      demographicWorkFlexibilityResponse?.other
    ];
    const colors = ['#2B3A67', '#2980b9', '#747687', '#069de0'];

    this.chartOptionsWorkFlexibility = {
      series: flexibilityData,
      chart: {
        type: "donut",
        height: 350,
      },
      labels: flexibilityLabels,
      colors: colors,
      title: {
        text: 'Demographic Work Flexibility Distribution',
        align: 'center',
        style: {
          fontSize: '15px',
          fontWeight: 'bold'
        }
      },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return val + " users";
          }
        }
      },
      legend: {
        position: 'bottom'
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          return Math.round(val) + "%";
        },
        style: {
          fontSize: '12px',
          fontWeight: 'bold',
          colors: ['#fff']
        }
      },
      stroke : {
        show:false
      },
      plotOptions: {
        pie: {
          dataLabels: {
            minAngleToShowLabel: 1
          }
        },
      }    
    };
  }

  showDemographicContractTypeChart(res: any) {
    const demographicContractTypeResponse = res?.data?.demographicContractTypeResponse;
    if (!demographicContractTypeResponse) {
      return;
    }
    const contractTypeLabels = ["Full-time", "Part-time", "Fixed Contract", "Casual", "Other"];
    const contractTypeData = [
      demographicContractTypeResponse?.fulltime,
      demographicContractTypeResponse?.parttime,
      demographicContractTypeResponse?.fixedContract,
      demographicContractTypeResponse?.casual,
      demographicContractTypeResponse?.other
    ];
    const colors = ['#103a7f', '#747687', '#103a7f', '#2B3A67', '#069de0'];
    this.chartOptionsContractType = {
      series: contractTypeData,
      chart: {
        type: "donut",
        height: 350,
      },
      labels: contractTypeLabels,
      colors: colors,
      title: {
        text: 'Demographic Contract Type Distribution',
        align: 'center',
        style: {
          fontSize: '15px',
          fontWeight: 'bold'
        }
      },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return val + " users";
          }
        }
      },
      legend: {
        position: 'bottom'
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          return Math.round(val) + "%";
        },
        style: {
          fontSize: '12px',
          fontWeight: 'bold',
          colors: ['#fff']
        }
      },
      stroke : {
        show:false
      },
      plotOptions: {
        pie: {
          dataLabels: {
            minAngleToShowLabel: 1
          }
        }
      }      
    };
  }

  editUser(userId: number) {
    console.log(userId);

    const dialogRef = this.dialog.open(CreateUserComponent, {
      width: '800px',
      height: '600px',
      disableClose: true,
      data: { name: 'edit-user', id: userId, isConsultant: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

}
