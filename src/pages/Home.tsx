import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { getActivePeople, deletePerson, Person } from "@/lib/data";
import { FilterSection } from "@/components/FilterSection";
import { SearchAndTableSection } from "@/components/SearchAndTableSection";
import BirthdayTracker from "@/components/BirthdayTracker";
import ContractTracker from "@/components/ContractTracker";
import StatusTracker from "@/components/StatusTracker";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import {
  getMilitaryRankNames,
  isRankInCategory,
  REQUIRED_PERSON_FIELDS,
} from "@/lib/constants";
import { useUrlFilters } from "@/hooks/use-url-filters";

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
  | "militaryRank"
  | "position"
  | "shpoNumber"
  | "gender"
  | "completionPercentage";
type SortOrder = "asc" | "desc" | null;

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

const Home = () => {
  const { searchTerm, setSearchTerm, filters, setFilters, sortConfig, setSortConfig, resetFilters } = useUrlFilters();
  const [showFilters, setShowFilters] = useState(false);
  const [people, setPeople] = useState<Array<Person>>([]);

  useEffect(() => {
    const loadPeople = async () => {
      try {
        const activePeople = await getActivePeople();
        setPeople(activePeople);
      } catch (error) {
        console.error("Error loading people:", error);
      }
    };

    loadPeople();
  }, []);

  const filteredPeople = people
    .map((person) => ({
      ...person,
      completionPercentage: calculateCompletionPercentage(person),
    }))
    .filter((person) => {
      const matchesSearch = searchTerm === "" || 
        person.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (person.position && person.position.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (person.militaryRank && person.militaryRank.toLowerCase().includes(searchTerm.toLowerCase()));
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
      (filters.combatExperienceStatus === "with" && person.combatExperienceStatus) ||
      (filters.combatExperienceStatus === "without" && !person.combatExperienceStatus);

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

  const handleDelete = async (personName: string) => {
    try {
      await deletePerson(personName);
      const activePeople = await getActivePeople();
      setPeople(activePeople);
    } catch (error) {
      console.error("Error deleting person:", error);
    }
  };

  const handleResetFilters = () => {
    resetFilters();
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

  // Helper functions to check if trackers have relevant data
  const getUpcomingBirthdays = (daysRange = 10) => {
    const today = new Date();
    const currentYear = today.getFullYear();

    const getDaysUntilBirthday = (birthDate: string): number => {
      const [year, month, day] = birthDate.split("-").map(Number);
      const nextBirthday = new Date(currentYear, month - 1, day);

      if (nextBirthday < today) {
        nextBirthday.setFullYear(currentYear + 1);
      }

      const timeDiff = nextBirthday.getTime() - today.getTime();
      return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    };

    return filteredPeople
      .filter((p) => !!p.birthDate)
      .filter((p) => getDaysUntilBirthday(p.birthDate) <= daysRange);
  };

  const getUpcomingContracts = (daysRange = 10) => {
    const today = new Date();
    const currentYear = today.getFullYear();

    const getDaysUntilContract = (contractDate: string): number => {
      const [year, month, day] = contractDate.split("-").map(Number);
      const nextContract = new Date(currentYear, month - 1, day);

      if (nextContract < today) {
        nextContract.setFullYear(currentYear + 1);
      }

      const timeDiff = nextContract.getTime() - today.getTime();
      return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    };

    return filteredPeople
      .filter((p) => !!p.contractEndDate)
      .filter((p) => getDaysUntilContract(p.contractEndDate) <= daysRange);
  };

  const hasUpcomingBirthdays = getUpcomingBirthdays().length > 0;
  const hasUpcomingContracts = getUpcomingContracts().length > 0;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background p-3 sm:p-4 lg:p-6">
      <div className="w-full max-w-[1600px] mx-auto space-y-4">
        {/* Top Controls Bar */}
        <div className="flex items-center justify-start gap-4">
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
              className="text-muted-foreground hover:text-foreground"
            >
              Скинути
            </Button>
          )}
        </div>

        {/* Collapsible Filters Section */}
        {showFilters && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-4 lg:gap-6 p-4 bg-card border border-border rounded-lg">
            {/* Main Filters */}
            <div>
              <FilterSection
                filters={filters}
                setFilters={setFilters}
                people={people}
              />
            </div>
          </div>
        )}

        {/* Conditional Birthday and Contract Trackers - Always at top of table when data exists */}
        {(hasUpcomingBirthdays || hasUpcomingContracts) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hasUpcomingBirthdays && (
              <BirthdayTracker people={filteredPeople} />
            )}
            {hasUpcomingContracts && (
              <ContractTracker people={filteredPeople} />
            )}
          </div>
        )}

        {/* Status Tracker - Compact view when filters are hidden */}
        {!showFilters && (
          <div className="lg:hidden">
            <StatusTracker people={filteredPeople} />
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
            handleDelete={handleDelete}
            setPeople={setPeople}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
