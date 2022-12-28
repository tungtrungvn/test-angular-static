import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientInsuranceInfoComponent } from './patient-insurance-info.component';

describe('PatientInsuranceInfoComponent', () => {
  let component: PatientInsuranceInfoComponent;
  let fixture: ComponentFixture<PatientInsuranceInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientInsuranceInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientInsuranceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
