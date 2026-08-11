import React from "react";
import RequireAuth from "../features/auth/components/RequireAuth";

const Books = React.lazy(() => import("../features/books/pages/Books"));
const BookDetail = React.lazy(() => import("../features/books/pages/BookDetail"));
const AddNewBook = React.lazy(() => import("../features/books/pages/AddNewBook"));
const EditBook = React.lazy(() => import("../features/books/pages/EditBook"));
const Login = React.lazy(() => import("../features/auth/pages/Login"));
const Register = React.lazy(() => import("../features/auth/pages/Register"));

const username = "Admin"; 

export const routes = [
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/books",
        element: (
            <RequireAuth>
             <Books username={username} />
            </RequireAuth>
        ) 
            
    },
    {
        path: "/books/:id",
        element: (
            <RequireAuth>
                <BookDetail username={username} />
            </RequireAuth>
        )  
        
    },
    {
        path: "/books/new",
        element: (
            <RequireAuth>
                <AddNewBook username={username} />
            </RequireAuth>  
        )
    },
    {
        path: "/books/:id/edit",
        element: (
            <RequireAuth>
                <EditBook username={username} />
            </RequireAuth>
        )
    }
];
