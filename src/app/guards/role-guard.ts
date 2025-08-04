import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

export const roleGuard: CanActivateFn = (route, state) => {
   const roles = route.data["roles"] as string[];
   const authService =inject(Auth);
   const matSnackBar = inject(MatSnackBar);
   const router = inject(Router);
   const userRoles = authService.getRoles();

   if(!authService.isLoggedIn()){
    router.navigate(['/login']);
  
    matSnackBar.open('You must be logged in to view this page', 'Ok', {
      duration:5000,
    })
    return false;
  }

  if(roles.some((role)=>userRoles?.includes(role))) return true;


  router.navigate(['/']);
    matSnackBar.open('You do not have permission to view this page', 'Ok', {
      duration:5000,
    });
    return false;

};
