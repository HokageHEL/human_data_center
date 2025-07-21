import { Dispatch, SetStateAction, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, FileText, FileSpreadsheet, ArrowUpDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Person, addPerson } from "@/lib/data";
import { generateTableDocument, exportToExcel } from "@/lib/docx-generator";
import { Packer } from "docx";
import { saveAs } from "file-saver";
import {
  getExportColumns,
  TABLE_COLUMNS_STORAGE_KEY,
  DEFAULT_TABLE_COLUMNS,
  type TableColumn,
} from "@/lib/constants";
import { useResizableColumns } from "@/hooks/use-resizable-columns";
import { TruncatedText } from "@/components/ui/truncated-text";

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

type SortField =
  | "fullName"
  | "birthDate"
  | "age"
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

  const { columns, setColumns, handleMouseDown, isResizing, resizingColumn } =
    useResizableColumns(
      (() => {
        const savedColumns = localStorage.getItem(TABLE_COLUMNS_STORAGE_KEY);
        return savedColumns ? JSON.parse(savedColumns) : DEFAULT_TABLE_COLUMNS;
      })()
    );

  useEffect(() => {
    localStorage.setItem(TABLE_COLUMNS_STORAGE_KEY, JSON.stringify(columns));
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
    setColumns(DEFAULT_TABLE_COLUMNS);
    localStorage.setItem(
      TABLE_COLUMNS_STORAGE_KEY,
      JSON.stringify(DEFAULT_TABLE_COLUMNS)
    );
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

  const handleExportToWord = async () => {
    const exportColumns = getExportColumns(columns);
    const doc = generateTableDocument(filteredPeople, exportColumns);
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "people-table.docx");
  };

  const handleExportToExcel = () => {
    const exportColumns = getExportColumns(columns);
    const data = exportToExcel(filteredPeople, exportColumns);
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "people-table.xlsx");
  };

  const renderCell = (person: Person, field: string, columnWidth: number) => {
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
        return (
          <TruncatedText
            text={person.shpoNumber || ""}
            maxWidth={columnWidth - 20}
          />
        );
      case "fullName":
        return (
          <TruncatedText
            text={person.fullName || ""}
            maxWidth={columnWidth - 20}
          />
        );
      case "birthDate":
        return (
          <TruncatedText
            text={formatDate(person.birthDate)}
            maxWidth={columnWidth - 20}
          />
        );
      case "age":
        return (
          <TruncatedText
            text={calculateAge(person.birthDate).toString()}
            maxWidth={columnWidth - 20}
          />
        );
      case "militaryRank":
        return (
          <TruncatedText
            text={person.militaryRank || ""}
            maxWidth={columnWidth - 20}
          />
        );
      case "position":
        return (
          <TruncatedText
            text={person.position || ""}
            maxWidth={columnWidth - 20}
          />
        );
      case "gender":
        return (
          <TruncatedText
            text={person.gender || ""}
            maxWidth={columnWidth - 20}
          />
        );
      default:
        return null;
    }
  };

  const totalPeople = filteredPeople.length;
  const peopleInPPD = filteredPeople.filter((person) => person.isInPPD).length;
  const peopleNotInPPD = totalPeople - peopleInPPD;
  const peopleOnVacation = filteredPeople.filter(
    (person) => person.status === "відпустка"
  ).length;
  const peopleOnBusinessTrip = filteredPeople.filter(
    (person) => person.status === "відрядження"
  ).length;
  const peopleOnMaternityLeave = filteredPeople.filter(
    (person) => person.status === "декрет"
  ).length;
  const peopleOnLongSickLeave = filteredPeople.filter(
    (person) => person.status === "довгострокове_лікування"
  ).length;
  const peopleOnShortSickLeave = filteredPeople.filter(
    (person) => person.status === "короткострокове_лікування"
  ).length;
  const peopleOnTraining = filteredPeople.filter(
    (person) => person.status === "навчання"
  ).length;
  const peopleOnRvbd = filteredPeople.filter(
    (person) => person.status === "РВБД"
  ).length;
  const peopleNotSpecifiedLeave = filteredPeople.filter(
    (person) => person.status === "не_вказано"
  ).length;

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="mb-6 space-y-4">
          <Input
            type="text"
            placeholder="Пошук..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 sm:h-12 text-base sm:text-lg border-2 border-border focus:border-primary"
          />
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <Button
              onClick={handleExportToWord}
              className="h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-lg flex-1 sm:flex-none"
              variant="outline"
              size="sm"
            >
              <FileText className="mr-1 sm:mr-2 h-4 sm:h-5 w-4 sm:w-5" />
              <span className="hidden sm:inline">Word</span>
              <span className="sm:hidden">W</span>
            </Button>
            <Button
              onClick={handleExportToExcel}
              className="h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-lg flex-1 sm:flex-none"
              variant="outline"
              size="sm"
            >
              <FileSpreadsheet className="mr-1 sm:mr-2 h-4 sm:h-5 w-4 sm:w-5" />
              <span className="hidden sm:inline">Excel</span>
              <span className="sm:hidden">E</span>
            </Button>
            <Button
              onClick={handleAddPerson}
              className="h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-lg hover:bg-green-300 flex-1 sm:flex-none"
              size="sm"
            >
              <Plus className="mr-1 sm:mr-2 h-4 sm:h-5 w-4 sm:w-5" />
              Додати
            </Button>
          </div>
        </div>

        <div className="mb-4 flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex gap-8">
            <div className="flex gap-4">
              <span>Всього: {totalPeople}</span>
              <span>У ППД: {peopleInPPD}</span>
            </div>
            <div className="flex gap-4">
              <span>
                <span className="font-bold">Не</span> в ППД: {peopleNotInPPD}
              </span>
              {peopleOnVacation > 0 && (
                <span>Відпустка: {peopleOnVacation}</span>
              )}
              {peopleOnBusinessTrip > 0 && (
                <span>Відрядження: {peopleOnBusinessTrip}</span>
              )}
              {peopleOnMaternityLeave > 0 && (
                <span>Декрет: {peopleOnMaternityLeave}</span>
              )}
              {peopleOnLongSickLeave > 0 && (
                <span>Довгострокове лікування: {peopleOnLongSickLeave}</span>
              )}
              {peopleOnShortSickLeave > 0 && (
                <span>Короткострокове лікування: {peopleOnShortSickLeave}</span>
              )}
              {peopleOnTraining > 0 && (
                <span>Навчання: {peopleOnTraining}</span>
              )}
              {peopleOnRvbd > 0 && <span>РВБД: {peopleOnRvbd}</span>}
              {peopleNotSpecifiedLeave > 0 && (
                <span>Не вказано: {peopleNotSpecifiedLeave}</span>
              )}
            </div>
          </div>
          <Button
            onClick={resetColumnOrder}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            Скинути порядок
          </Button>
        </div>
        <Card className="p-3 sm:p-6 bg-card border-border">
          <div className="overflow-x-auto">
            <Table className="min-w-full table-fixed">
              <TableHeader>
                <TableRow>
                  {columns.map((column, index) => (
                    <TableHead
                      key={column.field}
                      className={`relative group justify-center whitespace-nowrap text-xs sm:text-sm border-r border-border
                      ${
                        dropIndicator === index
                          ? "border-l-2 border-primary"
                          : ""
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
                      style={{
                        width: `${column.width}px`,
                        minWidth: `${column.minWidth || 80}px`,
                        maxWidth: `${column.maxWidth || 500}px`,
                      }}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragEnter={() => handleDragEnter(index)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <div
                        className="flex items-center gap-1 cursor-pointer px-2"
                        onClick={() => handleSort(column.field as SortField)}
                      >
                        <TruncatedText
                          text={column.label}
                          maxWidth={column.width - 40}
                        />
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
                      {/* Resize handle */}
                      <div
                        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/50 group-hover:bg-primary/30"
                        onMouseDown={(e) => handleMouseDown(e, index)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableHead>
                  ))}
                  <TableHead className="text-xs sm:text-sm whitespace-nowrap w-[80px]">
                    ППД
                  </TableHead>
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
                      <TableCell
                        className="text-center text-xs sm:text-sm px-2 py-2 border-r border-border"
                        key={column.field}
                        style={{
                          width: `${column.width}px`,
                          minWidth: `${column.minWidth || 80}px`,
                          maxWidth: `${column.maxWidth || 500}px`,
                        }}
                      >
                        {renderCell(person, column.field, column.width)}
                      </TableCell>
                    ))}
                    <TableCell className="text-center px-2 sm:px-4 py-2">
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
          </div>
        </Card>
      </div>
    </div>
  );
};
