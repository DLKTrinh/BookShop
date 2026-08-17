import React from "react";
import RequireAuth from "../features/auth/components/RequireAuth";
import { Navigate } from "react-router-dom";

const Books = React.lazy(() => import("../features/books/pages/Books"));
const BookDetail = React.lazy(() => import("../features/books/pages/BookDetail"));
const AddNewBook = React.lazy(() => import("../features/books/pages/AddNewBook"));
const EditBook = React.lazy(() => import("../features/books/pages/EditBook"));
const Login = React.lazy(() => import("../features/auth/pages/Login"));
const Register = React.lazy(() => import("../features/auth/pages/Register"));
const Dashboard = React.lazy(() => import("../features/dashboard/pages/Dashboard"));


export const routes = [
    {
        path: "/",
        element: (
        // RequireAuth handles the unauthenticated case (redirects to /login,
        // remembering "/" as where to come back to). If authenticated, this
        // just forwards straight on to the real homepage.
        <RequireAuth>
            <Navigate to="/dashboard" replace />
        </RequireAuth>
        ),
    },
    {
        path: "/dashboard",
        element: (
        <RequireAuth>
            <Dashboard />
        </RequireAuth>
        ),
    },

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
             <Books />
            </RequireAuth>
        ) 
            
    },
    {
        path: "/books/:id",
        element: (
            <RequireAuth>
                <BookDetail />
            </RequireAuth>
        )  
        
    },
    {
        path: "/books/new",
        element: (
            <RequireAuth>
                <AddNewBook />
            </RequireAuth>  
        )
    },
    {
        path: "/books/:id/edit",
        element: (
            <RequireAuth>
                <EditBook />
            </RequireAuth>
        )
    }
];
