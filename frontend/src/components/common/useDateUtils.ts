import { CalendarDateTime } from '@internationalized/date';
export function useDateUtils() {

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    function toISOFormat(date: Date) {
        const pad = (num: number, size = 2) => String(num).padStart(size, '0');

        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());
        const ms = pad(date.getMilliseconds(), 3);

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${ms}`;
    }

    function calendarDateTimeToString(calendarDateTime: CalendarDateTime) {

        const year = calendarDateTime.year;
        const monthName = monthNames[calendarDateTime.month - 1];
        const day = calendarDateTime.day;

        let hour = calendarDateTime.hour;
        const minute = calendarDateTime.minute;

        const period = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;

        const minuteStr = minute > 0 ? `:${String(minute).padStart(2, '0')}` : '';

        return `${monthName} ${day}, ${year} at ${hour}${minuteStr} ${period}`;
    }

    function dateToString(date: Date): string {
        const year = date.getFullYear();
        const monthName = monthNames[date.getMonth()];
        const day = date.getDate();

        let hour = date.getHours();
        const minute = date.getMinutes();

        const period = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;

        const minuteStr = minute > 0 ? `:${String(minute).padStart(2, '0')}` : '';

        return `${monthName} ${day}, ${year} at ${hour}${minuteStr} ${period}`;
    }

    return {
        toISOFormat,
        calendarDateTimeToString,
        dateToString
    }
}