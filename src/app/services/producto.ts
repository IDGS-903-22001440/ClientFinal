import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map, Observable } from 'rxjs';
import { ProductosDetail } from '../interfaces/productos-detail';

export interface Producto_Interface {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  stock: number;
  categoriaId: number;
}

export interface Categoria_Interface {
  id: number;
  nombre: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrlProductos = 'https://localhost:5000/api/productoes';  // Ajusta si tu ruta es distinta
  private apiUrlCategorias = 'https://localhost:5000/api/categorias';

  constructor(private http: HttpClient) {}

  async obtenerProductos(): Promise<Producto_Interface[]> {
    const productos: Producto_Interface[] = await firstValueFrom(this.http.get<Producto_Interface[]>(this.apiUrlProductos));
    return productos.map(p => ({
      ...p,
      imagen: 'https://localhost:5000' + p.imagen // Ajusta la URL base y concatenación
    }));
  }

  async obtenerCategorias(): Promise<Categoria_Interface[]> {
    return await firstValueFrom(this.http.get<Categoria_Interface[]>(this.apiUrlCategorias));
  }

  getProductoPorId(id: number) {
    return this.http.get<Producto_Interface>(`${this.apiUrlProductos}/${id}`).pipe(
      map(producto => ({
        ...producto,
        imagen: 'https://localhost:5000' + producto.imagen
      }))
    );
  }

  // ✅ Nuevo método para obtener categorías
  getCategorias(): Observable<Categoria_Interface[]> {
    return this.http.get<Categoria_Interface[]>(`${this.apiUrlCategorias}`);
  }


    getProductosDashboard = (): Observable<ProductosDetail> =>
      this.http.get<ProductosDetail>(`${this.apiUrlProductos}/dashboard`)
}
