import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDeviceReadingComponent } from './patient-device-reading.component';

describe('PatientDeviceReadingComponent', () => {
  let component: PatientDeviceReadingComponent;
  let fixture: ComponentFixture<PatientDeviceReadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientDeviceReadingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientDeviceReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
