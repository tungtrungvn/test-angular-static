import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {ActivatedRoute, Params} from '@angular/router';
import {map, Observable} from 'rxjs';
import {KeyValue} from '@angular/common';
import * as uuid from 'uuid';

@Injectable({
    providedIn: 'root'
})
export class UtilService {
    constructor(private route: ActivatedRoute) {
    }

    buildParams(params: any): HttpParams {
        let newParams = new HttpParams();
        Object.keys(params).forEach(key => {
            if (params[key] instanceof Array) {
                params[key].forEach((item: any, index: number) => {
                    newParams = newParams.set(`${key.toString()}[${index}]`, item);
                });
            } else {
                newParams = newParams.set(key.toString(), params[key]);
            }
        });
        return newParams;
    }

    getUrlParams(): Observable<Array<KeyValue<string, any>>> {
        return this.route.queryParams.pipe(map((params: Params) => {
            const urlParams: Array<KeyValue<string, any>> = [];
            for (const key of Object.keys(params)) {
                urlParams.push({key: key.toLowerCase(), value: params[key]});
            }
            return urlParams;
        }));
    }


    getUrlParam(key: string): any {
        let paramValue;
        this.route.queryParams.subscribe(params => {
            for (const paramKey in params) {
                if (key.toLowerCase() === paramKey.toLowerCase()) {
                    paramValue = params[paramKey];
                    break;
                }
            }
        });
        return paramValue;
    }

    isObject = (object: null) => {
        return object != null && typeof object === 'object';
    }

    isDeepEqual = (object1: { [x: string]: any; }, object2: { [x: string]: any; }) => {

        const objKeys1 = Object.keys(object1);
        const objKeys2 = Object.keys(object2);

        if (objKeys1.length !== objKeys2.length) { return false; }

        for (const key of objKeys1) {
            const value1 = object1[key];
            const value2 = object2[key];

            const isObjects = this.isObject(value1) && this.isObject(value2);

            if ((isObjects && !this.isDeepEqual(value1, value2)) ||
                (!isObjects && value1 !== value2)
            ) {
                return false;
            }
        }
        return true;
    }

    getUUIDv4() {
        return uuid.v4();
    }
}
