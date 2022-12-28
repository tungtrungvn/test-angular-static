import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AuthService } from '@app/core/services/auth.service';
import { OpentokService } from '@app/core/services/opentok.service';
import { IUserInfo } from '@app/models/interfaces/users.interface';
import { ChatMessage } from '@app/models/interfaces/videocall.interface';

@Component({
  selector: 'app-video-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit, OnChanges {
  @Input() session: OT.Session;
  doctorInfor: IUserInfo;
  @Input() scrollToBottom: boolean;
  @ViewChild('chatHistory', { static: false }) chatHistory: ElementRef<HTMLDivElement>;
  @ViewChild('txtMessage', { static: true }) txtMessage: ElementRef;
  message = '';
  constructor(private _opentokService: OpentokService,
              private _authService: AuthService) { }

  ngOnInit(): void {
    this.doctorInfor = this._authService.getUser();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.session) {
      if (this.session) {
        this.initChatHistory();
      }
    }
    if (changes.scrollToBottom) {
      if (changes.scrollToBottom.currentValue) {
        setTimeout(() => this.chatHistory.nativeElement.scrollTop = this.chatHistory.nativeElement.scrollHeight);
      }
    }
  }

  initChatHistory(): void {
     // Load history messages
     this._opentokService.getChatHistory(this.session.sessionId).then((chatMessages: ChatMessage[]) => {
      if (chatMessages) {
        chatMessages.forEach(item => {
          this.addMessageToChatHistory(item);
        });
      }
      // Scroll to bottom
      setTimeout(() => this.chatHistory.nativeElement.scrollTop = this.chatHistory.nativeElement.scrollHeight, 500);
    });

    // Listen to chat message
     this.session.on('signal:chat', (event: any) => {
      const msg = document.createElement('div');
      const isLocalMessage = event.from.connectionId === this.session.connection?.connectionId;
      const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }).toLowerCase();
      if (isLocalMessage) {
        msg.innerHTML = `<div class="d-flex justify-content-end"><div class="local"><pre class="text">${event.data}</pre><div class="time">${time}</div></div></div>`;
      }
      else {
        msg.innerHTML = `<div class="d-flex justify-content-start"><div class="remote"><pre class="text">${event.data}</pre><div class="time">${time}</div></div></div>`;
      }
      this.chatHistory.nativeElement.appendChild(msg.firstChild as any);
      this.chatHistory.nativeElement.scrollTop = this.chatHistory.nativeElement.scrollHeight;
    });

  }


  addMessageToChatHistory(chatMessage: ChatMessage): void {
    const msg = document.createElement('div');
    const isLocalMessage = chatMessage.userName.toLowerCase() === this.doctorInfor.id.toString();
    const time = new Date(chatMessage.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }).toLowerCase();
    if (isLocalMessage) {
      msg.innerHTML = `<div class="d-flex justify-content-end"><div class="local"><pre class="text">${chatMessage.chatMessage}</pre><div class="time">${time}</div></div></div>`;
    }
    else {
      msg.innerHTML = `<div class="d-flex justify-content-start"><div class="remote"><pre class="text">${chatMessage.chatMessage}</pre><div class="time">${time}</div></div></div>`;
    }
    this.chatHistory.nativeElement.appendChild(msg.firstChild as any);
  }


  send(e?: any): void {
    e?.preventDefault();
    if (this.message && this.message.trim() != '') {
      const tempMessage = this.message;
      this.message = '';

      this.session.signal({
        type: 'chat',
        data: tempMessage
      }, (error) => {
        if (error) {
          console.log('ERROR sending signal:', error.name, error.message);
        } else {
          const chatMessage = {
            sessionId: this.session.sessionId,
            chatMessage: tempMessage,
            userName: this.doctorInfor.id.toString()
          };
          this._opentokService.sendChatHistory(chatMessage);
        }
      });

      this.txtMessage.nativeElement.focus();
    }
  }

}
