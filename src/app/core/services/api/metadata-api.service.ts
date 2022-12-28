import { Injectable } from '@angular/core';
import { State } from '@app/models/interfaces/metadata.interface';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';


const routes = {
  getStates: '/metadata/states',
};

@Injectable({
  providedIn: 'root'
})
export class MetadataApiService {
    constructor(private apiService: ApiService) { }

    getStates(): Observable<State[]> {
      return this.apiService.get(routes.getStates);
    }

}
