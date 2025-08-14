import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Proveedor } from '../../services/Proveedor';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Categoria_Interface } from '../../services/producto';


@Component({
  selector: 'app-proveedor-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './proveedor-modal.html',
  styleUrl: './proveedor-modal.css'
})
export class ProveedorModal implements OnChanges {
  @Input() proveedor: Proveedor | null = null;
  @Input() categorias: Categoria_Interface[] = [];
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Proveedor>();

  nombre: string = '';
  telefono: string = '';
  email: string = '';
  categoriaId: number | null = null;

  ngOnChanges() {
    if (this.proveedor) {
      this.nombre = this.proveedor.nombre || '';
      this.telefono = this.proveedor.telefono || '';
      this.email = this.proveedor.email || '';
      this.categoriaId = this.proveedor.categoriaId;
    } else {
      this.nombre = '';
      this.telefono = '';
      this.email = '';
      this.categoriaId = null;
    }
  }

  guardar() {
    if (!this.nombre || !this.email || this.categoriaId === null) return;

    const proveedor: Proveedor = {
      id: this.proveedor?.id || 0,
      nombre: this.nombre.trim(),
      telefono: this.telefono.trim(),
      email: this.email.trim(),
      categoriaId: this.categoriaId
    };

    this.onSave.emit(proveedor);
  }

  cerrar() {
    this.onClose.emit();
  }
}