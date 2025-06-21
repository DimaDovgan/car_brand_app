import React from 'react';
import { render, screen, fireEvent, waitFor ,within} from '@testing-library/react';
import '@testing-library/jest-dom';
import {AdvancedSearchForm} from '../../../app/ui/AdvancedSearchForm';
import { Filter } from '../../../app/lib/serializeFiltersURL';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';


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
  

  
  it('updates powerRange.from when input changes', () => {
    const mockOnFilterChange = jest.fn();

    const { getByLabelText,getByPlaceholderText,getAllByPlaceholderText } = renderWithQueryClient(
      <AdvancedSearchForm
        filter={mockFilter}
        onFilterChange={mockOnFilterChange}
        onSearch={jest.fn()}
      />
    );
const inputs = getAllByPlaceholderText('From');
// припустимо, поле Power — це друге з трьох:
const powerFromInput = inputs[1];
    // const input = getByPlaceholderText('From'); // або getByPlaceholderText / getByTestId

    fireEvent.change(powerFromInput, { target: { value: '100' } });

    expect(mockOnFilterChange).toHaveBeenCalled();

    const updaterFn = mockOnFilterChange.mock.calls[0][0];
    const updatedFilter = updaterFn(mockFilter);

    expect(updatedFilter).toEqual({
      ...mockFilter,
      powerRange: { from: '100', to: '' },
    });
  });


   

  it('handles brand input change and shows dropdown', () => {
  const mockOnFilterChange = jest.fn();
  
  renderWithQueryClient(
    <AdvancedSearchForm
      filter={mockFilter}
      onFilterChange={mockOnFilterChange}
      onSearch={jest.fn()}
    />
  );

  const brandInput = screen.getByPlaceholderText('Select brand');
  fireEvent.change(brandInput, { target: { value: 'Toyota' } });

  expect(mockOnFilterChange).toHaveBeenCalledWith({
    ...mockFilter,
    brand: 'Toyota',
    model: '',
    modelId: ''
  });
});

it('handles model input change when brand is selected', () => {
    const mockOnFilterChange = jest.fn();
    const filterWithBrand = { ...mockFilter, brand: 'Toyota', brandId: '1' };
    
    renderWithQueryClient(
      <AdvancedSearchForm
        filter={filterWithBrand}
        onFilterChange={mockOnFilterChange}
        onSearch={jest.fn()}
      />
    );

    const modelInput = screen.getByPlaceholderText('Enter model');
    fireEvent.change(modelInput, { target: { value: 'Corolla' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...filterWithBrand,
      model: 'Corolla'
    });
  });

   it('disables model input when brand is not selected', () => {
    renderWithQueryClient(
      <AdvancedSearchForm
        filter={mockFilter}
        onFilterChange={jest.fn()}
        onSearch={jest.fn()}
      />
    );

    const modelInput = screen.getByPlaceholderText('Enter model');
    expect(modelInput).toBeDisabled();
  });

  it('toggles body type selection', () => {
    const mockOnFilterChange = jest.fn();
    
    renderWithQueryClient(
      <AdvancedSearchForm
        filter={mockFilter}
        onFilterChange={mockOnFilterChange}
        onSearch={jest.fn()}
      />
    );

    // Open body type dropdown
    const bodyTypeInput = screen.getByPlaceholderText('Select body types');
    fireEvent.click(bodyTypeInput);

    // Select a body type
    const sedanCheckbox = screen.getByLabelText('Sedan');
    fireEvent.click(sedanCheckbox);

    // Check that the filter was updated
    const updaterFn = mockOnFilterChange.mock.calls[0][0];
    const updatedFilter = updaterFn(mockFilter);
    expect(updatedFilter.bodyType).toEqual(['Sedan']);
  });


    it('handles year range selection', () => {
    const mockOnFilterChange = jest.fn();
    
    const { getAllByPlaceholderText } = renderWithQueryClient(
      <AdvancedSearchForm
        filter={mockFilter}
        onFilterChange={mockOnFilterChange}
        onSearch={jest.fn()}
      />
    );

    // Open year from dropdown
    const yearFromInput = getAllByPlaceholderText('1910')[0];
    fireEvent.click(yearFromInput);

    // Select a year
    const year2020 = screen.getByText('2020');
    fireEvent.click(year2020);

    // Check that the filter was updated
    const updaterFn = mockOnFilterChange.mock.calls[0][0];
    const updatedFilter = updaterFn(mockFilter);
    expect(updatedFilter.yearsRange.from).toBe('2020');
    expect(updatedFilter.yearsRange.to).toBe('');
  });

 


it('handles fuel type selection', () => {
    const mockOnFilterChange = jest.fn();
    
    renderWithQueryClient(
      <AdvancedSearchForm
        filter={mockFilter}
        onFilterChange={mockOnFilterChange}
        onSearch={jest.fn()}
      />
    );

    // Select Petrol fuel type
    const petrolButton = screen.getByRole('button', { name: 'Petrol' });
    fireEvent.click(petrolButton);

    // Check that the filter was updated
    const updaterFn = mockOnFilterChange.mock.calls[0][0];
    const updatedFilter = updaterFn(mockFilter);
    expect(updatedFilter.selectedFuel).toEqual(['Petrol']);
  });

 it('handles engine capacity range changes', () => {
    const mockOnFilterChange = jest.fn();
    
    renderWithQueryClient(
      <AdvancedSearchForm
        filter={mockFilter}
        onFilterChange={mockOnFilterChange}
        onSearch={jest.fn()}
      />
    );

    const engineInputs = screen.getAllByPlaceholderText('From');
    const engineFromInput = engineInputs[0];

    fireEvent.change(engineFromInput, { target: { value: '1.6' } });
expect(mockOnFilterChange).toHaveBeenCalled();
    // Check that the filter was updated
    const updaterFn = mockOnFilterChange.mock.calls[0][0];
    expect(mockOnFilterChange).toHaveBeenCalled();
    const updatedFilter = updaterFn(mockFilter);
    expect(updatedFilter.engineCapacityRange.from).toBe('1.6');
    expect(updatedFilter.engineCapacityRange.to).toBe('');
  });


 

  

   it('clears brand and model when clear button is clicked', () => {
  const mockOnFilterChange = jest.fn();
  const filterWithBrand = { 
    ...mockFilter, 
    brand: 'Toyota',
    brandId: '1',
    model: 'Corolla',
    modelId: '101'
  };
  
  renderWithQueryClient(
    <AdvancedSearchForm
      filter={filterWithBrand}
      onFilterChange={mockOnFilterChange}
      onSearch={jest.fn()}
    />
  );
  const brandField = screen.getByText('Brand').parentElement;
const clearBrandButton = within(brandField).getByText('×');
fireEvent.click(clearBrandButton);

  expect(mockOnFilterChange).toHaveBeenCalledWith({
    ...mockFilter,
    brand: '',
    brandId: '',
    model: '',
    modelId: ''
  });
});


it('handles fuel consumption mode selection', () => {
    const mockOnFilterChange = jest.fn();
    
    renderWithQueryClient(
      <AdvancedSearchForm
        filter={mockFilter}
        onFilterChange={mockOnFilterChange}
        onSearch={jest.fn()}
      />
    );

    const cityModeButton = screen.getByRole('button', { name: 'City' });
    fireEvent.click(cityModeButton);
    const updaterFn = mockOnFilterChange.mock.calls[0][0];
    const updatedFilter = updaterFn(mockFilter);
    expect(updatedFilter.fuelConsumption.mode).toBe('City');
  });


  beforeEach(() => {
  window.alert = jest.fn(); });


});








  


