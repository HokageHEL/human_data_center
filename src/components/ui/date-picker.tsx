"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { uk } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  id?: string
}

function formatDate(date: Date | undefined): string {
  if (!date) {
    return ""
  }

  return format(date, "dd.MM.yyyy", { locale: uk })
}

function parseDate(dateString: string): Date | undefined {
  if (!dateString) return undefined
  
  // Try to parse different date formats
  const formats = [
    /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/, // dd.mm.yyyy
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // yyyy-mm-dd
  ]
  
  for (const format of formats) {
    const match = dateString.match(format)
    if (match) {
      let day, month, year
      if (format === formats[0]) { // dd.mm.yyyy
        [, day, month, year] = match
      } else { // yyyy-mm-dd
        [, year, month, day] = match
      }
      
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      if (!isNaN(date.getTime())) {
        return date
      }
    }
  }
  
  return undefined
}

function isValidDate(date: Date | undefined): boolean {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Оберіть дату",
  disabled = false,
  className,
  id
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(
    value ? parseDate(value) : undefined
  )
  const [month, setMonth] = React.useState<Date | undefined>(date)
  const [inputValue, setInputValue] = React.useState(value ? formatDate(parseDate(value)) : "")

  React.useEffect(() => {
    if (value) {
      const parsedDate = parseDate(value)
      setDate(parsedDate)
      setMonth(parsedDate)
      setInputValue(formatDate(parsedDate))
    } else {
      setDate(undefined)
      setMonth(undefined)
      setInputValue("")
    }
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    
    const parsedDate = parseDate(newValue)
    if (isValidDate(parsedDate)) {
      setDate(parsedDate)
      setMonth(parsedDate)
      onChange?.(parsedDate!.toISOString().split('T')[0]) // Return yyyy-mm-dd format
    } else if (newValue === "") {
      setDate(undefined)
      setMonth(undefined)
      onChange?.("") 
    }
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    setInputValue(formatDate(selectedDate))
    setOpen(false)
    
    if (selectedDate) {
      onChange?.(selectedDate.toISOString().split('T')[0]) // Return yyyy-mm-dd format
    } else {
      onChange?.("") 
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setOpen(true)
    }
  }

  return (
    <div className={cn("relative flex gap-2", className)}>
      <Input
        id={id}
        value={inputValue}
        placeholder={placeholder}
        className="bg-background pr-10"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            disabled={disabled}
          >
            <CalendarIcon className="size-3.5" />
            <span className="sr-only">Обрати дату</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0"
          align="end"
          alignOffset={-8}
          sideOffset={10}
        >
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            month={month}
            onMonthChange={setMonth}
            onSelect={handleDateSelect}
            locale={uk}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}