import { format, isWednesday, isBefore, startOfDay, addDays, nextWednesday } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface GoLiveDatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  className?: string;
}

export function GoLiveDatePicker({ value, onChange, className }: GoLiveDatePickerProps) {
  const today = startOfDay(new Date());
  
  // Only allow future Wednesdays
  const isDateDisabled = (date: Date) => {
    const dayStart = startOfDay(date);
    // Disable if not a Wednesday or if it's today or in the past
    return !isWednesday(date) || isBefore(dayStart, addDays(today, 1));
  };

  // Start calendar on next Wednesday
  const defaultMonth = nextWednesday(today);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'justify-start text-left font-normal border-foreground',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'EEEE, MMM d, yyyy') : 'Select Wednesday'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={isDateDisabled}
          defaultMonth={defaultMonth}
          initialFocus
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
}
