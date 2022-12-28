import { Injectable } from '@angular/core';
import {ApiService} from '@core/services/api/api.service';
import {HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IVitalChartResponse} from '@interfaces/vital.interface';

const routes = {
  getCharts: '/charts'
};

@Injectable({
  providedIn: 'root'
})
export class ChartsApiService {

  constructor(
    private apiService: ApiService
  ) { }

  getVitalChartPatient(params: HttpParams | undefined): Observable<IVitalChartResponse> {
    return this.apiService.get(routes.getCharts, params);
  }
}
