import { Person } from "@/lib/data";
import React from "react";
import { Card } from "@/components/ui/card";
import { STATUS_LABELS } from "@/lib/constants";

interface Props {
  people: Person[];
}

const StatusTracker: React.FC<Props> = ({ people }) => {
  const statusCounts = people
    .filter((person) => !person.isInPPD)
    .reduce((acc, person) => {
      const status = person.status || "не_вказано";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);



  return (
    <Card className="p-4 space-y-2">
      <h2 className="text-lg font-semibold">Статуси персоналу (не в ППД)</h2>
      <div className="space-y-1">
        {Object.entries(STATUS_LABELS).map(([status, label]) => (
          <div key={status} className="flex justify-between items-center">
            <span>{label}</span>
            <span className="font-medium">{statusCounts[status] || 0}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default StatusTracker;
