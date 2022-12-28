import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DoctorService } from '@app/core/services/doctor.service';
import { IServiceCategory } from '@app/models/interfaces/doctor.interface';

@Component({
  selector: 'app-service-catogories-component',
  templateUrl: './service-catogories.component.html',
  styleUrls: ['./service-catogories.component.scss']
})
export class ServiceCatogoriesComponent implements OnInit {

  @Output() filterChange: EventEmitter<number> = new EventEmitter();
  data: IServiceCategory[] = [];
  constructor(
    private doctorService: DoctorService,
  ) { }
  ngOnInit(): void {
    this.getAllServiceCategories();
  }

  onChange(event: any): void {
    const id = event.target.value;
    this.filterChange.emit(id);
  }
  private getAllServiceCategories(): void {
    
  }

}
