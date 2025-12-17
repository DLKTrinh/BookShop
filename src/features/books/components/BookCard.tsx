import { Link } from "react-router-dom";

interface BookCardProps {
    id: number | string;
    title: string;
    author: string;
    cover: string;
}

const BookCard: React.FC<BookCardProps> = ({ id, title, author, cover }) => {
    return (
        <Link
            to={`/books/${id}`}  // Fixed: Changed to= to to={
            className="block bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 border border-gray-700 select-none"
        >
            <div className="relative aspect-[2/3] w-full">
                <img
                    src={cover}
                    alt={title}
                    className="w-full h-full object-cover rounded-t-xl"
                />
            </div>
            <div className="py-1 px-3 text-center flex flex-col justify-between h-20">
                <div className="flex-1 flex items-center justify-center">
                    <h3 className="text-gray-200 font-medium line-clamp-2 leading-snug">
                        {title}
                    </h3>
                </div>
                <p className="text-gray-400 text-sm">{author}</p>
            </div>
        </Link>
    );
};

export default BookCard;