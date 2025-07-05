import { Person } from "@/lib/data";
import React from "react";

interface TrackerInfo {
  fullName: string;
  date: string;
  daysLeft: number;
}

interface Props {
  people: Person[];
  daysRange?: number;
  title: string;
  dateField: keyof Person;
  dateLabel: string;
}

const Tracker: React.FC<Props> = ({
  people,
  daysRange = 10,
  title,
  dateField,
  dateLabel,
}) => {
  const today = new Date();
  const currentYear = today.getFullYear();

  const getDaysUntilDate = (date: string): number => {
    const [year, month, day] = date.split("-").map(Number);
    const nextDate = new Date(currentYear, month - 1, day);

    if (nextDate < today) {
      nextDate.setFullYear(currentYear + 1);
    }

    const timeDiff = nextDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  const upcomingDates: TrackerInfo[] = people
    .filter((p) => !!p[dateField])
    .map((p) => {
      const daysLeft = getDaysUntilDate(p[dateField] as string);
      return {
        fullName: p.fullName,
        date: p[dateField] as string,
        daysLeft,
      };
    })
    .filter((b) => b.daysLeft <= daysRange)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div className="mt-4 border p-4 rounded-xl shadow ">
      <h2 className="text-lg font-bold mb-2 whitespace-nowrap">{title}</h2>
      <ul className="space-y-1">
        {upcomingDates.map((item, idx) => (
          <li key={idx} className="text-sm">
            <span className="font-bold">{item.fullName}</span>
            <span> — {item.date} </span>
            <span>
              ( {dateLabel} <span className="font-bold">{item.daysLeft}</span>{" "}
              дн.)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tracker;
