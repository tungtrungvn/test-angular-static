import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { OpentokService } from '@app/core/services/opentok.service';
import * as OT from '@opentok/client';

@Component({
  selector: 'app-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.scss']
})
export class PublisherComponent implements  AfterViewInit, AfterViewChecked {
  @ViewChild('publisherDiv', {static : false}) publisherDiv: ElementRef;
  @Input() session: OT.Session;
  sessionConnected : boolean;
  publisher: OT.Publisher;
  audioIsOn = false;
  videoIsOn = false;
  publishing: boolean;
  @Output() audioIsOnMuted: EventEmitter<boolean> = new EventEmitter();
  checkAudioMuted = false;


  constructor(private _opentokService: OpentokService) { 
    this.publishing = false;
  }
  
  ngAfterViewInit() {
    this.publisher = OT.initPublisher(this.publisherDiv.nativeElement, {insertMode: 'append', publishAudio: this.audioIsOn, publishVideo: this.videoIsOn});
    if (this.session) {
      if (this.sessionConnected) {
        this.publish();
      }

      this.session.on('sessionConnected', () => {
        this.sessionConnected = true;
        this.publish();
      });

      this.session.on('sessionDisconnected', () => {
        this.sessionConnected = false;
      });
    }

  }

  ngAfterViewChecked(): void {
    /*
    var appThis = this;
        // Listen to audio event
        if(!appThis.checkAudioMuted) {
          let publisherDivContainer = document.getElementById("publisherDivContainer");
          if(publisherDivContainer) {
            let videoControl = publisherDivContainer.getElementsByTagName("video")[0];
            if(videoControl) {
              videoControl.onvolumechange = function(event: any) {
                appThis.audioIsOnMuted.emit(event.target.muted);
              };
              appThis.checkAudioMuted = true;
            }
          }
        }
    */
  }

  publish() {
    this.session.publish(this.publisher, (err) => {
      if (err) {
        console.log("Video publisher : " + err);
      } else {
        this.publishing = true;
      }
    });
  }

  setAudio(value : boolean) {
    this.publisher.publishAudio(value);
    this.audioIsOn = value;
  }

  setVideo(value : boolean) {
    this.publisher.publishVideo(value);
    this.videoIsOn = value;
  }

  destroy() {
    //this.publisher.destroy();
    this.publisher.session?.unpublish(this.publisher);
  }

  joinCallAgain() {
    this.session.publish(this.publisher);
  }


}
