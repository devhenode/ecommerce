import dayjs from 'dayjs';

export function formatDateTime(iso: string): string {
  return dayjs(iso).format('D MMM, HH:mm');
}

export function formatDay(iso: string): string {
  return dayjs(iso).format('ddd D MMM');
}

export function addDays(days: number): string {
  return dayjs().add(days, 'day').toISOString();
}

export function isoNow(): string {
  return dayjs().toISOString();
}
