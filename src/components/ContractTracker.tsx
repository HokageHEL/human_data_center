import { Person } from "@/lib/data";
import React from "react";
import Tracker from "./Tracker";

interface Props {
  people: Person[];
  daysRange?: number;
}

const ContractTracker: React.FC<Props> = ({ people, daysRange = 10 }) => {
  return (
    <Tracker
      people={people}
      daysRange={daysRange}
      title="Наближається кінець контракту"
      dateField="contractEndDate"
      dateLabel="залишилось"
    />
  );
};

export default ContractTracker;