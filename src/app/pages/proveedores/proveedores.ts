import { Component, inject, OnInit } from '@angular/core';
import { ProveedorService, Proveedor } from '../../services/Proveedor';
import { Categoria_Interface, ProductoService } from '../../services/producto';
import { ProveedorModal } from '../../components/proveedor-modal/proveedor-modal';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-proveedores',
  imports: [ProveedorModal, MatIconModule, CommonModule],
  templateUrl: './proveedores.html',
  styleUrl: './proveedores.css'
})
export class Proveedores implements OnInit {
  proveedores: Proveedor[] = [];
  categorias: Categoria_Interface[] = [];
  selectedProveedor: Proveedor | null = null;

  productoService = inject(ProductoService);

  constructor(private proveedorService: ProveedorService) {}

  ngOnInit() {
    this.selectedProveedor = null;
    this.cargarProveedores();
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.productoService.getCategorias().subscribe({
      next: (data) => (this.categorias = data),
      error: (err) => console.error('Error al cargar categorías', err),
    });
  }

  cargarProveedores() {
    this.proveedorService.getAll().subscribe({
      next: (data) => (this.proveedores = data),
      error: (err) => console.error('Error al cargar proveedores', err),
    });
  }

  openEdit(proveedor: Proveedor) {
    this.selectedProveedor = { ...proveedor }; // Clonar para evitar mutaciones directas
  }

  openCreateProveedor() {
    this.selectedProveedor = {
      id: 0,
      nombre: '',
      email: '',
      telefono: '',
      categoriaId: 0
    };
  }

  closeProveedorModal() {
    this.selectedProveedor = null;
  }

  saveProveedor(proveedor: Proveedor) {
    if (!proveedor.id || proveedor.id === 0) {
      // Crear nuevo proveedor
      this.proveedorService.create(proveedor).subscribe(() => {
        this.cargarProveedores();
        this.closeProveedorModal();
      });
    } else {
      // Actualizar proveedor existente
      this.proveedorService.update(proveedor.id, proveedor).subscribe(() => {
        this.cargarProveedores();
        this.closeProveedorModal();
      });
    }
  }

  trackById(index: number, item: Proveedor): number {
    return item.id;
  }

  deleteProveedor(id: number) {
    this.proveedorService.delete(id).subscribe({
      next: () => {
        console.log('Proveedor eliminado');
        this.cargarProveedores();
      },
      error: (err) => console.error('Error al eliminar proveedor', err)
    });
  }

  getNombreCategoria(categoriaId: number): string {
    const categoria = this.categorias.find(cat => cat.id === categoriaId);
    return categoria ? categoria.nombre : '-';
  }
}
