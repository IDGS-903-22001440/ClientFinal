import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Roles } from '../interfaces/roles';
import { RoleCreateRequest } from '../interfaces/role-create-request';

@Injectable({
  providedIn: 'root'
})
export class Role {
  apiUrl = environment.apiUrl

  constructor(private http:HttpClient){}

  getRoles = () : Observable<Roles[]> =>
    this.http.get<Roles[]>(`${this.apiUrl}/Roles`)

  createRole = (role:RoleCreateRequest) : Observable<{message:string}> =>
    this.http.post<{message:string}>(`${this.apiUrl}/Roles`,role)

  delete = (id:string) : Observable<{message:string}> =>
    this.http.delete<{message:string}>(`${this.apiUrl}/Roles/${id}`)

  assignRole = (userId:string, roleId:string) : Observable<{message:string}> =>
    this.http.post<{message:string}>(`${this.apiUrl}/Roles/assign`,{
      userId,roleId,
    })
}
