import { Person } from "@/lib/data";
import React from "react";

interface BirthdayInfo {
  fullName: string;
  birthDate: string;
  daysLeft: number;
}

interface Props {
  people: Person[];
  daysRange?: number;
}

const BirthdayTracker: React.FC<Props> = ({ people, daysRange = 10 }) => {
  const today = new Date();
  const currentYear = today.getFullYear();

  const getDaysUntilBirthday = (birthDate: string): number => {
    const [year, month, day] = birthDate.split("-").map(Number);
    const nextBirthday = new Date(currentYear, month - 1, day);

    if (nextBirthday < today) {
      nextBirthday.setFullYear(currentYear + 1);
    }

    const timeDiff = nextBirthday.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  const upcomingBirthdays: BirthdayInfo[] = people
    .filter((p) => !!p.birthDate)
    .map((p) => {
      const daysLeft = getDaysUntilBirthday(p.birthDate);
      return { fullName: p.fullName, birthDate: p.birthDate, daysLeft };
    })
    .filter((b) => b.daysLeft <= daysRange)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div className="mt-4 border p-4 rounded-xl shadow bg-white">
      <h2 className="text-lg font-bold mb-2 whitespace-nowrap">
        Наближаються дні народження
      </h2>
      <ul className="space-y-1">
        {upcomingBirthdays.map((b, idx) => (
          <li key={idx} className="text-sm">
            <span className="font-bold">{b.fullName}</span>
            <span> — {b.birthDate} </span>
            <span>
              ( через <span className="font-bold">{b.daysLeft}</span> дн.)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BirthdayTracker;
