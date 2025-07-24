import { Dispatch, SetStateAction } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface RankFilterProps {
  label: string;
  selectedRanks: string[];
  onRankChange: (ranks: string[]) => void;
  idPrefix: string;
}

export const RankFilter = ({
  label,
  selectedRanks,
  onRankChange,
  idPrefix,
}: RankFilterProps) => {
  const ranks = [
    { key: "Офіцери", label: "Офіцери" },
    { key: "Сержанти", label: "Сержанти" },
    { key: "Солдати", label: "Солдати" },
  ];

  const handleRankToggle = (rankKey: string, checked: boolean) => {
    const updatedRanks = checked
      ? [...selectedRanks, rankKey]
      : selectedRanks.filter((rank) => rank !== rankKey);
    onRankChange(updatedRanks);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        {ranks.map((rank) => (
          <div key={rank.key} className="flex items-center space-x-2">
            <Switch
              id={`${idPrefix}-${rank.key.toLowerCase()}`}
              checked={selectedRanks.includes(rank.key)}
              onCheckedChange={(checked) =>
                handleRankToggle(rank.key, checked)
              }
            />
            <Label htmlFor={`${idPrefix}-${rank.key.toLowerCase()}`}>
              {rank.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};