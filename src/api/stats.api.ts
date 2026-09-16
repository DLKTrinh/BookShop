import api from "@/api/axiosInstance";

export interface CountItem {
  name: string;
  count: number;
}

export interface MonthlyItem {
  month: string;
  count: number;
}

export interface AdminStats {
  overview: {
    totalBooks: number;
    totalCopies: number;
    outOfStock: number;
    uniqueAuthors: number;
    uniquePublishers: number;
    uniqueSubjects: number;
    totalUsers: number;
  };
  booksBySubject: CountItem[];
  booksByPublisher: CountItem[];
  booksByAuthor: CountItem[];
  booksByDecade: { decade: number; count: number }[];
  booksAddedOverTime: MonthlyItem[];
  usersAddedOverTime: MonthlyItem[];
  usersByRole: CountItem[];
}

export const getAdminStats = async (): Promise<AdminStats> => {
  const { data } = await api.get("/api/stats/admin");
  return data;
};