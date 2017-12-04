import { Injectable } from '@angular/core';
import { Http, Request, RequestOptionsArgs, Response} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TransferState } from '../transfer-state/transfer-state';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/fromPromise';
import {FRONT_BACK_URL} from '../../main.config';

@Injectable()
export class TransferHttp {
  constructor(private http: Http, protected transferState: TransferState) {}

  request(uri: string | Request, options?: RequestOptionsArgs): Observable<any> {
    return this.getData(uri, options, (url: string, options: RequestOptionsArgs) => {
      return this.http.request(url, options);
    });
  }
  /**
   * Performs a request with `get` http method.
   */
  get(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.getData(url, options, (url: string, options: RequestOptionsArgs) => {
      return this.http.get(url, options);
    });
  }
  /**
   * Performs a request with `post` http method.
   */
  post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    return this.getPostData(url, body, options, (url: string, options: RequestOptionsArgs) => {
      return this.http.post(url, body. options);
    });
  }
  /**
   * Performs a request with `put` http method.
   */
  put(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    return this.getData(url, options, (url: string, options: RequestOptionsArgs) => {
      return this.http.put(url, options);
    });
  }
  /**
   * Performs a request with `delete` http method.
   */
  delete(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.getData(url, options, (url: string, options: RequestOptionsArgs) => {
      return this.http.delete(url, options);
    });
  }
  /**
   * Performs a request with `patch` http method.
   */
  patch(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    return this.getPostData(url, body, options, (url: string, options: RequestOptionsArgs) => {
      return this.http.patch(url, body.options);
    });
  }
  /**
   * Performs a request with `head` http method.
   */
  head(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.getData(url, options, (url: string, options: RequestOptionsArgs) => {
      return this.http.head(url, options);
    });
  }
  /**
   * Performs a request with `options` http method.
   */
  options(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.getData(url, options, (url: string, options: RequestOptionsArgs) => {
      return this.http.options(url, options);
    });
  }

  private getData(uri: string | Request, options: RequestOptionsArgs, callback: (uri: string | Request, options?: RequestOptionsArgs) => Observable<Response>) {

    let url = uri;

    if (typeof uri !== 'string') {
      url = uri.url
    }


    let key: string = url.toString();

    if (options) {
      key = url + JSON.stringify(options);
    }

    try {
      return this.resolveData(key);

    } catch (e) {
      return callback(uri, options)
        .map(res => res.json())
        .do(data => {
          this.setCache(key, data);
        });
    }
  }

  private getPostData(uri: string | Request, body: any, options: RequestOptionsArgs, callback: (uri: string | Request, body: any, options?: RequestOptionsArgs) => Observable<Response>) {

    let url = uri;

    if (typeof uri !== 'string') {
      url = uri.url
    }

    const key = url + JSON.stringify(body) + JSON.stringify(options);

    try {

      return this.resolveData(key);

    } catch (e) {
      return callback(uri, body, options)
        .map(res => res.json())
        .do(data => {
          this.setCache(key, data);
        });
    }
  }

  private resolveData(key: string) {
    const data = this.getFromCache(key);

    if (!data) {
      throw new Error();
    }

    return Observable.fromPromise(Promise.resolve(data));
  }

  private setCache(key, data) {
    return this.transferState.set(key, data);
  }

  private getFromCache(key): any {
    return this.transferState.get(key);
  }

  /**
   * TEMPORARY
   * Method to get url
   * @param url
   * @returns {string}
   */
  public static getUrl(url: string, isOuter?: boolean): string {
    return `${FRONT_BACK_URL}${url}`;
  }
}
