/* eslint-disable @typescript-eslint/no-explicit-any */
import { IShowToast } from '@/types';

export const getWeekNumber = (date: string) => {
  const theDate = new Date(date);
  const onejan = new Date(theDate.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(
    ((theDate.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) /
      7,
  );
  return weekNumber;
};
export const getDateNow = (): string => {
  const now = new Date();
  const [result] = now.toISOString().split('T');
  return result;
};
export const getDayNow = (): number => {
  const now = new Date();
  return now.getDay();
};
export const getDateTimeNow = (): string => {
  const now = new Date();
  return now.toISOString();
};
export const isDateBefore = (
  date1: string | Date,
  date2: string | Date,
): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1 < d2;
};
export const getDate = (date: string | Date): string => {
  const d = new Date(date);
  const [result] = d.toISOString().split('T');
  return result;
};
export const getDates = (dates: Date[]): string[] => {
  const result = dates.map((date) => {
    return date.toISOString();
  });
  return result;
};
export const formatDates = (dates: string[]): Date[] => {
  const result = dates.map((date) => new Date(date));
  return result;
};
export const errorHandler = (
  error: any,
  showToast?: IShowToast,
  navigate?: any,
) => {
  console.error(error);

  if (showToast) {
    showToast('error', 'Erreur', error.response.data.message);
  }
  switch (error.response.status) {
    case 401:
      navigate('/login', { replace: true });
      break;
    case 403:
      navigate('/login');
      break;

    default:
      break;
  }
};
export const successHandler = (res: any, showToast?: IShowToast) => {
  if (showToast) {
    showToast('success', 'Succès', res.data.message);
  }
};
export const arrayBufferToBase64 = (buffer: any) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};
export const countOccurrencesChar = (text: string) => {
  const occurrences: { [key: string]: number } = {};
  for (const char of text) {
    occurrences[char] = (occurrences[char] || 0) + 1;
  }
  return occurrences;
};
