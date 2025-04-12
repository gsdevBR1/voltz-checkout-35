
export interface CrossSell {
  id: string;
  crossSellProductId: string;
  crossSellProductName: string;
  mainProductIds: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CrossSellFormData {
  crossSellProductId: string;
  mainProductIds: string[];
}
