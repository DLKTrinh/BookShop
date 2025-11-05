import React from "react";

const Dashboard = React.lazy(() => import("../pages/Dashboard"));
const Books = React.lazy(() => import("../features/books/pages/Books"));
const BookDetail = React.lazy(() => import("../features/bookdetails/pages/BookDetail"));
const AddNewBook = React.lazy(() => import("@/features/addbook/pages/AddNewBook"));

const username = "Admin"; 

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
