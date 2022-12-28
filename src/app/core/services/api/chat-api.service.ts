import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { UtilService } from '@core/services/util.service';
import { Types } from 'ably';
import { IChannelsResponse } from '@app/models/interfaces/chat.interface';

const routes = {
  getChannelsUrl: '/chat/channel-chat',
};


@Injectable({
  providedIn: 'root'
})
export class ChatApiService {

  constructor(
    private apiService: ApiService,
    private utilService: UtilService
  ) { }

  getChannelsApi(): Observable<IChannelsResponse> {
    return this.apiService.get(routes.getChannelsUrl);
  }
}
