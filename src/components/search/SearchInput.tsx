import { useEffect, useRef, useState } from "react";
import { BackIcon, CloseIcon } from "../../icons/Icons";

interface SearchInputProps {
  value: string;
  setValue: (value: string) => void;
  closeDrawer: () => void;
  clearSearchText: () => void;
}

export const SearchInput = ({
  value,
  setValue,
  closeDrawer,
  clearSearchText,
}: SearchInputProps) => {
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    console.log("component mounted");
    if (ref && ref.current) {
      setTimeout(() => ref.current.focus(), 0);
    }
  }, []);

  return (
    <div className="search__input">
      <button className="button button--no-border" onClick={closeDrawer}>
        <BackIcon />
      </button>
      <input
        type="search"
        value={value}
        ref={ref}
        onChange={(e) => setValue(e.target.value)}
      />
      <button className="button button--no-border" onClick={clearSearchText}>
        <CloseIcon />
      </button>
    </div>
  );
};
