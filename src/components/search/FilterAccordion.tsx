import { Collapse } from "antd";
import { FilterTypes, Filters } from "../../hooks/useSearch";
import CollapsePanel from "antd/es/collapse/CollapsePanel";
import { RadioGroup } from "../common/RadioGroup";
import { useState } from "react";

interface FilterAccordionProps {
  controlFilters: Filters;
  setControlFilters: (filters: Filters) => void;
}

export const FilterAccordion = ({
  controlFilters,
  setControlFilters,
}: FilterAccordionProps) => {
  const setFilter = (filterType: FilterTypes, values: string[]) => {
    console.log(controlFilters);
    setControlFilters({ ...controlFilters, [filterType]: values });
  };
  return (
    <Collapse
      className="search__filter-accordion"
      bordered={false}
      expandIconPosition={"end"}
    >
      <CollapsePanel key={1} header="Message Type">
        <RadioGroup
          options={["1", "2", "3", "Test"]}
          selected={controlFilters[FilterTypes.MessageType]}
          setSelected={(val: string[]) =>
            setFilter(FilterTypes.MessageType, val)
          }
        />
      </CollapsePanel>
      <CollapsePanel key={2} header="Infrastructure Type">
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
      </CollapsePanel>
    </Collapse>
  );
};
