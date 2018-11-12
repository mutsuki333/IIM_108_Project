import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {

  private headers: any = new Headers({'Content-Type': 'application/json'});
  private host: string = 'http://54.71.220.94';

  constructor(private http: HttpClient) { }

  public get(api:string): Promise<any[]> {
    return this.http.get(this.host + api, this.headers)
    .toPromise()
    .then((res) => {
      const response: any = res;
      return response;
    })
    .catch(this.errorHandler);
  }
  public post(api:string,body:any): Promise<any[]> {
    return this.http.post(this.host + api,body, this.headers)
    .toPromise()
    .then((res) => {
      const response: any = res;
      return response;
    })
    .catch(this.errorHandler);
  }
  private errorHandler(err) {
    console.log('Error occured.', err);
    return Promise.reject(err.message || err);
  }
}
