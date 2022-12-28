import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { BackShareService } from '@app/core/services/back-share.service';
import { DataShareService } from '@app/core/services/data-share.service';
import { StateService } from '@app/core/services/state.service';
import { IPatientInfo, IUserInfo } from '@app/models/interfaces/users.interface';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class AppHeaderComponent implements OnInit, AfterViewInit{
  public noAvatar = 'assets/images/users/no-avatar.png';
  @Input() isExpanded: boolean;
  doctorInfo: IUserInfo;
  patientInfo: IPatientInfo;
  patientName: string;
  patientExtraInfo: string;
  showLogo: boolean;
  showPatientInfoInHeader: boolean;
  showBack = false;
  headerInWhite: boolean;
  isVideoCallScreen: boolean;
  backButtonOldText = 'Appointment List';
  backButtonText = 'Appointment List';
  mobileQuery: MediaQueryList;
  @ViewChild('headerItem') headerItem: ElementRef<HTMLDivElement>;
  @Output() setExpanded: EventEmitter<boolean> = new EventEmitter<boolean>();
  private mobileQueryListener: () => void;

  constructor(
    private _backShareService: BackShareService,
    private _authService: AuthService,
    private _dataShareService: DataShareService,
    private _router: Router,
    private _stateService: StateService,
    private media: MediaMatcher,
    private cd: ChangeDetectorRef
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 767.98px)');
    this.mobileQueryListener = () => cd.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
    this._backShareService.current.subscribe(isOpen => {
      this.showBack = isOpen;
    });

    this._stateService.showPatientInfoInHeader.subscribe(value => {
      this.showPatientInfoInHeader = value;
    });

    this._stateService.backBtnText.subscribe(val => {
      if (val) {
        this.backButtonText = val;
      }else {
        this.backButtonText = this.backButtonOldText;
      }
    });

    this.doctorInfo = this._authService.getUser();
    this._stateService.patientInfo.subscribe(patient =>
      {
        if (patient) {
          this.patientInfo = patient;
          if (patient) {
            this.showLogo = true;
          }
          this.patientName = `${patient?.firstName} ${patient?.lastName}`;

          if (patient && patient.birthday) {
            this.patientExtraInfo = `${new Date().getFullYear() - new Date(patient.birthday).getFullYear() + 1} years`;
          } else {
            this.patientExtraInfo = `$- years`;
          }

          if (patient.address && patient.address.city) {
            this.patientExtraInfo = `${this.patientExtraInfo}, ${patient.address?.city}`;
          }

        }
      });
    this._stateService.headerInWhite.subscribe((value: boolean) => {
      this.headerInWhite = value;
    });

    this._stateService.isVideoCallScreen.subscribe(value => {
      this.isVideoCallScreen = value;
      if (value) {
        this.backButtonOldText = this.backButtonText;
        this.backButtonText = `Video Call`;
      }
      else {
        this.backButtonText = this.backButtonOldText;
      }
    });
  }

  ngAfterViewInit(): void {
    let count = 0;
    const setHeight = setInterval(() => {
      this._stateService.headerHeight.next(this.headerItem?.nativeElement.offsetHeight || 0);
      count++;
      if (count === 5) {
        clearInterval(setHeight);
      }
    }, 1000);
  }

  public ngOnInit(): void {
    setTimeout(() => {
      this.getProfileStorage();
    }, 3000);
  }

  getProfileStorage() {
    this._dataShareService.data.subscribe(response => {
      const profile = response || this._authService.getUser();
      this.doctorInfo.firstName = profile.firstName || this.doctorInfo.firstName;
      this.doctorInfo.lastName = profile.lastName || this.doctorInfo.lastName;
      this.doctorInfo.avatarUrl = profile.avatarUrl || this.doctorInfo.avatarUrl;
      this.doctorInfo.specialty = profile.specialty || this.doctorInfo.specialty;
      this.cd.detectChanges();
    });
  }

  onReturnList(): void {
    this._backShareService.change(false);
    this._stateService.backActions.next(true);
    if (this.isVideoCallScreen) {
      this._stateService.headerInWhite.next(true);
    }
    if (this.isVideoCallScreen)
    {
      this._stateService.showPatientProfileInVideoCallScreen.next(false);
      this._stateService.showPatientInfoInHeader.next(true);
      return;
    }
  }
  onLogout(): void {
    this._router.navigate(['/logout']);
  }
}
