import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsInfoComponent } from './questions-info.component';

describe('QuestionsInfoComponent', () => {
  let component: QuestionsInfoComponent;
  let fixture: ComponentFixture<QuestionsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionsInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
