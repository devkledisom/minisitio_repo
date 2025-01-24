import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = () => {

        console.log(children.props.isPublic);

        const isPublic = children.props.isPublic;
        const logged = sessionStorage.getItem('authTokenMN');
        const level = sessionStorage.getItem('userLogged');

        if(isPublic && level == "ADMIN") {
            return false;
        } else {
            return !!sessionStorage.getItem('authTokenMN');
        }

       //return !!sessionStorage.getItem('authTokenMN');
        //return false;
    };

    return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default PrivateRoute;