import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getArchivedPeople, restorePerson, permanentlyDeletePerson, Person } from "@/lib/data";
import { FilterSection } from "@/components/FilterSection";
import { SearchAndTableSection } from "@/components/SearchAndTableSection";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Filter, Download } from "lucide-react";
import { useArchiveFilters } from "@/hooks/use-archive-filters";
import { ExportColumnDialog } from "@/components/ExportColumnDialog";
import {
  ALL_TABLE_COLUMNS,
  type TableColumn,
} from "@/lib/constants/all-table-columns";
import { REQUIRED_PERSON_FIELDS } from "@/lib/constants/person-fields";
import {
  getMilitaryRankNames,
  isRankInCategory,
} from "@/lib/constants/military";

const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const calculateCompletionPercentage = (person: Person): number => {
  const filledRequiredFields = REQUIRED_PERSON_FIELDS.filter(
    (field) =>
      person[field as keyof Person] &&
      person[field as keyof Person].toString().trim() !== ""
  ).length;

  const totalFields = REQUIRED_PERSON_FIELDS.length;
  return Math.round((filledRequiredFields / totalFields) * 100);
};

type SortField =
  | "fullName"
  | "birthDate"
  | "age"
  | "militaryRank"
  | "position"
  | "shpoNumber"
  | "gender"
  | "completionPercentage";

