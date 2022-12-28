import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackShareService {

  private _dataSource: BehaviorSubject<boolean>;
  current: Observable<boolean>;

  constructor() {
    this._dataSource = new BehaviorSubject(false);
    this.current = this._dataSource.asObservable();
  }

  change(option: boolean) {
    this._dataSource.next(option);
  }
}