import { Component, inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { Auth } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Role } from '../../services/role';
import { Observable } from 'rxjs';
import { Roles } from '../../interfaces/roles';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidationError } from '../../interfaces/validation-error';

@Component({
  selector: 'app-register',
  imports: [MatInputModule, RouterLink, MatIconModule, MatSelectModule, ReactiveFormsModule, AsyncPipe, CommonModule, MatSnackBarModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  router = inject(Router)
  authService = inject(Auth)
  matSnackBar = inject(MatSnackBar)
  roleService = inject(Role);
  roles$!:Observable<Roles[]>;
  fb = inject(FormBuilder);
  registerForm!: FormGroup;
  hide = true;
  confirmPasswordHide = true;
  errors!:ValidationError[];
  
  register(){
    this.authService.register(this.registerForm.value).subscribe({
      next:(response)=>{
        console.log(response)

        this.matSnackBar.open(response.message,'Close',{
          duration:5000,
          horizontalPosition:'center',
        });
        this.router.navigate(['/login'])
      },
      error:(err:HttpErrorResponse)=>{
        if(err!.status==400){
          this.errors = err!.error;
          this.matSnackBar.open('Validations error','Close',{
          duration:5000,
          horizontalPosition:'center',
        });
        }
      },
      complete:()=>console.log('Register success'),
    });
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required]],
      fullName:['',[Validators.required]],
      roles:[''],
      confirmPassword:['',[Validators.required]]
    },{
      validator: this.passwordMatchValidator,
    }
  )

    this.roles$ = this.roleService.getRoles();
  }

  private passwordMatchValidator(control: AbstractControl): {[key:string]:boolean} | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

}
