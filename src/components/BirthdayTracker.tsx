import { Person } from "@/lib/data";
import React from "react";
import Tracker from "./Tracker";

interface Props {
  people: Person[];
  daysRange?: number;
}

const BirthdayTracker: React.FC<Props> = ({ people, daysRange = 10 }) => {
  return (
    <Tracker
      people={people}
      daysRange={daysRange}
      title="Наближаються дні народження"
      dateField="birthDate"
      dateLabel="через"
    />
  );
};

export default BirthdayTracker;
