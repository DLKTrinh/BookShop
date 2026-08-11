interface GenreSelectorProps {
  selectedGenres: string[];
  onChange: (genres: string[]) => void;
}

const genres = [
  // Fiction
  "Fantasy",
  "High Fantasy",
  "Urban Fantasy",
  "Science Fiction",
  "Sci-Fi",
  "Dystopian",
  "Speculative Fiction",
  "Romance",
  "Contemporary Romance",
  "Historical Romance",
  "Mystery",
  "Cozy Mystery",
  "Thriller",
  "Psychological Thriller",
  "Crime",
  "Detective",
  "Horror",
  "Gothic Horror",
  "Paranormal",
  "Adventure",
  "Action",
  "Western",

  // Literature
  "Literary Fiction",
  "Classic",
  "Contemporary Fiction",
  "Short Stories",
  "Poetry",
  "Drama",

  // Non-Fiction
  "Non-Fiction",
  "Biography",
  "Autobiography",
  "Memoir",
  "Self-Help",
  "Personal Development",
  "Philosophy",
  "Psychology",
  "Religion & Spirituality",
  "History",
  "Politics",
  "Economics",
  "Sociology",
  "True Crime",

  // Science & Education
  "Science",
  "Technology",
  "Engineering",
  "Mathematics",
  "Computer Science",
  "Artificial Intelligence",
  "Data Science",
  "Education",
  "Language Learning",

  // Lifestyle & Creative
  "Art",
  "Design",
  "Photography",
  "Music",
  "Film",
  "Cooking",
  "Food & Drink",
  "Health",
  "Fitness",
  "Travel",
  "Nature",

  // Business & Work
  "Business",
  "Entrepreneurship",
  "Marketing",
  "Finance",
  "Investing",
  "Management",
  "Leadership",
  "Career",

  // Young readers
  "Children",
  "Middle Grade",
  "Young Adult",
  "Coming of Age",

  // Comics & Media
  "Comics",
  "Graphic Novel",
  "Manga",
  "Light Novel",

  // Niche
  "Military",
  "War",
  "Sports",
  "Mythology",
  "Folklore",
  "LGBTQ+",
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
