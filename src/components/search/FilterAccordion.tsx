import { FilterTypes, Filters } from "../../hooks/useSearch";
import { RadioGroup, RadioInput } from "../common/RadioGroup";
import { useState } from "react";
import {
  InfrastructureSubjectCode,
  MessageCode,
} from "../../models/WhiteflagSignal";
import { Collapse } from "../layout/Collapse";

const messageTypeMap = new Map<string, string[]>([
  ["Infrastructure", Object.keys(InfrastructureSubjectCode)],
  ["Abracadbra", Object.keys(InfrastructureSubjectCode)],
  ["Beeld", Object.keys(InfrastructureSubjectCode)],
]);

console.log("map", messageTypeMap);

interface FilterAccordionProps {
  controlFilters: Filters;
  setControlFilters: (filters: Filters) => void;
}

export const FilterAccordion = ({
  controlFilters,
  setControlFilters,
}: FilterAccordionProps) => {
  console.log("FilterAccordion init", "controlFilters", controlFilters);
  const setFilter = (filterType: FilterTypes, values: string[]) => {
    console.log(controlFilters);
    setControlFilters({ ...controlFilters, [filterType]: values });
  };

  const setMessageType = (val: string[]) =>
    setFilter(FilterTypes.MessageType, val);

  const toggleMessageType = (selected: string[], value: string) => {
    if (!selected) {
      setMessageType([value]);
    } else if (selected.includes(value)) {
      setMessageType([...selected.filter((o) => o !== value)]);
    } else {
      setMessageType([...selected, value]);
    }
  };

  return (
    <div className="search__filter-accordion">
      <span>Message Type</span>
      <RadioGroup
        selected={controlFilters[FilterTypes.MessageType]}
        setSelected={setMessageType}
      >
        {Object.keys(MessageCode).map((type) => (
          <Collapse
            key={type}
            closedContent={
              <RadioInput
                label={type}
                value={type}
                checked={controlFilters[FilterTypes.MessageType]?.includes(
                  type
                )}
                onChange={(v: string) =>
                  toggleMessageType(controlFilters[FilterTypes.MessageType], v)
                }
              />
            }
          >
            <RadioGroup
              className="inner-checklist"
              options={messageTypeMap.get(type)}
              selected={controlFilters[FilterTypes.InfrastructureType]}
              setSelected={(val: string[]) =>
                setFilter(FilterTypes.InfrastructureType, val)
              }
            />
          </Collapse>
        ))}
      </RadioGroup>

      <span>Author</span>
      <RadioGroup
        className="author-checklist"
        options={["you", "me", "him"]}
        selected={controlFilters[FilterTypes.Author]}
        setSelected={(val: string[]) => setFilter(FilterTypes.Author, val)}
      />
      {/* <CollapsePanel key={2} header="Infrastructure Type">
        <RadioGroup
          options={["1", "2", "3", "Test"]}
          selected={controlFilters[FilterTypes.InfrastructureType]}
          setSelected={(val: string[]) =>
            setFilter(FilterTypes.InfrastructureType, val)
          }
        />
      </CollapsePanel>
      <CollapsePanel key={3} header="Author">
        <RadioGroup
          options={["Muhammad85", "Plato", "Yannick_Seyeux"]}
          selected={controlFilters[FilterTypes.Author]}
          setSelected={(val: string[]) => setFilter(FilterTypes.Author, val)}
        />
      </CollapsePanel> */}
    </div>
  );
};
