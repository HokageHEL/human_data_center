import { FormField } from "./FormField";
import { GENDER_OPTIONS } from "@/lib/constants";

interface GeneralInfoSectionProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
}



export const GeneralInfoSection = ({
  formData,
  onInputChange,
}: GeneralInfoSectionProps) => {
  return (
    <>
      <FormField
        label="Прізвище Імʼя По-батькові"
        field="fullName"
        type="text"
        value={formData.fullName}
        onChange={onInputChange}
        placeholder="Петренко Іван Васильович"
      />
      <FormField
        label="Номер та серія паспорта"
        field="passportNumber"
        type="text"
        value={formData.passportNumber}
        onChange={onInputChange}
        placeholder="12"
      />
      <FormField
        label="ІПН"
        field="taxId"
        type="text"
        value={formData.taxId}
        onChange={onInputChange}
        placeholder="123658912"
      />
      <FormField
        label="Місце реєстрації"
        field="registrationPlace"
        type="text"
        value={formData.registrationPlace}
        onChange={onInputChange}
        placeholder="Вінниця"
      />
      <FormField
        label="Адреса проживання"
        field="address"
        type="text"
        value={formData.address}
        onChange={onInputChange}
        placeholder="вул. Хрещатик, 12"
      />
      <FormField
        label="Родичі"
        field="relatives"
        type="textarea"
        value={formData.relatives}
        onChange={onInputChange}
        placeholder="мама, папа"
      />
      <FormField
        label="Освіта"
        field="education"
        type="textarea"
        value={formData.education}
        onChange={onInputChange}
        placeholder='НТУУ "КПІ"'
      />
      <FormField
        label="Стать"
        field="gender"
        type="select"
        value={formData.gender}
        onChange={onInputChange}
        options={GENDER_OPTIONS}
      />
      <FormField
        label="Дата народження"
        field="birthDate"
        type="date"
        value={formData.birthDate}
        onChange={onInputChange}
      />
      <FormField
        label="Номер телефону"
        field="phoneNumber"
        type="text"
        value={formData.phoneNumber}
        onChange={onInputChange}
        placeholder="0971234567"
      />
    </>
  );
};