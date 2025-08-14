import { Component, OnInit } from '@angular/core';
import { SalesService, Sale } from '../../services/Sales'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto_Interface, ProductoService } from '../../services/producto';

@Component({
  selector: 'app-his-compra',
  imports: [CommonModule, FormsModule],
  templateUrl: './his-compra.html',
  styleUrl: './his-compra.css'
})
export class HisCompra implements OnInit {
 ventas: Sale[] = [];
  productos: Producto_Interface[] = [];
  detalleSeleccionado: Sale | null | undefined = null;

constructor(
  private salesService: SalesService,
  private productoService: ProductoService
) {}

ngOnInit() {
  this.cargarVentas();
}

cargarVentas() {
  this.salesService.getMySales().subscribe(ventas => {
    this.ventas = ventas;
    this.cargarProductos();  // luego cargar productos
  });
}

  verDetalle(ventaId: number) {
    this.detalleSeleccionado = this.ventas.find(v => v.id === ventaId);
  }

  // Método para cerrar el detalle
  cerrarDetalle() {
    this.detalleSeleccionado = null;
  }

  cargarProductos() {
  this.productoService.obtenerProductos().then(productos => {
    this.productos = productos;
    this.asociarProductosDetalles();
  });
}

  asociarProductosDetalles() {
  this.ventas.forEach(venta => {
    venta.saleDetails.forEach(detalle => {
      detalle.producto = this.productos.find(p => p.id === detalle.productId);
    });
  });
}

}
