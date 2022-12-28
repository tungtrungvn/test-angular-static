import {
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef, HostListener,
  KeyValueChanges,
  KeyValueDiffer,
  KeyValueDiffers,
  OnInit,
  ViewChild
} from '@angular/core';
import { FileService } from '@app/core/services/file.service';
import { ChatService } from '@app/core/services/chat.service';
import { IChannelMessage } from '@app/models/interfaces/chat.interface';
import * as Ably from 'ably';
import { AuthService } from '@app/core/services/auth.service';
import { IPatientInfo, IUserInfo } from '@app/models/interfaces/users.interface';
import { ChatShareService } from '@app/core/services/chat-share.service';
import {BackShareService} from '@core/services/back-share.service';
import {MediaMatcher} from '@angular/cdk/layout';
import {StateService} from '@core/services/state.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, DoCheck {
  isExpandProfile = false;
  currentUser: IUserInfo;
  messages: any[] | undefined;
  mobileQuery: MediaQueryList;
  private readonly mobileQueryListener: () => void;
  showChat: any = null;
  patientInfo: IPatientInfo | undefined;

  @ViewChild('detailMessages', { static: true }) detailMessages: ElementRef | undefined;
  private detailMessagesDiffer: KeyValueDiffer<string, any> | undefined;
  // public noAvatar = 'assets/images/users/no-avatar.png';

  constructor(private fileService: FileService,
              private authService: AuthService,
              changeDetectorRef: ChangeDetectorRef,
              private chatService: ChatService,
              public chatSharedService: ChatShareService,
              private backShareService: BackShareService,
              private stateService: StateService,
              private media: MediaMatcher,
              private differs: KeyValueDiffers) {
    this.currentUser = this.authService.getUser();
    this.mobileQuery = media.matchMedia('(max-width: 991.98px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
    this.stateService.backActions.subscribe(val => {
      if (val) {
        this.showChat = true;
        this.onToogleProfile(false);
      }
    });
  }

  playAudio(): any {
    const audio = new Audio();
    audio.src = '/assets/audio/ably-audio-ping.wav';
    audio.load();
    audio.play();
  }

  ngOnInit(): void {
    const messages = this.channelSelected?.messages ?? [];
    this.detailMessagesDiffer = this.differs.find(messages).create();
    this.showSelectChat();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.showSelectChat();
  }

  showSelectChat(): void {
    if (this.mobileQuery.matches) {
      this.showChat = false;
      this.stateService.backBtnText.next('Select chat');
      this.backShareService.change(true);
    }else {
      this.showChat = null;
      this.stateService.backBtnText.next(null);
      this.backShareService.change(false);
    }
  }

  ngDoCheck(): void {
    if (this.detailMessagesDiffer) {
      const messages = this.channelSelected?.messages ?? [];
      const changes = this.detailMessagesDiffer.diff(messages);
      if (changes) {
        this.detailMessageLstChanged(changes);
      }
    }
  }
  detailMessageLstChanged(changes: KeyValueChanges<string, any>): void {
    this.scrollToBottom();
  }

  onToogleProfile(isOpenProfile: boolean): void {
    this.isExpandProfile = isOpenProfile;
  }

  onSelectChannel(channel: IChannelMessage): void {
    const oldChannel = this.chatSharedService.chatSharedMessage.channelSelected;
    this.isExpandProfile = false;
    if (typeof this.showChat === 'boolean') {
      this.showSelectChat();
    }
    this.chatSharedService.saveChannelLocalStorage(channel.channelId);
    this.chatSharedService.chatSharedMessage.channelSelected = channel;
    if (this.client && this.currentUser) {
      if (oldChannel) {
        this.chatService.removeChannelLocalStorage(oldChannel.channelId, this.currentUser.id.toString());
      }
      this.chatSharedService.calculateUnreadChannel(channel.channelId);
    }
  }

  get client(): Ably.Realtime | undefined {
    return this.chatSharedService.chatSharedMessage.client;
  }

  get channelSelected(): IChannelMessage | undefined {
    if (!this.chatSharedService.chatSharedMessage.channelSelected &&
        this.chatSharedService.chatSharedMessage.channels.every(c => c.hasMessage)) {
      const selected = this.channels.find(Boolean);
      if (selected) {
        selected.isSelected = true;
        this.chatSharedService.chatSharedMessage.channelSelected = selected;
        this.chatSharedService.saveChannelLocalStorage(selected.channelId);
      }
    }
    return this.chatSharedService.chatSharedMessage.channelSelected;
  }

  get channels(): IChannelMessage[] {
    return this.chatSharedService.chatSharedMessage.channels.sort((a, b) => {
      const messagesTimea = a.messages?.map(o => o.timestamp);
      const messagesTimeb = b.messages?.map(o => o.timestamp);
      if (messagesTimea && messagesTimeb) {
        if (Math.max(...messagesTimea) < Math.max(...messagesTimeb)) {
          return 1;
        }
        if (Math.max(...messagesTimea) > Math.max(...messagesTimeb)) {
          return -1;
        }
      }
      return 0;
    });
  }

  get hasData(): boolean {
    return this.chatSharedService.chatSharedMessage.hasData;
  }

  scrollToBottom(): void {
    if (this.detailMessages) {
      this.detailMessages.nativeElement.scrollTop = this.detailMessages.nativeElement.scrollHeight;
    }
  }

  getPatientProfile(event: any) {
    this.patientInfo = event;
  }
}

