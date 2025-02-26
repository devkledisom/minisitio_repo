import { createContext, useState, useEffect } from "react";
import { masterPath } from '../config/config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
     /*    const token = localStorage.getItem("token");
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setUser(payload);
        } */
    }, []);

    const login = async (descCPFCNPJ, senha) => {
        const res = await fetch(`${masterPath.url}/entrar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ descCPFCNPJ, senha })
        });

        const data = await res.json();
        console.log('kledisom', data)
        if (res.ok) {
            localStorage.setItem("token", data.accessToken);
            const payload = data.data;
            setUser(payload);
            return payload;
        }
        return data;
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
