import { createContext, useState, useEffect } from "react";
import { masterPath } from '../config/config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(null); 

    useEffect(() => {
        const token = sessionStorage.getItem("userTokenAccess");
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setUser(payload);


            fetch(`${masterPath.url}/is-auth`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data.data) {
                    setUser(data.data);
                    setLoading(false);
                } else {
                    //console.error("Invalid response data", data);
                    logout();
                }

            })
            .catch(() => logout())
        } else {
            setLoading(false);
        }

        
    }, []);

    const login = async (descCPFCNPJ, senha) => {
        const res = await fetch(`${masterPath.url}/entrar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ descCPFCNPJ, senha })
        });

        const data = await res.json();
        if (res.ok) {
            sessionStorage.setItem("userTokenAccess", data.accessToken);
            const payload = data.data;
            setUser(payload);
            setLoading(false);
            return payload;
        }
        return data;
    };

    const logout = () => {
        sessionStorage.removeItem("userTokenAccess");
        setUser(null);
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
