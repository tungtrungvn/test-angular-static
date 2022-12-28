import { Injectable } from '@angular/core';
import { State } from '@app/models/interfaces/metadata.interface';
import { Observable } from 'rxjs';
import { MetadataApiService } from './api/metadata-api.service';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {

  constructor(private metadataService: MetadataApiService) { }

  getStates(): Observable<State[]> {
    return this.metadataService.getStates();
  }
}
