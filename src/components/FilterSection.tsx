import { Dispatch, SetStateAction } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Person } from "@/lib/data";

interface FilterSectionProps {
  filters: {
    birthDate: string;
    militaryRank: string[];
    positionRank: string[];
    unit: string;
    gender: string;
    fitnessStatus: string;
    isInPPD: boolean;
    combatExperienceStatus: boolean;
  };
  setFilters: Dispatch<
    SetStateAction<{
      birthDate: string;
      militaryRank: string[];
      positionRank: string[];
      unit: string;
      gender: string;
      fitnessStatus: string;
      isInPPD: boolean;
      combatExperienceStatus: boolean;
    }>
  >;
  people: Person[];
}

export const FilterSection = ({
  filters,
  setFilters,
  people,
}: FilterSectionProps) => {

  return (
    <Card className="p-4">
      <div className="mb-4">
        <h3 className="font-semibold">Фільтри</h3>
      </div>
      <div className="space-y-2">
        <div className="space-y-2">
          <Label>Підрозділ</Label>
          <Select
            value={filters.unit}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, unit: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Оберіть підрозділ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="all" value="all">
                Всі
              </SelectItem>
              {Array.from(new Set(people.map((p) => p.unit)))
                .filter(Boolean)
                .sort()
                .map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Стать</Label>
          <Select
            value={filters.gender}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, gender: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Оберіть стать" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="all" value="all">
                Всі
              </SelectItem>
              <SelectItem key="male" value="Ч">
                Чоловіча
              </SelectItem>
              <SelectItem key="female" value="Ж">
                Жіноча
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Придатність</Label>
          <Select
            value={filters.fitnessStatus}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, fitnessStatus: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Оберіть статус придатності" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="all" value="all">
                Всі
              </SelectItem>
              <SelectItem key="fit" value="придатний">
                Придатний
              </SelectItem>
              <SelectItem key="limited" value="обмежено придатний">
                Обмежено придатний
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="officers"
                checked={filters.militaryRank.includes("Офіцери")}
                onCheckedChange={(checked) =>
                  setFilters((prev) => ({
                    ...prev,
                    militaryRank: checked
                      ? [...prev.militaryRank, "Офіцери"]
                      : prev.militaryRank.filter((rank) => rank !== "Офіцери"),
                  }))
                }
              />
              <Label htmlFor="officers">Офіцери</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="sergeants"
                checked={filters.militaryRank.includes("Сержанти")}
                onCheckedChange={(checked) =>
                  setFilters((prev) => ({
                    ...prev,
                    militaryRank: checked
                      ? [...prev.militaryRank, "Сержанти"]
                      : prev.militaryRank.filter((rank) => rank !== "Сержанти"),
                  }))
                }
              />
              <Label htmlFor="sergeants">Сержанти</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="soldiers"
                checked={filters.militaryRank.includes("Солдати")}
                onCheckedChange={(checked) =>
                  setFilters((prev) => ({
                    ...prev,
                    militaryRank: checked
                      ? [...prev.militaryRank, "Солдати"]
                      : prev.militaryRank.filter((rank) => rank !== "Солдати"),
                  }))
                }
              />
              <Label htmlFor="soldiers">Солдати</Label>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="ppd"
            checked={filters.isInPPD}
            onCheckedChange={(checked) =>
              setFilters((prev) => ({ ...prev, isInPPD: checked }))
            }
          />
          <Label htmlFor="ppd">В ППД</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="ubd"
            checked={filters.combatExperienceStatus}
            onCheckedChange={(checked) =>
              setFilters((prev) => ({
                ...prev,
                combatExperienceStatus: checked,
              }))
            }
          />
          <Label htmlFor="ubd">УБД</Label>
        </div>
      </div>
    </Card>
  );
};
