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
import { RankFilter } from "@/components/RankFilter";

interface FilterSectionProps {
  filters: {
    birthDate: string;
    militaryRank: string[];
    positionRank: string[];
    unit: string;
    gender: string;
    fitnessStatus: string;
    isInPPD: boolean;
    combatExperienceStatus: string;
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
      combatExperienceStatus: string;
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Column 1: Basic Filters */}
        <div className="space-y-4">
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
        </div>

        {/* Column 2: Status Filters */}
        <div className="space-y-4">
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
              <Label>УБД</Label>
              <Select
                value={filters.combatExperienceStatus}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    combatExperienceStatus: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть статус УБД" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="all" value="all">
                    Всі
                  </SelectItem>
                  <SelectItem key="with" value="with">
                    З УБД
                  </SelectItem>
                  <SelectItem key="without" value="without">
                    Без УБД
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Column 3: Rank Filters */}
        <div className="space-y-4">
          <RankFilter
            label="Військові звання"
            selectedRanks={filters.militaryRank}
            onRankChange={(ranks) =>
              setFilters((prev) => ({ ...prev, militaryRank: ranks }))
            }
            idPrefix="military"
          />
          <RankFilter
            label="Посадові звання"
            selectedRanks={filters.positionRank}
            onRankChange={(ranks) =>
              setFilters((prev) => ({ ...prev, positionRank: ranks }))
            }
            idPrefix="position"
          />
        </div>
      </div>
    </Card>
  );
};
