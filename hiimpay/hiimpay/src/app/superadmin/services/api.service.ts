import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/enviorment.prod';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  createPhase(obj: any) {
    return this.http.post<any>(this.baseUrl + `createphase`, obj);
  }

  getAllClient(orderBy: any, page: any, size: any, sortBy: any) {
    const url = `${this.baseUrl}clients/pagention?orderBy=${orderBy}&page=${page}&size=${size}&sortBy=${sortBy}`;
    return this.http.post<any>(url,'');
  }


  getAllOpenClient(orderBy: any, page: any, size: any, sortBy: any) {
    return this.http.get<any>(
      this.baseUrl + `clients/OpenStatus?orderBy=${orderBy}&page=${page}&size=${size}&sortBy=${sortBy}`
    );
  }


  getCountOfClients() {
    return this.http.get<any>(this.baseUrl + 'clients/getCountByStatus');
  }
  getClient(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'clients');
  }

  getAllRealityComponent() {
    return this.http.get<any>(this.baseUrl + `component`);
  }


  getAllPinClients(orderBy:any,page:any,size:any,sortBy:any) {
    const userId = JSON.parse(sessionStorage.getItem('currentLoggedInUserData')!).id;
    return this.http.post<any>(this.baseUrl + `pinned/clients/${userId}?orderBy=${orderBy}&page=${page}&size=${size}&sortBy=${sortBy}`,'');
  }

  getClientById(clientId: number) {
    return this.http.get<any>(this.baseUrl + 'clients/getById?id=' + clientId);
  }

  updateClientById(id: any, obj: any) {
    return this.http.put<any>(this.baseUrl + `clients/${id}`, obj);
  }

  createClient(obj: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'clients/save', obj);
  }

  deleteClient(clientId: number) {
    return this.http.put<any>(this.baseUrl + `clients/softDelete/${clientId}`,'');
  }

  getCousultants(): Observable<any> {
    return this.http.post<any>(this.baseUrl + `users/users/userByConsultantId`,'');
  }

  updateUser(id: any, obj: any) {
    return this.http.put<any>(this.baseUrl + `users/${id}`, obj);
  }

  getCountQuestions(): Observable<any> {
    return this.http.get<any>(this.baseUrl + `questions/count`);
  }
  pinClinet(clientId: number): Observable<any> {
    const loggedUserId = JSON.parse(sessionStorage.getItem('currentLoggedInUserData')!).id;
    return this.http.post<any>(
      this.baseUrl + `pinned/pin/client/${loggedUserId}/${clientId}`,
      ''
    );
  }

  unPinClient(clientId: number) {
    const loggedUserId = JSON.parse(sessionStorage.getItem('currentLoggedInUserData')!).id;
    return this.http.delete<any>(this.baseUrl + `pinned/unpin/client/${loggedUserId}/${clientId}`);
  }

  getCount(id: any): Observable<any> {
    return this.http.get<any>(
      this.baseUrl +
      `survey-assignments/getSurveycountByStatusAndClientId?clientId=${id}`
    );
  }
  searchByID(id: any) {
    return this.http.get<any>(this.baseUrl + ` survey-assignments/${id}`);
  }

  getOneToOneInterview() {
    return this.http.get<any>(this.baseUrl + `one-to-one-interviews`);
  }

  getUserByClientID(id: any) {
    return this.http.get<any>(
      this.baseUrl +
      ` users/getByClientId?clientId=${id}&orderBy=asc&page=0&size=10&sortBy=id`
    );
  }

  getAllOnetoOneInterview(clientId:number,currentDate:string,userId:number) {
    return this.http.get<any>(this.baseUrl + `consultant/api/focus-group-meetings/upcomingEvents?clientId=${clientId}&currentDate1=${currentDate}&userId=${userId}`);
  }

  getMeetingsByMonthForAdmin(clientId:number,month:number,userId:number,year:number):Observable<any> {
    return this.http.post<any>(this.baseUrl+`consultant/dateByMonthNew?clientId=${clientId}&month=${month}&userId=${userId}&year=${year}`,'');
  }

  getEventOnDateForAdmin(clientId:number,date:any,userId:number):Observable<any>{
    return this.http.post<any>(this.baseUrl+`consultant/eventsOnDate?clientId=${clientId}&date=${date}&userId=${userId}`,'');
  }

  getAdminInterviewByStatus(clientId:number,currentDate:string,status:string,userId:number):Observable<any>{
    return this.http.post<any>(this.baseUrl+`consultant/api/focus-group-meetings/filterForAdmin?clientId=${clientId}&currentDate1=${currentDate}&status=${status}&userId=${userId}`,'');
  }

  getFocuseGroupMeetingsAdminInterviewByStatus(currentDate:string,status:string,userId:number):Observable<any>{
    return this.http.post<any>(this.baseUrl+`focus-group-meetings/api/focus-group-meetings/filterForAdmin?currentDate1=${currentDate}&status=${status}&userId=${userId}`,'');
  }

  getFocuseGroupMeetingsByMonthForAdmin(month:number,userId:number,year:number):Observable<any> {
    return this.http.post<any>(this.baseUrl+`focus-group-meetings/dateByMonthNew?month=${month}&userId=${userId}&year=${year}`,'')
  }

  getFocuseGroupMeetigsEventOnDateForAdmin(date:any,userId:number):Observable<any>{
    return this.http.post<any>(this.baseUrl+`focus-group-meetings/eventsOnDate?date=${date}&userId=${userId}`,'');
  }

  createMeeting(obj: any) {
    return this.http.post<any>(
      this.baseUrl + `one-to-one-interviews/save`,
      obj
    );
  }
  updateMeeting(obj: any, id: any) {
    return this.http.put<any>(
      this.baseUrl + `one-to-one-interviews/${id}`,
      obj
    );
  }
  getMeetingByID(id: any) {
    return this.http.get<any>(this.baseUrl + `one-to-one-interviews/${id}`);
  }

  //Meetings For ALL Meetings tab for CPOC

  getAllActivityAdminInterviewByStatus(clientId:number,currentDate:string,status:string):Observable<any>{
    return this.http.post<any>(this.baseUrl+`allactivity/api/focus-group-meetings/filterForAdmin?clientId=${clientId}&currentDate1=${currentDate}&status=${status}`,'');
  }

  getAllActivityMeetingsByMonthForAdmin(clientId:number,month:number,year:number):Observable<any> {
    return this.http.post<any>(this.baseUrl+`allactivity/dateByMonthNew?clientId=${clientId}&month=${month}&year=${year}`,'');
  }

  getAllActivityEventOnDateForAdmin(clientId:number,date:any):Observable<any>{
    return this.http.post<any>(this.baseUrl+`allactivity/eventsOnDate?clientId=${clientId}&date=${date}`,'');
  }

  //---------------------------------------------------------------------------------------------------------------------

  getAllSurvey() {
    return this.http.get<any>(this.baseUrl + 'survey-types');
  }

  getSurveyByID(id: any) {
    return this.http.get<any>(this.baseUrl + `survey-assignments/${id}`);
  }

  saveSurvey(obj: any) {
    return this.http.get<any>(this.baseUrl + ` survey-assignments/save`, obj);
  }

  getByUserID(id: any) {
    return this.http.get<any>(this.baseUrl + `users/${id}`);
  }

  getByUpdateUserID(id: any, obj: any) {
    return this.http.put<any>(this.baseUrl + ` users/${id}`, obj);
  }
  createUser(obj: any) {
    return this.http.post<any>(this.baseUrl + ` users/save`, obj);
  }

  createGroup(obj: any) {
    return this.http.post<any>(this.baseUrl + ` focus-group/save`, obj);
  }

  focusGroupMeeting(obj: any) {
    return this.http.post<any>(this.baseUrl + `focus-group-meetings/save`, obj);
  }

  focusgroupByClientId(id: any) {
    return this.http.get<any>(this.baseUrl + ` focus-group/${id}`);
  }

  focusgroup() {
    return this.http.get<any>(this.baseUrl + `focus-group`);
  }

  getAllQuestions() {
    return this.http.get<any>(this.baseUrl + 'questions');
  }

  getAllQuestionsWIthOptions() {
    return this.http.get<any>(this.baseUrl + 'questions/getAllQuestionsWithAnswer');
  }

  createQuestion(obj: any) {
    return this.http.post<any>(this.baseUrl + 'questions/save', obj);
  }

  getQuestionListByStatus(status: any) {
    return this.http.get<any>(this.baseUrl + 'clients/status/' + status);
  }

  getSurveytListByStatus(status: any) {
    return this.http.get<any>(this.baseUrl + 'clients/status/' + status);
  }

  getClientListByStatus(status: any) {
    return this.http.get<any>(this.baseUrl + 'clients/status/' + status);
  }
  assignSurveyToClient(obj: any) {
    return this.http.post<any>(this.baseUrl + 'survey-types', obj);
  }

  assignQuestiontoSurvey(obj: any) {
    return this.http.post<any>(this.baseUrl + 'sub-phase-controller/save', obj);
  }
  deleteInterviewOneToOne(id: any) {
    return this.http.delete<any>(this.baseUrl + ` one-to-one-interviews/${id}`);
  }

  onDeleteFocusGroup(id: any) {
    return this.http.delete<any>(this.baseUrl + `focus-group/${id}`);
  }

  updateComponentById(obj: any, id: any) {
    return this.http.put<any>(this.baseUrl + `component/${id}`, obj);
  }

  createComponent(obj: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'component/save', obj);
  }

  deleteCompoent(clientId: number) {
    return this.http.delete<any>(this.baseUrl + 'component/' + clientId);
  }

  // ex-consultant
  getAllEXwiseConsultantPagination(orderBy:string,page:number,size:number,sortBy:number){
    return this.http.post<any>(this.baseUrl+`users/Consultant/pagention?orderBy=${orderBy}&page=${page}&size=${size}&sortBy=${sortBy}`,'');
  }

  deleteUser(id: number) {
    return this.http.put<any>(this.baseUrl + `users/softDelete/${id}`,'');
  }


  //ex-dignostics
  getanalyseById(clientId: number) {
    return this.http.get<any>(this.baseUrl + 'ex-diagnostic-reports/getAllUserId?userId=' + clientId);
  }

  updateanalysetById(id: any, obj: any) {
    return this.http.put<any>(this.baseUrl + `ex-diagnostic-reports/${id}`, obj);
  }

  createanalyse(obj: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'ex-diagnostic-reports/save', obj);
  }

  deleteanalyse(clientId: number) {
    return this.http.delete<any>(this.baseUrl + 'ex-diagnostic-reports/' + clientId);
  }

}
