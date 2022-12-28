import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { UtilService } from '@core/services/util.service';
import { IGetContestsList, IContestInfo, IContestResponse, IGetContestResultList, IContestResultHistory } from '@app/models/interfaces/contest.interface';
import { IUserInfo } from '@interfaces/users.interface';

const routes = {
  getContestsUrl: '/contests/list',
  getContestsByIdsUrl: '/contests/list-by-ids',
  createContestUrl: '/contests/create',
  approveContestUrl: (contestId: string) => `/contests/approve/${contestId}`,
  approveLiveNowContestUrl: (contestId: string) => `/contests/approve-live-now/${contestId}`,
  rejectContestUrl: (contestId: string) => `/contests/reject/${contestId}`,
  getContestByIdUrl: (contestId: string) => `/contests/${contestId}`,
  deleteContestByIdUrl: (contestId: string) => `/contests/${contestId}`,
  updateQuestionContestUrl: (contestId: string) => `/contests/update-question/${contestId}`,
  updateInfoContestUrl: (contestId: string) => `/contests/update-info/${contestId}`,
  updateMediaContestUrl: (contestId: string) => `/contests/update-media/${contestId}`,
  getContestHistoriesByIdUrl: (contestId: string) => `/contests/result/${contestId}`,
  cancelContestUrl: '/contests/cancel',
  tieContestUrl: '/contests/tie',
};


@Injectable({
  providedIn: 'root'
})
export class ContestsApiService {

  constructor(
    private apiService: ApiService,
    private utilService: UtilService
  ) { }

  getContestsByIds(params: any): Observable<IContestInfo[]> {
    const newParams = this.utilService.buildParams(params);
    return this.apiService.get(routes.getContestsByIdsUrl, newParams);
  }

  getContestResults(contestId: string): Observable<IContestResultHistory> {
    return this.apiService.get(routes.getContestHistoriesByIdUrl(contestId));
  }

  cancelContest(body: any): Observable<any> {
    return this.apiService.put(routes.cancelContestUrl, body);
  }

  tieContest(body: any): Observable<any> {
    return this.apiService.put(routes.tieContestUrl, body);
  }

  updateMediaContest(contestId: string, body: any): Observable<any> {
    return this.apiService.put(routes.updateMediaContestUrl(contestId), body);
  }

  updateInfoContest(contestId: string, body: any): Observable<any> {
    return this.apiService.put(routes.updateInfoContestUrl(contestId), body);
  }


  updateQuestionContest(contestId: string, body: any): Observable<any> {
    return this.apiService.put(routes.updateQuestionContestUrl(contestId), body);
  }


  rejectContestById(contestId: string, body: any): Observable<any> {
    return this.apiService.put(routes.rejectContestUrl(contestId), body);
  }
  approveLiveNowContestById(contestId: string, body: any): Observable<any> {
    return this.apiService.put(routes.approveLiveNowContestUrl(contestId), body);
  }
  approveContestById(contestId: string, body: any): Observable<any> {
    return this.apiService.put(routes.approveContestUrl(contestId), body);
  }

  createContest(body: any): Observable<IContestResponse> {
    return this.apiService.post(routes.createContestUrl, body);
  }

  deleteContestById(contestId: string): Observable<any> {
    return this.apiService.delete(routes.deleteContestByIdUrl(contestId));
  }

  getContestById(contestId: string): Observable<IContestInfo> {
    return this.apiService.get(routes.getContestByIdUrl(contestId));
  }

  getContests(params: any): Observable<IGetContestsList> {
    const newParams = this.utilService.buildParams(params);
    return this.apiService.get(routes.getContestsUrl, newParams);
  }

  putMediaFile(fullPath: string, file: any): Observable<any> {
    return this.apiService.putBinaryFile(fullPath, file);
  }
}
