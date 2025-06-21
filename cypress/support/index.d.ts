export {}; // Це робить файл модулем

declare global {
   namespace Cypress {
    interface Chainable {
      selectBrand(brand: string): Chainable<void>;
      selectModel(model: string): Chainable<void>;
      selectGeneration(generation: string): Chainable<void>;
      selectSpecification(specification: string): Chainable<void>;
    }
  }
}
