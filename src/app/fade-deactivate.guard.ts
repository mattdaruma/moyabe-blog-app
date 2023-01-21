import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FeedComponent } from './feed/feed.component';
import { PostComponent } from './post/post.component';

@Injectable({
  providedIn: 'root'
})
export class FadeDeactivateGuard implements CanDeactivate<FeedComponent | PostComponent> {
  canDeactivate(
    component: FeedComponent | PostComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
      component.deactivate()
      return new Promise((resolve, reject)=>{
        setTimeout(()=>{
          resolve(true)
        }, 150)
      })
  }
  
}
