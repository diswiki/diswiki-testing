function formatTimestamp(timestamp: number, format: 'normal' | 'normaltime' | 'relative'): string {
    const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
    const months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];

    switch (format) {
        case 'normal':
            return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
        case 'normaltime':
            const hours = date.getHours() % 12 || 12;
            const minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
            const period = date.getHours() >= 12 ? 'PM' : 'AM';
            return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${hours}:${minutes} ${period}`;
        case 'relative':
            const now = new Date();
            const diff = now.getTime() - date.getTime();
            const seconds = Math.floor(diff / 1000);
            const minutesDiff = Math.floor(seconds / 60);
            const hoursDiff = Math.floor(minutesDiff / 60);
            const daysDiff = Math.floor(hoursDiff / 24);

            if (daysDiff > 0) {
                return `${daysDiff} day${daysDiff > 1 ? 's' : ''} ago`;
            } else if (hoursDiff > 0) {
                return `${hoursDiff} hour${hoursDiff > 1 ? 's' : ''} ago`;
            } else if (minutesDiff > 0) {
                return `${minutesDiff} minute${minutesDiff > 1 ? 's' : ''} ago`;
            } else {
                return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
            }
        default:
            throw new Error('Invalid format type');
    }
}

/**
 * 
 * @param timestamp 
 * @returns [days, months, years]
 */
function timeSinceTimestamp(timestamp: number): [number, number, number] {
    const now = new Date();
    const then = new Date(timestamp * 1000);
    const diffTime = Math.abs(now.getTime() - then.getTime());

    // days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // months
    let diffMonths = (now.getFullYear() - then.getFullYear()) * 12;
    diffMonths += now.getMonth() - then.getMonth();
    if (now.getDate() < then.getDate()) {
        diffMonths--;
    }

    // years
    const diffYears = Math.ceil(diffMonths / 12);

    return [diffDays, diffMonths, diffYears];
}

function avgReadTime(text: string) {
    const wpm = 225;
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wpm);
    return time;
};



export {
    formatTimestamp,
    timeSinceTimestamp,
    avgReadTime
}