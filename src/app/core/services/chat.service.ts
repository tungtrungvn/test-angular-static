import { Injectable } from '@angular/core';
import { IChannelLastRead, IChannelsResponse } from '@app/models/interfaces/chat.interface';
import { Types } from 'ably';
import { Observable } from 'rxjs';
import { ChatApiService } from './api/chat-api.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private chatApiService: ChatApiService
  ) { }

  removeChannelLocalStorage(channelId: string, userId: string): void {
    const key = `channel_lastread_${channelId}_${userId}`;
    localStorage.removeItem(key);
  }

  setChannelLocalStorage(channel: IChannelLastRead): void {
    const key = `channel_lastread_${channel.channelId}_${channel.userId}`;
    localStorage.setItem(key, JSON.stringify(channel));
  }
  getChannelLocalStorage(channelId: string, userId: string): IChannelLastRead {
    const key = `channel_lastread_${channelId}_${userId}`;
    const json = localStorage.getItem(key) || '';
    const channel = json ? JSON.parse(json) : undefined;
    return channel;
  }

  getChannelsApi(): Observable<IChannelsResponse> {
    return this.chatApiService.getChannelsApi();
  }
}
