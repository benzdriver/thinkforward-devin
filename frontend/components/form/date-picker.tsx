import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const datePickerVariants = cva(
  "flex items-center w-full rounded-md border border-secondary-200 bg-white text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-secondary-200",
        filled: "border-transparent bg-secondary-50",
        outline: "border-secondary-300",
        ghost: "border-transparent bg-transparent hover:bg-secondary-50",
      },
      size: {
        sm: "h-8 px-3 py-1 text-xs",
        md: "h-10 px-4 py-2",
        lg: "h-12 px-4 py-2 text-base",
      },
      iconPosition: {
        left: "pl-9",
        right: "pr-9",
        both: "pl-9 pr-9",
        none: "",
      },
      isRounded: {
        true: "rounded-full",
        false: "rounded-md",
      },
      hasError: {
        true: "border-destructive-300 focus-visible:ring-destructive-400",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      iconPosition: "right",
      isRounded: false,
      hasError: false,
    },
  }
);

const calendarVariants = cva(
  "bg-white p-3 rounded-md shadow-md border border-secondary-200 z-50",
  {
    variants: {
      position: {
        top: "bottom-full mb-1",
        bottom: "top-full mt-1",
      },
      align: {
        left: "left-0",
        center: "left-1/2 -translate-x-1/2",
        right: "right-0",
      },
    },
    defaultVariants: {
      position: "bottom",
      align: "left",
    },
  }
);

type DateValue = Date | null;
type RangeValue = { start: DateValue; end: DateValue };

export interface DatePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "value" | "onChange"> {
  variant?: VariantProps<typeof datePickerVariants>["variant"];
  size?: VariantProps<typeof datePickerVariants>["size"];
  iconPosition?: VariantProps<typeof datePickerVariants>["iconPosition"];
  isRounded?: VariantProps<typeof datePickerVariants>["isRounded"];
  hasError?: boolean;
  icon?: React.ReactNode;
  value?: DateValue | RangeValue;
  onChange?: (date: DateValue | RangeValue) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  format?: string;
  placeholder?: string;
  isRange?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  disabledDays?: number[]; // 0-6, 0 is Sunday
  locale?: string;
  showWeekNumbers?: boolean;
  calendarPosition?: VariantProps<typeof calendarVariants>["position"];
  calendarAlign?: VariantProps<typeof calendarVariants>["align"];
  monthsToShow?: number;
  showToday?: boolean;
  clearable?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  renderDay?: (date: Date, isSelected: boolean, isDisabled: boolean) => React.ReactNode;
}

const formatDate = (date: Date | null, format: string = "yyyy-MM-dd", locale: string = "zh-CN"): string => {
  if (!date) return "";
  
  try {
    const options: Intl.DateTimeFormatOptions = {};
    
    if (format.includes("yyyy") || format.includes("yy")) {
      options.year = format.includes("yyyy") ? "numeric" : "2-digit";
    }
    
    if (format.includes("MM") || format.includes("M")) {
      options.month = format.includes("MM") ? "2-digit" : "numeric";
    }
    
    if (format.includes("dd") || format.includes("d")) {
      options.day = format.includes("dd") ? "2-digit" : "numeric";
    }
    
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

const parseDate = (dateString: string, format: string = "yyyy-MM-dd"): Date | null => {
  if (!dateString) return null;
  
  if (format === "yyyy-MM-dd") {
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JS
      const day = parseInt(parts[2], 10);
      
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month, day);
      }
    }
  }
  
  const timestamp = Date.parse(dateString);
  return isNaN(timestamp) ? null : new Date(timestamp);
};

const isDateDisabled = (
  date: Date,
  minDate?: Date,
  maxDate?: Date,
  disabledDates?: Date[],
  disabledDays?: number[]
): boolean => {
  if (minDate && date < minDate) {
    return true;
  }
  
  if (maxDate && date > maxDate) {
    return true;
  }
  
  if (disabledDays && disabledDays.includes(date.getDay())) {
    return true;
  }
  
  if (disabledDates) {
    return disabledDates.some(
      (disabledDate) =>
        disabledDate.getFullYear() === date.getFullYear() &&
        disabledDate.getMonth() === date.getMonth() &&
        disabledDate.getDate() === date.getDate()
    );
  }
  
  return false;
};

const isSameDay = (date1: Date | null, date2: Date | null): boolean => {
  if (!date1 || !date2) return false;
  
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const isInRange = (date: Date, start: Date | null, end: Date | null): boolean => {
  if (!start || !end) return false;
  
  return date >= start && date <= end;
};

const getMonthData = (year: number, month: number): Date[] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();
  
  const days: Date[] = [];
  
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    days.push(new Date(year, month - 1, prevMonthLastDay - i));
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }
  
  const remainingDays = 42 - days.length; // 6 rows of 7 days
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(year, month + 1, i));
  }
  
  return days;
};

