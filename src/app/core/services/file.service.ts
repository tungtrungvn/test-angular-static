import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileApiService } from './api/file-api.service';
import { IFileResponse } from '@app/models/interfaces/file.interface';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private fileApiService: FileApiService,
  ) { }

  uploadFile(file: any): Observable<IFileResponse> {
    return this.fileApiService.uploadFileApi(file);
  }
}
