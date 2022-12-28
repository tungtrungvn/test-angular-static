import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {AuthService} from '@app/core/services/auth.service';
import {ChatService} from '@app/core/services/chat.service';
import {FileService} from '@app/core/services/file.service';
import {FileType} from '@app/models/enums/file.enum';
import {IChannelMessage, IMessageItem} from '@app/models/interfaces/chat.interface';
import {IPatientInfo, IUserInfo} from '@app/models/interfaces/users.interface';
import * as Ably from 'ably';
import {Subject} from 'rxjs';
import {UtilService} from '@core/services/util.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import lgZoom from 'lightgallery/plugins/zoom';
import lgThumb from 'lightgallery/plugins/thumbnail';
import lgAutoPlay from 'lightgallery/plugins/autoplay';
import {LightGallerySettings} from 'lightgallery/lg-settings';
import {InitDetail} from 'lightgallery/lg-events';
import {LightGallery} from 'lightgallery/lightgallery';

@Component({
  selector: 'app-chat-detail',
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.scss']
})

export class ChatDetailComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() patientInfo: IPatientInfo | undefined;
  @Input() channelSelected: IChannelMessage | undefined;
  @Input() client: Ably.Realtime | undefined;
  @Input() isExpandProfile = false;
  @Output() openProfile: EventEmitter<any> = new EventEmitter();
  currentUser: IUserInfo;
  channel: Ably.Types.RealtimeChannelCallbacks | undefined;
  mediaList: {file: File, fileType: FileType}[] = [];
  chatDetailForm: FormGroup;
  footerHeight = 0;
  settings: LightGallerySettings = {
    counter: false,
    plugins: [lgZoom, lgThumb, lgAutoPlay],
    selector: '.media-preview .light-gallery',
  };
  private lightGallery!: LightGallery;
  @ViewChild('detailMessages') detailMessages: ElementRef;
  @ViewChild('detailContent') detailContent: ElementRef<HTMLDivElement>;
  @ViewChild('dropzone') dropzone: ElementRef<HTMLDivElement>;
  @ViewChild('inputMessage') inputMessage: ElementRef<HTMLTextAreaElement>;

  constructor(private fileService: FileService,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private utilService: UtilService,
              private chatService: ChatService,
              private snackBar: MatSnackBar) {
    this.currentUser = this.authService.getUser();

    this.chatDetailForm = this.formBuilder.group({
      message: new FormControl()
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // this.onResized();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.channelSelected) {
      if (this.client && this.currentUser && this.channelSelected) {
        if (this.detailMessages) {
          this.detailMessages.nativeElement.scrollTop = this.detailMessages.nativeElement.scrollHeight;
        }
        this.channel = this.client.channels.get(this.channelSelected.channelId);
        setTimeout(() => this.lightGallery?.refresh());
      }
    }
  }

  onOpenProfile(): void {
    this.openProfile.emit();
  }

  onSelectFile(event: Event): void {
    const input = event?.target as HTMLInputElement;
    if (input?.files?.length) {
      const fileList = Array.from(input.files);
      fileList.forEach(file => {
        const fileSize = file.size / 1024;
        if (fileSize < 25000) {
          const fileType = this.getFileType(file);
          this.mediaList.push({
            file,
            fileType
          });
        }else {
          this.snackBar.open('Max file upload size 25MB', 'OK', {
            duration: 5000
          });
        }
      });
      input.value = '';
    }

  }


  onRemove(index: number): void {
    // this.mediaFile = null;
    // this.fileType = FileType.NONE;
    this.mediaList.splice(index, 1);
    // this.onResized(this.footerHeight);
  }


  onResized($event?: number): void {
    if (!this.detailContent || !this.detailContent.nativeElement) {
      return;
    }
    if ($event) {
      this.footerHeight = $event;
    } else {
      this.footerHeight = this.inputMessage.nativeElement.offsetHeight;
    }
    const defaultHeight = 20;
    let diffHeight = this.footerHeight + defaultHeight;
    if (diffHeight <= 0) {
      diffHeight = 0;
    }

    let newHeight = diffHeight;
    if (this.mediaList.length) {
      newHeight += this.dropzone.nativeElement.offsetHeight;
    }
    this.detailContent.nativeElement.style.height = `calc(100% - ${newHeight}px)`;
  }

  publish() {
    const defaultMess: any = {
      name: `${this.currentUser.firstName} ${this.currentUser.lastName}`,
      avatar: this.currentUser.avatarUrl,
      uid: this.currentUser.id.toString(),
    };
    const subject = new Subject<any>();
    const messageText = {
      id: '',
      text: this.chatDetailForm.value.message,
      timestamp: Math.floor(Date.now() / 1000),
      trackingId: this.utilService.getUUIDv4(),
      ...defaultMess
    };
    if (this.mediaList.length) {
      const total = this.mediaList.length;
      let calculator = 0;
      this.mediaList.forEach((media) => {
        const message = {
          id: '',
          trackingId: this.utilService.getUUIDv4(),
          media: URL.createObjectURL(media.file),
          ...defaultMess,
          mediaType: media.file.type,
          timestamp: Math.floor(Date.now() / 1000),
          text: ''
        };
        this.channelSelected?.messages?.push(message);
        this.fileService.uploadFile(media.file).subscribe(res => {
          calculator++;
          message.media = res.path;
          message.mediaType = res.contentType;
          this.sendMessageData(message);
          if (calculator >= total) {
            setTimeout(() => subject.next(true));
          }
        });
      });
      if (messageText.text) {
        this.channelSelected?.messages?.push(messageText);
      }
    }else {
      setTimeout(() => subject.next(true));
    }
    subject.subscribe(() => {
      if (messageText.text) {
        this.sendMessageData(messageText);
      }
    });
    this.chatDetailForm.reset();
    this.mediaList = [];
  }

  sendMessageData(message: IMessageItem): any {
    if (!this.channel || !this.currentUser) {
      return;
    }
    this.channel.publish('update', message, (err: any) => {
      if (err && err.statusCode === 401) {
        window.location.href = '/login';
        return;
      }
      if (err) {
        alert('publish failed with error ' + err);
      }
    });
  }

  onHandleKeyPress($event: KeyboardEvent): void {
    if ($event.keyCode === 13) {
      $event.preventDefault();
      this.publish();
    }
  }

  getFileType(file: File): FileType {
    if (file && file.type.indexOf('video') > -1) {
      return FileType.VIDEO;
    } else if (file && file.type.indexOf('image') > -1) {
      return FileType.IMAGE;
    } else if (file && file.type.indexOf('audio') > -1) {
      return FileType.AUDIO;
    } else {
      return FileType.NONE;
    }
  }

  getFileTypeByContentType(contentType?: string): FileType {
    if (!contentType) {
      return FileType.NONE;
    }
    if (contentType && contentType.indexOf('video') > -1) {
      return FileType.VIDEO;
    } else if (contentType && contentType.indexOf('image') > -1) {
      return FileType.IMAGE;
    } else if (contentType && contentType.indexOf('audio') > -1) {
      return FileType.AUDIO;
    } else {
      return FileType.NONE;
    }
  }

  onInit = (detail: InitDetail): void => {
    this.lightGallery = detail.instance;
  }
}
