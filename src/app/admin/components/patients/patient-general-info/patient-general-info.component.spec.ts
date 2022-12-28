import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientGeneralInfoComponent } from './patient-general-info.component';

describe('PatientGeneralInfoComponent', () => {
  let component: PatientGeneralInfoComponent;
  let fixture: ComponentFixture<PatientGeneralInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientGeneralInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientGeneralInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
