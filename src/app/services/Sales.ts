import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto_Interface } from './producto';
import { UserDetail } from '../interfaces/user-detail';
import { SalesDetail } from '../interfaces/sales-detail';

export interface SaleDetail {
  id?: number;
  productId: number;
  quantity: number;
  unitPrice?: number;
  producto?: Producto_Interface; 
}

export interface SaleDto {
  detalleVenta: SaleDetail[];
}

export type SaleStatus = 'EnProceso' | 'Aceptada';

export interface Sale {
  id: number;
  userId: string;
  date: string;
  total: number;
  saleDetails: SaleDetail[];
  direccion: string;
  user?: UserDetail;// otros campos según modelo
}

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private apiUrl = 'https://localhost:5000/api/Sales';

  constructor(private http: HttpClient) {}

  createSale(saleDto: SaleDto): Observable<any> {
    return this.http.post(this.apiUrl, saleDto);
  }

  getAllSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.apiUrl);
  }

  getMySales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.apiUrl}/user`);
  }

  getSaleById(id: number): Observable<Sale> {
    return this.http.get<Sale>(`${this.apiUrl}/${id}`);
  }

  getSaleDashboard = (): Observable<SalesDetail> =>
        this.http.get<SalesDetail>(`${this.apiUrl}/dashboard`);

  // Nuevo método para cambiar el estatus
  updateSaleStatus(id: number, status: SaleStatus): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, status);
  }

  // ✅ Ajustado para enviar direccion
  createCotizacion(data: { userId: string; direccion: string; saleDetails: SaleDetail[] }) {
    return this.http.post(`${this.apiUrl}/CreateCotizacion`, data);
  }
}