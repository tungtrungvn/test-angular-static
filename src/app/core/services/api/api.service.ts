import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '@env/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const BASE_URL = env.apiUrl;


@Injectable({
  providedIn: 'root'
})

export class ApiService {

  private options = { headers: new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8') };

  constructor(private httpClient: HttpClient) { }

  public get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.httpClient.get(BASE_URL + path, { params }).pipe(catchError(this.formatErrors));
  }

  public put(path: string, body: object = {}): Observable<any> {
    return this.httpClient
      .put(BASE_URL + path, JSON.stringify(body), this.options)
      .pipe(catchError(this.formatErrors));
  }

  public putFormData(path: string, body: object = {}): Observable<any> {
    return this.httpClient
      .put(BASE_URL + path, body)
      .pipe(catchError(this.formatErrors));
  }

  public patch(path: string, body: object = {}): Observable<any> {
    return this.httpClient
      .patch(BASE_URL + path, JSON.stringify(body), this.options)
      .pipe(catchError(this.formatErrors));
  }


  public postFormData(path: string, body: object = {}): Observable<any> {
    return this.httpClient
      .post(BASE_URL + path, body)
      .pipe(catchError(this.formatErrors));
  }

  public post(path: string, body: object = {}): Observable<any> {
    return this.httpClient
      .post(BASE_URL + path, JSON.stringify(body), this.options)
      .pipe(catchError(this.formatErrors));
  }
  //add longdvk
  public postFullPath(path: string, body: object = {}): Observable<any> {

    let options1 = { headers: new HttpHeaders().set('Content-Type', 'application/json').set("Access-Control-Allow-Origin","*")};
    let result= this.httpClient
      .post(path, JSON.stringify(body), options1)
      .pipe(catchError(this.formatErrors));
      return result;
  }
  public delete(path: string): Observable<any> {
    return this.httpClient.delete(BASE_URL + path).pipe(catchError(this.formatErrors));
  }

  public formatErrors(error: any): Observable<any> {
    console.log(error);
    return throwError(error.error);
  }

  public download(path: string): Observable<any> {
    return this.httpClient.get(BASE_URL + path, {responseType: 'blob'});
  }

  public putBinaryFile(fullPath: string, body: any): Observable<any> {
    return this.httpClient
      .put(fullPath, body)
      .pipe(catchError(this.formatErrors));
  }
}
