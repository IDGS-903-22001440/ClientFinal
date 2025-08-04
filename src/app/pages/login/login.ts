import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { routes } from '../../app.routes';
import { T } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-login',
  imports: [MatInputModule, MatSnackBarModule, RouterLink, MatIconModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  authService=inject(Auth)
  matSnackBar = inject(MatSnackBar)
  router = inject(Router)
  hide = true;
  form!: FormGroup;
  fb = inject(FormBuilder);

  login() {
    this.authService.login(this.form.value).subscribe({
      next:(response)=>{
        this.matSnackBar.open(response.message,'Close',{
          duration:5000,
          horizontalPosition:'center'
        })
        this.router.navigate(['/'])
      },
      error:(error)=>{
        this.matSnackBar.open(error.error.message,'Close',{
          duration:5000,
          horizontalPosition:'center'
        })
      }
    })
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required]],
    })
  }
}
