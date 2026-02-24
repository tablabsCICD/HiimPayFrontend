import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/enviorment.prod';


@Injectable({
  providedIn: 'root'
})
export class Superadmin {

  baseUrl = environment.baseUrl;
  constructor(private http:HttpClient) { }

  getClient(): Observable<any> {
    return this.http.get<any>(this.baseUrl+'clients');
  }
  getClientById(id:any){
    return this.http.get<any>(this.baseUrl+`clients/${id}`);
  }

}
