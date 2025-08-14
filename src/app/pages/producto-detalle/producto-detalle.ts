import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ProductoService } from '../../services/producto';
import { ComentarioInterface, ComentarioService } from '../../services/comentario'; // Asegúrate de tenerlo
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-producto-detalle',
  imports: [FormsModule, CommonModule],
  templateUrl: './producto-detalle.html',
  styleUrl: './producto-detalle.css'
})
export class ProductoDetalle  implements OnInit {
  producto: any;
  cantidad = 1;
  ordenActual: 'fecha' | 'likes' | 'dislikes' | 'usuario' = 'fecha';

  comentarios: ComentarioInterface[] = [];
  nuevoComentario: string = '';

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private comentarioService: ComentarioService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productoService.getProductoPorId(id).subscribe({
      next: (data) => {
        this.producto = data;
        this.cargarComentarios(); // ← aquí cargamos los comentarios
      },
      error: (err) => {
        console.error('Error al obtener producto', err);
        this.router.navigate(['/']);
      }
    });
  }

  restarCantidad() {
    if (this.cantidad > 1) this.cantidad--;
  }

  sumarCantidad() {
    if (this.producto && this.cantidad < this.producto.stock) {
      this.cantidad++;
    }
  }

  agregarAlCarrito() {
  const itemCarrito = {
    producto: this.producto,
    cantidad: this.cantidad
  };

  const carritoActual = JSON.parse(localStorage.getItem('carrito') || '[]');

  // Buscar si el producto ya existe en el carrito
  const index = carritoActual.findIndex((item: any) => item.producto.id === this.producto.id);

  if (index !== -1) {
    // Producto ya existe, sumar cantidad pero sin superar el stock
    const nuevaCantidad = carritoActual[index].cantidad + this.cantidad;
    carritoActual[index].cantidad = Math.min(nuevaCantidad, this.producto.stock);
  } else {
    // Producto no existe, agregar nuevo
    carritoActual.push(itemCarrito);
  }

  localStorage.setItem('carrito', JSON.stringify(carritoActual));
  alert('Producto agregado al carrito');
}

  volver() {
    this.location.back();
  }

  // --- NUEVO MÉTODO PARA AGREGAR PRODUCTOS AL CARRITO ---



  // ====== COMENTARIOS Y VOTOS ======

  cargarComentarios() {
  this.comentarioService.obtenerComentarios(this.producto.id).subscribe({
    next: (data) => {
      this.comentarios = this.ordenarComentarios(data);
    },
    error: (err) => {
      console.error('Error al obtener comentarios', err);
    }
  });
}

  cambiarOrden(nuevoOrden: 'fecha' | 'likes' | 'dislikes' | 'usuario') {
    this.ordenActual = nuevoOrden;
    this.comentarios = this.ordenarComentarios(this.comentarios);
  }

  crearComentario() {
    const contenido = this.nuevoComentario.trim();
    if (!contenido) return;

    this.comentarioService.crearComentario(this.producto.id, contenido).subscribe({
      next: () => {
        this.nuevoComentario = '';
        this.cargarComentarios();
      },
      error: (err) => {
        console.error('Error al crear comentario', err);
      }
    });
  }

  votar(comentarioId: number, esLike: boolean) {
    this.comentarioService.votarComentario(comentarioId, esLike).subscribe({
      next: () => this.cargarComentarios(),
      error: (err) => console.error('Error al votar', err)
    });
  }

  private ordenarComentarios(comentarios: ComentarioInterface[]): ComentarioInterface[] {
  // Función comparadora para el orden de comentarios padre y respuestas
  const comparador = (a: ComentarioInterface, b: ComentarioInterface): number => {
    switch (this.ordenActual) {
      case 'fecha':
        return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
      case 'likes':
        if (a.likes === b.likes) return a.dislikes - b.dislikes;
        return b.likes - a.likes;
      case 'dislikes':
        if (a.dislikes === b.dislikes) return a.likes - b.likes;
        return b.dislikes - a.dislikes;
      case 'usuario':
        const usuarioA = (a.usuario || '').toLowerCase();
        const usuarioB = (b.usuario || '').toLowerCase();
        if (usuarioA < usuarioB) return -1;
        if (usuarioA > usuarioB) return 1;
        return 0;
      default:
        return 0;
    }
  };

  // Ordenar comentarios padres
  const comentariosOrdenados = comentarios.slice().sort(comparador);

  // Ordenar recursivamente las respuestas de cada comentario
  comentariosOrdenados.forEach(c => {
    if (c.respuestas && c.respuestas.length > 0) {
      c.respuestas = this.ordenarComentarios(c.respuestas);
    }
  });

  return comentariosOrdenados;
}
}