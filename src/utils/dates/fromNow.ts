import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

export function fromNow(date: Date) {
  dayjs.extend(relativeTime);

  return dayjs(date).fromNow();
}
