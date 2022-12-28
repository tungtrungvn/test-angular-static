import { Injectable } from '@angular/core';
import { CommonApiService } from './api/common-api.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    constructor(
        private commonApiService: CommonApiService,
    ) { }
}
