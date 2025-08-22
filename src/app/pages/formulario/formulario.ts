import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateCotizacionDto, SaleDetail, SaleDto, SalesService } from '../../services/Sales';
import { CommonModule } from '@angular/common';
import { ProductoService, Producto_Interface, Categoria_Interface } from '../../services/producto';
import { Auth } from '../../services/auth';
import { RouterLink } from '@angular/router';

interface SensorModule {
  id: number;           
  name: string;         
  product: Producto_Interface; 
  selected: boolean;    
  formGroup?: FormGroup; // <-- añadimos esto
}

@Component({
  selector: 'app-formulario',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './formulario.html',
  styleUrl: './formulario.css'
})
export class Formulario implements OnInit {
  saleForm!: FormGroup;
  sensorModules: SensorModule[] = [];


  // Propiedades para modal
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
    private fb: FormBuilder,
    private cotizacionService: SalesService,
    private productoService: ProductoService,
    private authService: Auth
  ) {}

  async ngOnInit() {
    const user = this.authService.getUserDetail();

    this.saleForm = this.fb.group({
      userId: [user?.id || '', Validators.required],
      fullName: [user?.fullName || '', Validators.required],
      email: [user?.email || '', [Validators.required, Validators.email]],
      direccion: ['', Validators.required],
      saleDetails: this.fb.array([])
    });

    const productos = await this.productoService.obtenerProductos();
    this.sensorModules = [
      { id: 2, name: 'Temperatura', product: productos.find(p => p.id === 2)!, selected: false },
      { id: 4, name: 'Ruido', product: productos.find(p => p.id === 4)!, selected: false },
      { id: 5, name: 'Basura', product: productos.find(p => p.id === 5)!, selected: false }
    ];
  }

  get saleDetails(): FormArray {
    return this.saleForm.get('saleDetails') as FormArray;
  }

  onModuleCheckboxChange(module: SensorModule, event: any) {
    module.selected = event.target.checked;
    if (module.selected) {
      const fg = this.fb.group({
        productId: [module.product.id, Validators.required],
        productName: [module.product.nombre],
        price: [module.product.precio],
        quantity: [1, [Validators.required, Validators.min(1)]]
      });
      this.saleDetails.push(fg);
      module.formGroup = fg;
    } else {
      if (module.formGroup) {
        const index = this.saleDetails.controls.indexOf(module.formGroup);
        if (index >= 0) {
          this.saleDetails.removeAt(index);
        }
        module.formGroup = undefined;
      }
    }
  }

  submitForm() {
  if (this.saleForm.invalid || this.saleDetails.length === 0) {
    this.saleForm.markAllAsTouched();
    alert('Por favor completa el formulario y selecciona al menos un sensor.');
    return;
  }

  // Construir el payload según CreateCotizacionDto
  const payload: CreateCotizacionDto = {
    userId: this.saleForm.value.userId,
    direccion: this.saleForm.value.direccion,
    detalleVenta: this.saleDetails.value.map((d: any) => ({
      productId: d.productId,
      quantity: d.quantity,
      unitPrice: d.price
    }))
  };

  this.cotizacionService.createCotizacion(payload).subscribe({
    next: () => {
      alert('Cotización creada exitosamente.');
      this.saleForm.reset();
      this.saleDetails.clear();
      this.sensorModules.forEach(m => m.selected = false);
    },
    error: err => {
      console.error('Error al crear cotización:', err);
      alert('Error al crear cotización.');
    }
  });
}



  async calculateCotizacion() {
  // Obtener todos los productos del service
  const productos = await this.productoService.obtenerProductos();

  // Mapear los productos seleccionados en el formulario
  const saleDetails = this.saleDetails.value.map((d: any) => {
    const prod = productos.find(p => p.id === d.productId)!;
    return {
      productId: d.productId,
      nombre: prod.nombre,
      cantidad: d.quantity,
      precio: prod.precio
    };
  });

  const sensorIds = [2, 3, 4, 5];
  const totalSensores = saleDetails
      .filter((d: any) => sensorIds.includes(d.productId))
      .reduce((sum: number, d: any) => sum + d.cantidad, 0);

  // Agregar ESP32
  const esp32 = productos.find(p => p.id === 6);
  const detallesFinal = [...saleDetails];
  if (esp32) {
    detallesFinal.push({ productId: esp32.id, nombre: esp32.nombre, cantidad: 1, precio: esp32.precio });
  }

  // Agregar cables (1 por cada 2 sensores)
  const cablesQty = Math.floor(totalSensores / 2);
  const cables = productos.find(p => p.id === 1);
  if (cables && cablesQty > 0) {
    detallesFinal.push({ productId: cables.id, nombre: cables.nombre, cantidad: cablesQty, precio: cables.precio });
  }

  // Agregar resistencias (1 por cada 5 sensores)
  const resistenciasQty = Math.floor(totalSensores / 5);
  const resistencias = productos.find(p => p.id === 8);
  if (resistencias && resistenciasQty > 0) {
    detallesFinal.push({ productId: resistencias.id, nombre: resistencias.nombre, cantidad: resistenciasQty, precio: resistencias.precio });
  }

  // Calcular totales
  const subtotal = detallesFinal.reduce((sum, d) => sum + d.precio * d.cantidad, 0);
  const extraSensores = Math.min(totalSensores * 2000, 20000);
  const extraPorcentaje = subtotal * 0.25;
  const totalFinal = subtotal + extraSensores + extraPorcentaje;

  // Guardar info para mostrar en el modal
  this.cotizacionPreview = {
    subtotal,
    extraSensores,
    extraPorcentaje,
    totalFinal,
    detalles: detallesFinal
  };

  this.showModal = true;
}

  // Método auxiliar para obtener precio de un producto por id
  getPrecioProducto(productId: number): number {
    const prod = this.sensorModules.find(m => m.product.id === productId)?.product;
    return prod ? prod.precio : 0;
  }
}