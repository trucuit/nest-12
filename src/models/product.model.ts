export class Product {
  id?: string;
  categoryId?: number;
  productName?: string;
  price?: number;

  constructor({
    id,
    categoryId,
    productName,
    price,
  }: {
    id?: string;
    categoryId?: number;
    productName?: string;
    price?: number;
  }) {
    this.id = id;
    this.categoryId = categoryId;
    this.productName = productName;
    this.price = price;
  }
}
