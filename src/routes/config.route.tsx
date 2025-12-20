import React from "react";

const Books = React.lazy(() => import("../features/books/pages/Books"));
const BookDetail = React.lazy(() => import("../features/books/pages/BookDetail"));
const AddNewBook = React.lazy(() => import("../features/books/pages/AddNewBook"));

const username = "Admin"; 

export const routes = [
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
