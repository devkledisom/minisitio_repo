import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = () => {
        return !!sessionStorage.getItem('authTokenMN');
        //return false;
    };

    return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default PrivateRoute;