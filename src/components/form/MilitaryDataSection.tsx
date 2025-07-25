import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FormField } from "./FormField";
import { FITNESS_STATUS_OPTIONS, SERVICE_TYPE_OPTIONS } from "@/lib/constants";
import { Separator } from "../ui/separator";

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
  contractEndDate?: string;
  extendedUntilDemobilization?: boolean;
  servicePeriods?: string;
  previousServicePlaces?: string;
  militaryDocumentNumber?: string;
  shpoNumber?: string;
  combatExperienceStatus?: boolean;
  combatExperienceNumber?: string;
  combatPeriods?: string;
  BMT?: boolean;
  professionCourse?: boolean;
  professionCourseValue?: string;

  // Military orders
  appointedBy?: string;
  appointmentOrderNumber?: string;
  appointmentOrderDate?: string;
  enrollmentOrderNumber?: string;
  enrollmentOrderDate?: string;
  dismissalOrderNumber?: string;
  dismissalOrderDate?: string;

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
    <div className="space-y-6">
      {/* Position and Rank Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Посада та звання</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            label="Посада"
            field="position"
            type="text"
            value={formData.position}
            onChange={onInputChange}
            placeholder="оператор"
          />
          <div className="grid grid-cols-1 gap-4 items-start">
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
          </div>
          <FormField
            label="Військове звання (за посадою)"
            field="positionRank"
            type="select"
            value={formData.positionRank}
            onChange={onInputChange}
            options={militaryRankOptions}
          />
        </CardContent>
      </Card>

      {/* Medical and Fitness Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Медичні дані</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            label="Придатність до військової служби"
            field="fitnessStatus"
            type="select"
            value={formData.fitnessStatus}
            onChange={onInputChange}
            options={FITNESS_STATUS_OPTIONS}
          />
          {formData.fitnessStatus === "обмежено придатний" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <FormField
                label="Номер висновку ВЛК"
                field="medicalCommissionNumber"
                type="text"
                value={formData.medicalCommissionNumber}
                onChange={onInputChange}
                placeholder="123456789"
              />
              <FormField
                label="Дата висновку ВЛК"
                field="medicalCommissionDate"
                type="date"
                value={formData.medicalCommissionDate}
                onChange={onInputChange}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Unit and Department Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Підрозділ та спеціальність</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
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
            {formData.unit && formData.unit !== "" && (
              <FormField
                label="Відділ"
                field="department"
                type="select"
                value={formData.department}
                onChange={onInputChange}
                options={departmentOptions}
              />
            )}
          </div>
          <FormField
            label="ВОС"
            field="militarySpecialty"
            type="text"
            value={formData.militarySpecialty}
            onChange={onInputChange}
            placeholder="041256"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
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
          </div>
        </CardContent>
      </Card>
      {/* Service Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium text-gray-600">Інформація про службу</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <FormField
              label="Тип служби"
              field="serviceType"
              type="select"
              value={formData.serviceType}
              onChange={onInputChange}
              options={SERVICE_TYPE_OPTIONS}
            />
            <FormField
              label={formData.serviceType === "контракт" ? "Дата укладення контракту" : "Дата призову"}
              field="serviceStartDate"
              type="date"
              value={formData.serviceStartDate}
              onChange={onInputChange}
            />
          </div>
          {formData.serviceType === "контракт" && (
            <FormField
              label="Дата закінчення контракту"
              field="contractEndDate"
              type="date"
              value={formData.contractEndDate}
              onChange={onInputChange}
            />
          )}
          {formData.serviceType === "контракт" &&
            formData.contractEndDate &&
            (() => {
              const today = new Date();
              const contractEnd = new Date(formData.contractEndDate);
              const isContractExpired = contractEnd < today;

              return isContractExpired ? (
                <FormField
                  label="Контракт продовжено до оголошення демобілізації"
                  field="extendedUntilDemobilization"
                  type="switch"
                  value={formData.extendedUntilDemobilization}
                  onChange={onInputChange}
                />
              ) : null;
            })()}
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
        </CardContent>
      </Card>
      {/* Documents and Combat Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium text-gray-600">Документи та бойовий досвід</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
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
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <FormField
              label="УБД"
              field="combatExperienceStatus"
              type="switch"
              value={formData.combatExperienceStatus}
              onChange={onInputChange}
            />
            {formData.combatExperienceStatus && (
              <FormField
                label="№ УБД"
                field="combatExperienceNumber"
                type="text"
                value={formData.combatExperienceNumber}
                onChange={onInputChange}
                placeholder="123456789"
              />
            )}
          </div>
          <FormField
            label="Періоди участі у бойових діях"
            field="combatPeriods"
            type="textarea"
            value={formData.combatPeriods}
            onChange={onInputChange}
            placeholder="01.09.1939 -- 02.09.1945"
          />
        </CardContent>
      </Card>

      {/* Training and Education */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium text-gray-600">Навчання та підготовка</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <FormField
              label="БЗВП"
              field="BMT"
              type="switch"
              value={formData.BMT}
              onChange={onInputChange}
            />
            <FormField
              label="ФАХ"
              field="professionCourse"
              type="switch"
              value={formData.professionCourse}
              onChange={onInputChange}
            />
          </div>
          {formData.professionCourse && (
            <FormField
              label="ВОС за ФАХом"
              field="professionCourseValue"
              type="text"
              value={formData.professionCourseValue}
              onChange={onInputChange}
              placeholder="123456"
            />
          )}
        </CardContent>
      </Card>

      {/* Military Orders Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium text-gray-600">Накази та призначення</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            label="Ким призначений"
            field="appointedBy"
            type="text"
            value={formData.appointedBy}
            onChange={onInputChange}
            placeholder="Командир частини"
          />
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <FormField
              label="№ наказу про призначення"
              field="appointmentOrderNumber"
              type="text"
              value={formData.appointmentOrderNumber}
              onChange={onInputChange}
              placeholder="123/2024"
            />
            <FormField
              label="Дата наказу про призначення"
              field="appointmentOrderDate"
              type="date"
              value={formData.appointmentOrderDate}
              onChange={onInputChange}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <FormField
              label="№ наказу (про зарахування у списки частини)"
              field="enrollmentOrderNumber"
              type="text"
              value={formData.enrollmentOrderNumber}
              onChange={onInputChange}
              placeholder="456/2024"
            />
            <FormField
              label="Дата наказу (про зарахування у списки частини)"
              field="enrollmentOrderDate"
              type="date"
              value={formData.enrollmentOrderDate}
              onChange={onInputChange}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <FormField
              label="№ наказу (про виключення з списків частини)"
              field="dismissalOrderNumber"
              type="text"
              value={formData.dismissalOrderNumber}
              onChange={onInputChange}
              placeholder="789/2024"
            />
            <FormField
              label="Дата наказу (про виключення з списків частини)"
              field="dismissalOrderDate"
              type="date"
              value={formData.dismissalOrderDate}
              onChange={onInputChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
