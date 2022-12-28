import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as OT from '@opentok/client';
import { ChatMessage, EndVisitData, OpenTokSessionInfo } from '@app/models/interfaces/videocall.interface';
import { environment as env } from '@env/environment';
import { VideoApiService } from './api/video-api.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OpentokService {
  session: OT.Session;
  token: string;
  
  constructor(private http: HttpClient,
    private _videoService: VideoApiService) { 
  }

  
  getOT() {
    return OT;
  }

  getOpenTokSession(roomName: string): Observable<OpenTokSessionInfo> {
    return this._videoService.getOpenTokSession(roomName);
  }

  async sendChatHistory(chatMessage : any) {
    let chat_history_url = `${env.apiUrl}/videocall/chat-history`;
    var res = await this.http.post(chat_history_url, chatMessage).toPromise();
  }

  async getChatHistory(sessionId : any) : Promise<ChatMessage[]> {
    let chat_history_url = `${env.apiUrl}/videocall/chat-history/${sessionId}`;
    var headers= new HttpHeaders().set('x-time-zone', 'SE Asia Standard Time');
    var res = await this.http.get(chat_history_url, { headers: headers }).toPromise();
    return <Promise<ChatMessage[]>>res;
  }

  

  dropCall(appointmentId : number): Observable<any> {
    return this._videoService.dropCall(appointmentId);
  }

  async endVisit(endVisitData: EndVisitData) {
    let end_call_visit_url = `${env.apiUrl}/videocall/end-call-visit`;
    var res = await this.http.post(end_call_visit_url, endVisitData).toPromise();    
  }


}
