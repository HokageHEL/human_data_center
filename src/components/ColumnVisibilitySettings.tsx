import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  ALL_TABLE_COLUMNS, 
  DEFAULT_VISIBLE_COLUMNS, 
  getVisibleColumns, 
  saveVisibleColumns 
} from '@/lib/constants/all-table-columns';
import { useToast } from '@/hooks/use-toast';

interface ColumnVisibilitySettingsProps {
  onColumnsChange?: (columns: string[]) => void;
}

const ColumnVisibilitySettings: React.FC<ColumnVisibilitySettingsProps> = ({ 
  onColumnsChange 
}) => {
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadedColumns = getVisibleColumns();
    const requiredFields = ['shpoNumber', 'fullName'];
    
    if (loadedColumns.length > 0) {
      // Ensure required fields are always included
      const finalColumns = [...new Set([...requiredFields, ...loadedColumns])];
      setVisibleColumns(finalColumns);
      onColumnsChange?.(finalColumns);
    } else {
      // Ensure required fields are always included in default
      const finalColumns = [...new Set([...requiredFields, ...DEFAULT_VISIBLE_COLUMNS])];
      setVisibleColumns(finalColumns);
      onColumnsChange?.(finalColumns);
    }
  }, [onColumnsChange]);

  const handleColumnToggle = (columnField: string, checked: boolean) => {
    // Prevent toggling of required fields
    if (columnField === 'shpoNumber' || columnField === 'fullName') {
      return;
    }
    
    const newVisibleColumns = checked 
      ? [...visibleColumns, columnField]
      : visibleColumns.filter(col => col !== columnField);
    
    setVisibleColumns(newVisibleColumns);
    saveVisibleColumns(newVisibleColumns);
    onColumnsChange?.(newVisibleColumns);
  };

  const handleSelectAll = (category?: string) => {
    const columnsToSelect = category 
      ? ALL_TABLE_COLUMNS.filter(col => col.category === category).map(col => col.field)
      : ALL_TABLE_COLUMNS.map(col => col.field);
    
    const newVisibleColumns = [...new Set([...visibleColumns, ...columnsToSelect])];
    setVisibleColumns(newVisibleColumns);
    saveVisibleColumns(newVisibleColumns);
    onColumnsChange?.(newVisibleColumns);
  };

  const handleDeselectAll = (category?: string) => {
    const columnsToDeselect = category 
      ? ALL_TABLE_COLUMNS.filter(col => col.category === category).map(col => col.field)
      : ALL_TABLE_COLUMNS.map(col => col.field);
    
    // Always keep required fields selected
    const requiredFields = ['shpoNumber', 'fullName'];
    const newVisibleColumns = visibleColumns.filter(col => 
      !columnsToDeselect.includes(col) || requiredFields.includes(col)
    );
    setVisibleColumns(newVisibleColumns);
    saveVisibleColumns(newVisibleColumns);
    onColumnsChange?.(newVisibleColumns);
  };

  const handleResetToDefault = () => {
    // Ensure required fields are always included
    const requiredFields = ['shpoNumber', 'fullName'];
    const finalColumns = [...new Set([...requiredFields, ...DEFAULT_VISIBLE_COLUMNS])];
    setVisibleColumns(finalColumns);
    saveVisibleColumns(finalColumns);
    onColumnsChange?.(finalColumns);
    
    toast({
      title: "Налаштування скинуто",
      description: "Стовпці таблиці повернуто до стандартних налаштувань",
    });
  };

  const getCategoryColumns = (category: string) => {
    return ALL_TABLE_COLUMNS.filter(col => col.category === category);
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'system': return 'Системні поля';
      case 'personal': return 'Особисті дані';
      case 'military': return 'Військові дані';
      default: return category;
    }
  };

  const categories = ['system', 'personal', 'military'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Видимість стовпців таблиці</CardTitle>
        <CardDescription>
          Оберіть які стовпці відображати в головній таблиці
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Global controls */}
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleSelectAll()}
          >
            Вибрати всі
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleDeselectAll()}
          >
            Скасувати всі
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleResetToDefault}
          >
            Скинути до стандартних
          </Button>

        </div>

        <Separator />

        {/* Category sections */}
        {categories.map((category) => {
          const categoryColumns = getCategoryColumns(category);
          const selectedInCategory = categoryColumns.filter(col => 
            visibleColumns.includes(col.field)
          ).length;
          
          return (
            <div key={category} className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">
                  {getCategoryTitle(category)} ({selectedInCategory}/{categoryColumns.length})
                </h4>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSelectAll(category)}
                    className="h-6 px-2 text-xs"
                  >
                    Всі
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeselectAll(category)}
                    className="h-6 px-2 text-xs"
                  >
                    Жодного
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {categoryColumns.map((column) => (
                  <div key={column.field} className="flex items-center space-x-2">
                    <Checkbox
                      id={column.field}
                      checked={visibleColumns.includes(column.field)}
                      onCheckedChange={(checked) => 
                        handleColumnToggle(column.field, checked as boolean)
                      }
                      disabled={column.field === 'shpoNumber' || column.field === 'fullName'}
                    />
                    <Label 
                      htmlFor={column.field} 
                      className={`text-sm cursor-pointer ${
                        column.field === 'shpoNumber' || column.field === 'fullName' 
                          ? 'text-muted-foreground' 
                          : ''
                      }`}
                    >
                      {column.label}
                      {(column.field === 'shpoNumber' || column.field === 'fullName') && (
                        <span className="ml-1 text-xs text-muted-foreground">(always visible)</span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
              
              {category !== categories[categories.length - 1] && <Separator />}
            </div>
          );
        })}

        <div className="text-sm text-muted-foreground">
          Вибрано стовпців: {visibleColumns.length} з {ALL_TABLE_COLUMNS.length}
        </div>
      </CardContent>
    </Card>
  );
};

export default ColumnVisibilitySettings;