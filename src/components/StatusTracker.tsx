import { Person } from "@/lib/data";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { STATUS_LABELS } from "@/lib/constants";

interface Props {
  people: Person[];
}

const StatusTracker: React.FC<Props> = ({ people }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const statusCounts = people
    .filter((person) => !person.isInPPD)
    .reduce((acc, person) => {
      const status = person.status || "не_вказано";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const totalNonPPD = people.filter(person => !person.isInPPD).length;
  const totalPPD = people.filter(person => person.isInPPD).length;
  
  // Get top 2 most common statuses for summary
  const topStatuses = Object.entries(statusCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 2);

  return (
    <Card className="p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Статуси персоналу</h2>
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {/* Compact Summary View */}
      {!isExpanded && (
        <div className="space-y-1 text-sm">
          <div className="flex justify-between items-center">
            <span>Всього (не в ППД)</span>
            <span className="font-medium">{totalNonPPD}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>У ППД</span>
            <span className="font-medium">{totalPPD}</span>
          </div>
          {topStatuses.map(([status, count]) => (
            <div key={status} className="flex justify-between items-center text-muted-foreground">
              <span>{STATUS_LABELS[status] || status}</span>
              <span className="font-medium">{count}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Full Details View */}
      {isExpanded && (
        <div className="space-y-1">
          <div className="flex justify-between items-center font-medium border-b pb-1">
            <span>Всього (не в ППД)</span>
            <span>{totalNonPPD}</span>
          </div>
          <div className="flex justify-between items-center font-medium border-b pb-1">
            <span>У ППД</span>
            <span>{totalPPD}</span>
          </div>
          <div className="pt-2 space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">Деталізація статусів:</h3>
            {Object.entries(STATUS_LABELS).map(([status, label]) => (
              <div key={status} className="flex justify-between items-center">
                <span>{label}</span>
                <span className="font-medium">{statusCounts[status] || 0}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default StatusTracker;
