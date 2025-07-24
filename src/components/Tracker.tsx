import { Person } from "@/lib/data";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  if (upcomingDates.length === 0) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {upcomingDates.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <span className="font-medium">{item.fullName}</span>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{item.date}</span>
                <Badge variant={item.daysLeft <= 3 ? "destructive" : "secondary"} className="text-xs">
                  {dateLabel} {item.daysLeft} дн.
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Tracker;
