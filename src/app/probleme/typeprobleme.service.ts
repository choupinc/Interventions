import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IProbleme } from './typeprobleme';

@Injectable({
  providedIn: 'root'
})
export class TypeproblemeService {

  private urlDonnee = 'api/typesprobleme';

  constructor(private http: HttpClient) { }

  obtenirProblemes(): Observable<IProbleme[]> {

    return this.http.get<IProbleme[]>(this.urlDonnee).pipe(
      tap(data => console.log('obtenirProblemes: ' + JSON.stringify(data))),
      catchError(this.handleError)

    );
  }
  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}