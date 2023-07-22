import DateLabel from '../Labels/DateLabel';
import ThinLabel from '../Labels/ThinLabel';

interface IBlogCardProps {
  imageUrl: string;
  title: string;
  author: string;
  datePublished: Date;
  readTime: string;
  handleNavigate: () => void;
}

export default function BlogCard({ imageUrl, title, author, datePublished, readTime, handleNavigate }: IBlogCardProps) {
  return (
    <div className="h-80 md:h-96 bg-blackGrain shadow-md rounded-2xl cursor-pointer" onClick={handleNavigate}>
      <img className="h-[60%] w-full object-cover rounded-t-2xl" src={imageUrl} alt={`${title} image`} />
      <div className="border border-thinDarkGray h-[40%] w-full rounded-b-2xl relative">
        <div className="p-4">
          <h3 className="font-open-sans text-lg">{title}</h3>
          <div className="absolute bottom-0 left-0 w-full p-4">
            <div className="flex items-center justify-between">
              <ThinLabel text={author} />
              <div className="flex items-center space-x-2">
                <DateLabel dateString={datePublished} />
                <ThinLabel text={readTime} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
