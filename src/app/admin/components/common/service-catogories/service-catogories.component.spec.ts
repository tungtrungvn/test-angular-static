import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCatogoriesComponent } from './service-catogories.component';

describe('ServiceCatogoriesComponent', () => {
  let component: ServiceCatogoriesComponent;
  let fixture: ComponentFixture<ServiceCatogoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceCatogoriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceCatogoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
