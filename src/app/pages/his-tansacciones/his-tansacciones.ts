import { Component, OnInit } from '@angular/core';
import { CompraProveedorService } from '../../services/compra-proveedor';
import { SalesService } from '../../services/Sales';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto_Interface, ProductoService } from '../../services/producto';

@Component({
  selector: 'app-his-tansacciones',
  imports: [CommonModule, FormsModule],
  templateUrl: './his-tansacciones.html',
  styleUrl: './his-tansacciones.css'
})
export class HisTansacciones implements OnInit {
  modo: 'compras' | 'ventas' = 'compras';
  lista: any[] = [];
  detalleSeleccionado: any = null;
  detalleItems: any[] = [];
  productos: Producto_Interface[] = [];
  loading = false;

  constructor(
    private compraService: CompraProveedorService,
    private salesService: SalesService,
    private productoService: ProductoService
  ) {}

  async ngOnInit() {
    this.productos = await this.productoService.obtenerProductos();
    this.cargarLista();
  }

  cambiarModo() {
    this.modo = this.modo === 'compras' ? 'ventas' : 'compras';
    this.detalleSeleccionado = null;
    this.detalleItems = [];
    this.cargarLista();
  }

  cargarLista() {
    this.loading = true;
    if (this.modo === 'compras') {
      this.compraService.obtenerCompras().subscribe(data => {
        this.lista = data;
        this.loading = false;
      });
    } else {
      this.salesService.getAllSales().subscribe(data => {
        this.lista = data;
        this.loading = false;
      });
    }
  }

  verDetalle(id: number) {
  this.detalleSeleccionado = this.lista.find(item => item.id === id) ?? null;

  if (this.detalleSeleccionado) {
    const detallesRaw = this.modo === 'compras'
      ? this.detalleSeleccionado.detalles || []
      : this.detalleSeleccionado.saleDetails || [];

    this.detalleItems = detallesRaw.map((det: any) => {
      const productId = det.productId ?? det.productoId;
      const producto = this.productos.find(p => p.id === productId);
      return { ...det, producto: producto || null };
    });
  } else {
    this.detalleItems = [];
  }
}


    verDetalleVenta(id: number) {
      this.salesService.getSaleById(id).subscribe({
        next: (sale) => {
          this.detalleSeleccionado = sale;
        },
        error: (err) => {
          console.error('Error al obtener la venta:', err);
          alert('No se pudo cargar el detalle de la venta');
        }
      });
    }


    cargarProductos() {
      this.productoService.obtenerProductos().then(productos => {
        this.productos = productos;
      }).catch(err => {
        console.error('Error cargando productos', err);
      });
    }

}


