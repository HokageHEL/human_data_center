import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { getActivePeople, deletePerson, Person } from "@/lib/data";
import { FilterSection } from "@/components/FilterSection";
import { SearchAndTableSection } from "@/components/SearchAndTableSection";
import BirthdayTracker from "@/components/BirthdayTracker";
import ContractTracker from "@/components/ContractTracker";
import StatusTracker from "@/components/StatusTracker";
import { getMilitaryRankNames, RANK_CATEGORIES, isRankInCategory, REQUIRED_PERSON_FIELDS, OPTIONAL_PERSON_FIELDS } from "@/lib/constants";

const calculateCompletionPercentage = (person: Person): number => {
  let filledRequiredFields = REQUIRED_PERSON_FIELDS.filter(
    (field) =>
      person[field as keyof Person] &&
      person[field as keyof Person].toString().trim() !== ""
  ).length;

  // Documents count as a field if there are any
  if (person.documents && person.documents.length > 0) {
    filledRequiredFields++;
  }

  const totalFields = REQUIRED_PERSON_FIELDS.length + 1; // +1 for documents
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    birthDate: "",
    militaryRank: [],
    positionRank: [],
    unit: "all",
    gender: "all",
    fitnessStatus: "all",
    isInPPD: false,
    combatExperienceStatus: false,
  });
  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    order: SortOrder;
  }>({
    field: "fullName",
    order: null,
  });
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
      const matchesSearch = person.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesBirthDate =
        !filters.birthDate || person.birthDate.includes(filters.birthDate);
      const matchesMilitaryRank =
        filters.militaryRank.length === 0 ||
        (person.militaryRank
          ? filters.militaryRank.some((rank) => {
              switch (rank) {
                case "Офіцери":
                  return isRankInCategory(person.militaryRank, 'OFFICERS');
                case "Сержанти":
                  return isRankInCategory(person.militaryRank, 'SERGEANTS');
                case "Солдати":
                  return isRankInCategory(person.militaryRank, 'SOLDIERS');
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
                  return isRankInCategory(person.positionRank, 'OFFICERS');
                case "Сержанти":
                  return isRankInCategory(person.positionRank, 'SERGEANTS');
                case "Солдати":
                  return isRankInCategory(person.positionRank, 'SOLDIERS');
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
        !filters.combatExperienceStatus ||
        (filters.combatExperienceStatus && person.combatExperienceStatus);

      return (
        matchesSearch &&
        matchesBirthDate &&
        matchesMilitaryRank &&
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
    setFilters({
      birthDate: "",
      militaryRank: [],
      positionRank: [],
      unit: "all",
      gender: "all",
      fitnessStatus: "all",
      isInPPD: false,
      combatExperienceStatus: false,
    });
    setSearchTerm("");
  };

  const isAnyFilterActive = () => {
    return searchTerm !== "";
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background p-6 flex justify-center">
      <div className="w-full max-w-8xl">
        <div className="flex justify-center">
          <div className="w-full max-w-7xl grid grid-cols-[auto,1fr,1fr] gap-6">
            {/* Filters Section */}
            <div className="space-y-4">
              <FilterSection
                filters={filters}
                setFilters={setFilters}
                people={people}
                handleResetFilters={handleResetFilters}
              />
              <StatusTracker people={filteredPeople} />
              <BirthdayTracker people={filteredPeople} />
              <ContractTracker people={filteredPeople} />
            </div>

            {/* Search and Table Section */}
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
    </div>
  );
};

export default Home;
