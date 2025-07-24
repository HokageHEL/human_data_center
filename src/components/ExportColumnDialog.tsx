import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FileText, FileSpreadsheet } from "lucide-react";
import { TableColumn } from "@/lib/constants/table-config";

interface ExportColumnDialogProps {
  isOpen: boolean;
  onClose: () => void;
  columns: TableColumn[];
  onExport: (selectedColumns: TableColumn[], exportType: 'word' | 'excel') => void;
}

export const ExportColumnDialog: React.FC<ExportColumnDialogProps> = ({
  isOpen,
  onClose,
  columns,
  onExport,
}) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    columns.map(col => col.field)
  );
  const [exportType, setExportType] = useState<'word' | 'excel'>('word');

  const handleColumnToggle = (columnField: string) => {
    setSelectedColumns(prev => 
      prev.includes(columnField)
        ? prev.filter(field => field !== columnField)
        : [...prev, columnField]
    );
  };

  const handleSelectAll = () => {
    setSelectedColumns(columns.map(col => col.field));
  };

  const handleDeselectAll = () => {
    setSelectedColumns([]);
  };

  const handleExport = () => {
    const columnsToExport = columns.filter(col => 
      selectedColumns.includes(col.field)
    );
    onExport(columnsToExport, exportType);
    onClose();
  };

  const isExportDisabled = selectedColumns.length === 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Вибір стовпців для експорту</DialogTitle>
          <DialogDescription>
            Оберіть стовпці, які потрібно включити в експорт
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Export Type Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Тип експорту:</Label>
            <div className="flex gap-2">
              <Button
                variant={exportType === 'word' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setExportType('word')}
                className="flex-1"
              >
                <FileText className="mr-2 h-4 w-4" />
                Word
              </Button>
              <Button
                variant={exportType === 'excel' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setExportType('excel')}
                className="flex-1"
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Excel
              </Button>
            </div>
          </div>

          {/* Column Selection */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Стовпці:</Label>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-xs h-6 px-2"
                >
                  Вибрати всі
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeselectAll}
                  className="text-xs h-6 px-2"
                >
                  Скасувати всі
                </Button>
              </div>
            </div>
            
            <div className="max-h-60 overflow-y-auto space-y-2 border rounded-md p-3">
              {columns.map((column) => (
                <div key={column.field} className="flex items-center space-x-2">
                  <Checkbox
                    id={column.field}
                    checked={selectedColumns.includes(column.field)}
                    onCheckedChange={() => handleColumnToggle(column.field)}
                  />
                  <Label
                    htmlFor={column.field}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {column.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Скасувати
          </Button>
          <Button 
            onClick={handleExport}
            disabled={isExportDisabled}
          >
            Експортувати ({selectedColumns.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};