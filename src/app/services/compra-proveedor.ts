import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ComprasDetail } from '../interfaces/compras-detail';

// Interfaces para tipado
export interface DetalleCompraProveedor {
  productoId: number;
  cantidad: number;
  precioUnitarioCompra: number;
  costosIndirectos: number;
}

export interface CompraProveedor {
  proveedorId: number;
  detalles: DetalleCompraProveedor[];
}

@Injectable({
  providedIn: 'root'
})
export class CompraProveedorService {

  private apiUrl = 'https://localhost:5000/api/ComprasProveedor';

  constructor(private http: HttpClient) {}

  registrarCompra(compra: CompraProveedor): Observable<any> {
    return this.http.post(this.apiUrl, compra);
  }

  obtenerCompras(
    proveedorId?: number,
    fechaInicio?: string,  // ISO string, ej: '2025-08-01'
    fechaFin?: string      // ISO string
  ): Observable<CompraProveedor[]> {
    let params = new HttpParams();

    if (proveedorId !== undefined) {
      params = params.set('proveedorId', proveedorId.toString());
    }
    if (fechaInicio) {
      params = params.set('fechaInicio', fechaInicio);
    }
    if (fechaFin) {
      params = params.set('fechaFin', fechaFin);
    }

    return this.http.get<CompraProveedor[]>(this.apiUrl, { params });
  }

  obtenerCompraPorId(id: number): Observable<CompraProveedor> {
    return this.http.get<CompraProveedor>(`${this.apiUrl}/${id}`);
  }

  getComprasDashboard = (): Observable<ComprasDetail> =>
        this.http.get<ComprasDetail>(`${this.apiUrl}/dashboard`)
}