import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs/';
import { map, catchError, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
// import 'rxjs/add/operator/do';
import Swal from 'sweetalert2';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {

  constructor(private route: ActivatedRoute,
    private router: Router,) { }
  /**
   * 
   * @param req 
   * @param next
   * When user request pass accessToken with all request and if any error display alert on every error
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = JSON.parse(localStorage.getItem('token'));

    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('token',
          token)
      });
      return next.handle(cloned)
        .pipe(
          map((event: HttpResponse<any>) => {
            
            // Swal.fire({type: 'success',title: 'Password Change Successfully',showConfirmButton:false,timer: 2000})
            return event;
          }),

          /**
           * 401 error 
           */
          catchError((error: HttpErrorResponse) => {
            
            const errorMessage = error.error.message;
            let errorStatus = error.status
            
            // if (error.status === 401) {
            // const token = (localStorage.removeItem('currentUser'));
            if (errorStatus)
              Swal.fire({
                type: 'error',
                title: errorMessage,
                showConfirmButton: false,
                timer: 2000
              })
            // this.router.navigate(['/login']);
            // }
            return throwError(error.error);
          })
        );
    } else {
      return next.handle(req)
        .pipe(
          map((event: HttpResponse<any>) => {
            
            return event;
          }),
          catchError((error: HttpErrorResponse) => {
            
            let errorMessage = error.error.message;
        //    
            // if (error.status === 401) {
            /**
             * Alert of every error response
             */
            Swal.fire({
              type: 'error',
              title: "Sorry",
              text: errorMessage,
              showConfirmButton: true,
              timer: 3000
            })
            // this.router.navigate(['/login']);
            // }
            return throwError(error);
          })
        );
    };

  }
}