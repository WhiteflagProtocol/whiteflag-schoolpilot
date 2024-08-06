import { useState } from "react";

interface SearchInputProps {
  value: string;
  setValue: (value: string) => void;
}

export const SearchInput = ({ value, setValue }: SearchInputProps) => {
  return (
    <div className="search__input">
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};
