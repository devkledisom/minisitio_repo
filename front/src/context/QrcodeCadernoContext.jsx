import { createContext, useState, useContext } from "react";
import { useParams } from "react-router-dom";

export const QrcodeCadernoContext = createContext();

export const useTheme = () => useContext(QrcodeCadernoContext)

export const QrcodeCadernoProvider = ({ children }) => {
    const [theme, setTheme] = useState("light");

    const {caderno, estado} = useParams(); 

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    }

    console.log("very:", window.location.href, caderno)

    return (
        <QrcodeCadernoContext.Provider value={{ theme, toggleTheme }} >
            {children}
        </QrcodeCadernoContext.Provider>
    )
};