import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';

export function Calendar({
  className,
  showIcon = true,
  selected,
  onSelect,
  disabled,
  ...props
}) {
  const [date, setDate] = React.useState(() => {
    // Ensure we have a valid date or null
    return selected && !isNaN(new Date(selected)) ? new Date(selected) : null;
  });

  React.useEffect(() => {
    setDate(selected && !isNaN(new Date(selected)) ? new Date(selected) : null);
  }, [selected]);

  const handleDayClick = (day) => {
    if (!day) return;
    const newDate = new Date(day);
    if (isNaN(newDate.getTime())) return;

    setDate(newDate);
    if (onSelect) {
      onSelect(newDate);
    }
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            disabled={disabled}>
            {showIcon && <CalendarIcon className='mr-2 h-4 w-4' />}
            {date && !isNaN(date) ? (
              format(date, 'PPP')
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <DayPicker
            selected={date}
            onDayClick={handleDayClick}
            disabled={disabled}
            {...props}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
