import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { UtilService } from '@core/services/util.service';
import { IFileResponse } from '@app/models/interfaces/file.interface';

const routes = {
  uploadFileUrl: '/files/media'
};


@Injectable({
  providedIn: 'root'
})
export class FileApiService {

  constructor(
    private apiService: ApiService,
    private utilService: UtilService
  ) { }

  uploadFileApi(file: any): Observable<IFileResponse> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.apiService.postFormData(routes.uploadFileUrl, formData);
  }
}
