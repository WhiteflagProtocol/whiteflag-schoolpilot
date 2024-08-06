import { useState } from "react";

interface RadioInputProps {
  label: string;
  value: string;
  checked: boolean;
  onChange: (val: string) => void;
}

function RadioInput({ label, value, checked, onChange }: RadioInputProps) {
  return (
    <label onClick={() => onChange(value)}>
      <input type="radio" checked={checked} />
      <span>{label}</span>
    </label>
  );
}

interface RadioGroupProps {
  options: Array<string>;
  selected: Array<string>;
  setSelected: (val: string[]) => void;
}

export const RadioGroup = ({
  options,
  selected,
  setSelected,
}: RadioGroupProps) => {
  const toggleOption = (value: string) => {
    console.log(selected, value);
    if (!selected) {
      console.log("creating new");
      setSelected([value]);
    } else if (selected.includes(value)) {
      console.log("disabling", value);
      setSelected([...selected.filter((o) => o !== value)]);
    } else {
      setSelected([...selected, value]);
    }
  };

  return (
    <div className="radio-group">
      {options.map((option) => (
        <RadioInput
          label={option}
          value={option}
          checked={selected?.includes(option)}
          onChange={(v: string) => toggleOption(v)}
        />
      ))}
    </div>
  );
};
