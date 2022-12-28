import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  ViewEncapsulation,
  ViewChild, ElementRef
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import * as Ably from 'ably';
import { Types } from 'ably';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { IChannelItem, IChannelsResponse, IMessageItem } from '@app/models/interfaces/chat.interface';
import { ChatService } from '@app/core/services/chat.service';
import { IUserInfo } from '@app/models/interfaces/users.interface';
import { AuthService } from '@app/core/services/auth.service';
import * as _ from 'underscore';
import { ChatShareService } from '@app/core/services/chat-share.service';
import { NavigationEnd, Router } from '@angular/router';
import { environment as env } from '@env/environment';
import { AppointmentListComponent } from '@app/admin/components/appointment/appointment-list/appointment-list.component';
import { DataShareService } from '@app/core/services/data-share.service';
import {StateService} from '@core/services/state.service';
import {BackShareService} from '@core/services/back-share.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('onMainContentChange', [
      state('close',
        style({
          'margin-left': '80px'
        })
      ),
      state('open',
        style({
          'margin-left': '250px'
        })
      ),
      transition('close => open', animate('250ms ease-in')),
      transition('open => close', animate('250ms ease-in')),
    ]),
    trigger('onSideNavChange',
      [
        state('close',
          style({
            width: '75px'
          })
        ),
        state('open',
          style({
            width: '250px'
          })
        ),
        transition('close => open', animate('250ms ease-in')),
        transition('open => close', animate('250ms ease-in')),
      ]
    )
  ],
})
export class AdminLayoutComponent implements OnDestroy {
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;
  public isExpanded = false;
  isShowSidebar = true;
  currentUser: IUserInfo;
  messages: unknown[] | undefined;
  noAvatar = 'assets/images/users/no-avatar.png';
  authUrl = `${env.apiUrl}/chat/auth`;

  @ViewChild('child') appointmentList: AppointmentListComponent;
  @ViewChild('elementHeight') elementHeight: ElementRef<HTMLDivElement>;
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private dataShareService: DataShareService,
    private router: Router,
    private chatSharedService: ChatShareService,
    private chatService: ChatService,
    private authService: AuthService,
    private stateService: StateService,
    private backShareService: BackShareService
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.router.events.subscribe(value => {
      if (value instanceof NavigationEnd) {
        this.isShowSidebar = !value.url.includes('/video-chat');
      }
    });

    this.currentUser = this.authService.getUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }

    const token = this.authService.getToken();

    this.chatSharedService.chatSharedMessage.client = new Ably.Realtime({ authUrl: this.authUrl, authHeaders: { Authorization: `Bearer ${token}` } });

    this.initChat();
    this.router.events.subscribe(value => {
      if (value instanceof NavigationEnd) {
        this.backShareService.change(false);
        this.settingsHeightPage();
      }
    });
  }

  settingsHeightPage(): void {
    this.stateService.headerHeight.subscribe(val => {
      if (val && this.elementHeight) {
        // this.elementHeight.nativeElement.style.height = `calc(100% - ${val}px)`;
        const child = this.elementHeight.nativeElement.children;
        child[child.length - 1].setAttribute('class', 'h-100');
      }
    });
  }

  initChat() {
    this.chatService.getChannelsApi().subscribe(
      (response: IChannelsResponse) => {
        if (response && response.token) {
          this.initChannel(response.channels);
          this.monitorSecretChannel(response.channelSecret);
        }
      }
    );
  }

  monitorSecretChannel(channelSecret: IChannelItem) {
    if (!this.client) {
      return;
    }

    const channel = this.client.channels.get(channelSecret.channelId);
    channel.subscribe((message: Types.Message) => {
      if (message.name === 'LinkedChannel') {
        const channels = message.data.channels;
        this.initChannel(channels);
      } else if (message.name === 'Appointment') {
        this.dataShareService.changeMessage(message.data);
      }
    });
  }

  initChannel(channels: IChannelItem[]) {
    this.chatSharedService.chatSharedMessage.hasData = channels
      && channels.length > 0;
    const channelSelected: IChannelItem | undefined = this.chatSharedService.chatSharedMessage.channels
      .find(item => item.isSelected) ?? undefined;
    this.chatSharedService.chatSharedMessage.channels = [];
    channels.forEach((channelItem: IChannelItem) => {

      if (this.client) {
        this.chatSharedService.chatSharedMessage.channels.push({
          channelId: channelItem.channelId,
          channelName: channelItem.channelName,
          partnerId: channelItem.partnerId,
          isSelected: !!channelSelected && channelSelected.channelId === channelItem.channelId,
          messages: [],
          channelAvatar: channelItem.channelAvatarUrl ?? this.noAvatar
        });
        const channel = this.client.channels.get(channelItem.channelId);
        channel.subscribe((message: Types.Message) => {
          if (!this.chatSharedService.chatSharedMessage.channels || !this.chatSharedService.chatSharedMessage.channels.length) {
            return;
          }

          if (this.currentUser && this.chatSharedService.chatSharedMessage.channelSelected &&
              this.chatSharedService.chatSharedMessage.channelSelected.channelId !== channelItem.channelId) {
            const channelStorage = this.chatService.getChannelLocalStorage(channel.name, this.currentUser.id.toString());
            if (!channelStorage) {
              this.chatSharedService.saveChannelLocalStorage(channelItem.channelId);
            }
            this.playAudio();
          }
          const currentChannel = this.chatSharedService.chatSharedMessage.channels.find((item) => item.channelId === channelItem.channelId);
          if (currentChannel) {
            /*this.channelSelected?.messages?.find((mes, index) => {
              const ob1 = {...mes} as Partial<IMessageItem>;
              delete ob1.id;
              delete ob1.media;
              for (const str of store) {
                const ob2 = {...str} as Partial<IMessageItem>;
                delete ob2.id;
                delete ob2.media;
                if (this.utilService.isDeepEqual(ob1, ob2)) {
                  this.channelSelected?.messages?.splice(index, 1);
                }
              }
            });*/
            const hasExists = currentChannel.messages?.find(x => {
              return x.id === message.id || (x.trackingId && x.trackingId === message.data?.trackingId);
            });
            if (!hasExists) {
              const lastMessage: IMessageItem = {
                name: message.data?.name,
                text: message.data?.text,
                avatar: message.data?.avatar,
                media: message.data?.media,
                uid: message.data?.uid,
                timestamp: message?.timestamp,
                mediaType: message.data?.mediaType,
                id: message.id
              };
              currentChannel.lastMessage = lastMessage;
              currentChannel.messages?.push(lastMessage);
            }else {
              hasExists.id = message.id;
              hasExists.media = message.data?.media;
              hasExists.timestamp = message.timestamp;
            }
          }
          this.chatSharedService.calculateUnreadChannel(channelItem.channelId);
        });
        channel.history((err: unknown, resultPage) => {
          const messages = resultPage?.items;
          if (!this.chatSharedService.chatSharedMessage.channels || !this.chatSharedService.chatSharedMessage.channels.length) {
            return;
          }
          const currentChannel = this.chatSharedService.chatSharedMessage.channels.find((item) => item.channelId === channelItem.channelId);
          if (currentChannel) {currentChannel.hasMessage = true; }
          if (!messages?.length) {
            return;
          }
          if (currentChannel) {
            currentChannel.messages = [];
            messages.forEach((messageItem: Types.Message) => {
              const message: IMessageItem = {
                name: messageItem.data?.name,
                text: messageItem.data?.text,
                avatar: messageItem.data?.avatar,
                media: messageItem.data?.media,
                uid: messageItem.data?.uid,
                timestamp: messageItem.timestamp,
                mediaType: messageItem.data?.mediaType,
                id: messageItem.id
              };
              currentChannel.messages?.unshift(message);
            });

            currentChannel.lastMessage = _.last(currentChannel.messages ?? []);
          }

          this.chatSharedService.calculateUnreadChannel(channelItem.channelId);
        });

      }
    });
  }

  get client(): Ably.Realtime | undefined {
    return this.chatSharedService.chatSharedMessage.client;
  }

  playAudio() {
    const audio = new Audio();
    audio.src = '/assets/audio/ably-audio-ping.wav';
    audio.load();
    audio.play();
  }


  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }


  public onClickToggle(isExpanded: boolean): void {
    this.isExpanded = isExpanded;
  }
}
