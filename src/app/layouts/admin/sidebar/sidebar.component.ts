import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter, HostListener,
  Input,
  OnDestroy,
  Output,
  ViewEncapsulation
} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {MenuItems} from '../../../shared/menu-items/menu-items';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ChatShareService} from '@app/core/services/chat-share.service';
import {debounceTime, Subject} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('animateText', [
      state('hide',
        style(
          {
            transform: 'translateX(0)',
            opacity: 0,
            display: 'none'
          }
        ),
      ),
      state('show',
        style(
          {
            transform: 'translateX(0)',
            opacity: 1,
            display: 'block',
            'margin-left': '8px'
          }
        ),
      ),
      transition('close => open', animate('250ms', style({ transform: 'translateX(0)', opacity: 1 }))),
      transition('open => close', animate('250ms', style({ transform: 'translateX(100%)', opacity: 0 }))),
    ])
  ],

})
export class AppSidebarComponent implements OnDestroy, AfterViewInit {
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    private chatSharedService: ChatShareService,
    private router: Router
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 991.98px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
    this.subject.pipe(debounceTime(10)).subscribe((isMobile) => {
      if (isMobile) {
        this.setExpanded.emit(true);
      }else {
        this.setExpanded.emit(false);
      }
    });
    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        if (this.mobileQuery.matches) {
          this.setExpanded.emit(true);
        }
      }
    });
  }

  get totalUnreadChat(): number {
    return this.chatSharedService.chatSharedMessage.channels.reduce((s, f) => s + (f.totalUnreadMessage ?? 0), 0);
  }

  @Input() isExpanded = true;
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() setExpanded: EventEmitter<boolean> = new EventEmitter<boolean>();
  mobileQuery: MediaQueryList;
  subject: Subject<any> = new Subject<any>();

  private readonly mobileQueryListener: () => void;

  handleSidebarToggle = () => this.toggleSidebar.emit(!this.isExpanded);

  ngAfterViewInit(): void {
    if (this.mobileQuery.matches) {
      setTimeout(() => {
        this.handleSidebarToggle();
      });
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.subject.next(this.mobileQuery.matches);
  }
}
