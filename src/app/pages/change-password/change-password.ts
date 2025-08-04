import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-change-password',
  imports: [FormsModule, MatSnackBarModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css'
})
export class ChangePassword {
  newPassword!:string;
  currentPassword!:string;
  authService = inject(Auth);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);

  changePassword(){
    this.authService.changePassword({
      email:this.authService.getUserDetail()?.email,
      newPassword: this.newPassword,
      currentPassword: this.currentPassword
  }).subscribe({
    next:(response)=>{
      if(response.isSuccess){
        this.matSnackBar.open(response.message,"Close",{
            duration:5000,
          });
          this.authService.logout();
          this.router.navigate(['/login'])
      }else{
        this.matSnackBar.open(response.message,"Close",{
            duration:5000,
          })
      }
    },
    error:(error:HttpErrorResponse)=>{
        this.matSnackBar.open(error.error.message,"Close",{
            duration:5000,
          })
      }
  })
  }
}
