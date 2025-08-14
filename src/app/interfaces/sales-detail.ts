export interface SalesDetail {
  TotalSales: number;
  TotalRevenue: number;
  DailySales: DailySale[];
  TopProducts: TopProduct[];
}

export interface DailySale {
  Date: string;         // o Date si lo parseas
  Total: number;
}

export interface TopProduct {
  Product: string;
  QuantitySold: number;
  Revenue: number;
}