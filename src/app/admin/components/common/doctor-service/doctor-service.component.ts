import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DoctorService } from '@app/core/services/doctor.service';
import { IDoctorService, IServiceCategory } from '@app/models/interfaces/doctor.interface';

@Component({
  selector: 'app-doctor-service-component',
  templateUrl: './doctor-service.component.html',
  styleUrls: ['./doctor-service.component.scss']
})
export class DoctorServiceComponent implements OnInit, OnChanges {

  @Output() filterChange: EventEmitter<number> = new EventEmitter();
  @Input() categoryId: number | undefined;
  data: IDoctorService[] = [];
  constructor(
    private doctorService: DoctorService,
  ) { }
  ngOnInit(): void {
    const allOption: IDoctorService = {
      id: -1,
      name: 'All'
    };
    this.data = [allOption];

    this.getAllDoctorServices();
  }

  onChange(event: any): void {
    const id = event.target.value;
    this.filterChange.emit(id);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.categoryId) {
      this.getAllDoctorServices();
    }
  }
  
  private getAllDoctorServices(): void {
    if (!this.categoryId || this.categoryId <= 0) {
      return;
    }
    
  }

}
