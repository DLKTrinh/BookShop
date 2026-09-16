import { Link, useLocation } from "react-router-dom";

interface BookCardProps {
    id: number | string;
    title: string;
    author: string;
    cover: string;
    isSelectable?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ 
    id, 
    title, 
    author, 
    cover, 
    isSelectable = false 
}) => {
    const location = useLocation();

    const cardContent = (
        <>
            <div className="relative aspect-[2/3] w-full">
                <img
                    src={cover}
                    alt={title}
                    className="w-full h-full object-cover rounded-t-xl"
                />
            </div>
            <div className="py-1 px-3 text-center flex flex-col justify-between h-20">
                <div className="flex-1 flex items-center justify-center">
                    <h3 className="text-card-foreground font-medium line-clamp-2 leading-snug">
                        {title}
                    </h3>
                </div>
                <p className="text-muted-foreground text-sm">{author}</p>
            </div>
        </>
    );

    // If selectable (delete mode)
    if (isSelectable) {
        return (
            <div className="block bg-card rounded-xl overflow-hidden shadow-md border border-border select-none">
                {cardContent}
            </div>
        );
    }

    // Otherwise
    return (
        <Link
            to={`/books/${id}`}
            state={{ from: location.pathname + location.search }}
            className="block bg-border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 border border-border select-none"
        >
            {cardContent}
        </Link>
    );
};

export default BookCard;