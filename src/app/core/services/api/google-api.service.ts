import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

const routes = {
  autocompleAddress: '/googlemaps/api/place/autocomplete/json',
  addressDetail: '/googlemaps/api/place/details/json'
};

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {

  constructor(
    private _apiService: ApiService
  ) { }

  getGoogleAddress(query: string): Observable<any> {
    return this._apiService.get(routes.autocompleAddress + query);
  }

  getAddressDetail(query: string): Observable<any> {
    return this._apiService.get(routes.addressDetail + query);
  }
}
