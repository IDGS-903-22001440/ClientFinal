import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { SalesDetail } from '../../interfaces/sales-detail';
import { ProductosDetail } from '../../interfaces/productos-detail';
import { ComprasDetail } from '../../interfaces/compras-detail';
import { CommonModule, JsonPipe } from '@angular/common';
import { SalesService } from '../../services/Sales';
import { ProductoService } from '../../services/producto';
import { CompraProveedorService } from '../../services/compra-proveedor';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  loading = true;
  errorMessage = '';

  // Ventas
  totalSales = 0;
  totalRevenue = 0;
  dailySales: any[] = [];
  topProducts: any[] = [];

  // Productos
  totalProductos = 0;
  productosBajoStock: any[] = [];
  stockPorCategoria: any[] = [];
  productosMasCaros: any[] = [];

  // Compras
  totalCompras = 0;
  totalInvertido = 0;
  comprasPorDia: any[] = [];
  proveedoresFrecuentes: any[] = [];
  productosMasComprados: any[] = [];

  constructor(
    private salesService: SalesService,
    private productosService: ProductoService,
    private comprasService: CompraProveedorService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  private loadDashboard() {
    this.loading = true;
    this.errorMessage = '';

    // Llamadas concurrentes (cada observable devuelve directamente el objeto)
    forkJoin({
      sales: this.salesService.getSaleDashboard(),
      productos: this.productosService.getProductosDashboard(),
      compras: this.comprasService.getComprasDashboard()
    }).subscribe({
      next: ({ sales, productos, compras }) => {
        // --- Ventas ---
        // manejo tolerantemente posibles diferencias de casing (TotalSales / totalSales)
        this.totalSales = (sales as any).TotalSales ?? (sales as any).totalSales ?? 0;
        this.totalRevenue = (sales as any).TotalRevenue ?? (sales as any).totalRevenue ?? 0;
        this.dailySales = (sales as any).DailySales ?? (sales as any).dailySales ?? [];
        this.topProducts = (sales as any).TopProducts ?? (sales as any).topProducts ?? [];
        console.log('Top Products:', this.topProducts);


        // --- Productos ---
        this.totalProductos = (productos as any).TotalProductos ?? (productos as any).totalProductos ?? 0;
        this.productosBajoStock = (productos as any).ProductosBajoStock ?? (productos as any).productosBajoStock ?? [];
        this.stockPorCategoria = (productos as any).StockPorCategoria ?? (productos as any).stockPorCategoria ?? [];
        this.productosMasCaros = (productos as any).ProductosMasCaros ?? (productos as any).productosMasCaros ?? [];

        // --- Compras ---
        this.totalCompras = (compras as any).TotalCompras ?? (compras as any).totalCompras ?? 0;
        this.totalInvertido = (compras as any).TotalInvertido ?? (compras as any).totalInvertido ?? 0;
        this.comprasPorDia = (compras as any).ComprasPorDia ?? (compras as any).comprasPorDia ?? [];
        this.proveedoresFrecuentes = (compras as any).ProveedoresFrecuentes ?? (compras as any).proveedoresFrecuentes ?? [];
        this.productosMasComprados = (compras as any).ProductosMasComprados ?? (compras as any).productosMasComprados ?? [];
      },
      error: (err) => {
        console.error('Error cargando dashboard', err);
        this.errorMessage = 'Error al cargar los datos del dashboard.';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}