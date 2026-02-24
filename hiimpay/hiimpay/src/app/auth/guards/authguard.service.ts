import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../authservice/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate{

  constructor(private auth: ApiService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean  {
    if (this.auth.loggedIn()) {
      return true;
    } else {
      // Redirect to login page if user is not authenticated
      this.router.navigate(['/auth']);
      return false;
    }
    // if(!this.auth.loggedIn()){
    //   this.router.navigate(['auth'])
    //   return false;
    // }
    // return this.auth.loggedIn();
  
  }
}
