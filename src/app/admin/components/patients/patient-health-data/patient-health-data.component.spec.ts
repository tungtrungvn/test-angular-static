import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientHealthDataComponent } from './patient-health-data.component';

describe('PatientHealthDataComponent', () => {
  let component: PatientHealthDataComponent;
  let fixture: ComponentFixture<PatientHealthDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientHealthDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientHealthDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
