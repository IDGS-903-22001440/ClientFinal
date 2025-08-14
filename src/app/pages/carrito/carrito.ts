import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../../services/Sales';

@Component({
  selector: 'app-carrito',
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class Carrito implements OnInit {
  carrito: any[] = [];
  total: number = 0;

  editandoIndex: number | null = null;
  cantidadEditada: number = 1;

  constructor(private saleService: SalesService) {}

  ngOnInit() {
    this.cargarCarrito();
  }

  cargarCarrito() {
    const data = localStorage.getItem('carrito');
    this.carrito = data ? JSON.parse(data) : [];
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.carrito.reduce(
      (acc, item) => acc + item.producto.precio * item.cantidad,
      0
    );
  }

  eliminarProducto(index: number) {
    this.carrito.splice(index, 1);
    this.guardarCarrito();
  }

  guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
    this.calcularTotal();
    this.cancelarEdicion();
  }

  abrirEdicion(index: number, cantidadActual: number) {
    this.editandoIndex = index;
    this.cantidadEditada = cantidadActual;
  }

  cancelarEdicion() {
    this.editandoIndex = null;
  }

  aceptarEdicion(index: number) {
    if (this.cantidadEditada < 1) this.cantidadEditada = 1;
    if (this.cantidadEditada > this.carrito[index].producto.stock) {
      this.cantidadEditada = this.carrito[index].producto.stock;
    }
    this.carrito[index].cantidad = this.cantidadEditada;
    this.guardarCarrito();
    this.editandoIndex = null;
  }

  restarCantidadEditada() {
    if (this.cantidadEditada > 1) {
      this.cantidadEditada--;
    }
  }

  sumarCantidadEditada(stock: number) {
    if (this.cantidadEditada < stock) {
      this.cantidadEditada++;
    }
  }

  validarCantidad(stock: number) {
    if (this.cantidadEditada < 1) this.cantidadEditada = 1;
    if (this.cantidadEditada > stock) this.cantidadEditada = stock;
  }

  crearRango(stock: number): number[] {
    return Array.from({ length: stock }, (_, i) => i + 1);
  }

  realizarVenta() {
    const venta = {
      detalleVenta: this.carrito.map(item => ({
        productId: item.producto.id,
        quantity: item.cantidad,
        unitPrice: item.producto.precio // opcional, si tu backend lo usa
      }))
    };

    this.saleService.createSale(venta).subscribe({
      next: () => {
        alert('Venta realizada con éxito');
        this.carrito = [];
        this.guardarCarrito();
      },
      error: err => {
        console.error('Error al realizar la venta:', err);
        alert('Error al realizar la venta');
      }
    });
  }
}