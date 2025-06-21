// "use client"
import React from 'react';
import { useState } from "react";
import  HintList from "@/app/ui/hintSearchFormListForAdvance";
import { Filter } from '@/app/lib/serializeFiltersURL';

 interface FuelConsumption { from: string; to: string; mode: string };

import styles from "./index.module.scss";

const bodyTypes = ["Sedan", "Hatchback", "Wagon", "Coupe", "Cabriolet / Roadster / Targa", "SUV / Crossover", "Minivan / MPV", "Pickup", "Limousine / Grand Tourer", "Quad / Utility"] as const;
const fuelTypes = ["Petrol", "Diesel", "Electric", "LPG", "Hydrogen", "Ethanol", "Hybrid", "Other / Mixed"] as const;
const driveTypes = ["Front wheel drive", "All wheel drive (4x4)", "Rear wheel drive"] as const;
const gearboxes = ["Manual", "Automatic", "CVT", "Semi-automatic"] as const;
const fuelModes = ["City", "Highway", "Mixed"];

interface AdvancedSearchFormProps {
  filter: Filter;
  onFilterChange: (filter: Filter | ((prev: Filter) => Filter)) => void;
  onSearch: (e: React.FormEvent) => void;
}

const generateYearOptions = () => {
  const years = [];
  for (let year = 2025; year >= 1880; year--) {
    years.push(year);
  }
  return years;
};
export const AdvancedSearchForm = ({ 
  filter, 
  onFilterChange:setFilter, 
  onSearch : handleSearch
}: AdvancedSearchFormProps) => {

   const years = generateYearOptions();

  const [showDropdowns, setShowDropdowns] = useState({
    bodyType: false,
    yearFrom: false,
    yearTo: false,
    brandList: false,
    modelList: false,
  });
  const toggleSelection = (value: string, field: keyof typeof filter) => {
    setFilter(prev => {
      const selected = prev[field] as string[];
      const updated = selected.includes(value) ? selected.filter(v => v !== value) : [...selected, value];
      return { ...prev, [field]: updated };
    });
  };

  const handleRangeChange = (
    field: keyof typeof filter,
    bound: "from" | "to" | "mode",
    value: string
  ) => {
    setFilter((prev: Filter) => ({
      ...prev,
      [field]: {
        ...(prev[field] as Range | FuelConsumption),
        [bound]: value,
      },
    }));
  };

  return (
    <form className={styles.container} onSubmit={handleSearch}>
      <h1>Advanced Search</h1>
      <div className={styles.field}>
        <label>Brand</label>
        <div className={styles.dropdownWrapper}>
  <input
    className={styles.search__input}
    type="text"
    name="search"
    placeholder="Select brand"
    value={filter.brand}
    onChange={(e) => {
      if(e.target.value!== filter.brand) {
setFilter({ ...filter, brand: e.target.value });
      setShowDropdowns(prev => ({
        ...prev,
        brandList: true 
      }));
      }
      
    }}
    onClick={() => {
      setShowDropdowns(prev => ({
        ...prev,
        brandList: !prev.brandList 
      }));
    }}
    autoComplete="off"
    spellCheck={false}
    autoCorrect="off"
  /> {filter.brand && (
              <span
                onClick={() => setFilter({ ...filter, brand: "", model: "", brandId: "", modelId: "" })}
                className={styles.crossYearsRange}
              >×</span>
            )}
            </div>
  <HintList 
  query={filter.brand} 
  resetQuery={setFilter}
  filter={filter}
  setShowDropdowns={setShowDropdowns}
  isVisible={showDropdowns.brandList}
  type="brand" 
/>
</div>
<div className={styles.field}>
      <label>Model</label>
  <div className={styles.dropdownWrapper}>
    <input
      className={styles.search__input}
      type="text"
      name="model"
      placeholder="Enter model"
      value={filter.model}
      onChange={(e) => {
        if (e.target.value !== filter.model) {
          setFilter({ ...filter, model: e.target.value });
          setShowDropdowns(prev => ({
        ...prev,
       modelList: true ,
      }));
          
        }
      }}

    onClick={() => {
      setShowDropdowns(prev => ({
        ...prev,
        modelList: !prev.modelList 
      }));
    }}

      disabled={!filter.brand} 
      autoComplete="off"
      spellCheck={false}
      autoCorrect="off"
    />
    {filter.model && (
      <span
        onClick={() => setFilter({ ...filter, model: "" ,modelId: ""})}
        className={styles.crossYearsRange}
      >
        ×
      </span>
    )}
  </div>
  <HintList 
  query={filter.model} 
  resetQuery={setFilter}
  filter={filter}
  setShowDropdowns={setShowDropdowns}
  isVisible={showDropdowns.modelList}
  type="model" 
/>
</div>


      {/* Body Type */}
      <div className={styles.field}>
        <label>Body Type</label>
        <div className={styles.dropdownWrapper}>
          <input
            type="text"
            placeholder="Select body types"
            value={filter.bodyType.join(", ")}
            readOnly
            onClick={() => setShowDropdowns(prev => ({ ...prev, bodyType: !prev.bodyType }))}
          />
          {showDropdowns.bodyType && (
            <div className={`${styles.dropdown} ${styles.customDropdown}`}>
              {bodyTypes.map(type => (
                <label key={type} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={filter.bodyType.includes(type)}
                    onChange={() => toggleSelection(type, "bodyType")}
                    className={styles.hiddenCheckbox}
                  />
                  <span className={styles.customCheckbox}></span>
                  {type}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Years */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label>Year From</label>
          <div className={styles.dropdownWrapper}>
            <input
              readOnly
              type="text"
              placeholder="1910"
              value={filter.yearsRange.from}
              onClick={() => setShowDropdowns(prev => ({ ...prev, yearFrom: !prev.yearFrom }))}
            />
            {filter.yearsRange.from && (
              <span
                onClick={() => handleRangeChange("yearsRange", "from", "")}
                className={styles.crossYearsRange}
              >×</span>
            )}
            {showDropdowns.yearFrom && (
              <div className={styles.dropdown}>
                {years.map((year) => (
                  <div
                    key={year}
                    className={styles.dropdownItem}
                    onClick={() => {
                      if (filter.yearsRange.to === "" || year <= parseInt(filter.yearsRange.to)) {
                        handleRangeChange("yearsRange", "from", year.toString());
                        setShowDropdowns(prev => ({ ...prev, yearFrom: false }));
                      } else {
                        alert("Year From should be less than Year To");
                      }
                    }}
                  >{year}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.field}>
          <label>Year To</label>
          <div className={styles.dropdownWrapper}>
            <input
              readOnly
              type="text"
              placeholder="2024"
              value={filter.yearsRange.to}
              onClick={() => setShowDropdowns(prev => ({ ...prev, yearTo: !prev.yearTo }))}
            />
            {filter.yearsRange.to && (
              <span
                onClick={() => handleRangeChange("yearsRange", "to", "")}
                className={styles.crossYearsRange}
              >×</span>
            )}
            {showDropdowns.yearTo && (
              <div className={styles.dropdown}>
                {years.map((year) => (
                  <div
                    key={year}
                    className={styles.dropdownItem}
                    onClick={() => {
                      if (filter.yearsRange.from === "" || year >= parseInt(filter.yearsRange.from)) {
                        handleRangeChange("yearsRange", "to", year.toString());
                        setShowDropdowns(prev => ({ ...prev, yearTo: false }));
                      } else {
                        alert("Year To should be greater than Year From");
                      }
                    }}
                  >{year}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fuel Type */}
      <div className={styles.field}>
        <label>Fuel Type</label>
        <div className={styles.buttonGroup}>
          {fuelTypes.map((type) => (
            <button
              key={type}
              className={`${styles.toggleButton} ${filter.selectedFuel.includes(type) ? styles.active : ""}`}
              onClick={() => toggleSelection(type, "selectedFuel")}
              type="button"
            >{type}</button>
          ))}
        </div>
      </div>

      {/* Drive Type */}
      <div className={styles.field}>
        <label>Drive Type</label>
        <div className={styles.buttonGroup}>
          {driveTypes.map((type) => (
            <button
              key={type}
              className={`${styles.toggleButton} ${filter.selectedDrive.includes(type) ? styles.active : ""}`}
              onClick={() => toggleSelection(type, "selectedDrive")}
              type="button"
            >{type}</button>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div className={styles.field}>
        <label>Transmission</label>
        <div className={styles.buttonGroup}>
          {gearboxes.map((type) => (
            <button
              key={type}
              className={`${styles.toggleButton} ${filter.selectedGearbox.includes(type) ? styles.active : ""}`}
              onClick={() => toggleSelection(type, "selectedGearbox")}
              type="button"
            >{type}</button>
          ))}
        </div>
      </div>
      {/* Engine Capacity */}
     <div className={styles.field}>
  <label>Engine Capacity (L)</label>
  <div className={styles.rangeInputs}>
    <input
      type="number"
      step="0.1"
      placeholder="From"
      value={filter.engineCapacityRange.from}
      onChange={(e) => {
        const value = e.target.value;
        if (
          value === "" ||
          parseFloat(value) <= parseFloat(filter.engineCapacityRange.to) ||
          filter.engineCapacityRange.to === ""
        ) {
          handleRangeChange("engineCapacityRange", "from", value);
        }
      }}
    />
    <span style={{ margin: "0 8px" }}>–</span>
    <input
      type="number"
      step="0.1"
      placeholder="To"
      value={filter.engineCapacityRange.to}
      onChange={(e) => {
        const value = e.target.value;
        if (
          value === "" ||
          parseFloat(value) >= parseFloat(filter.engineCapacityRange.from) ||
          filter.engineCapacityRange.from === ""
        ) {
          handleRangeChange("engineCapacityRange", "to", value);
        }
      }}
    />
  </div>
</div>

      {/* Потужність */}
      <div className={styles.field}>
        <label>Power (hp)</label>
       <div className={styles.rangeInputs}>
       <input
        type="number"
        step="10"
        placeholder="From"
        value={filter.powerRange.from}
        onChange={(e) => handleRangeChange("powerRange", "from", e.target.value)}
      onBlur={(e) => {
        const fromValue = e.target.value;
        const toValue = filter.powerRange.to;
        if (fromValue !== "" && toValue !== "" && parseInt(fromValue) > parseInt(toValue)) {
          handleRangeChange("powerRange", "from", toValue); // Автоматично вирівнюємо
        }
      }}
      />
        <span style={{ margin: '0 8px' }}>–</span>
        <input
        type="number"
        step="10"
        placeholder="To"
        value={filter.powerRange.to}
        onChange={(e) => handleRangeChange("powerRange", "to", e.target.value)}
      onBlur={(e) => {
        const toValue = e.target.value;
        const fromValue = filter.powerRange.from;
        if (toValue !== "" && fromValue !== "" && parseInt(toValue) < parseInt(fromValue)) {
          handleRangeChange("powerRange", "to", fromValue); 
        }
      }}
      />
    </div>
    </div>

         {/* Витрата палива */}
          <div className={styles.field}>
     <label>Fuel Consumption (L/100km)</label>
     <div className={styles.rangeInputs}>
       <input
      type="number"
      step="0.5"
      placeholder="From"
      value={filter.fuelConsumption.from}
       onChange={(e) => handleRangeChange("fuelConsumption", "from", e.target.value)}
      onBlur={(e) => {
        const fromValue = e.target.value;
        const toValue = filter.fuelConsumption.to;
        if (fromValue !== "" && toValue !== "" && parseFloat(fromValue) > parseFloat(toValue)) {
          handleRangeChange("fuelConsumption", "from", toValue); // Автоматично вирівнюємо
        }
      }}
    />   
    <span style={{ margin: '0 8px' }}>–</span>
    <input
      type="number"
      step="0.5"
      placeholder="To"
      value={filter.fuelConsumption.to}
       onChange={(e) => handleRangeChange("fuelConsumption", "to", e.target.value)}
      onBlur={(e) => {
        const toValue = e.target.value;
        const fromValue = filter.fuelConsumption.from;
        if (toValue !== "" && fromValue !== "" && parseFloat(toValue) < parseFloat(fromValue)) {
          handleRangeChange("fuelConsumption", "to", fromValue); // Автоматично вирівнюємо
        }
      }}
    />
  </div>
  <div className={styles.selectButtons}>
    {fuelModes.map((mode) => (
      <button
        key={mode}
        type="button"
        className={`${styles.selectButton} ${filter.fuelConsumption.mode === mode ? styles.active : ''}`}
        onClick={() =>handleRangeChange("fuelConsumption", "mode", mode)}>
        {mode}
      </button>
    ))}
  </div>
</div>

      <div className={styles.buttonWrapper}>
    <button type="submit" className={styles.searchButton}>
      🔍 Search
    </button>
  </div>

     
    </form>
  );
};






