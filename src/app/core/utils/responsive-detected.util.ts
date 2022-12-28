import {ChangeDetectorRef, Injectable} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveDetected {
  xSmallDevice: MediaQueryList;
  smallDevice: MediaQueryList;
  mediumDevice: MediaQueryList;
  largeDevice: MediaQueryList;
  xLargeDevice: MediaQueryList;

  private xSmallQueryListener: () => void;
  private smallQueryListener: () => void;
  private mediumQueryListener: () => void;
  private largeQueryListener: () => void;
  private xLargeQueryListener: () => void;

  constructor(private media: MediaMatcher) {}

  init(changeDetectorRef: ChangeDetectorRef) {
    this.xSmallDevice = this.media.matchMedia('(max-width: 575.98px)');
    this.xSmallQueryListener = () => changeDetectorRef.detectChanges();
    this.xSmallDevice.addListener(this.xSmallQueryListener);

    this.smallDevice = this.media.matchMedia('(max-width: 767.98px)');
    this.smallQueryListener = () => changeDetectorRef.detectChanges();
    this.smallDevice.addListener(this.smallQueryListener);

    this.mediumDevice = this.media.matchMedia('(max-width: 991.98px)');
    this.mediumQueryListener = () => changeDetectorRef.detectChanges();
    this.mediumDevice.addListener(this.mediumQueryListener);

    this.largeDevice = this.media.matchMedia('(max-width: 1199.98px)');
    this.largeQueryListener = () => changeDetectorRef.detectChanges();
    this.largeDevice.addListener(this.largeQueryListener);

    this.xLargeDevice = this.media.matchMedia('(max-width: 1399.98px)');
    this.xLargeQueryListener = () => changeDetectorRef.detectChanges();
    this.xLargeDevice.addListener(this.xLargeQueryListener);
  }

  public isMobile(): boolean {
    return this.xSmallDevice.matches;
  }

  public isLandscapeMobile(): boolean {
    return this.smallDevice.matches;
  }

  public isTable(): boolean {
    return this.mediumDevice.matches;
  }

  public isSmallDesktop(): boolean {
    return this.largeDevice.matches;
  }

  public isDesktop(): boolean {
    return this.xLargeDevice.matches;
  }
}
