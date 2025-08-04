import { Component, inject } from '@angular/core';
import { RoleForm } from '../../components/role-form/role-form';
import { Role } from '../../services/role';
import { RoleCreateRequest } from '../../interfaces/role-create-request';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { RoleList } from '../../components/role-list/role-list';
import { AsyncPipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-role',
  imports: [RoleForm, MatSnackBarModule, RoleList, AsyncPipe, MatSelectModule,MatInputModule],
  templateUrl: './role.html',
  styleUrl: './role.css'
})
export class RoleC {
  roleService = inject(Role)
  authService = inject(Auth)
  errorMessage='';
  roles:RoleCreateRequest = {} as RoleCreateRequest;
  roles$ = this.roleService.getRoles();
  users$ = this.authService.getAll();
  snackBar = inject(MatSnackBar);
  selectedUser:string = '';
  selectedRole:string = '';

  createRole(role: RoleCreateRequest){
    this.roleService.createRole(role).subscribe({
      next:(response:{message:string})=>{
        this.roles$ = this.roleService.getRoles();
        this.snackBar.open("Role Created Succesfully","Ok",{
          duration:3000,
        });
      },
      error:(error:HttpErrorResponse)=>{
        if(error.status == 400){
          this.errorMessage = error.error;
        }
      }
    })
  }

  deleteRole(id:string){
    this.roleService.delete(id).subscribe({
      next:(response)=>{
        this.roles$ = this.roleService.getRoles();
        this.snackBar.open("Role Succesfully","Close",{
          duration:3000,
        });
      },
      error:(error:HttpErrorResponse)=>{
        this.snackBar.open(error.message,"Close",{
          duration:3000,
        });
      }, 
    })
  }

  assignRole(){
    this.roleService.assignRole(this.selectedUser, this.selectedRole).subscribe({
      next:(response)=>{
        this.roles$ = this.roleService.getRoles();
        this.snackBar.open("Role Succesfully","Close",{
          duration:3000,
        });
      },
      error:(error:HttpErrorResponse)=>{
        this.snackBar.open(error.message,"Close",{
          duration:3000,
        });
      }, 
    })
  }
}
