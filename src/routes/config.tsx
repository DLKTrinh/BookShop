import Dashboard from "../pages/Dashboard";
import Books from "../features/books/pages/Books";
import BookDetail from "../features/bookdetails/pages/BookDetail";
import AddNewBook from "@/features/addbook/pages/AddNewBook";

const username = "Admin"; // You can move this to context or props later

export const routes = [
    {
        path: "/dashboard",
        element: <Dashboard username={username} />,
    },
    {
        path: "/books",
        element: <Books username={username} />,
    },
    {
        path: "/books/:id",
        element: <BookDetail username={username} />,
    },
    {
        path: "/books/new",
        element: <AddNewBook />,
    },
];
