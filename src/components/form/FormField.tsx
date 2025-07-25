import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FieldOption {
  value: string;
  label: string;
  className?: string;
}

type FormFieldValue = string | number | boolean | null | undefined;

interface FormFieldProps {
  label: string;
  field: string;
  type: "text" | "textarea" | "date" | "number" | "select" | "switch";
  value: FormFieldValue;
  onChange: (field: string, value: FormFieldValue) => void;
  options?: FieldOption[];
  show?: boolean;
  readonly?: boolean;
  placeholder?: string;
  onFieldChange?: (value: FormFieldValue) => void;
}

export const FormField = ({
  label,
  field,
  type,
  value,
  onChange,
  options,
  show = true,
  readonly = false,
  placeholder,
  onFieldChange,
}: FormFieldProps) => {
  if (!show) return null;

  const handleChange = (newValue: FormFieldValue) => {
    onChange(field, newValue);
    onFieldChange?.(newValue);
  };

  return (
    <div className="space-y-2">
      <Label className="block min-h-[1.25rem] leading-tight">{label}</Label>
      {type === "text" && (
        <Input
          value={value || ""}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder || `Введіть ${label.toLowerCase()}`}
          readOnly={readonly}
        />
      )}
      {type === "textarea" && (
        <Textarea
          value={value || ""}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder || `Введіть ${label.toLowerCase()}`}
          readOnly={readonly}
        />
      )}
      {type === "date" && (
        <DatePicker
          value={value as string || ""}
          onChange={(date) => handleChange(date)}
          placeholder={placeholder || "24.04.2003"}
          disabled={readonly}
          id={field}
        />
      )}
      {type === "number" && (
        <Input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value || ""}
          onChange={(e) => {
            const numericValue = e.target.value.replace(/[^0-9]/g, "");
            const newValue = numericValue === "" ? 0 : parseInt(numericValue);
            handleChange(newValue);
          }}
          readOnly={readonly}
          placeholder={placeholder}
        />
      )}
      {type === "select" && options && (
        <Select value={value || ""} onValueChange={handleChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder || "Оберіть..."} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className={option.className}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {type === "switch" && (
        <div className="flex items-center space-x-2">
          <Switch
            checked={value || false}
            onCheckedChange={handleChange}
          />
          <span className="text-sm">{value ? "Так" : "Ні"}</span>
        </div>
      )}
    </div>
  );
};