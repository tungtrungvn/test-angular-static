import { Component, ElementRef, AfterViewInit,  ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { OTError } from '@opentok/client';


@Component({
  selector: 'app-subscriber',
  templateUrl: './subscriber.component.html',
  styleUrls: ['./subscriber.component.scss']
})
export class SubscriberComponent implements AfterViewInit {
  
  @ViewChild('subscriberDiv', {static : false}) subscriberDiv: ElementRef;
  @Input() session: OT.Session;
  @Input() stream: OT.Stream;
  @Output() audioIsOnMuted: EventEmitter<boolean> = new EventEmitter();
  subscriber: OT.Subscriber;
  
  ngAfterViewInit() {
    this.subscriber = this.session.subscribe(this.stream, this.subscriberDiv.nativeElement, {width : "100%", height : "100px"}, 
    (err) => {
      this.onHandleError(err);
    });
  }

  onHandleError(err?: OTError): void {
    if (err) {
      console.log(err.message);
    }
    else{
      this.subscriberDiv.nativeElement.parentElement.style.width = "100%";
      this.subscriberDiv.nativeElement.parentElement.style.height = "100%";

      // Listen to audio event
      const subscriberDivContainer = document.getElementById("subscriberDivContainer");
      if(subscriberDivContainer) {
        const videoControl = subscriberDivContainer.getElementsByTagName("video")[0];
        if(videoControl) {
          videoControl.onvolumechange = (event: any) => {
            this.audioIsOnMuted.emit(event.target.muted);
        };
        }
      }
    }
  }

  setAudio(value: boolean): void {
    this.subscriber.subscribeToAudio(value);
  }

}
