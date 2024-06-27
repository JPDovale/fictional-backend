export abstract class SalesRepository {
  abstract getPrices(): Promise<string[]>
}
