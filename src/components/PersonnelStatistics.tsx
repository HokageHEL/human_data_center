import React from 'react';
import { Person } from '@/lib/data';

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
    <div className="flex gap-8">
      <div className="flex gap-4">
        <span>Всього: {totalPeople}</span>
        <span>У ППД: {peopleInPPD}</span>
      </div>
      <div className="flex gap-4">
        <span>
          <span className="font-bold">Не</span> в ППД: {peopleNotInPPD}
        </span>
        {peopleOnVacation > 0 && (
          <span>Відпустка: {peopleOnVacation}</span>
        )}
        {peopleOnBusinessTrip > 0 && (
          <span>Відрядження: {peopleOnBusinessTrip}</span>
        )}
        {peopleOnMaternityLeave > 0 && (
          <span>Декрет: {peopleOnMaternityLeave}</span>
        )}
        {peopleOnLongSickLeave > 0 && (
          <span>Довгострокове лікування: {peopleOnLongSickLeave}</span>
        )}
        {peopleOnShortSickLeave > 0 && (
          <span>Короткострокове лікування: {peopleOnShortSickLeave}</span>
        )}
        {peopleOnTraining > 0 && (
          <span>Навчання: {peopleOnTraining}</span>
        )}
        {peopleOnRvbd > 0 && <span>РВБД: {peopleOnRvbd}</span>}
        {peopleNotSpecifiedLeave > 0 && (
          <span>Не вказано: {peopleNotSpecifiedLeave}</span>
        )}
      </div>
    </div>
  );
};