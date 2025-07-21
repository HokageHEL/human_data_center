import { FormField } from "./FormField";
import { FITNESS_STATUS_OPTIONS, SERVICE_TYPE_OPTIONS } from "@/lib/constants";

type FormFieldValue = string | number | boolean | null | undefined;

interface MilitaryFormData {
  position?: string;
  militaryRank?: string;
  lastRankDate?: string;
  positionRank?: string;
  fitnessStatus?: string;
  medicalCommissionNumber?: string;
  medicalCommissionDate?: string;
  unit?: string;
  department?: string;
  militarySpecialty?: string;
  tariffCategory?: number;
  salary?: number;
  serviceType?: string;
  serviceStartDate?: string;
  unitStartDate?: string;
  contractEndDate?: string;
  servicePeriods?: string;
  previousServicePlaces?: string;
  militaryDocumentNumber?: string;
  shpoNumber?: string;
  combatExperienceStatus?: boolean;
  combatExperienceNumber?: string;
  combatPeriods?: string;
  [key: string]: FormFieldValue;
}

interface MilitaryDataSectionProps {
  formData: MilitaryFormData;
  onInputChange: (field: string, value: FormFieldValue) => void;
  militaryRanks: Array<{ rank: string; color: string }>;
  departmentsByUnit: Record<string, string[]>;
  calculateSalary: (tariffCategory: number) => number;
}



export const MilitaryDataSection = ({
  formData,
  onInputChange,
  militaryRanks,
  departmentsByUnit,
  calculateSalary,
}: MilitaryDataSectionProps) => {
  const militaryRankOptions = militaryRanks.map(({ rank, color }) => ({
    value: rank,
    label: rank,
    className: color,
  }));

  const unitOptions = Object.keys(departmentsByUnit).map((unit) => ({
    value: unit,
    label: unit,
  }));

  const departmentOptions = formData.unit
    ? departmentsByUnit[formData.unit]?.map((dept) => ({
        value: dept,
        label: dept,
      })) || []
    : [];

  return (
    <>
      <FormField
        label="Посада"
        field="position"
        type="text"
        value={formData.position}
        onChange={onInputChange}
        placeholder="оператор"
      />
      <FormField
        label="Військове звання"
        field="militaryRank"
        type="select"
        value={formData.militaryRank}
        onChange={onInputChange}
        options={militaryRankOptions}
      />
      <FormField
        label="Дата присвоєння останнього звання"
        field="lastRankDate"
        type="date"
        value={formData.lastRankDate}
        onChange={onInputChange}
      />
      <FormField
        label="Військове звання (за посадою)"
        field="positionRank"
        type="select"
        value={formData.positionRank}
        onChange={onInputChange}
        options={militaryRankOptions}
      />
      <FormField
        label="Придатність до військової служби"
        field="fitnessStatus"
        type="select"
        value={formData.fitnessStatus}
        onChange={onInputChange}
        options={FITNESS_STATUS_OPTIONS}
      />
      <FormField
        label="Номер висновку ВЛК"
        field="medicalCommissionNumber"
        type="text"
        value={formData.medicalCommissionNumber}
        onChange={onInputChange}
        placeholder="123456789"
        show={formData.fitnessStatus === "обмежено придатний"}
      />
      <FormField
        label="Дата висновку ВЛК"
        field="medicalCommissionDate"
        type="date"
        value={formData.medicalCommissionDate}
        onChange={onInputChange}
        show={formData.fitnessStatus === "обмежено придатний"}
      />
      <FormField
        label="Підрозділ"
        field="unit"
        type="select"
        value={formData.unit}
        onChange={onInputChange}
        options={unitOptions}
        onFieldChange={() => {
          onInputChange("department", "не_вибрано");
        }}
      />
      <FormField
        label="Відділ"
        field="department"
        type="select"
        value={formData.department}
        onChange={onInputChange}
        options={departmentOptions}
        show={formData.unit && formData.unit !== ""}
      />
      <FormField
        label="ВОС"
        field="militarySpecialty"
        type="text"
        value={formData.militarySpecialty}
        onChange={onInputChange}
        placeholder="041256"
      />
      <FormField
        label="Тарифний розряд"
        field="tariffCategory"
        type="number"
        value={formData.tariffCategory}
        onChange={onInputChange}
        placeholder="4"
        onFieldChange={(value) => {
          onInputChange("salary", calculateSalary(value));
        }}
      />
      <FormField
        label="Оклад"
        field="salary"
        type="number"
        value={formData.salary}
        onChange={onInputChange}
        readonly={true}
      />
      <FormField
        label="Тип служби"
        field="serviceType"
        type="select"
        value={formData.serviceType}
        onChange={onInputChange}
        options={SERVICE_TYPE_OPTIONS}
      />
      <FormField
        label="Дата призову / укладення контракту"
        field="serviceStartDate"
        type="date"
        value={formData.serviceStartDate}
        onChange={onInputChange}
      />
      <FormField
        label="У військовій частині з"
        field="unitStartDate"
        type="date"
        value={formData.unitStartDate}
        onChange={onInputChange}
      />
      <FormField
        label="Дата закінчення контракту"
        field="contractEndDate"
        type="date"
        value={formData.contractEndDate}
        onChange={onInputChange}
        show={formData.serviceType === "контракт"}
      />
      <FormField
        label="Періоди проходження служби"
        field="servicePeriods"
        type="textarea"
        value={formData.servicePeriods}
        onChange={onInputChange}
        placeholder="01.01.2022 - 31.12.2022"
      />
      <FormField
        label="Попередні місця служби"
        field="previousServicePlaces"
        type="textarea"
        value={formData.previousServicePlaces}
        onChange={onInputChange}
        placeholder="A0000"
      />
      <FormField
        label="Номер військового документа"
        field="militaryDocumentNumber"
        type="text"
        value={formData.militaryDocumentNumber}
        onChange={onInputChange}
        placeholder="1234567SN"
      />
      <FormField
        label="Номер ШПО"
        field="shpoNumber"
        type="text"
        value={formData.shpoNumber}
        onChange={onInputChange}
        placeholder="8"
      />
      <FormField
        label="УБД"
        field="combatExperienceStatus"
        type="switch"
        value={formData.combatExperienceStatus}
        onChange={onInputChange}
      />
      <FormField
        label="№ УБД"
        field="combatExperienceNumber"
        type="text"
        value={formData.combatExperienceNumber}
        onChange={onInputChange}
        placeholder="123456789"
        show={formData.combatExperienceStatus}
      />
      <FormField
        label="Періоди участі у бойових діях"
        field="combatPeriods"
        type="textarea"
        value={formData.combatPeriods}
        onChange={onInputChange}
        placeholder="01.09.1939 -- 02.09.1945"
      />
    </>
  );
};