import { Collapse } from "antd";
import CollapsePanel from "antd/es/collapse/CollapsePanel";
import React, { PropsWithChildren, useState } from "react";

interface RadioInputProps {
  label: string;
  value: string;
  checked?: boolean;
  onChange?: (val: string) => void;
  className?: string;
}

export function RadioInput({
  label,
  value,
  checked,
  onChange,
  className,
}: RadioInputProps) {
  return (
    <div
      className={`search__filter-option ${className}`}
      onClick={() => {
        onChange(value);
      }}
    >
      {/* <input type="radio" checked={checked} /> */}
      <div
        className="search__filter-option__checkbox"
        data-selected={checked}
      ></div>
      <span className="search__filter-option__label">{label}</span>
    </div>
  );
}

interface RadioGroupProps extends PropsWithChildren {
  options?: Array<string>;
  selected: Array<string>;
  setSelected: (val: string[]) => void;
  className?: string;
}

export const RadioGroup = ({
  options,
  selected,
  setSelected,
  children,
  className,
}: RadioGroupProps) => {
  console.log("RadioGroup init", "selected", selected);
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

  console.log("options", options);

  return (
    <>
      {!children ? (
        <div className={`radio-group ${className}`}>
          {options.map((option) => {
            // console.log("RadioGroup init", option, selected.includes(option));
            return (
              <RadioInput
                label={option}
                value={option}
                checked={selected?.includes(option)}
                onChange={(v: string) => toggleOption(v)}
              />
            );
          })}
        </div>
      ) : (
        children && children
      )}
    </>
  );
};
