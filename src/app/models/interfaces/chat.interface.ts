import { Types } from "ably";
import * as Ably from 'ably';

export interface IMessageItem {
  text: string;
  avatar?: string;
  name: string;
  uid?: string;
  media?: string;
  mediaType?: string;
  timestamp: number;
  ratio?: number;
  id: string;
  trackingId?: string;
}

export interface IChannelMessage {
  channelId: string;
  channelName: string;
  channelAvatar: string;
  partnerId: number;
  isSelected: boolean;
  lastMessage?: IMessageItem;
  messages?: IMessageItem[];
  totalUnreadMessage?: number;
  hasMessage?: boolean;
}

export interface IChannelItem {
  channelId: string;
  channelName: string;
  channelAvatarUrl?: string;
  partnerId: number;
}

export interface IChannelsResponse {
  channels: IChannelItem[],
  channelSecret: IChannelItem,
  token: Types.TokenDetails
}

export interface IMessageHistory {
  id: string;
  name: string;
  data: IMessageItem;
  timestamp: number;
}

export interface IChannelLastRead {
  channelId: string;
  timestamp: number;
  userId: string;
}

export interface IChatShareService {
  channels: IChannelMessage[];
  channelSelected?: IChannelMessage;
  client?: Ably.Realtime;
  hasData: boolean;
}
