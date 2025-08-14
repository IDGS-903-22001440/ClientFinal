import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto_Interface, ProductoService } from '../../services/producto';
import { forkJoin } from 'rxjs';
import { Sale, SalesService } from '../../services/Sales';
import { Router } from '@angular/router';


@Component({
  selector: 'app-documentation',
  imports: [CommonModule, FormsModule],
  templateUrl: './documentation.html',
  styleUrl: './documentation.css'
})
export class Documentation implements OnInit {
  productosCompradosIds: number[] = [];
  productosComprados: Producto_Interface[] = [];
  productoSeleccionado: any = null;
  cargando = true;
  router = inject(Router)

  constructor(
    private salesService: SalesService,
    private productoService: ProductoService
  ) {}

  ngOnInit() {
    this.cargarProductosComprados();
  }

  cargarProductosComprados() {
    this.salesService.getMySales().subscribe({
      next: (ventas: Sale[]) => {
        // Extraer todos los IDs de productos comprados
        const ids = new Set<number>();
        ventas.forEach(venta => {
          venta.saleDetails.forEach(detalle => {
            if (detalle.productId) {
              ids.add(detalle.productId);
            }
          });
        });

        this.productosCompradosIds = Array.from(ids);

        // Cargar la información completa de cada producto
        const solicitudes = this.productosCompradosIds.map(id =>
          this.productoService.getProductoPorId(id)
        );

        // Suscribirse a todas las llamadas
        solicitudes.forEach(obs => {
          obs.subscribe(producto => {
            this.productosComprados.push(producto);
          });
        });

        this.cargando = false;
      },
      error: (err) => {
        console.error('Error obteniendo ventas:', err);
        this.cargando = false;
      }
    });
  }

  haComprado(nombreProducto: string): boolean {
    return this.productosComprados.some(
      p => p.nombre.toLowerCase() === nombreProducto.toLowerCase()
    );
  }


  seleccionarProducto(nombre: string) {
    this.productoSeleccionado = nombre;
  }

  irAlInicio() {
    this.router.navigate(['/']);
  }
}
