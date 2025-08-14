import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SaleDto, SalesService } from '../../services/Sales';
import { CommonModule } from '@angular/common';
import { ProductoService, Producto_Interface, Categoria_Interface } from '../../services/producto';
import { Auth } from '../../services/auth';

interface SensorModule {
  id: number;           
  name: string;         
  product: Producto_Interface; 
  selected: boolean;    
  formGroup?: FormGroup; // <-- añadimos esto
}

@Component({
  selector: 'app-formulario',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './formulario.html',
  styleUrl: './formulario.css'
})
export class Formulario implements OnInit {
  saleForm!: FormGroup;
  sensorModules: SensorModule[] = [];

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

    const direccion = this.saleForm.value.direccion;
    const userId = this.saleForm.value.userId;

    const payload = {
      userId: userId,
      direccion: direccion,
      saleDetails: this.saleDetails.value.map((d: any) => ({
        productId: d.productId,
        quantity: d.quantity,
        unitPrice: d.price
      }))
    };

    this.cotizacionService.createCotizacion(payload).subscribe({
      next: res => {
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
}