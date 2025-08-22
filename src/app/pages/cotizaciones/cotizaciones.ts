import { Component, inject, OnInit } from '@angular/core';
import { SalesService, Sale, SaleDetail } from '../../services/Sales';
import { Auth } from '../../services/auth';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDetail } from '../../interfaces/user-detail';

@Component({
  selector: 'app-cotizaciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './cotizaciones.html',
  styleUrls: ['./cotizaciones.css']
})
export class Cotizaciones implements OnInit {
  authService = inject(Auth);
  quotations: Sale[] = [];
  myQuotations: Sale[] = [];
  detalleSeleccionado: Sale | null = null;
  loading = false;

  // Variables para modal
  showModal: boolean = false;
  cotizacionPreview: {
    subtotal: number,
    extraSensores: number,
    extraPorcentaje: number,
    totalFinal: number,
    detalles: { nombre: string, cantidad: number, precio: number }[]
  } = {
    subtotal: 0,
    extraSensores: 0,
    extraPorcentaje: 0,
    totalFinal: 0,
    detalles: []
  };

  constructor(
    private salesService: SalesService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  // Cargar cotizaciones y asignar usuario
  loadData() {
  this.loading = true;
  const isAdmin = this.authService.getUserDetail()?.roles.includes('Admin');

  const loadSales = (sales: Sale[], assignTo: 'quotations' | 'myQuotations') => {
    this.authService.getAll().subscribe({
      next: users => {
        // Emparejar usuario con la cotización
        const salesWithUsers: Sale[] = sales.map(sale => ({
          ...sale,
          user: users.find(u => u.id === sale.userId) // undefined si no encuentra
        }));
        this[assignTo] = salesWithUsers;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  };

  if (isAdmin) {
    this.salesService.getAllQuotations().subscribe({
      next: data => loadSales(data, 'quotations'),
      error: () => this.loading = false
    });
  }

  this.salesService.getMyQuotations().subscribe({
    next: data => loadSales(data, 'myQuotations'),
    error: () => this.loading = false
  });
}

  verDetalle(id: number) {
    const isAdmin = this.authService.getUserDetail()?.roles.includes('Admin');
    this.detalleSeleccionado = (isAdmin ? this.quotations : this.myQuotations)
      .find(q => q.id === id) || null;

    if (this.detalleSeleccionado) {
      this.showModal = true;
      this.calcularTotales(this.detalleSeleccionado);
    }
  }

  cerrarDetalle() {
    this.detalleSeleccionado = null;
    this.showModal = false;
    this.cotizacionPreview = {
      subtotal: 0,
      extraSensores: 0,
      extraPorcentaje: 0,
      totalFinal: 0,
      detalles: []
    };
  }

  calcularTotales(venta: Sale) {
    const detalles = venta.saleDetails.map((item: SaleDetail) => ({
      nombre: item.producto?.nombre || 'Producto',
      cantidad: item.quantity,
      precio: item.unitPrice || 0
    }));

    const subtotal = detalles.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    const extraSensores = subtotal * 0.1;
    const extraPorcentaje = subtotal * 0.05;
    const totalFinal = subtotal + extraSensores + extraPorcentaje;

    this.cotizacionPreview = { subtotal, extraSensores, extraPorcentaje, totalFinal, detalles };
  }

  acceptQuotation(id: number) {
    this.salesService.acceptQuotation(id).subscribe({
      next: () => { this.toastr.success('Cotización aceptada'); this.loadData(); },
      error: err => this.toastr.error(err.error || 'Error al aceptar')
    });
  }

  payQuotation(id: number) {
    this.salesService.payQuotation(id).subscribe({
      next: () => { this.toastr.success('Cotización pagada'); this.loadData(); },
      error: err => this.toastr.error(err.error || 'Error al pagar')
    });
  }

  rejectQuotation(id: number) {
    this.salesService.updateSaleStatus(id, 3).subscribe({
      next: () => { this.toastr.info('Cotización rechazada'); this.loadData(); },
      error: err => this.toastr.error(err.error || 'Error al rechazar')
    });
  }

  cancelQuotation(id: number) {
    this.salesService.updateSaleStatus(id, 4).subscribe({
      next: () => { this.toastr.warning('Cotización cancelada'); this.loadData(); },
      error: err => this.toastr.error(err.error || 'Error al cancelar')
    });
  }

  getStatusName(status: number): string {
    switch (status) {
      case 0: return 'En Proceso';
      case 1: return 'Aceptada';
      case 2: return 'Pagada';
      case 3: return 'Rechazada';
      case 4: return 'Cancelada';
      default: return 'Desconocido';
    }
  }
}