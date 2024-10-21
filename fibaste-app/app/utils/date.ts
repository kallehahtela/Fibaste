import { DateTime } from "luxon";

const customizeRelativeDate = (relativeDate: string | null) => {
    if (relativeDate) {
        return relativeDate
            .replace('hours', 'hrs')
            .replace('minute', 'min')
            .replace('minutes', 'min')
            .replace('second', 'sec')
            .replace('seconds', 'sec');
    }
};

export const formatDate = (dateString: string, format?: string) => {
    const date = DateTime.fromISO(dateString);
    if (format) {
        return date.toFormat(format);
    }

    const now = DateTime.now();
    // if the date is within the last 7 days
    if (date.hasSame(now, 'day')) {
        return customizeRelativeDate(date.toRelative());
    }

    // checking if it is yesterday
    else if (date.hasSame(now.minus({ days: 1 }), 'day')) {
        return 'Yesterday';
    }

    // if this is from the same week
    else if (date > now.minus({ days: 6 })) {
        // 'EEE' gives your short day names (e.g. Mon, Tue)
        return date.toFormat('EEE')
    }

    else {
        // older than a week, show full date
        return date.toFormat('dd/MM/yy');
    }
};