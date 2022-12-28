import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { UtilService } from '@core/services/util.service';

const routes = {
  getAllSportsUrl: '/sports?keyword&skip=0&limit=1000',
  getAllTeamsBySportCodeUrl: (sportCode: string) => `/contests/teams/list?sportCode=${sportCode}&skip=0&limit=1000`
};

@Injectable({
  providedIn: 'root'
})
export class CommonApiService {

  constructor(
    private apiService: ApiService,
    private utilService: UtilService
  ) { }

}
