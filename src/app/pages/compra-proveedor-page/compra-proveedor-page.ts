import { Component, OnInit } from '@angular/core';
import { ProductoService, Producto_Interface } from '../../services/producto';
import { ProveedorService, Proveedor } from '../../services/Proveedor';
import { CompraProveedorService, CompraProveedor } from '../../services/compra-proveedor';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-compra-proveedor-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './compra-proveedor-page.html',
  styleUrl: './compra-proveedor-page.css'
})
export class CompraProveedorPage implements OnInit {
  compra = { proveedorId: 0, detalles: [] as any[] };
  proveedores: any[] = [];
  productos: any[] = [];
  productosFiltrados: any[] = [];
  proveedorSeleccionado: any = null;
  categoriaProveedor: string = '';
  formProducto = { productoId: 0, cantidad: 0, precioUnitarioCompra: 0 };
  editandoIndex: number | null = null;

  // 🔹 Agregar estas dos propiedades que faltaban
  categoriaIdSeleccionada: number | null = null;
  mostrarFormulario: boolean = false;

  constructor(
    private productoService: ProductoService,
    private proveedorService: ProveedorService,
    private compraService: CompraProveedorService
  ) {}

  ngOnInit() {
    this.proveedorService.getAll().subscribe(data => this.proveedores = data);
    this.productoService.obtenerProductos().then(data => this.productos = data);
  }

  onProveedorSeleccionado(event: any) {
    const proveedorId = event.target.value;

    if (proveedorId) {
      const proveedor = this.proveedores.find(p => p.id === +proveedorId);

      if (proveedor) {
        this.proveedorSeleccionado = proveedor; // para mostrar el formulario
        this.categoriaProveedor = proveedor.categoriaNombre || 'Sin categoría';
        this.categoriaIdSeleccionada = proveedor.categoriaId;

        // filtrar productos por categoría
        this.productosFiltrados = this.productos.filter(
          prod => prod.categoriaId === proveedor.categoriaId
        );

        // ASIGNAR proveedorId al modelo de compra
        this.compra.proveedorId = +proveedorId;
      }
    } else {
      this.proveedorSeleccionado = null;
      this.productosFiltrados = [];
      this.compra.proveedorId = 0; // o null según tu modelo
    }
  }
  agregarOActualizarProducto() {
    if (this.editandoIndex !== null) {
      this.compra.detalles[this.editandoIndex] = {
        ...this.formProducto,
        costosIndirectos: this.formProducto.precioUnitarioCompra * 0.05
      };
      this.editandoIndex = null;
    } else {
      this.compra.detalles.push({
        ...this.formProducto,
        costosIndirectos: this.formProducto.precioUnitarioCompra * 0.05
      });
    }
    this.resetFormulario();
  }

  editarProducto(index: number) {
    this.formProducto = { ...this.compra.detalles[index] };
    this.editandoIndex = index;
  }

  cancelarEdicion() {
    this.resetFormulario();
    this.editandoIndex = null;
  }

  eliminarProducto(index: number) {
    this.compra.detalles.splice(index, 1);
  }

  resetFormulario() {
    this.formProducto = { productoId: 0, cantidad: 0, precioUnitarioCompra: 0 };
  }

  obtenerNombreProducto(id: number) {
    return this.productos.find(p => p.id === id)?.nombre || 'Producto';
  }

  calcularTotal() {
    return this.compra.detalles.reduce((sum, item) => sum + (item.cantidad * item.precioUnitarioCompra), 0);
  }

  registrarCompra() {
    const compraAEnviar = {
      proveedorId: this.compra.proveedorId, // Asegúrate que NO sea 0
      fechaCompra: new Date().toISOString(),
      total: this.calcularTotal(),
      detalles: this.compra.detalles.map(d => ({
        productoId: Number(d.productoId),
        cantidad: d.cantidad,
        precioUnitarioCompra: d.precioUnitarioCompra,
        costosIndirectos: d.costosIndirectos
      }))
    };

    console.log('Compra enviada al backend:', compraAEnviar);

    this.compraService.registrarCompra(compraAEnviar).subscribe({
      next: () => {
        alert('Compra registrada correctamente');
        this.compra = { proveedorId: 0, detalles: [] };
        this.proveedorSeleccionado = null;
        this.productosFiltrados = [];
        this.resetFormulario();
      },
      error: (err) => console.error('Error del servidor:', err)
    });
  }
}