const getWeekNumber = (date: Date): number => {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
};

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      className,
      variant,
      size,
      iconPosition,
      isRounded,
      hasError,
      icon,
      value,
      onChange,
      onBlur,
      format = "yyyy-MM-dd",
      placeholder = "选择日期",
      isRange = false,
      minDate,
      maxDate,
      disabledDates,
      disabledDays,
      locale = "zh-CN",
      showWeekNumbers = false,
      calendarPosition = "bottom",
      calendarAlign = "left",
      monthsToShow = 1,
      showToday = true,
      clearable = true,
      readOnly = false,
      disabled = false,
      renderDay,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [currentMonth, setCurrentMonth] = React.useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());
    const [hoveredDate, setHoveredDate] = React.useState<Date | null>(null);
    const [inputValue, setInputValue] = React.useState("");
    
    const containerRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
    
    const [selectedDate, setSelectedDate] = React.useState<DateValue | RangeValue>(
      isRange ? { start: null, end: null } : null
    );
    
    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedDate(value);
        
        if (value && isRange && 'start' in value && value.start) {
          setCurrentMonth(value.start.getMonth());
          setCurrentYear(value.start.getFullYear());
        } else if (!isRange && value) {
          setCurrentMonth((value as Date).getMonth());
          setCurrentYear((value as Date).getFullYear());
        }
      }
    }, [value, isRange]);
    
    React.useEffect(() => {
      if (selectedDate && isRange && 'start' in selectedDate) {
        const { start, end } = selectedDate;
        if (start && end) {
          setInputValue(`${formatDate(start, format, locale)} ~ ${formatDate(end, format, locale)}`);
        } else if (start) {
          setInputValue(`${formatDate(start, format, locale)} ~ `);
        } else {
          setInputValue("");
        }
      } else if (!isRange && selectedDate) {
        setInputValue(formatDate(selectedDate as Date, format, locale));
      } else {
        setInputValue("");
      }
    }, [selectedDate, format, locale, isRange]);
    
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
    
    const handleInputClick = () => {
      if (!disabled && !readOnly) {
        setIsOpen(!isOpen);
      }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      
      if (!e.target.value) {
        if (isRange) {
          const newValue = { start: null, end: null };
          setSelectedDate(newValue);
          onChange?.(newValue);
        } else {
          setSelectedDate(null);
          onChange?.(null);
        }
        return;
      }
      
      if (isRange) {
        const parts = e.target.value.split("~").map((part) => part.trim());
        if (parts.length === 2) {
          const start = parseDate(parts[0], format);
          const end = parseDate(parts[1], format);
          
          if (start && end) {
            const newValue = { start, end };
            setSelectedDate(newValue);
            onChange?.(newValue);
          }
        }
      } else {
        const date = parseDate(e.target.value, format);
        if (date) {
          setSelectedDate(date);
          onChange?.(date);
        }
      }
    };
    
    const handleDateClick = (date: Date) => {
      if (isDateDisabled(date, minDate, maxDate, disabledDates, disabledDays)) {
        return;
      }
      
      if (isRange) {
        const range = selectedDate as RangeValue;
        
        if (!range.start || (range.start && range.end)) {
          const newValue = { start: date, end: null };
          setSelectedDate(newValue);
          onChange?.(newValue);
        } else {
          const isBeforeStart = date < range.start;
          const newValue = {
            start: isBeforeStart ? date : range.start,
            end: isBeforeStart ? range.start : date,
          };
          setSelectedDate(newValue);
          onChange?.(newValue);
          setIsOpen(false);
        }
      } else {
        setSelectedDate(date);
        onChange?.(date);
        setIsOpen(false);
      }
    };
    
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      
      if (isRange) {
        const newValue = { start: null, end: null };
        setSelectedDate(newValue);
        onChange?.(newValue);
      } else {
        setSelectedDate(null);
        onChange?.(null);
      }
      
      setInputValue("");
    };
    
    const handlePrevMonth = () => {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    };
    
    const handleNextMonth = () => {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    };
    
    const handleToday = () => {
      const today = new Date();
      setCurrentMonth(today.getMonth());
      setCurrentYear(today.getFullYear());
      
      if (!isRange) {
        setSelectedDate(today);
        onChange?.(today);
        setIsOpen(false);
      }
    };
    
    const handleMouseEnter = (date: Date) => {
      if (isRange) {
        setHoveredDate(date);
      }
    };
    
    const handleMouseLeave = () => {
      setHoveredDate(null);
    };
    
    const renderCalendar = () => {
      const monthData = getMonthData(currentYear, currentMonth);
      const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
      
      const range = selectedDate as RangeValue;
      const isInSelectionRange = (date: Date) => {
        if (!isRange || !range.start || !hoveredDate) return false;
        
        if (range.end) {
          return isInRange(date, range.start, range.end);
        }
        
        return (
          (date > range.start && date <= hoveredDate) ||
          (date < range.start && date >= hoveredDate)
        );
      };
      
      return (
        <div
          className={cn(
            calendarVariants({ position: calendarPosition, align: calendarAlign }),
            "min-w-[280px]"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              className="p-1 rounded-md hover:bg-secondary-100"
              onClick={handlePrevMonth}
            >
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
                className="text-secondary-600"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            
            <div className="font-medium">
              {new Date(currentYear, currentMonth).toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
              })}
            </div>
            
            <button
              type="button"
              className="p-1 rounded-md hover:bg-secondary-100"
              onClick={handleNextMonth}
            >
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
                className="text-secondary-600"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
          
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {showWeekNumbers && (
                  <th className="w-8 text-xs font-medium text-secondary-500 p-1">#</th>
                )}
                {weekDays.map((day) => (
                  <th
                    key={day}
                    className="w-8 text-xs font-medium text-secondary-500 p-1"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, weekIndex) => {
                const weekStart = weekIndex * 7;
                const weekEnd = weekStart + 7;
                const week = monthData.slice(weekStart, weekEnd);
                
                return (
                  <tr key={weekIndex}>
                    {showWeekNumbers && (
                      <td className="text-xs text-secondary-500 p-1 text-center">
                        {getWeekNumber(week[0])}
                      </td>
                    )}
                    {week.map((date, dayIndex) => {
                      const isCurrentMonth = date.getMonth() === currentMonth;
                      const isToday = isSameDay(date, new Date());
                      const isDisabled = isDateDisabled(
                        date,
                        minDate,
                        maxDate,
                        disabledDates,
                        disabledDays
                      );
                      
                      let isSelected = false;
                      if (selectedDate && isRange && 'start' in selectedDate) {
                        isSelected =
                          isSameDay(date, selectedDate.start) ||
                          isSameDay(date, selectedDate.end);
                      } else if (!isRange && selectedDate) {
                        isSelected = isSameDay(date, selectedDate as Date);
                      }
                      
                      const isRangeStart =
                        isRange &&
                        selectedDate &&
                        'start' in selectedDate &&
                        isSameDay(date, selectedDate.start);
                      
                      const isRangeEnd =
                        isRange &&
                        selectedDate &&
                        'start' in selectedDate &&
                        selectedDate.end &&
                        isSameDay(date, selectedDate.end);
                      
                      const isInRange =
                        isRange &&
                        selectedDate &&
                        'start' in selectedDate &&
                        selectedDate.start &&
                        selectedDate.end &&
                        date > selectedDate.start &&
                        date < selectedDate.end;
                      
                      const isInHoverRange = isInSelectionRange(date);
                      
                      return (
                        <td
                          key={dayIndex}
                          className={cn(
                            "p-0 text-center",
                            isCurrentMonth ? "text-foreground" : "text-secondary-400",
                            isDisabled && "text-secondary-300 cursor-not-allowed",
                            !isDisabled && "cursor-pointer hover:bg-secondary-100",
                            isToday && !isSelected && "border border-primary-300",
                            isSelected && "bg-primary-500 text-white hover:bg-primary-600",
                            (isInRange || isInHoverRange) &&
                              "bg-primary-100 hover:bg-primary-200",
                            isRangeStart &&
                              "rounded-l-full bg-primary-500 text-white hover:bg-primary-600",
                            isRangeEnd &&
                              "rounded-r-full bg-primary-500 text-white hover:bg-primary-600"
                          )}
                          onClick={() => !isDisabled && handleDateClick(date)}
                          onMouseEnter={() => handleMouseEnter(date)}
                          onMouseLeave={handleMouseLeave}
                        >
                          {renderDay ? (
                            renderDay(date, isSelected, isDisabled)
                          ) : (
                            <div className="w-8 h-8 flex items-center justify-center">
                              {date.getDate()}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          <div className="flex justify-between mt-2 text-xs">
            {showToday && (
              <button
                type="button"
                className="px-2 py-1 rounded hover:bg-secondary-100 text-primary-600"
                onClick={handleToday}
              >
                今天
              </button>
            )}
            
            {clearable && (
              <button
                type="button"
                className="px-2 py-1 rounded hover:bg-secondary-100 text-secondary-600"
                onClick={handleClear}
              >
                清除
              </button>
            )}
          </div>
        </div>
      );
    };
    
    const defaultIcon = (
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
        className="text-secondary-500"
      >
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
      </svg>
    );
    
    return (
      <div className="relative w-full" ref={containerRef}>
        <div className="relative">
          {iconPosition !== "none" && (
            <div
              className={cn(
                "absolute inset-y-0 flex items-center",
                iconPosition === "left" || iconPosition === "both"
                  ? "left-0 pl-3"
                  : "right-0 pr-3"
              )}
            >
              {icon || defaultIcon}
            </div>
          )}
          
          <input
            type="text"
            className={cn(
              datePickerVariants({
                variant,
                size,
                iconPosition,
                isRounded,
                hasError,
              }),
              className
            )}
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onClick={handleInputClick}
            onBlur={onBlur}
            readOnly={readOnly}
            disabled={disabled}
            ref={inputRef}
            {...props}
          />
          
          {clearable && inputValue && !disabled && !readOnly && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              onClick={handleClear}
              aria-label="清除日期"
            >
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
                className="text-secondary-500 hover:text-secondary-700"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m15 9-6 6" />
                <path d="m9 9 6 6" />
              </svg>
            </button>
          )}
        </div>
        
        {isOpen && renderCalendar()}
      </div>
    );
  }
);
DatePicker.displayName = "DatePicker";

export { DatePicker, datePickerVariants, calendarVariants };
