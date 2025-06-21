// cypress/e2e/carFlow.cy.ts

// 1. Оголошення кастомних команд прямо в тесті
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       selectBrand(brand: string): Chainable<void>;
//       selectModel(model: string): Chainable<void>;
//     }
//   }
// }

// 2. Реєстрація команд
Cypress.Commands.add('selectBrand', (brand: string) => {
  cy.get(`[data-testid="brand-${brand}"]`).click();
});

Cypress.Commands.add('selectModel', (model: string) => {
  cy.get(`[data-testid="model-${model}"]`).click();
});

Cypress.Commands.add('selectGeneration', (generation: string) => {
  cy.get(`[data-testid="generation-${generation}"]`).click();
});
Cypress.Commands.add('selectSpecification', (specification: string) => {
  cy.get(`[data-testid="specification-${specification}"]`).click();
});

describe('Car Catalog Flow', () => {
  it('should navigate from brand to specifications', () => {
    cy.visit('/');
    
    cy.selectBrand('Toyota');
    cy.url().should('include', '/models/388/Toyota');
     cy.contains('h2', 'Toyota models').should('exist');
    
    cy.selectModel('Camry');
    cy.url().should('include', '/generation/3615/Toyota-Camry');
    cy.contains('h2', 'Toyota-Camry generations').should('exist');
     const expectedGenerationsCount = 25; 
    cy.get('[data-testid^="generation-"]').should('have.length', expectedGenerationsCount);
    cy.get('[data-testid^="generation-"]').each(($generation) => {
  cy.wrap($generation).within(() => {
    cy.get('.page_generation__name__9eYJW').should('not.be.empty');
    cy.get('.page_generation__power__3V3up').should('contain', 'Hp');
  });
});
    cy.selectGeneration('Toyota Camry VIII (XV70)');
    cy.url().should('include', '/specifications/10066/toyota-camry-viii-xv70');
     const expectedSpecificationsCount = 7; 
    cy.get('[data-testid^="specification-"]').should('have.length', expectedSpecificationsCount);
    cy.selectSpecification('2.5 (218 Hp) Hybrid e-CVT');
    cy.url().should('include', '/characteristics/47142/25-218-hp-hybrid-e-cvt');
    cy.contains('h2', 'Toyota Camry VIII (XV70)2.5 (218 Hp) Hybrid e-CVT 2018 year — 2020 year').should('exist');
  });

it('should validate generations sorting by end year', () => {
  cy.visit('/generation/3615/Toyota-Camry');
  let prevYers=2025;
  const MAX_YEAR_DIFF = 2;
  cy.get('[data-testid^="generation-"]').each(($gen) => {
     cy.wrap($gen).within(() => {
    cy.get('.page_generation__name__9eYJW.page_red_col__aQv_3, .page_generation__name__9eYJW.page_green_col__IvJmF')
      .invoke('text')
      .then((text) => {
        const years = text.trim(); 
        if(years.length>10){
const endYear = parseInt(years.slice(-4));
            expect(endYear).to.be.at.most(prevYers+MAX_YEAR_DIFF);
            prevYers = endYear;
        }
      });
  });
  })
});

it('should complete search flow with extended waits', () => {
  // 1. Відкриваємо сторінку
  cy.visit('/advanced_search/filter', {
    onBeforeLoad(win) {
      // Ігноруємо помилку "Cannot read properties of undefined"
      cy.stub(win.console, 'error').callsFake((msg) => {
        if (msg.includes('Cannot read properties of undefined')) return;
        console.error(msg);
      });
    }
  });

  cy.intercept('GET', '/api/allbrand').as('getBrands');
  cy.wait('@getBrands', { timeout: 20000 });

  cy.get('[placeholder="Select brand"]')
    .should('be.visible')
    .click({ force: true });

  cy.get('.hintSearchFormListForAdvance_hintList__cdzpG ul', { timeout: 15000 })
    .should('exist')
    .find('li')
    .should('have.length.gt', 0)
    .contains('Toyota')
    .click({ force: true });

  cy.get('[placeholder="Enter model"]', { timeout: 15000 })
    .should('be.enabled')
    .click({ force: true });

   cy.get('[data-testid="loading-spinner"]', { timeout: 10000 }).should('not.exist');

//   // 8. Чекаємо на рендер списку моделей
  cy.get('.hintSearchFormListForAdvance_hintList__cdzpG ul li', { timeout: 15000 })
    .should('exist')
    .contains('Camry')
    .click({ force: true });

cy.get('button.AdvancedSearchForm_searchButton__EqsTr') // Точний селектор з вашого коду
    .should('be.visible')
    .and('contain', '🔍 Search') // Додаткова перевірка тексту
    .click({ force: true });

  // 6. Перевірка результатів
  cy.url({ timeout: 30000 }).should('include', '/advanced_search/filter?brand_name=Toyota&model_name=Camry&page=1');
  cy.get('.advancedSearchList_specification__item__pF9sS', { timeout: 15000 })
  .should('exist')
  .and('be.visible')
  .and('have.length.gt', 0);
});

});
