const startOfMonth = (): Date => {
  const date = new Date();
  const result = new Date(date.getFullYear(), date.getMonth(), 1);
  return result;
};

const endOfMonth = (): Date => {
  const date = new Date();
  const result = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return result;
};

const addMinutesToDate = (date: Date, n: number) => {
  date.setTime(date.getTime() + n * 60000);
  //return d.toISOString().split('.')[0].replace('T',' ');
  return date;
};

const addDaysToDate = (date: Date, n: number) => {
  date.setDate(date.getDate() + n);
  //return d.toISOString().split('T')[0];
  return date;
};

const FORMAT_SHORT_DATE = 'yyyy-MM-dd';
const FORMAT_SCHEDULER_DATE = 'yyyyMMdd';
const LOCALE = 'en-US';
export const DateUltil = {
  startOfMonth,
  endOfMonth,
  addMinutesToDate,
  addDaysToDate,
  FORMAT_SHORT_DATE,
  LOCALE,
  FORMAT_SCHEDULER_DATE
};
