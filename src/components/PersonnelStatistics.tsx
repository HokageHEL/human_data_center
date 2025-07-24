import React from 'react';
import { Person } from '@/lib/data';
import { Badge } from '@/components/ui/badge';

interface PersonnelStatisticsProps {
  people: Person[];
}

export const PersonnelStatistics: React.FC<PersonnelStatisticsProps> = ({ people }) => {
  // Calculate statistics
  const totalPeople = people.length;
  const peopleInPPD = people.filter((person) => person.isInPPD).length;
  const peopleNotInPPD = totalPeople - peopleInPPD;
  const peopleOnVacation = people.filter(
    (person) => person.status === "відпустка" && !person.isInPPD
  ).length;
  const peopleOnBusinessTrip = people.filter(
    (person) => person.status === "відрядження" && !person.isInPPD
  ).length;
  const peopleOnMaternityLeave = people.filter(
    (person) => person.status === "декрет" && !person.isInPPD
  ).length;
  const peopleOnLongSickLeave = people.filter(
    (person) => person.status === "довгострокове_лікування" && !person.isInPPD
  ).length;
  const peopleOnShortSickLeave = people.filter(
    (person) => person.status === "короткострокове_лікування" && !person.isInPPD
  ).length;
  const peopleOnTraining = people.filter(
    (person) => person.status === "навчання" && !person.isInPPD
  ).length;
  const peopleOnRvbd = people.filter(
    (person) => person.status === "РВБД" && !person.isInPPD
  ).length;
  const peopleNotSpecifiedLeave = people.filter(
    (person) =>
      (!person.status || person.status === "не_вказано") && !person.isInPPD
  ).length;

  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default" className="text-sm">
        Всього: {totalPeople}
      </Badge>
      <Badge variant="secondary" className="text-sm">
        У ППД: {peopleInPPD}
      </Badge>
      <Badge variant="outline" className="text-sm">
        Не в ППД: {peopleNotInPPD}
      </Badge>
      {peopleOnVacation > 0 && (
        <Badge variant="outline" className="text-sm">
          Відпустка: {peopleOnVacation}
        </Badge>
      )}
      {peopleOnBusinessTrip > 0 && (
        <Badge variant="outline" className="text-sm">
          Відрядження: {peopleOnBusinessTrip}
        </Badge>
      )}
      {peopleOnMaternityLeave > 0 && (
        <Badge variant="outline" className="text-sm">
          Декрет: {peopleOnMaternityLeave}
        </Badge>
      )}
      {peopleOnLongSickLeave > 0 && (
        <Badge variant="outline" className="text-sm">
          Довгострокове лікування: {peopleOnLongSickLeave}
        </Badge>
      )}
      {peopleOnShortSickLeave > 0 && (
        <Badge variant="outline" className="text-sm">
          Короткострокове лікування: {peopleOnShortSickLeave}
        </Badge>
      )}
      {peopleOnTraining > 0 && (
        <Badge variant="outline" className="text-sm">
          Навчання: {peopleOnTraining}
        </Badge>
      )}
      {peopleOnRvbd > 0 && (
        <Badge variant="outline" className="text-sm">
          РВБД: {peopleOnRvbd}
        </Badge>
      )}
      {peopleNotSpecifiedLeave > 0 && (
        <Badge variant="outline" className="text-sm">
          Не вказано: {peopleNotSpecifiedLeave}
        </Badge>
      )}
    </div>
  );
};