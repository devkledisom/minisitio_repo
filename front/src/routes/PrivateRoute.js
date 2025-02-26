import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children, role }) => {
    const { user } = useContext(AuthContext);

    if (!user) return <Navigate to="/login" />;
    console.log(user.codTipoUsuario, role)
    if (role && user.codTipoUsuario !== role) return <Navigate to="/forbidden" />;

    return children;
};

export default PrivateRoute;




/* import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = () => {

        console.log(children.props.isPublic);

        const isPublic = children.props.isPublic;
        const logged = sessionStorage.getItem('authTokenMN');
        const level = sessionStorage.getItem('userLogged');

        if(!isPublic && level != "ADMIN") {
            return false;
        } else {
            return !!sessionStorage.getItem('authTokenMN');
        }

       //return !!sessionStorage.getItem('authTokenMN');
        //return false;
    };

    return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default PrivateRoute; */

