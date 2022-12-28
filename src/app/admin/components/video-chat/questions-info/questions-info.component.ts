import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { VideoService } from '@app/core/services/video.service';
import { AppointmentQuestionaire } from '@app/models/interfaces/videocall.interface';

@Component({
  selector: 'app-video-questions-info',
  templateUrl: './questions-info.component.html',
  styleUrls: ['./questions-info.component.scss']
})
export class QuestionsInfoComponent implements OnChanges {
  @Input() appointmentId?: number;
  questionAnswers: AppointmentQuestionaire[] = [];

  constructor(private _videoService: VideoService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.appointmentId) {
      if (this.appointmentId) {
        this.binQuestionairesInfo();
      }
    }
  }

  binQuestionairesInfo(): void {
    if (!this.appointmentId) {
      return;
    }
    this._videoService.getAppointmentQuestionaire(this.appointmentId).subscribe(
      (response: AppointmentQuestionaire[]) => {
        this.questionAnswers = response;
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
