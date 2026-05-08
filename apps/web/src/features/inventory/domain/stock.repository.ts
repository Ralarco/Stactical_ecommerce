export interface IStockRepository {
  checkAvailability(variantId: string, quantity: number): Promise<boolean>;
  reserveStock(variantId: string, quantity: number): Promise<void>;
  releaseStock(variantId: string, quantity: number): Promise<void>;
  updateStock(variantId: string, availableStock: number, incomingStock?: number): Promise<void>;
}
