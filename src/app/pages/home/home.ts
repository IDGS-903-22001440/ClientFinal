import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { ProductoService, Producto_Interface } from '../../services/producto';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})

export class Home implements OnInit {
  authService = inject(Auth);
  matSnackBar = inject(MatSnackBar);
  productos: Producto_Interface[] = [];
  productosMitad1: any[] = [];
  productosMitad2: any[] = [];


  isLoggedIn() {
    return this.authService.isLoggedIn();
  }
  
  constructor(
    private productoService: ProductoService,
    private router: Router,
  ) {}


  async ngOnInit(): Promise<void> {
    const user = this.authService.getUserDetail();
    if (user?.roles.includes('Admin')) {
      // Redirigir automáticamente
      this.router.navigate(['/dashboard']);}
  try {
    this.productos = await this.productoService.obtenerProductos();

    if (!this.isLoggedIn()) {
      const mitad = Math.ceil(this.productos.length / 2);
      this.productosMitad1 = this.productos.slice(0, mitad);
      this.productosMitad2 = this.productos.slice(mitad);
    } else {
      // Si está logueado, no necesitas estas dos variables, las limpias por seguridad
      this.productosMitad1 = [];
      this.productosMitad2 = [];
    }
  } catch (err) {
    console.error('Error al cargar productos', err);
  }
}


  irADescripcion(productoId: number) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/producto', productoId]);
    } else {
      this.router.navigate(['/login']);
    }
  }



  currentIndex = 0;
autoSlideInterval: any;

ngAfterViewInit(): void {
  this.startAutoSlide();
}

startAutoSlide() {
  this.autoSlideInterval = setInterval(() => {
    this.nextSlide();
  }, 3000);
}

nextSlide() {
  if (this.productos.length === 0) return;
  this.currentIndex = (this.currentIndex + 1) % Math.min(this.productos.length, 4);
}

prevSlide() {
  if (this.productos.length === 0) return;
  this.currentIndex =
    (this.currentIndex - 1 + Math.min(this.productos.length, 5)) %
    Math.min(this.productos.length, 5);
}

goToSlide(index: number) {
  this.currentIndex = index;
  clearInterval(this.autoSlideInterval);
  this.startAutoSlide();
}

  irADetalle(id: number) {
  if (this.authService.isLoggedIn()) {
    this.router.navigate(['/producto', id]);
  } else {
    this.router.navigate(['/login'], { queryParams: { redirectTo: `/producto/${id}` } });
  }
}
}