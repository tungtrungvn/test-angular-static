import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientVisitHistoryComponent } from './patient-visit-history.component';

describe('PatientVisitHistoryComponent', () => {
  let component: PatientVisitHistoryComponent;
  let fixture: ComponentFixture<PatientVisitHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientVisitHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientVisitHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
