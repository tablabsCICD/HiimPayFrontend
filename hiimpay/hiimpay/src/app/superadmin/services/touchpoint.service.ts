import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/enviorment.prod';


@Injectable({
  providedIn: 'root'
})
export class TouchpointService {

  baseUrl = environment.baseUrl;
  // baseUrl2 = environment.baseUrl2;
  constructor(private http: HttpClient) { }

  getAllTouchPointsStages(): Observable<any> {
    return this.http.get<any>(this.baseUrl + `TouchPointStagesController`);
  }

  getAllTouchPoints(): Observable<any> {
    return this.http.get<any>(this.baseUrl + `touchpoint-controller`);
  }
  getRealitysubphase(stageId: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + `getByStageId?stageId=${stageId}`,'');
  }

  getAllComponents(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'component');
  }

  toucpointGraph(id: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + `getRealityTouchpointGraph?clientId=${id}`,'');
  }

  createComponentForReality(obj: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + `component/save`, obj);
  }

  getComponentForRealityById(id: number): Observable<any> {
    return this.http.get<any>(this.baseUrl + `component/${id}`);
  }

  updateComponentForRealityById(id: number, obj: any): Observable<any> {
    return this.http.put<any>(this.baseUrl + `component/${id}`, obj);
  }

  deleteComponentForRealityById(id: number): Observable<any> {
    // return this.http.delete<any>(this.baseUrl+`component/${id}`);
    return this.http.put<any>(this.baseUrl + `component/${id}`, { active: false });
  }

  createTouchpoint(obj: any): Observable<any> {
    return this.http.post(this.baseUrl + `touchpoint-controller/save`, obj);
  }

  getTouchpointById(id: number): Observable<any> {
    return this.http.get(this.baseUrl + `touchpoint-controller/${id}`);
  }

  updateToucpointById(id: number, obj: any): Observable<any> {
    return this.http.put<any>(this.baseUrl + `touchpoint-controller/${id}`, obj);
  }

  deleteTouchpointById(id: number): Observable<any> {
    return this.http.put<any>(this.baseUrl + `touchpoint-controller/${id}`, {status:'false'});
  }

  createTouchPointStage(obj: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + `TouchPointStagesController/save`, obj);
  }

  getTouchpointStageById(id: number): Observable<any> {
    return this.http.get<any>(this.baseUrl + `TouchPointStagesController/${id}`);
  }

  updateTouchpointStageById(id: number, obj: any): Observable<any> {
    return this.http.put<any>(this.baseUrl + `TouchPointStagesController/${id}`, obj);
  }

  deleteTouchpointStageById(id: number): Observable<any> {
    return this.http.put<any>(this.baseUrl + `TouchPointStagesController/${id}`, { active: false });
  }

  createTouchpointAndRealitySubphaseAssignment(obj: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + `touchPoint-sub-phase-controller/save`, obj);
  }

  updateTouchpointAndRealitySubphaseAssignment(id: any, obj: any): Observable<any> {
    return this.http.put<any>(this.baseUrl + `touchPoint-sub-phase-controller/${id}`, obj);
  }

  createRealityTouchpointStageAssignment(obj: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + `createRealityTouchpointAssignmnt`, obj);
  }

  getAllAssignedStagesForRealityTouchpointByCID(id: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + `getallRealityTouchpointAssignmnt/byClientId/${id}`,'');
  }

  deleteAssignmentForRealityTouchpointByID(id: number): Observable<any> {
    return this.http.put<any>(this.baseUrl + id,{active:false});
  }

  getAssignFormById(touchPointAssignmtId: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + `getallRealityTouchpointAssignmnt/forFormWithPreviousAns?touchPointAssignmtId=${touchPointAssignmtId}`,'');
  }

  getGraph(AssignmtId: number): Observable<any> {
    return this.http.get<any>(this.baseUrl + `getRealityTouchPointGraph?realityTouchpointAssignmntId=${AssignmtId}`);
  }


  assignFormResonce(obj: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + `captureRealityTouchpoint`, obj);
  }

  getTouchpointRealityDetailsById(id:any):Observable<any>{
    return this.http.get<any>(this.baseUrl+`TouchPointStagesController/realityTouchpoints/details/${id}`);
  }

  searchTouchpoint(keyword:any):Observable<any>{
    return this.http.get<any>(this.baseUrl+`touchpoint-controller/TouchPoints/search?keyword=${keyword}`);
  }

  searchComponent(keyword:any):Observable<any>{
    return this.http.get<any>(this.baseUrl+`touchpoint-controller/TouchPoints/search?keyword=${keyword}`);
  }
  
}
