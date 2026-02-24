import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/enviorment.prod';

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  baseUrl = environment.baseUrl;
  private dataUrl = 'assets/testdata.json';
  // baseUrl2 = environment.baseUrl2;
  constructor(private http: HttpClient) { }

  getAllSurveyAssignmentByClientID(id: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + `survey-assignments/surveyAssignments/getAllClientIdUniqueSurvey?clientId=${id}`,'');
  }

  getFudsSUrveyDetailsForReport(id: number): Observable<any> {
    return this.http.get<any>(this.baseUrl + `grapg/fuds/StaticsurveyScore22?surveyAssignmentClientId=${id}`);
  }

  getFudsSurveyLineGrapah(clientId: number, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl+`graph1/fuds/lineChartGraph?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`,'');
    // let url = `${this.baseUrl}demographic/graph1/fuds/lineChartGraph?clientId=${clientId}`;
    // if (contractType) {
    //   url += `&contractType=${contractType}`;
    // }
    // if (gender) {
    //   url += `&gender=${gender}`;
    // }
    // if (lifeCycle) {
    //   url += `&lifeCycle=${lifeCycle}`;
    // }
    // if (staticSurveyID) {
    //   url += `&StaticSurveyID=${staticSurveyID}`;
    // }
    // if (tenure) {
    //   url += `&tenure=${tenure}`;
    // }
    // return this.http.post<any>(url, '');
  }

  getFudsForProgressBar(clientId: number, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl+`graph2/fuds/progressChart?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`,'');
    // return this.http.post<any>(this.baseUrl + `demographic/graph2/fuds/progressChart?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`, '');
  }

  getFudsForTable(clientId: number,staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl+`StaticScoreController/fuds/scoreForTable?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`,'');
    // let url = `${this.baseUrl}StaticScoreController/demographic/fuds/scoreForTable?clientId=${clientId}`;

    // if (contractType) {
    //   url += `&contractType=${contractType}`;
    // }
    // if (gender) {
    //   url += `&gender=${gender}`;
    // }
    // if (lifeCycle) {
    //   url += `&lifeCycle=${lifeCycle}`;
    // }
    // if (staticSurveyID) {
    //   url += `&StaticSurveyID=${staticSurveyID}`;
    // }
    // if (tenure) {
    //   url += `&tenure=${tenure}`;
    // }
    // return this.http.post<any>(url, '');
  }

  getFudsForQuestionGraph(clientId: number, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `graph3/FUDS/horizontalBarGraph?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`, '');
  }

  getEESurveyLineGrapah(clientId: number, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `graph1/EE/heatMap/new?clientId=${clientId}&surveyId=${staticSurveyID}`, '');
  }

  getEEForProgressBar(clientId: number, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `graph2/EE/progressChart?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`, '');
  }

  getEEForQuestionGraph(clientId: number, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `graph3/EE/horizontalBarChart?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`, '');
  }

  getEEForTable(clientId: number, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `StaticScoreController/EE/scoreForTable?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`, '');
  }

  getExitSurveyLineGraph(clientId: number, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `graph1/Exit/score12?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`, '');
  }

  getExitSurveyReasonProgressBar(clientId: number, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `graph2/Exit/progressChartExit?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`, '')
    // return this.http.post<any>(this.baseUrl + `demographic/graph2/Exit/progressChartExit?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`, '')
  }

  getExitSurveyForQuestionGraph(clientId: number, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `graph3/Exit/score12?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`, '');
  }

  getExitSurveyForTable(clientId: number, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `StaticScoreController/Exit/score1?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`, '');
    // let url = `${this.baseUrl}StaticScoreController/demographic/Exit/score1?clientId=${clientId}`;
  
    // if (contractType) {
    //   url += `&contractType=${contractType}`;
    // }
    // if (gender) {
    //   url += `&gender=${gender}`;
    // }
    // if (lifeCycle) {
    //   url += `&lifeCycle=${lifeCycle}`;
    // }
    // if (staticSurveyID) {
    //   url += `&StaticSurveyID=${staticSurveyID}`;
    // }
    // if (tenure) {
    //   url += `&tenure=${tenure}`;
    // }
    // return this.http.post<any>(url, '');
  }

  getOnboardingLineChart(clientId: number, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `graph1/onboarding/lineChart?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`, '');
  }

  getOnBoardingEffectivenessProgressBar(clientId: number, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `graph2/onboarding/score12?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`, '');
  }

  getOnboardingEffectivenessForQuestionGraph(clientId: number, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `graph3/onboarding/horizontalBarChart?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`, '');
  }

  getOnboardingEffectivenessForTable(clientId: number, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `StaticScoreController/Onboarding/scoreForTable?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`, '');
  }

  getOJTSurveyLineGraph(clientId: number,staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `graph1/OJT/lineChart?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`, '');
    // let url = `${this.baseUrl}demographic/graph1/OJT/lineChart?clientId=${clientId}`;

    // if (contractType) {
    //   url += `&contractType=${contractType}`;
    // }
    // if (gender) {
    //   url += `&gender=${gender}`;
    // }
    // if (lifeCycle) {
    //   url += `&lifeCycle=${lifeCycle}`;
    // }
    // if (staticSurveyID) {
    //   url += `&StaticSurveyID=${staticSurveyID}`;
    // }
    // if (tenure) {
    //   url += `&tenure=${tenure}`;
    // }
    // return this.http.post<any>(url, '');
  }

  getOJTProgressBar(clientId:number, staticSurveyID:number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `graph2/ojt/progressChartOJT?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`, '');
    // let url = `${this.baseUrl}StaticScoreController/demographic/ojt1/scoreForTable?clientId=${clientId}`;

    // if (staticSurveyID) {
    //   url += `&StaticSurveyID=${staticSurveyID}`;
    // }
    // if (contractType) {
    //   url += `&contractType=${contractType}`;
    // }
    // if (gender) {
    //   url += `&gender=${gender}`;
    // }
    // if (lifeCycle) {
    //   url += `&lifeCycle=${lifeCycle}`;
    // }
    // if (tenure) {
    //   url += `&tenure=${tenure}`;
    // }
    // return this.http.post<any>(url, '');
  }

  getOJTSurveyQuestionGraph(clientId: number, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `graph3/OJT/horizontalBarChart?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`, '');
  }

  getOJTSurveyForTable(clientId: number, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `StaticScoreController/ojt1/scoreForTable?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`, '');
    // return this.http.post<any>(this.baseUrl + `StaticScoreController/demographic/ojt1/scoreForTable?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`, '');
  }

  getInductionSurveyLineGraph(clientId: number, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `graph1/induction/lineChart?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`, '');
  }

  getInductionsurveyProgressBar(clientId: number, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `graph2/induction/score12?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`, '');
  }

  getInductionSurveyQuestionGraph(clientId: number, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `graph3/induction/horizontalBarChart?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`, '');
  }

  getInductionSurveyForTable(clientId: number, StaticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `StaticScoreController/Induction/scoreForTable?clientId=${clientId}&StaticSurveyID=${StaticSurveyID}`, '');
  }

  // getPulseSurveyLineGraph(clientId:number, staticSurveyID:number):Observable<any>{
  //   return this.http.post<any>(this.baseUrl2+`graph1/pulse/lineChart?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`,'');
  // }

  getPulseSurveyLineGraph(clientId: number, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `graph1/Pulse/heatMapNew?clientId=${clientId}&surveyId=${staticSurveyID}`, '');
  }

  getPulsesurveyProgressBar(clientId: number, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `graph2/Pulse/progressChartPulse?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`, '');
  }

  getPulseSurveyQuestionGraph(clientId: number, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `graph3/pulse/horizontalBarChart?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`, '');
  }

  getPulseSurveyForTable(clientId: number, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `StaticScoreController/Pulse1/score1?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`, '');
  }

  getManagerEffectivenessLineGraph(clientId: number, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl+`graph1/Manager/LineChart?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`,'');
    // let url = `${this.baseUrl}demographic/graph1/Manager/LineChart?clientId=${clientId}`;

    // if (contractType) {
    //   url += `&contractType=${contractType}`;
    // }
    // if (gender) {
    //   url += `&gender=${gender}`;
    // }
    // if (lifeCycle) {
    //   url += `&lifeCycle=${lifeCycle}`;
    // }
    // if (staticSurveyID) {
    //   url += `&StaticSurveyID=${staticSurveyID}`;
    // }
    // if (tenure) {
    //   url += `&tenure=${tenure}`;
    // }
    // return this.http.post<any>(url, '');
  }

  getManagerEffectivenessDonutGrpah(clientId: number, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl+`graph2/Manager/progressChartManager?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`,'');
    // return this.http.post<any>(this.baseUrl + `demographic/graph2/Manager/progressChartManager?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`, '');
  }

  getManagerEffectivenessQuestionGraph(clientId: number, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `graph3/Manager/score12?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`, '');
  }

  getManagerEffectivenessForTable(clientId: number,staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl+`StaticScoreController/Manager1/score1?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`,'');
    // let url = `${this.baseUrl}StaticScoreController/demographic/Manager1/score1?clientId=${clientId}`;

    // if (contractType) {
    //   url += `&contractType=${contractType}`;
    // }
    // if (gender) {
    //   url += `&gender=${gender}`;
    // }
    // if (lifeCycle) {
    //   url += `&lifeCycle=${lifeCycle}`;
    // }
    // if (staticSurveyID) {
    //   url += `&StaticSurveyID=${staticSurveyID}`;
    // }
    // if (tenure) {
    //   url += `&tenure=${tenure}`;
    // }
    // return this.http.post<any>(url, '');
  }

  getENPSSUrveyForDonutChart(clientId: number, staticSurveyID: number): Observable<any> {
    return this.http.get<any>(this.baseUrl + `StaticScoreController/EnpsServey/graph?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`);
  }

  getDaynamicSurveyLineGrapah(clientId: number, isStatic: boolean, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `StaticScoreController/getDynamicLineChart?clientId=${clientId}&isStatic=${isStatic}&surveyId=${staticSurveyID}`,'');
  }

  getOtherDynamicSurveyProgressBar(clientId: number, isStatic: boolean, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `graph2/Dyanmic/progressChartPulse?clientId=${clientId}&isStatic=${isStatic}&StaticSurveyID=${staticSurveyID}`, '');
  }

  getOtherSurveyQuestionGraph(clientId: number, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `graph3/Foundation/horizontalBarChartFOundation?clientId=${clientId}&StaticSurveyID=${staticSurveyID}`, '');
  }

  getOtherSurveyQuestionGraphForDynamicSurvey(clientId: number, isStatic: boolean, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `graph3/dynamic/horizontalBarChartFOundation?clientId=${clientId}&isStatic=${isStatic}&StaticSurveyID=${staticSurveyID}`, '');
  }

  getOtherDaynamicSUrveyForTable(clientId: number, isStatic: boolean, staticSurveyID: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `StaticScoreController/Dynamic/score1?clientId=${clientId}&isStatic=${isStatic}&StaticSurveyID=${staticSurveyID}`, '')
  }

  getDemographicGraphDetails(clientId: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `users/users/clientId?clientId=${clientId}`,'');
  }

  getDemographicReportBySUrvey(clientId: number, isStatic: boolean, surveyId: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `users/users/surveyWise?clientId=${clientId}&isStatic=${isStatic}&surveyId=${surveyId}`,'');
  }
  // getGaph3(){
  //   return this.http.post<any>(this.baseUrl2+`graph3/Fuds?surveyAssignmentClientId=1`,'');
  // }

  downloadExcelForDynamicSurveyExport(clientId: any, surveyId: any,): Observable<any> {
    return this.http.post<any>(this.baseUrl + `excelReport/StaticScoreController/dynamic/excel?clientId=${clientId}&surveyId=${surveyId}`, '');
  }

  downloadExcelForStaticSurveyExport(clientId: any, surveyId: any,): Observable<any> {
    return this.http.post<any>(this.baseUrl + `excelReport/StaticScoreController/static/excel?clientId=${clientId}&StaticSurveyId=${surveyId}`, '');
  }

}
