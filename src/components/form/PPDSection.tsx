import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ABSENCE_STATUS_OPTIONS } from "@/lib/constants";

interface PPDSectionProps {
  isInPPD: boolean;
  onIsInPPDChange: (isInPPD: boolean) => void;
  absenceStatus: string;
  onAbsenceStatusChange: (status: string) => void;
  onStatusChange: (status: string) => void;
}

/**
 * PPD (Personnel Personnel Department) Section Component
 * 
 * Handles the logic for determining if a person is in PPD (Personnel Personnel Department)
 * and manages absence status selection when they are not in PPD.
 * 
 * Features:
 * - Toggle switch for PPD status
 * - Conditional absence status selection when not in PPD
 * - Automatic status synchronization
 */
export function PPDSection({
  isInPPD,
  onIsInPPDChange,
  absenceStatus,
  onAbsenceStatusChange,
  onStatusChange,
}: PPDSectionProps) {
  const handleAbsenceStatusChange = (value: string) => {
    onAbsenceStatusChange(value);
    onStatusChange(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="isInPPD"
          checked={isInPPD}
          onCheckedChange={onIsInPPDChange}
        />
        <Label htmlFor="isInPPD">В ППД</Label>
      </div>

      {!isInPPD && (
        <div className="space-y-2">
          <Label htmlFor="absenceStatus">Причина відсутності</Label>
          <Select
            value={absenceStatus}
            onValueChange={handleAbsenceStatusChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Оберіть статус відсутності" />
            </SelectTrigger>
            <SelectContent>
              {ABSENCE_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}