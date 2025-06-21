// Функція для серіалізації фільтрів в URL-параметри


export interface Filter {
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
export const serializeFilters = (filters: Filter, isFullReset?: boolean) => {
    if (isFullReset) {
    return 'full=true';
  }

  const params = new URLSearchParams();

   if (filters.brandId) {
    params.set('brand_name', filters.brand);
  }
  if (filters.modelId) {
    params.set('model_name', filters.model);
  }
  // Тип кузова
  if (filters.bodyType.length > 0) params.set('body', filters.bodyType.join(','));
  
  // Роки
  if (filters.yearsRange.from) params.set('year_from', filters.yearsRange.from);
  if (filters.yearsRange.to) params.set('year_to', filters.yearsRange.to);
  
  // Паливо
  if (filters.selectedFuel.length > 0) params.set('fuel', filters.selectedFuel.join(','));
  
  // Привід
  if (filters.selectedDrive.length > 0) params.set('drive', filters.selectedDrive.join(','));
  
  // Коробка передач
  if (filters.selectedGearbox.length > 0) params.set('gearbox', filters.selectedGearbox.join(','));
  
  // Об'єм двигуна
  if (filters.engineCapacityRange.from) params.set('engine_from', filters.engineCapacityRange.from);
  if (filters.engineCapacityRange.to) params.set('engine_to', filters.engineCapacityRange.to);
  
  // Потужність
  if (filters.powerRange.from) params.set('power_from', filters.powerRange.from);
  if (filters.powerRange.to) params.set('power_to', filters.powerRange.to);
  
  // Витрата палива
  if (filters.fuelConsumption.from) params.set('consumption_from', filters.fuelConsumption.from);
  if (filters.fuelConsumption.to) params.set('consumption_to', filters.fuelConsumption.to);
  if (filters.fuelConsumption.mode) params.set('consumption_mode', filters.fuelConsumption.mode);
  
  return params.toString();
};

// Функція для десеріалізації URL-параметрів у фільтри
export const deserializeFilters = (searchParams: URLSearchParams): Filter => {
  // Якщо є параметр full=true - повертаємо пусті фільтри
  if (searchParams.get('full') === 'true') {
    return {
      selectedFuel: [],
      selectedDrive: [],
      selectedGearbox: [],
      yearsRange: { from: "", to: "" },
      fuelConsumption: { from: "", to: "", mode: "" },
      powerRange: { from: "", to: "" },
      engineCapacityRange: { from: "", to: "" },
      bodyType: [],
      brand: "",
      model: "",
      brandId: "",
      modelId: "",
    };
  }

  const defaultFilter: Filter = {
    selectedFuel: [],
    selectedDrive: [],
    selectedGearbox: [],
    yearsRange: { from: "", to: "" },
    fuelConsumption: { from: "", to: "", mode: "" },
    powerRange: { from: "", to: "" },
    engineCapacityRange: { from: "", to: "" },
    bodyType: [],
    brand: "",
    model: "",
    brandId: "",
    modelId: "",
  };
  
  return {
    ...defaultFilter,
    brand: searchParams.get('brand_name') || "",
    model: searchParams.get('model_name') || "",

    bodyType: searchParams.get('body')?.split(',') || [],
    yearsRange: {
      from: searchParams.get('year_from') || "",
      to: searchParams.get('year_to') || "",
    },
    selectedFuel: searchParams.get('fuel')?.split(',') || [],
    selectedDrive: searchParams.get('drive')?.split(',') || [],
    selectedGearbox: searchParams.get('gearbox')?.split(',') || [],
    engineCapacityRange: {
      from: searchParams.get('engine_from') || "",
      to: searchParams.get('engine_to') || "",
    },
    powerRange: {
      from: searchParams.get('power_from') || "",
      to: searchParams.get('power_to') || "",
    },
    fuelConsumption: {
      from: searchParams.get('consumption_from') || "",
      to: searchParams.get('consumption_to') || "",
      mode: searchParams.get('consumption_mode') || "",
    },
  };
};
