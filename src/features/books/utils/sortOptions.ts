export const sortOptions = [
  { id: "default", value: "", label: "Default" },
  { id: "title-asc", value: "title", label: "Title (A-Z)" },
  { id: "title-desc", value: "-title", label: "Title (Z-A)" },
  { id: "author-asc", value: "author", label: "Author (A-Z)" },
  { id: "author-desc", value: "-author", label: "Author (Z-A)" },
];

export const getValueFromId = (id: string): string => {
  return sortOptions.find(opt => opt.id === id)?.value || "";
};

export const getIdFromValue = (value: string): string => {
  return sortOptions.find(opt => opt.value === value)?.id || "default";
};