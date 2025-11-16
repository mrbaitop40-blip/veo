import React from 'react';

interface SelectInputProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}

const SelectInput = <T extends string,>({ label, value, onChange, options }: SelectInputProps<T>) => {
  return (
    <div className="w-full">
      <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;