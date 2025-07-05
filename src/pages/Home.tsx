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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortField = "fullName" | "birthDate" | "militaryRank" | "position";
type SortOrder = "asc" | "desc";

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
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search and Table Section */}
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
                className="h-12 px-6 text-lg hover:bg-green-300"
                size="lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Додати
              </Button>
            </div>

            <Card className="p-6 bg-card border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">№ШПО</TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("fullName")}
                    >
                      <div className="flex items-center gap-2">
                        ПІБ
                        <ArrowUpDown className={`h-4 w-4 ${sortConfig.field === "fullName" && sortConfig.order === "desc" ? "transform rotate-180" : ""}`} />
                      </div>
                    </TableHead>
                    <TableHead>Стать</TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("birthDate")}
                    >
                      <div className="flex items-center gap-2">
                        Дата народження
                        <ArrowUpDown className={`h-4 w-4 ${sortConfig.field === "birthDate" && sortConfig.order === "desc" ? "transform rotate-180" : ""}`} />
                      </div>
                    </TableHead>
                    <TableHead>Вік</TableHead>
                    <TableHead>Номер телефону</TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("militaryRank")}
                    >
                      <div className="flex items-center gap-2">
                        Військове звання
                        <ArrowUpDown className={`h-4 w-4 ${sortConfig.field === "militaryRank" && sortConfig.order === "desc" ? "transform rotate-180" : ""}`} />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("position")}
                    >
                      <div className="flex items-center gap-2">
                        Посада
                        <ArrowUpDown className={`h-4 w-4 ${sortConfig.field === "position" && sortConfig.order === "desc" ? "transform rotate-180" : ""}`} />
                      </div>
                    </TableHead>
                    <TableHead className="w-[100px]">Дії</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPeople.map((person, index) => (
                    <TableRow
                      key={person.fullName}
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => handlePersonClick(person)}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            {person.photo ? (
                              <AvatarImage
                                src={person.photo}
                                alt={person.fullName}
                              />
                            ) : (
                              <AvatarFallback>
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          {person.fullName}
                        </div>
                      </TableCell>
                      <TableCell>{person.gender || "Ч"}</TableCell>
                      <TableCell>{person.birthDate}</TableCell>
                      <TableCell>{calculateAge(person.birthDate)}</TableCell>
                      <TableCell>{person.phoneNumber}</TableCell>
                      <TableCell>{person.militaryRank}</TableCell>
                      <TableCell>{person.position}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(person.fullName);
                          }}
                        >
                          Видалити
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
