interface GenreSelectorProps {
  selectedGenres: string[];
  onChange: (genres: string[]) => void;
}

const genres = [
  "Fantasy",
  "Sci-Fi",
  "Romance",
  "Mystery",
  "Thriller",
  "Non-Fiction",
  "Biography",
  "Self-Help",
  "History",
  "Horror",
];

export default function GenreSelector({
  selectedGenres,
  onChange,
}: GenreSelectorProps) {
  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      onChange(selectedGenres.filter((g) => g !== genre));
    } else {
      onChange([...selectedGenres, genre]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {genres.map((genre) => {
        const isSelected = selectedGenres.includes(genre);
        return (
          <button
            key={genre}
            type="button"
            onClick={() => toggleGenre(genre)}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-all duration-200 ${
              isSelected
                ? "bg-blue-600 text-white border-blue-500"
                : "bg-gray-800 text-gray-300 border-gray-600 hover:border-blue-500 hover:text-blue-400"
            }`}
          >
            {genre}
          </button>
        );
      })}
    </div>
  );
}
