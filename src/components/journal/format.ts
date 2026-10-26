/** "26 October 2026": long, unambiguous and the same on server and browser. */
export const formatJournalDate = (value: Date | string) =>
    new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date(value));
