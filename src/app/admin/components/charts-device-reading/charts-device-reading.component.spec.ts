import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsDeviceReadingComponent } from './charts-device-reading.component';

describe('ChartsDeviceReadingComponent', () => {
  let component: ChartsDeviceReadingComponent;
  let fixture: ComponentFixture<ChartsDeviceReadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartsDeviceReadingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartsDeviceReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