const Archive = () => {
  const navigate = useNavigate();
  const {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    sortConfig,
    setSortConfig,
    resetFilters,
  } = useArchiveFilters();
  const [showFilters, setShowFilters] = useState(false);
  const [people, setPeople] = useState<Array<Person>>([]);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  useEffect(() => {
    const loadArchivedPeople = async () => {
      try {
        const archivedPeople = await getArchivedPeople();
        setPeople(archivedPeople);
      } catch (error) {
        console.error("Error loading archived people:", error);
      }
    };

    loadArchivedPeople();
  }, []);



  const filteredPeople = people
    .map((person) => ({
      ...person,
      completionPercentage: calculateCompletionPercentage(person),
    }))
    .filter((person) => {
      const matchesSearch =
        searchTerm === "" ||
        person.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (person.position &&
          person.position.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (person.militaryRank &&
          person.militaryRank.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesBirthDate =
        !filters.birthDate || person.birthDate.includes(filters.birthDate);
      const matchesMilitaryRank =
        filters.militaryRank.length === 0 ||
        (person.militaryRank
          ? filters.militaryRank.some((rank) => {
              switch (rank) {
                case "Офіцери":
                  return isRankInCategory(person.militaryRank, "OFFICERS");
                case "Сержанти":
                  return isRankInCategory(person.militaryRank, "SERGEANTS");
                case "Солдати":
                  return isRankInCategory(person.militaryRank, "SOLDIERS");
                default:
                  return false;
              }
            })
          : filters.militaryRank.length === 0);

      const matchesPositionRank =
        filters.positionRank.length === 0 ||
        (person.positionRank
          ? filters.positionRank.some((rank) => {
              switch (rank) {
                case "Офіцери":
                  return isRankInCategory(person.positionRank, "OFFICERS");
                case "Сержанти":
                  return isRankInCategory(person.positionRank, "SERGEANTS");
                case "Солдати":
                  return isRankInCategory(person.positionRank, "SOLDIERS");
                default:
                  return false;
              }
            })
          : filters.positionRank.length === 0);
      const matchesUnit =
        !filters.unit ||
        filters.unit === "all" ||
        person.unit.toLowerCase().includes(filters.unit.toLowerCase());
      const matchesGender =
        !filters.gender ||
        filters.gender === "all" ||
        person.gender === filters.gender;
      const matchesFitnessStatus =
        !filters.fitnessStatus ||
        filters.fitnessStatus === "all" ||
        person.fitnessStatus === filters.fitnessStatus;
      const matchesIsInPPD =
        !filters.isInPPD || (filters.isInPPD && person.isInPPD);
      const matchesCombatExperience =
        filters.combatExperienceStatus === "all" ||
        (filters.combatExperienceStatus === "with" &&
          person.combatExperienceStatus) ||
        (filters.combatExperienceStatus === "without" &&
          !person.combatExperienceStatus);

      return (
        matchesSearch &&
        matchesBirthDate &&
        matchesMilitaryRank &&
        matchesPositionRank &&
        matchesUnit &&
        matchesGender &&
        matchesFitnessStatus &&
        matchesIsInPPD &&
        matchesCombatExperience
      );
    })
    .sort((a, b) => {
      if (sortConfig.order === null) return 0;

      const order = sortConfig.order === "asc" ? 1 : -1;
      const field = sortConfig.field;

      // Special handling for shpoNumber field
      if (field === "shpoNumber") {
        const aValue = Number(a[field]) || 999;
        const bValue = Number(b[field]) || 999;
        return (aValue - bValue) * order;
      }

      // Special handling for militaryRank field
      if (field === "militaryRank") {
        const militaryRankNames = getMilitaryRankNames();
        const aIndex = militaryRankNames.indexOf(a[field]);
        const bIndex = militaryRankNames.indexOf(b[field]);
        return (aIndex - bIndex) * order;
      }

      // Special handling for completionPercentage field
      if (field === "completionPercentage") {
        return (a.completionPercentage - b.completionPercentage) * order;
      }

      // Special handling for age field
      if (field === "age") {
        const aAge = calculateAge(a.birthDate);
        const bAge = calculateAge(b.birthDate);
        return (aAge - bAge) * order;
      }

      if (a[field] < b[field]) return -1 * order;
      if (a[field] > b[field]) return 1 * order;
      return 0;
    });

  const handleSort = (field: SortField) => {
    setSortConfig((prev) => {
      if (prev.field !== field) {
        return { field, order: "asc" };
      }
      if (prev.order === "asc") {
        return { field, order: "desc" };
      }
      if (prev.order === "desc") {
        return { field, order: null };
      }
      return { field, order: "asc" };
    });
  };

  const handleRestore = async (personName: string) => {
    try {
      await restorePerson(personName);
      // Reload archived people after restore
      const archivedPeople = await getArchivedPeople();
      setPeople(archivedPeople);
      console.log("Person restored:", personName);
    } catch (error) {
      console.error("Error restoring person:", error);
    }
  };

  const handlePermanentDelete = async (personName: string) => {
    try {
      await permanentlyDeletePerson(personName);
      // Reload archived people after permanent deletion
      const archivedPeople = await getArchivedPeople();
      setPeople(archivedPeople);
      console.log("Person permanently deleted:", personName);
    } catch (error) {
      console.error("Error permanently deleting person:", error);
    }
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  const handleOpenExportDialog = () => {
    setIsExportDialogOpen(true);
  };

  const handleExport = async (
    selectedColumns: TableColumn[],
    exportType: "word" | "excel"
  ) => {
    // Export logic would go here
    console.log("Export:", { selectedColumns, exportType });
  };

  const isAnyFilterActive = () => {
    return (
      searchTerm !== "" ||
      filters.birthDate !== "" ||
      filters.militaryRank.length > 0 ||
      filters.positionRank.length > 0 ||
      filters.unit !== "" ||
      filters.gender !== "" ||
      filters.fitnessStatus !== "" ||
      filters.isInPPD ||
      filters.combatExperienceStatus !== "all"
    );
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-primary/10 p-3 sm:p-4 lg:p-6">
      <div className="w-full max-w-[1600px] mx-auto space-y-4">
        {/* Archive Header */}
        <div className="text-center py-4">
          <h1 className="text-3xl font-bold text-foreground">Archive</h1>
        </div>

        {/* Top Controls Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Фільтри
              {showFilters ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            {isAnyFilterActive() && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="text-muted-foreground hover:text-foreground/90"
              >
                Скинути
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <Button
              onClick={handleOpenExportDialog}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Експорт</span>
              <span className="sm:hidden">Е</span>
            </Button>
          </div>
        </div>

        {/* Collapsible Filters Section */}
        {showFilters && (
          <div className="p-4 bg-card border border-border rounded-lg">
            <FilterSection
              filters={filters}
              setFilters={setFilters}
              people={people}
            />
          </div>
        )}

        {/* Main Table Section - Full Width */}
        <div className="w-full">
          <SearchAndTableSection
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            filteredPeople={filteredPeople}
            handleSort={handleSort}
            renderActions={(person) => (
              <div className="flex gap-2">
                <Button
                  onClick={() => handleRestore(person.fullName)}
                  variant="outline"
                  size="sm"
                  className="text-green-600 hover:text-green-700"
                >
                  Restore
                </Button>
                <Button
                  onClick={() => handlePermanentDelete(person.fullName)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              </div>
            )}
            setPeople={setPeople}
            isFromArchive={true}
          />
        </div>
      </div>

      <ExportColumnDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        onExport={handleExport}
        columns={ALL_TABLE_COLUMNS}
      />
    </div>
  );
};

export default Archive;