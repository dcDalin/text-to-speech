import { BsChevronLeft } from 'react-icons/bs';
import { Link } from 'react-router-dom';

export default function PreviousChevron() {
  return (
    <Link to="/">
      <BsChevronLeft className="text-lg" />
    </Link>
  );
}
