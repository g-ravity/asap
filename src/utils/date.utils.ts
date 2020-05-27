import format from "date-fns/format";

export const getDate = (date: Date): string => format(date, "dd");
export const getMonth = (date: Date): string => format(date, "MMMM");
export const getYear = (date: Date): string => format(date, "yyyy");
export const getDay = (date: Date): string => format(date, "EEEE");
