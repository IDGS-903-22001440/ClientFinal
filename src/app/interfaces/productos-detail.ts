export interface ProductosDetail {
  TotalProductos: number;
  ProductosBajoStock: ProductoStock[];
  StockPorCategoria: CategoriaStock[];
  ProductosMasCaros: ProductoPrecio[];
}

export interface ProductoStock {
  Id: number;
  Nombre: string;
  Stock: number;
}

export interface CategoriaStock {
  Categoria: string;
  StockTotal: number;
}

export interface ProductoPrecio {
  Nombre: string;
  Precio: number;
  Categoria: string;
}