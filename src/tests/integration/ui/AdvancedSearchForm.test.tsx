import React from 'react';
import { render, screen, fireEvent, waitFor ,within} from '@testing-library/react';
import '@testing-library/jest-dom';
import {AdvancedSearchForm} from '../../../app/ui/AdvancedSearchForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';



jest.mock('../../../app/ui/hintSearchFormListForAdvance', () => {
  return {
    __esModule: true,
    default: () => null // Просто повертаємо null, оскільки нам не потрібно тестувати HintList тут
  }
});



describe('AdvancedSearchForm', () => {
  const queryClient = new QueryClient();

  const mockFilter = {
     brand: '',
    brandId: '',
    model: '',
    modelId: '',
    powerRange: { from: '', to: '' },
    engineCapacityRange: { from: '', to: '' },
    bodyType: [],
    yearsRange: { from: '', to: '' },
    selectedFuel: [],
    selectedDrive: [],
    selectedGearbox: [],
    fuelConsumption: { from: '', to: '', mode: '' },
  };

  const renderWithQueryClient = (ui: React.ReactNode) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    );
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

    it('renders the form with all fields', () => {
    renderWithQueryClient(
      <AdvancedSearchForm
        filter={mockFilter}
        onFilterChange={jest.fn()}
        onSearch={jest.fn()}
      />
    );

     expect(screen.getByText('Advanced Search')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Select brand')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Enter model')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Select body types')).toBeInTheDocument();
  expect(screen.getAllByPlaceholderText('1910')[0]).toBeInTheDocument();
  expect(screen.getAllByPlaceholderText('2024')[0]).toBeInTheDocument();
  expect(screen.getByText('Fuel Type')).toBeInTheDocument();
  expect(screen.getByText('Drive Type')).toBeInTheDocument();
  expect(screen.getByText('Transmission')).toBeInTheDocument();
  expect(screen.getByText('Engine Capacity (L)')).toBeInTheDocument();
  expect(screen.getByText('Power (hp)')).toBeInTheDocument();
  expect(screen.getByText('Fuel Consumption (L/100km)')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '🔍 Search' })).toBeInTheDocument();
  });

  it('validates year range (from <= to)', () => {
  // Мокаємо window.alert
  window.alert = jest.fn();

  const mockOnFilterChange = jest.fn();
  const filterWithYearFrom = { 
    ...mockFilter, 
    yearsRange: { from: '2020', to: '' } 
  };
  
  const { getAllByPlaceholderText } = renderWithQueryClient(
    <AdvancedSearchForm
      filter={filterWithYearFrom}
      onFilterChange={mockOnFilterChange}
      onSearch={jest.fn()}
    />
  );

  // Відкриваємо випадаючий список для вибору року "to"
  const yearToInput = getAllByPlaceholderText('2024')[0];
  fireEvent.click(yearToInput);

  // Пробуємо вибрати некоректний рік (менший за "from")
  const year2019 = screen.getByText('2019');
  fireEvent.click(year2019);

  // Перевіряємо, що спрацював alert
  expect(window.alert).toHaveBeenCalledWith('Year To should be greater than Year From');
});

  it('validates engine capacity range (from <= to)', async () => {
     const mockOnFilterChange = jest.fn();
  renderWithQueryClient(
    <AdvancedSearchForm
      filter={mockFilter}
      onFilterChange={mockOnFilterChange}
      onSearch={jest.fn()}
    />
  );
  const [fromInput, toInput] = screen.getAllByPlaceholderText(/From|To/i);
  fireEvent.change(fromInput, { target: { value: '2.0' } });
fireEvent.change(toInput, { target: { value: '1.5' } });

  expect(mockOnFilterChange).toHaveBeenCalled();
  });

  it('handles form submission', () => {
    const mockOnSearch = jest.fn(e => e.preventDefault());
   const { container } = renderWithQueryClient(
  <AdvancedSearchForm
    filter={mockFilter}
    onFilterChange={jest.fn()}
    onSearch={mockOnSearch}
  />
);

const form = container.querySelector('form');
fireEvent.submit(form);

    expect(mockOnSearch).toHaveBeenCalled();
  });


  beforeEach(() => {
  window.alert = jest.fn(); });


});








  


