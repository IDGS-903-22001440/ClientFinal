import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-forget-password',
  imports: [FormsModule, MatSnackBarModule,MatIconModule],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css'
})
export class ForgetPassword {
  email!:string; 
  authService = inject(Auth)
  matSnackBar = inject(MatSnackBar);
  showEmailSend = false;
  isSubmitting = false;


  forgetPassword(){
    this.isSubmitting = true;
    this.authService.forgotPassword(this.email).subscribe({
      next:(response)=>{
        if(response.isSuccess){
          this.matSnackBar.open(response.message,"Close",{
            duration:5000,
          })
          this.showEmailSend=true;
        }else{
          this.matSnackBar.open(response.message,"Close",{
            duration:5000,
          });
        }
      },
      error:(error:HttpErrorResponse)=>{
        this.matSnackBar.open(error.message,"Close",{
            duration:5000,
          });
      },
      complete:()=>{
        this.isSubmitting = false;
      }
    })
  }
}
