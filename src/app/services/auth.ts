import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../interfaces/login-request';
import { map, Observable } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { RegisterRequest } from '../interfaces/register-request';
import { UserDetail } from '../interfaces/user-detail';
import { Role } from './role';
import { ResetPasswordRequest } from '../interfaces/reset-password-request';
import { ChangePasswordRequest } from '../interfaces/change-password-request';
import { EditUserRequest } from '../interfaces/edit-user-request';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  
  apiUrl:string = environment.apiUrl;
  private userKey = 'user'

  constructor(private http:HttpClient){}

  login(data:LoginRequest):Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.apiUrl}/Account/login`,data).pipe(
      map((response)=>{
        if(response.isSuccess){
          localStorage.setItem(this.userKey, JSON.stringify(response));
        }
        return response;
      })
    )
  }

  register(data:RegisterRequest):Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.apiUrl}/Account/register`,data)
  }

  getDetail=():Observable<UserDetail> =>
    this.http.get<UserDetail>(`${this.apiUrl}/Account/detail`)


  forgotPassword = (email:string):Observable<AuthResponse>=>
    this.http.post<AuthResponse>(`${this.apiUrl}/Account/forgot-password`,{
      email,
    })

  resetPassword = (data : ResetPasswordRequest):Observable<AuthResponse>=>
    this.http.post<AuthResponse>(`${this.apiUrl}/Account/reset-password`, data)

  changePassword = (data : ChangePasswordRequest):Observable<AuthResponse>=>
    this.http.post<AuthResponse>(`${this.apiUrl}/Account/change-password`, data)
  

  getUserDetail=()=>{
    const token = this.getToken();
    if(!token) return null;
    const decodedToken:any =  jwtDecode(token);
    const userDetail = {
      id : decodedToken.nameid,
      fullName:decodedToken.name,
      email:decodedToken.email,
      roles:decodedToken.role || []
    }

    return userDetail
  }

  isLoggedIn=():boolean=>{
    const token = this.getToken();
    if(!token) return false;

    return !this.isTokenExpired();
  }

  isInRole = (role: string): boolean => {
  const roles = this.getRoles();

  if (!roles) return false;

  if (typeof roles === 'string') {
    return (roles as string).toLowerCase() === role.toLowerCase();
  }

  if (Array.isArray(roles)) {
    return (roles as string[]).some(r => r.toLowerCase() === role.toLowerCase());
  }

  return false;
};


  private isTokenExpired() {
    const token = this.getToken();
    if(!token) return true;
    const decoded = jwtDecode(token);
    const isTokenExpired = Date.now() >= decoded['exp']! * 1000;
    //if(isTokenExpired) this.logout();
    return isTokenExpired;
  }

  logout = ():void=>{
    localStorage.removeItem(this.userKey);
  };

  getRoles = ():string[] | null =>{
    const token = this.getToken();
    if(!token) return null;

    const decodedToken:any = jwtDecode(token);
    return decodedToken.role || null;
  };


  getAll=():Observable<UserDetail[]> => this.http.get<UserDetail[]>(`${this.apiUrl}/Account`);

  refreshToken=(data:{email:string,token:string,refreshToken:string}):Observable<AuthResponse> => this.http.post<AuthResponse>(`${this.apiUrl}/Account/refresh-token`,data);

  getToken = ():string|null => {
    const user = localStorage.getItem(this.userKey);
    if(!user){
      return null;
    }
    const userDetail:AuthResponse=JSON.parse(user);

    return userDetail.token
  };

  getRefreshToken = ():string|null => {
    const user = localStorage.getItem(this.userKey);
    if(!user){
      return null;
    }
    const userDetail:AuthResponse=JSON.parse(user);

    return userDetail.refreshToken
  };

  // Editar usuario (solo FullName y Email)
  editUser = (id: string, data: EditUserRequest): Observable<AuthResponse> =>
  this.http.put<AuthResponse>(`${this.apiUrl}/Account/${id}`, data);

  // Eliminar usuario
  deleteUser = (id: string): Observable<AuthResponse> =>
    this.http.delete<AuthResponse>(`${this.apiUrl}/Account/${id}`);
}
