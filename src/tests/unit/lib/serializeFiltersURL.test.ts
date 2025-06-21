import { serializeFilters, deserializeFilters} from '../../../app/lib/serializeFiltersURL';

interface Filter {
  selectedFuel: string[];
  selectedDrive: string[];
  selectedGearbox: string[];
  yearsRange: { from: string; to: string };
  fuelConsumption: { from: string; to: string; mode: string };
  powerRange: { from: string; to: string };
  engineCapacityRange: { from: string; to: string };
  bodyType: string[];
  brand: string;
  model: string;
  brandId: string;
  modelId: string; 
}

describe('Filter Serialization Utilities', () => {
  const emptyFilter: Filter = {
    selectedFuel: [],
    selectedDrive: [],
    selectedGearbox: [],
    yearsRange: { from: '', to: '' },
    fuelConsumption: { from: '', to: '', mode: '' },
    powerRange: { from: '', to: '' },
    engineCapacityRange: { from: '', to: '' },
    bodyType: [],
    brand: '',
    model: '',
    brandId: '',
    modelId: ''
  };

  describe('serializeFilters', () => {
    it('should return empty string for empty filter', () => {
      expect(serializeFilters(emptyFilter)).toBe('');
    });

    it('should handle full reset flag', () => {
      expect(serializeFilters(emptyFilter, true)).toBe('full=true');
    });

    it('should serialize brand and model', () => {
      const filter = { ...emptyFilter, brand: 'Acura', model: 'NSX', brandId: '1', modelId: '2' };
      expect(serializeFilters(filter)).toBe('brand_name=Acura&model_name=NSX');
    });

    it('should serialize body type', () => {
      const filter = { ...emptyFilter, bodyType: ['Coupe'] };
      expect(serializeFilters(filter)).toBe('body=Coupe');
    });

    it('should serialize year range', () => {
      const filter = { ...emptyFilter, yearsRange: { from: '2011', to: '2020' } };
      expect(serializeFilters(filter)).toBe('year_from=2011&year_to=2020');
    });

    it('should serialize drive type with encoding', () => {
      const filter = { ...emptyFilter, selectedDrive: ['All wheel drive (4x4)'] };
      expect(serializeFilters(filter)).toBe('drive=All+wheel+drive+%284x4%29');
    });

    it('should serialize complete filter', () => {
      const filter: Filter = {
        ...emptyFilter,
        brand: 'Acura',
        model: 'NSX',
        bodyType: ['Coupe'],
        yearsRange: { from: '2011', to: '' },
        selectedFuel: ['Petrol'],
        selectedDrive: ['All wheel drive (4x4)'],
        selectedGearbox: ['Automatic'],
        engineCapacityRange: { from: '1.9', to: '' },
        powerRange: { from: '500', to: '' }
      };
      
      const expected = 'body=Coupe&year_from=2011&fuel=Petrol&drive=All+wheel+drive+%284x4%29&gearbox=Automatic&engine_from=1.9&power_from=500';
      expect(serializeFilters(filter)).toBe(expected);
    });
  });

  describe('deserializeFilters', () => {
    it('should return empty filter for empty params', () => {
      const params = new URLSearchParams();
      expect(deserializeFilters(params)).toEqual(emptyFilter);
    });

    it('should handle full reset', () => {
      const params = new URLSearchParams('full=true');
      expect(deserializeFilters(params)).toEqual(emptyFilter);
    });

    it('should deserialize brand and model', () => {
      const params = new URLSearchParams('brand_name=Acura&model_name=NSX');
      const expected = { ...emptyFilter, brand: 'Acura', model: 'NSX' };
      expect(deserializeFilters(params)).toEqual(expected);
    });

    it('should deserialize single body type', () => {
      const params = new URLSearchParams('body=Coupe');
      const expected = { ...emptyFilter, bodyType: ['Coupe'] };
      expect(deserializeFilters(params)).toEqual(expected);
    });

    it('should deserialize multiple body types', () => {
      const params = new URLSearchParams('body=Coupe,Sedan');
      const expected = { ...emptyFilter, bodyType: ['Coupe', 'Sedan'] };
      expect(deserializeFilters(params)).toEqual(expected);
    });

    it('should deserialize year range', () => {
      const params = new URLSearchParams('year_from=2011');
      const expected = { ...emptyFilter, yearsRange: { from: '2011', to: '' } };
      expect(deserializeFilters(params)).toEqual(expected);
    });

    it('should deserialize encoded drive type', () => {
      const params = new URLSearchParams('drive=All+wheel+drive+%284x4%29');
      const expected = { ...emptyFilter, selectedDrive: ['All wheel drive (4x4)'] };
      expect(deserializeFilters(params)).toEqual(expected);
    });

    it('should deserialize complete URL', () => {
      const params = new URLSearchParams(
        'brand_name=Acura&model_name=NSX&body=Coupe&year_from=2011&fuel=Petrol&drive=All+wheel+drive+%284x4%29&gearbox=Automatic&engine_from=1.9&power_from=500'
      );
      
      const expected: Filter = {
        ...emptyFilter,
        brand: 'Acura',
        model: 'NSX',
        bodyType: ['Coupe'],
        yearsRange: { from: '2011', to: '' },
        selectedFuel: ['Petrol'],
        selectedDrive: ['All wheel drive (4x4)'],
        selectedGearbox: ['Automatic'],
        engineCapacityRange: { from: '1.9', to: '' },
        powerRange: { from: '500', to: '' }
      };
      
      expect(deserializeFilters(params)).toEqual(expected);
    });
  });

  describe('Roundtrip Tests', () => {
    it('should correctly serialize and deserialize complex filter', () => {
      const originalFilter: Filter = {
        ...emptyFilter,
        brand: 'Acura',
        model: 'NSX',
        bodyType: ['Coupe'],
        yearsRange: { from: '2011', to: '2020' },
        selectedFuel: ['Petrol', 'Diesel'],
        selectedDrive: ['All wheel drive (4x4)'],
        selectedGearbox: ['Automatic', 'Manual'],
        engineCapacityRange: { from: '1.9', to: '3.5' },
        powerRange: { from: '500', to: '600' }
      };

      const serialized = serializeFilters(originalFilter);
      const params = new URLSearchParams(serialized);
      const deserialized = deserializeFilters(params);

      // Note: brandId and modelId are not serialized
      const expected = {
        ...originalFilter,
        brand: '',
        model: ''
      };

      expect(deserialized).toEqual(expected);
    });
  });
});