import React from 'react';

interface RadioOption<T extends string> {
  value: T;
  label: string;
}

interface RadioButtonGroupProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: RadioOption<T>[];
  name: string;
}

const RadioButtonGroup = <T extends string,>({ label, value, onChange, options, name }: RadioButtonGroupProps<T>) => {
  const groupName = name.replace(/\s+/g, '-').toLowerCase();
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-2">{label}</label>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              id={`radio-${groupName}-${option.value}`}
              type="radio"
              name={groupName}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value as T)}
              className="h-4 w-4 text-violet-500 bg-gray-800 border-gray-600 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-black"
            />
            <label htmlFor={`radio-${groupName}-${option.value}`} className="ml-2 block text-sm text-gray-300">
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadioButtonGroup;