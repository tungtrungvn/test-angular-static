import { Injectable } from '@angular/core';
import { IChannelLastRead, IChatShareService } from '@app/models/interfaces/chat.interface';
import { IUserInfo } from '@app/models/interfaces/users.interface';
import { AuthService } from './auth.service';
import { ChatService } from './chat.service';
import * as _ from 'underscore';

@Injectable({
  providedIn: 'root'
})
export class ChatShareService {
  currentUser: IUserInfo;
  chatSharedMessage: IChatShareService = {
    channels: [],
    hasData: true
  };
  constructor(public chatService: ChatService,
              public authService: AuthService) {
    this.currentUser = this.authService.getUser();
  }

  clearChannel() {
    this.chatSharedMessage.channels = [];
    this.chatSharedMessage.hasData = false;
    this.chatSharedMessage.channelSelected = undefined;
    this.chatSharedMessage.client = undefined;
  }

  saveChannelLocalStorage(channelId: string) {
    if (!this.chatSharedMessage.channels || !this.currentUser) {
      return;
    }
    this.chatService.removeChannelLocalStorage(channelId, this.currentUser.id.toString());
    const channel = this.chatSharedMessage.channels.filter(function (item) { return item.channelId === channelId; })[0];
    if (!channel || !channel.lastMessage) {
      return;
    }

    const channelStorage: IChannelLastRead = {
      channelId: channelId,
      timestamp: channel.lastMessage.timestamp,
      userId: this.currentUser.id.toString()
    }

    this.chatService.setChannelLocalStorage(channelStorage);
  }


  calculateUnreadChannel(channelId: string): void {
    if (!this.chatSharedMessage.channels || !this.currentUser) {
      return;
    }
    const channel = this.chatSharedMessage.channels.filter(function (item) { return item.channelId === channelId; })[0];
    if (!channel || !channel.messages) {
      return;
    }

    if (channel.channelId === this.chatSharedMessage.channelSelected?.channelId) {
      channel.totalUnreadMessage = 0;
      return;
    }

    const channelStorage = this.chatService.getChannelLocalStorage(channel.channelId, this.currentUser.id.toString());
    if (!channelStorage) {
      return;
    }

    channel.totalUnreadMessage = _.filter(channel.messages, function (item) { return item.timestamp > channelStorage.timestamp; }).length;
  }
}
