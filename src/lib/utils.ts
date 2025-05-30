import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import moment from 'moment'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimestamp(timestamp: string) {
  const messageTime = moment(timestamp);
  const now = moment();
  const diffHours = now.diff(messageTime, 'hours');

  if (diffHours < 48) {
    return messageTime.fromNow();
  }

  return messageTime.format('MMM D YYYY, h:mm A');
}