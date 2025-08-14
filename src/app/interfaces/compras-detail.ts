export interface ComprasDetail {
  TotalCompras: number;
  TotalInvertido: number;
  ComprasPorDia: CompraDiaria[];
  ProveedoresFrecuentes: ProveedorFrecuente[];
  ProductosMasComprados: ProductoComprado[];
}

export interface CompraDiaria {
  Fecha: string;         // Puedes convertirlo a Date si lo necesitas
  Total: number;
}

export interface ProveedorFrecuente {
  Proveedor: string;
  ComprasRealizadas: number;
  TotalInvertido: number;
}

export interface ProductoComprado {
  Producto: string;
  CantidadTotal: number;
  MontoTotal: number;
}