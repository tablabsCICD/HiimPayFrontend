import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environment/enviorment.prod';


@Injectable({
  providedIn: 'root'
})
export class SearchService {
  baseurl = environment.baseUrl;
  searchResults = new BehaviorSubject<any[]>([]);
  searchKeyword = new BehaviorSubject<any[]>([]);

  getResult(value: any) {
    //project
    this.searchResults.next(value);
  }

  sendResults(): Observable<any> {
    return this.searchResults.asObservable();
  }

  setSearchKeyword(keyword: any): void {
    this.searchKeyword.next(keyword);
  }

  getSearchKeyword(): Observable<any> {
    return this.searchKeyword.asObservable();
  }

  constructor(private http: HttpClient) {}

  searchpeoplemetrics(id:any,keyword: any): Observable<any> {
    return this.http.get(this.baseurl + `people-metrics/search?clientId=${id}&keyword=` + keyword);
  }
  searchUsers(id:any,keyword: any): Observable<any> {
    return this.http.get(this.baseurl + `users/users/search?clientId=${id}&keyword=${keyword}`);
  }
  searchSurvey(id:any,keyword:any):Observable<any>{
    return this.http.get(this.baseurl+`survey-assignments/surveyAssignments/search?clientId=${id}&keyword=${keyword}`)
  }
  searchFocusgroup(id:any,keyword:any):Observable<any>{
    return this.http.get(this.baseurl+`focus-group/Search?clientId=${id}&keyword=${keyword}`)
  }
  // searchevents(keyword:any,id:any):Observable<any>{
  //   return this.http.get(this.baseurl+`focus-group-meetings/upcomingEvents/pagination/search?keyword=${keyword}&userId=${id}`)
  // }
  searchevents(clientId:any,date:any,keyword:any,id:any):Observable<any>{
    return this.http.get(this.baseurl+`consultant/upcomingEvents/pagination/search?clientId=${clientId}&currentDate1=${date}&keyword=${keyword}&userId=${id}`)
  }

  searchres(userid:any,keyword:any):Observable<any>{
    return this.http.get<any>(this.baseurl+`employee-responses/searchAllsurveyForEmp?clientEmpId=${userid}&keyword=${keyword}`);
  }

  searchTouchpointReality(clientId:any,keyword:any):Observable<any>{
    return this.http.get<any>(this.baseurl+`getallRealityTouchpointAssignmnt/search/?clientId=${clientId}&keyword=${keyword}`);
  }


  searchUniqueSurveyAssignment(clientId:any,keyword:any):Observable<any>{
    return this.http.get<any>(this.baseurl+`survey-assignments/surveyAssignments/getAllClientIdUniqueSurveySearch?clientId=${clientId}&keyword=${keyword}`)
  }

}
