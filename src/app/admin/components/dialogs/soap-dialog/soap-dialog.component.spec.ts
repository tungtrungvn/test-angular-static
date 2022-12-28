import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoapDialogComponent } from './soap-dialog.component';

describe('SubmitDialogComponent', () => {
  let component: SoapDialogComponent;
  let fixture: ComponentFixture<SoapDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoapDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoapDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
