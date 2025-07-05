import { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Plus, User, ArrowUpDown } from "lucide-react";
import { Person } from "@/lib/data";
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
}

export const SearchAndTableSection = ({
  searchTerm,
  setSearchTerm,
  sortConfig,
  setSortConfig,
  filteredPeople,
  handleSort,
  handleDelete,
}: SearchAndTableSectionProps) => {
  const navigate = useNavigate();

  const handlePersonClick = (person: Person) => {
    console.log('Navigating to edit page for person:', person.fullName);
    const encodedName = encodeURIComponent(person.fullName);
    console.log('Encoded name for URL:', encodedName);
    navigate(`/edit/${encodedName}`);
  };

  const handleAddPerson = () => {
    console.log('Navigating to add new person page');
    navigate('/edit/new');
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
      </div>

      <Card className="p-6 bg-card border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer w-[80px]"
                onClick={() => handleSort("shpoNumber")}
              >
                <div className="flex items-center gap-1">
                  №ШПО
                  {sortConfig.field === "shpoNumber" ? (
                    sortConfig.order === "asc" ? (
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
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("fullName")}
              >
                <div className="flex items-center gap-1">
                  ПІБ
                  {sortConfig.field === "fullName" ? (
                    sortConfig.order === "asc" ? (
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
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("birthDate")}
              >
                <div className="flex items-center gap-1">
                  Дата народження
                  {sortConfig.field === "birthDate" ? (
                    sortConfig.order === "asc" ? (
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
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("militaryRank")}
              >
                <div className="flex items-center gap-1">
                  Військове звання
                  {sortConfig.field === "militaryRank" ? (
                    sortConfig.order === "asc" ? (
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
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("position")}
              >
                <div className="flex items-center gap-1">
                  Посада
                  {sortConfig.field === "position" ? (
                    sortConfig.order === "asc" ? (
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
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("gender")}
              >
                <div className="flex items-center gap-1">
                  Стать
                  {sortConfig.field === "gender" ? (
                    sortConfig.order === "asc" ? (
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
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="w-[100px]">Дії</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPeople.map((person) => (
              <TableRow
                key={person.fullName}
                className="cursor-pointer hover:bg-accent"
                onClick={() => handlePersonClick(person)}
              >
                <TableCell>{person.shpoNumber}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {person.fullName}
                  </div>
                </TableCell>
                <TableCell>{person.birthDate}</TableCell>
                <TableCell>{person.militaryRank}</TableCell>
                <TableCell>{person.position}</TableCell>
                <TableCell>{person.gender}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
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
  );
};
