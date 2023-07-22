import { ImSpinner8 } from 'react-icons/im';

export default function FullPageLoader() {
  return (
    <div className="h-screen w-full flex items-center justify-center space-x-2">
      <ImSpinner8 className="animate-spin" />
      <p>Loading...</p>
    </div>
  );
}
