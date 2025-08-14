import { Component, OnInit } from '@angular/core';
import { ComentarioInterface, ComentarioService } from '../../services/comentario';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProductoService, Producto_Interface } from '../../services/producto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comments',
  imports: [CommonModule, FormsModule],
  templateUrl: './comments.html',
  styleUrl: './comments.css'
})
export class Comments implements OnInit {
  comentarios: ComentarioInterface[] = [];
  loading = false;
  errorMessage = '';

  productos: Producto_Interface[] = [];
  productoId: number = 0; // 0 o el primer producto por defecto

  ordenActual: string = 'fecha'; // <--- Agrega esta línea para declarar ordenActual

  constructor(
    private comentarioService: ComentarioService,
    private productoService: ProductoService
  ) {}


  async ngOnInit() {
    await this.cargarProductos();
    if (this.productos.length > 0) {
      this.productoId = this.productos[0].id;
      this.cargarComentariosPorFecha();  // cargar por fecha inicialmente
    }
  }

  async cargarProductos() {
    try {
      this.productos = await this.productoService.obtenerProductos();
    } catch (error) {
      console.error('Error al cargar productos:', error);
      this.errorMessage = 'Error al cargar productos';
    }
  }

  onProductoChange() {
  // Al cambiar de producto, recarga comentarios usando el orden actual
  switch (this.ordenActual) {
    case 'fecha':
      this.cargarComentariosPorFecha();
      break;
    case 'likes':
      this.cargarComentariosOrdenLikes();
      break;
    case 'dislikes':
      this.cargarComentariosOrdenDislikes();
      break;
    case 'usuario':
      this.cargarComentariosOrdenNombre();
      break;
    default:
      this.cargarComentariosPorFecha();
  }
}

  onOrdenChange(event: Event) {
  const selectElement = event.target as HTMLSelectElement;
  const valor = selectElement.value;

  switch (valor) {
    case 'fecha':
      this.cargarComentariosPorFecha();
      break;
    case 'likes':
      this.cargarComentariosOrdenLikes();
      break;
    case 'dislikes':
      this.cargarComentariosOrdenDislikes();
      break;
    case 'usuario':
      this.cargarComentariosOrdenNombre();
      break;
    default:
      this.cargarComentariosPorFecha();
  }
}

  cargarComentariosPorFecha() {
  if (!this.productoId) {
    this.comentarios = [];
    return;
  }
  this.loading = true;
  this.errorMessage = '';
  this.comentarioService.obtenerComentarios(this.productoId).subscribe({
    next: (data) => {
      // Filtrar comentarios eliminados
      this.comentarios = data.filter(c => !c.eliminado);
      this.loading = false;
    },
    error: (err) => {
      this.errorMessage = 'Error al cargar comentarios';
      console.error(err);
      this.loading = false;
    }
  });
}

  cargarComentariosOrdenLikes() {
    this.cargarComentariosYOrdenar((a, b) => {
      // Likes: mayor a menor
      if (a.likes === b.likes) {
        // Si likes igual, dislikes menor a mayor
        return a.dislikes - b.dislikes;
      }
      return b.likes - a.likes;
    });
  }

  cargarComentariosOrdenDislikes() {
    this.cargarComentariosYOrdenar((a, b) => {
      // Dislikes: mayor a menor
      if (a.dislikes === b.dislikes) {
        // Si dislikes igual, likes menor a mayor
        return a.likes - b.likes;
      }
      return b.dislikes - a.dislikes;
    });
  }

  cargarComentariosOrdenNombre() {
    this.cargarComentariosYOrdenar((a, b) => {
      const usuarioA = a.usuario?.toLowerCase() || '';
      const usuarioB = b.usuario?.toLowerCase() || '';
      if (usuarioA < usuarioB) return -1;
      if (usuarioA > usuarioB) return 1;
      return 0;
    });
  }

  private cargarComentariosYOrdenar(comparador: (a: ComentarioInterface, b: ComentarioInterface) => number) {
  if (!this.productoId) {
    this.comentarios = [];
    return;
  }
  this.loading = true;
  this.errorMessage = '';
  this.comentarioService.obtenerComentarios(this.productoId).subscribe({
    next: (data) => {
      // Filtrar comentarios eliminados antes de ordenar
      const filtrados = data.filter(c => !c.eliminado);
      this.comentarios = filtrados.sort(comparador);
      this.loading = false;
    },
    error: (err) => {
      this.errorMessage = 'Error al cargar comentarios';
      console.error(err);
      this.loading = false;
    }
  });
}

  eliminarComentario(id: number) {
    if (confirm('¿Seguro que quieres eliminar este comentario?')) {
      this.comentarioService.eliminarComentario(id).subscribe({
        next: () => this.cargarComentariosPorFecha(),
        error: (err) => {
          console.error(err);
          alert('Error al eliminar el comentario.');
        }
      });
    }
  }

  responderComentario(parentComentarioId: number) {
    const respuesta = prompt('Escribe tu respuesta:');
    if (respuesta && respuesta.trim() !== '') {
      this.comentarioService.crearComentario(this.productoId, respuesta.trim(), parentComentarioId)
        .subscribe({
          next: () => this.cargarComentariosPorFecha(),
          error: (err) => {
            console.error(err);
            alert('Error al enviar la respuesta.');
          }
        });
    }
  }
}