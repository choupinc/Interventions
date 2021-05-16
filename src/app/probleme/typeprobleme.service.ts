import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ITypeProbleme } from './typeprobleme';

@Injectable({
  providedIn: 'root'
})
export class TypeProblemeService {

  //private urlDonnee = 'https://localhost:5001/Intervention';
  private urlDonnee = 'https://interventionscac2021.azurewebsites.net/intervention';

  constructor(private http: HttpClient) { }

  obtenirProblemes(): Observable<ITypeProbleme[]> {

    return this.http.get<ITypeProbleme[]>(this.urlDonnee).pipe(
      tap(data => console.log('obtenirTypesProbleme: ' + JSON.stringify(data))),
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