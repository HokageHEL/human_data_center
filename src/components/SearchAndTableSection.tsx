import React, {
  Dispatch,
  SetStateAction,
  useState,
  useRef,
  useEffect,
} from "react";
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
import { Plus, Download, ArrowUpDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Person, addPerson } from "@/lib/data";
import { generateTableDocument, exportToExcel } from "@/lib/docx-generator";
import { Packer } from "docx";
import { saveAs } from "file-saver";
import {
  getExportColumns,
  TABLE_COLUMNS_STORAGE_KEY,
  type TableColumn,
} from "@/lib/constants";
import {
  getTableColumnsConfig,
  getVisibleColumns,
  ALL_TABLE_COLUMNS,
} from "@/lib/constants/all-table-columns";
import { useResizableColumns } from "@/hooks/use-resizable-columns";

import { PersonnelStatistics } from "@/components/PersonnelStatistics";
import { ExportColumnDialog } from "@/components/ExportColumnDialog";

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

  // Local state to track current people data for immediate UI updates
  const [localPeople, setLocalPeople] = useState<Person[]>(filteredPeople);
  
  // Export dialog state
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  // Update local state when filteredPeople prop changes
  useEffect(() => {
    setLocalPeople(filteredPeople);
  }, [filteredPeople]);

  const { columns, setColumns, handleMouseDown, isResizing, resizingColumn } =
    useResizableColumns([]);

  // Initialize columns from localStorage on component mount
  useEffect(() => {
    const newColumns = getTableColumnsConfig();
    setColumns(newColumns);
  }, [setColumns]);

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
    const defaultColumns = getTableColumnsConfig();
    setColumns(defaultColumns);
    localStorage.setItem(
      TABLE_COLUMNS_STORAGE_KEY,
      JSON.stringify(defaultColumns)
    );
  };

  // Listen for changes in visible columns and update table accordingly
  useEffect(() => {
    const handleColumnVisibilityChange = () => {
      const newColumns = getTableColumnsConfig();
      setColumns(newColumns);
      localStorage.setItem(TABLE_COLUMNS_STORAGE_KEY, JSON.stringify(newColumns));
    };

    // Listen for custom event (same page changes)
    window.addEventListener('columnVisibilityChanged', handleColumnVisibilityChange);
    // Listen for storage event (different tab changes)
    window.addEventListener('storage', handleColumnVisibilityChange);
    
    return () => {
      window.removeEventListener('columnVisibilityChanged', handleColumnVisibilityChange);
      window.removeEventListener('storage', handleColumnVisibilityChange);
    };
  }, [setColumns]);

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

  const handleOpenExportDialog = () => {
    setIsExportDialogOpen(true);
  };

  const handleExport = async (selectedColumns: TableColumn[], exportType: 'word' | 'excel') => {
    if (exportType === 'word') {
      const doc = generateTableDocument(filteredPeople, selectedColumns);
      const blob = await Packer.toBlob(doc);
      saveAs(blob, "people-table.docx");
    } else {
      const data = exportToExcel(filteredPeople, selectedColumns);
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "people-table.xlsx");
    }
  };

  const renderCell = (person: Person, field: string, columnWidth: number) => {
    const renderText = (text: string | number | undefined) => (
      <span className="truncate">
        {text?.toString() || ""}
      </span>
    );

    const renderBoolean = (value: boolean | undefined) => (
      <span className={`px-2 py-1 rounded text-xs ${
        value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {value ? 'Так' : 'Ні'}
      </span>
    );

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
        return renderText(person.shpoNumber);
      case "fullName":
        return renderText(person.fullName);
      case "birthDate":
        return renderText(formatDate(person.birthDate));
      case "age":
        return renderText(calculateAge(person.birthDate));
      case "militaryRank":
        return renderText(person.militaryRank);
      case "position":
        return renderText(person.position);
      case "gender":
        return renderText(person.gender);
      case "passportNumber":
        return renderText(person.passportNumber);
      case "taxId":
        return renderText(person.taxId);
      case "registrationPlace":
        return renderText(person.registrationPlace);
      case "address":
        return renderText(person.address);
      case "familyStatus":
        return renderText(person.familyStatus);
      case "relatives":
        return renderText(person.relatives);
      case "education":
        return renderText(person.education);
      case "phoneNumber":
        return renderText(person.phoneNumber);
      case "additionalInfo":
        return renderText(person.additionalInfo);
      case "lastRankDate":
        return renderText(formatDate(person.lastRankDate || ''));
      case "positionRank":
        return renderText(person.positionRank);
      case "fitnessStatus":
        return renderText(person.fitnessStatus);
      case "medicalCommissionNumber":
        return renderText(person.medicalCommissionNumber);
      case "medicalCommissionDate":
        return renderText(formatDate(person.medicalCommissionDate || ''));
      case "unit":
        return renderText(person.unit);
      case "department":
        return renderText(person.department);
      case "militarySpecialty":
        return renderText(person.militarySpecialty);
      case "tariffCategory":
        return renderText(person.tariffCategory);
      case "salary":
        return renderText(person.salary);
      case "serviceType":
        return renderText(person.serviceType);
      case "serviceStartDate":
        return renderText(formatDate(person.serviceStartDate));
      case "servicePeriods":
        return renderText(person.servicePeriods);
      case "unitStartDate":
        return renderText(formatDate(person.unitStartDate));
      case "previousServicePlaces":
        return renderText(person.previousServicePlaces);
      case "contractEndDate":
        return renderText(formatDate(person.contractEndDate || ''));
      case "militaryDocumentNumber":
        return renderText(person.militaryDocumentNumber);
      case "combatExperienceStatus":
        return renderBoolean(person.combatExperienceStatus);
      case "combatExperienceNumber":
        return renderText(person.combatExperienceNumber);
      case "combatPeriods":
        return renderText(person.combatPeriods);
      case "status":
        return (
          <span className={`px-2 py-1 rounded text-xs ${
            person.status === 'не_вказано' ? 'bg-gray-100 text-gray-800' :
            person.status === 'відпустка' ? 'bg-blue-100 text-blue-800' :
            person.status === 'короткострокове_лікування' ? 'bg-yellow-100 text-yellow-800' :
            person.status === 'довгострокове_лікування' ? 'bg-orange-100 text-orange-800' :
            person.status === 'відрядження' ? 'bg-purple-100 text-purple-800' :
            person.status === 'декрет' ? 'bg-pink-100 text-pink-800' :
            person.status === 'РВБД' ? 'bg-red-100 text-red-800' :
            person.status === 'навчання' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {person.status?.replace('_', ' ') || 'не вказано'}
          </span>
        );
      case "isInPPD":
        return (
          <Switch
            checked={person.isInPPD}
            onCheckedChange={async (checked) => {
              const updatedPerson = { 
                ...person, 
                isInPPD: checked,
                // Set status to 'не_вказано' when PPD is activated
                status: checked ? 'не_вказано' : person.status
              };

              // Update local state immediately for UI responsiveness
              setLocalPeople((prevPeople) =>
                prevPeople.map((p) =>
                  p.fullName === person.fullName ? updatedPerson : p
                )
              );

              // Update database and parent state
              await addPerson(updatedPerson);
              setPeople((prevPeople) =>
                prevPeople.map((p) =>
                  p.fullName === person.fullName ? updatedPerson : p
                )
              );
            }}
            onClick={(e) => e.stopPropagation()}
          />
        );
      case "BMT":
        return renderBoolean(person.BMT);
      case "BMTDate":
        return renderText(formatDate(person.BMTDate || ''));
      case "professionCourse":
        return renderBoolean(person.professionCourse);
      case "professionCourseValue":
        return renderText(person.professionCourseValue);
      default:
        return renderText('');
    }
  };

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
              onClick={handleOpenExportDialog}
              className="h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-lg flex-1 sm:flex-none"
              variant="outline"
              size="sm"
            >
              <Download className="mr-1 sm:mr-2 h-4 sm:h-5 w-4 sm:w-5" />
              <span className="hidden sm:inline">Експорт</span>
              <span className="sm:hidden">Е</span>
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
          <PersonnelStatistics people={localPeople} />

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
                        minWidth: `${column.minWidth || 20}px`,
                      }}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragEnter={() => handleDragEnter(index)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <div
                        className="flex text-center justify-center items-center gap-1 cursor-pointer px-2 overflow-hidden"
                        onClick={() => handleSort(column.field as SortField)}
                      >
                        <span className="truncate">
                          {column.label}
                        </span>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {localPeople.map((person) => (
                  <TableRow
                    key={person.fullName}
                    className="cursor-pointer hover:bg-accent/10 dark:hover:bg-accent/5"
                    onClick={() => handlePersonClick(person)}
                  >
                    {columns.map((column) => (
                      <TableCell
                        className="text-center text-xs sm:text-sm px-2 py-2 border-r border-border overflow-hidden"
                        key={column.field}
                        style={{
                          width: `${column.width}px`,
                          minWidth: `${column.minWidth || 20}px`,
                        }}
                      >
                        {renderCell(person, column.field, column.width)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
      
      <ExportColumnDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        onExport={handleExport}
        columns={columns}
      />
    </div>
  );
};
