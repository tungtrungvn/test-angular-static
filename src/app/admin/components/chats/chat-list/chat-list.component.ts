import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { IChannelMessage } from '@app/models/interfaces/chat.interface';
import {FormControl} from '@angular/forms';
import {map, Observable, startWith} from 'rxjs';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit, OnChanges {
  @Input() hasData: boolean;
  @Input() channels: IChannelMessage[] = [];
  @Input() channelSelected: IChannelMessage | undefined;
  @Output() selectedChannelChange: EventEmitter<any> = new EventEmitter();
  showSearch = false;
  searchControl = new FormControl();
  filteredOptions: Observable<IChannelMessage[]>;
  constructor() { }

  ngOnInit(): void {
    this.filteredOptions = this.searchControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || ''))
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.channels?.currentValue) {
      this.searchControl.updateValueAndValidity({onlySelf: false, emitEvent: true});
    }
  }

  onSelectChannel(channel: IChannelMessage): void {
    this.selectedChannelChange.emit(channel);
  }

  private _filter(value: string): IChannelMessage[] {
    if (!value.toLowerCase()) {
      return this.channels;
    }
    return this.channels.filter(channel => channel.channelName.toLowerCase().includes(value.toLowerCase()));
  }

  triggerSearch() {
    this.showSearch = !this.showSearch;
    this.searchControl.setValue('');
  }
}
