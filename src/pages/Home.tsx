import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Plus, User, Filter, ArrowUpDown } from "lucide-react";
import { getActivePeople, deletePerson, Person } from "@/lib/data";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortField = "fullName" | "birthDate" | "militaryRank";
type SortOrder = "asc" | "desc";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    birthDate: "",
    militaryRank: "",
  });
  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    order: SortOrder;
  }>({
    field: "fullName",
    order: "asc",
  });
  const [people, setPeople] = useState<Array<Person>>([]);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

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
    .filter((person) => {
      const matchesSearch = person.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesBirthDate =
        !filters.birthDate || person.birthDate.includes(filters.birthDate);
      const matchesMilitaryRank =
        !filters.militaryRank ||
        person.militaryRank
          .toLowerCase()
          .includes(filters.militaryRank.toLowerCase());

      return matchesSearch && matchesBirthDate && matchesMilitaryRank;
    })
    .sort((a, b) => {
      const order = sortConfig.order === "asc" ? 1 : -1;
      const field = sortConfig.field;

      if (a[field] < b[field]) return -1 * order;
      if (a[field] > b[field]) return 1 * order;
      return 0;
    });

  const handlePersonClick = (person: { fullName: string }) => {
    navigate(`/edit/${encodeURIComponent(person.fullName)}`);
  };

  const handleAddPerson = () => {
    navigate("/edit/new");
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

  const handleSort = (field: SortField) => {
    setSortConfig((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search and List Section */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex gap-4">
              <Input
                type="text"
                placeholder="Пошук..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 text-lg border-2 border-border focus:border-primary"
              />
              <Button
                onClick={handleAddPerson}
                className="h-12 px-6 text-lg  hover:bg-green-300"
                size="lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Додати
              </Button>
            </div>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center gap-4 mb-4">
                Сортувати за:
                <Select
                  value={sortConfig.field}
                  onValueChange={(value: SortField) => handleSort(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Сортувати за" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fullName">Ім'я</SelectItem>
                    <SelectItem value="birthDate">Дата народження</SelectItem>
                    <SelectItem value="militaryRank">ВОС</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleSort(sortConfig.field)}
                >
                  <ArrowUpDown
                    className={`h-4 w-4 ${
                      sortConfig.order === "desc" ? "transform rotate-180" : ""
                    }`}
                  />
                </Button>
              </div>

              <div className="space-y-2">
                {filteredPeople.map((person, index) => (
                  <div
                    key={person.fullName}
                    onClick={() => handlePersonClick(person)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex gap-4 items-center">
                        <span className="text-foreground font-medium mr-3">
                          {index + 1}.
                        </span>

                        <Avatar className="h-10 w-10">
                          {person.photo ? (
                            <AvatarImage
                              src={person.photo}
                              alt={person.fullName}
                            />
                          ) : (
                            <AvatarFallback>
                              <User className="h-6 w-6" />
                            </AvatarFallback>
                          )}
                        </Avatar>

                        <span className="text-foreground">
                          {person.fullName}
                        </span>
                      </div>
                    </div>
                    <Button
                      className="h-12 px-6 text-sm hover:bg-red-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(person.fullName);
                      }}
                    >
                      Видалити
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            <Card className="p-6 bg-card">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Dark Mode</span>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={(checked) =>
                    setTheme(checked ? "dark" : "light")
                  }
                  className="border-1px"
                />
              </div>
            </Card>

            <Card className="p-6 bg-card">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-4 w-4" />
                  <h3 className="font-medium">Фільтри</h3>
                </div>

                <div className="space-y-2">
                  <Label>Дата народження</Label>
                  <Input
                    type="date"
                    value={filters.birthDate}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        birthDate: e.target.value,
                      }))
                    }
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>ВОС</Label>
                  <Input
                    type="text"
                    value={filters.militaryRank}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        militaryRank: e.target.value,
                      }))
                    }
                    placeholder="Введіть ВОС"
                    className="w-full"
                  />
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    setFilters({
                      birthDate: "",
                      militaryRank: "",
                    })
                  }
                >
                  Скинути фільтри
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
