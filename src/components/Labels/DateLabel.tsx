import { fromNow } from '../../utils/dates/fromNow';

export default function DateLabel({ dateString }: { dateString: Date }) {
  return <time className="thin-label">{fromNow(dateString)}</time>;
}
