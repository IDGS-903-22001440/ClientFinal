import { CanActivateFn, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const matSnackBar = inject(MatSnackBar);

  if(inject(Auth).isLoggedIn()){
    return true;
  }

  matSnackBar.open('You must be logged in to view this page', 'Ok', {
    duration:3000,
  });

  inject(Router).navigate(['/'])
  return false;
};
