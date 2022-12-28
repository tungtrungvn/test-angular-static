import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleApiService } from './api/google-api.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleService {

  constructor(
    private googleApiService: GoogleApiService,
  ) { }

  getGoogleAddress(query: string): Observable<any> {
    return this.googleApiService.getGoogleAddress(query);
  }

  getAddressDetail(query: string): Observable<any> {
    return this.googleApiService.getAddressDetail(query);
  }
}
