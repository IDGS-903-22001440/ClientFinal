import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Categoria_Interface } from './producto';


export interface Proveedor {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  categoriaId: number;
}



@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
    private apiUrl = 'https://localhost:5000/api/proveedores';


  constructor(private http: HttpClient) {}

  // Obtener todos los proveedores
  getAll(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.apiUrl);
  }

  // Obtener proveedor por ID
  getById(id: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo proveedor
  create(proveedor: Proveedor) {
  return this.http.post<Proveedor>(`${this.apiUrl}`, proveedor);
    }

  // Actualizar proveedor
  update(id: number, proveedor: Proveedor): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, proveedor);
  }

  // Eliminar proveedor
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}