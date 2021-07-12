import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { collection, EntityEntryPoint, IRI } from '../models/_core';

export const DEFAULT_API_BASE = 'https://chaospad-dev.herokuapp.com';

@Injectable()
export class ApiService {
  constructor(
    private http: HttpClient,
    @Optional()
    @Inject('API_BASE')
    private readonly API_BASE: string
  ) {
    this.API_BASE = API_BASE ? API_BASE : DEFAULT_API_BASE;
  }

  get<T>(iri: IRI): Observable<T> {
    return this.http.get<T>(this.API_BASE + iri);
  }

  getCollection<T>(iri: EntityEntryPoint): Observable<collection<T>> {
    return this.http.get<collection<T>>(this.API_BASE + iri);
  }

  getApiBase(): string {
    return this.API_BASE;
  }

  post<T>(iri: EntityEntryPoint, body: any): Observable<T> {
    return this.http.post<T>(this.API_BASE + iri, body);
  }

  patch<T>(iri: IRI, body: any): Observable<T> {
    return this.http.patch<T>(this.API_BASE + iri, body);
  }

  delete<T>(iri: IRI): Observable<T> {
    return this.http.delete<T>(this.API_BASE + iri);
  }
}
