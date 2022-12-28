import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { IDirtyComponent } from '@interfaces/dirty.interface';

@Injectable({
    providedIn: 'root'
})
export class DirtyCheckGuard implements CanDeactivate<IDirtyComponent> {
    canDeactivate(
        component: IDirtyComponent,
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (component.canDeactivate()) {
            return confirm('There are changes you have made to the page. If you quit, you will lose your changes.');
        } else {
            return true;
        }
    }
}
