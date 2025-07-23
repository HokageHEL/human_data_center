import { useState, useCallback, useRef, useEffect } from "react";

export interface ResizableColumn {
  field: string;
  label: string;
  width: number; // width in pixels
  minWidth?: number;
  maxWidth?: number;
}

export const useResizableColumns = (initialColumns: ResizableColumn[]) => {
  const [columns, setColumns] = useState<ResizableColumn[]>(initialColumns);
  const [isResizing, setIsResizing] = useState(false);
  const [resizingColumn, setResizingColumn] = useState<number | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, columnIndex: number) => {
      e.preventDefault();
      setIsResizing(true);
      setResizingColumn(columnIndex);
      startX.current = e.clientX;
      startWidth.current = columns[columnIndex].width;
    },
    [columns]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || resizingColumn === null) return;

      const deltaX = e.clientX - startX.current;

      const newWidth = startWidth.current + deltaX;

      setColumns((prev) =>
        prev.map((col, index) =>
          index === resizingColumn ? { ...col, width: newWidth } : col
        )
      );
    },
    [isResizing, resizingColumn, columns]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    setResizingColumn(null);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return {
    columns,
    setColumns,
    handleMouseDown,
    isResizing,
    resizingColumn,
  };
};
