import { Dispatch, SetStateAction, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Plus, User, ArrowUpDown, GripHorizontal } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Person, addPerson } from "@/lib/data";

const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const calculateAge = (birthDate: string): number => {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SortField =
  | "fullName"
  | "birthDate"
  | "militaryRank"
  | "position"
  | "shpoNumber"
  | "gender";
type SortOrder = "asc" | "desc" | null;

interface SearchAndTableSectionProps {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  sortConfig: {
    field: SortField;
    order: SortOrder;
  };
  setSortConfig: Dispatch<
    SetStateAction<{
      field: SortField;
      order: SortOrder;
    }>
  >;
  filteredPeople: Person[];
  handleSort: (field: SortField) => void;
  handleDelete: (personName: string) => void;
  setPeople: Dispatch<SetStateAction<Person[]>>;
}

export const SearchAndTableSection = ({
  searchTerm,
  setSearchTerm,
  sortConfig,
  setSortConfig,
  filteredPeople,
  handleSort,
  handleDelete,
  setPeople,
}: SearchAndTableSectionProps) => {
  const navigate = useNavigate();
  const draggedColumn = useRef<number | null>(null);
  const draggedOverColumn = useRef<number | null>(null);
  const [dropIndicator, setDropIndicator] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const defaultColumns = [
    { field: "completionPercentage", label: "Заповнено", width: "w-[120px]" },
    { field: "shpoNumber", label: "№ШПО", width: "w-[80px]" },
    { field: "fullName", label: "ПІБ", width: "w-[200px]" },
    { field: "birthDate", label: "Дата народження", width: "w-[150px]" },
    { field: "militaryRank", label: "Військове звання", width: "w-[150px]" },
    { field: "position", label: "Посада", width: "w-[150px]" },
    { field: "gender", label: "Стать", width: "w-[100px]" },
  ];

  const [columns, setColumns] = useState(() => {
    const savedColumns = localStorage.getItem("tableColumns");
    return savedColumns ? JSON.parse(savedColumns) : defaultColumns;
  });

  useEffect(() => {
    localStorage.setItem("tableColumns", JSON.stringify(columns));
  }, [columns]);

  const handleDragStart = (index: number) => {
    draggedColumn.current = index;
    setDropIndicator(index);
    setIsDragging(true);
  };

  const handleDragEnter = (index: number) => {
    draggedOverColumn.current = index;
    setDropIndicator(index);
  };

  const handleDragEnd = () => {
    if (draggedColumn.current !== null && draggedOverColumn.current !== null) {
      const newColumns = [...columns];
      const draggedItem = newColumns[draggedColumn.current];
      newColumns.splice(draggedColumn.current, 1);
      newColumns.splice(draggedOverColumn.current, 0, draggedItem);
      setColumns(newColumns);
    }
    draggedColumn.current = null;
    draggedOverColumn.current = null;
    setDropIndicator(null);
    setIsDragging(false);
  };

  const resetColumnOrder = () => {
    setColumns(defaultColumns);
    localStorage.setItem("tableColumns", JSON.stringify(defaultColumns));
  };

  const handlePersonClick = (person: Person) => {
    console.log("Navigating to edit page for person:", person.fullName);
    const encodedName = encodeURIComponent(person.fullName);
    console.log("Encoded name for URL:", encodedName);
    navigate(`/edit/${encodedName}`);
  };

  const handleAddPerson = () => {
    console.log("Navigating to add new person page");
    navigate("/edit/new");
  };

  const renderCell = (person: Person, field: string) => {
    switch (field) {
      case "completionPercentage":
        return (
          <div className="flex items-center gap-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className={`h-2.5 rounded-full ${
                  person.completionPercentage >= 80
                    ? "bg-green-600"
                    : person.completionPercentage >= 50
                    ? "bg-yellow-400"
                    : "bg-red-600"
                }`}
                style={{ width: `${person.completionPercentage}%` }}
              ></div>
            </div>
            <span className="min-w-[3ch]">{person.completionPercentage}%</span>
          </div>
        );
      case "shpoNumber":
        return person.shpoNumber;
      case "fullName":
        return <div className="flex items-center gap-2">{person.fullName}</div>;
      case "birthDate":
        return <span>{formatDate(person.birthDate)}</span>;
      case "militaryRank":
        return person.militaryRank;
      case "position":
        return person.position;
      case "gender":
        return person.gender;
      default:
        return null;
    }
  };

  return (
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
        <Button
          onClick={resetColumnOrder}
          className="h-12 px-6 text-lg hover:bg-yellow-300"
          variant="outline"
          size="lg"
        >
          Скинути порядок колонок
        </Button>
      </div>

      <Card className="p-6 bg-card border-border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead
                  key={column.field}
                  className={`cursor-move ${column.width} relative group
                    ${
                      dropIndicator === index ? "border-l-2 border-primary" : ""
                    }
                    ${
                      isDragging && draggedColumn.current === index
                        ? "opacity-50 bg-accent"
                        : ""
                    }
                    ${
                      isDragging && draggedColumn.current !== index
                        ? "hover:border-l-2 hover:border-primary/50"
                        : ""
                    }
                  `}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => handleSort(column.field as SortField)}
                >
                  <div className="flex items-center gap-1">
                    <GripHorizontal className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {column.label}
                    {sortConfig.field === column.field &&
                      (sortConfig.order === "asc" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m18 15-6-6-6 6" />
                        </svg>
                      ) : sortConfig.order === "desc" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      ) : (
                        <ArrowUpDown className="h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
              ))}
              <TableHead>ППД</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPeople.map((person) => (
              <TableRow
                key={person.fullName}
                className="cursor-pointer hover:bg-accent"
                onClick={() => handlePersonClick(person)}
              >
                {columns.map((column) => (
                  <TableCell key={column.field}>
                    {renderCell(person, column.field)}
                  </TableCell>
                ))}
                <TableCell>
                  <Switch
                    checked={person.isInPPD}
                    onCheckedChange={async (checked) => {
                      const updatedPerson = { ...person, isInPPD: checked };
                      await addPerson(updatedPerson);
                      setPeople((prevPeople) =>
                        prevPeople.map((p) =>
                          p.fullName === person.fullName ? updatedPerson : p
                        )
                      );
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
