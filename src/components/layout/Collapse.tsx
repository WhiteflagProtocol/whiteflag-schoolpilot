import { PropsWithChildren, useState } from "react";
import { BackIcon, ChevronDownIcon, ChevronRightIcon } from "../../icons/Icons";

interface CollapseProps extends PropsWithChildren {
  closedContent: React.ReactNode;
}

export function Collapse({ closedContent, children }: CollapseProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="collapse">
      <div className="collapse__control-bar">
        <div
          className="collapse__expand-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {!isOpen ? <ChevronRightIcon /> : <ChevronDownIcon />}
        </div>
        <div className="collapse__closed-content">{closedContent}</div>
      </div>
      {isOpen && <div className="collapse__expanded-content">{children}</div>}
    </div>
  );
}
