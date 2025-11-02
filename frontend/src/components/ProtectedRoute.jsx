import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    // 1. Retrieve the token and user data from local storage
    const token = localStorage.getItem('token');
    const userStorage = localStorage.getItem('user');
    let user = null;
    let userRole = null;

    if (userStorage) {
        try {
            user = JSON.parse(userStorage);
            // Assuming your user object saved during login has a 'role' field
            userRole = user.role; 
        } catch (e) {
            console.error("Error parsing user data:", e);
        }
    }

    // 2. Check Authentication Status (Is the user logged in?)
    if (!token || !user) {
        // If no token or user data is found, redirect to login
        return <Navigate to="/login" replace />;
    }

    // 3. Check Authorization (Does the user have the right role?)
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // If the user is logged in but doesn't have the required role, 
        // redirect them to the homepage or show an access denied message.
        alert("Access Denied: You do not have permission to view this page.");
        return <Navigate to="/" replace />;
    }

    // 4. If checks pass, render the child component (the secured page)
    return children;
};

export default ProtectedRoute;