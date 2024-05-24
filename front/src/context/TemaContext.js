// TemaContext.js
import React, { createContext, useContext, useState } from 'react';

// Criando o contexto
const TemaContexto = createContext();

// Componente Provedor do Contexto
export const TemaProvider = ({ children }) => {
    const [tema, setTema] = useState('claro');

    return (
        <TemaContexto.Provider value={{ tema, setTema }}>
            {children}
        </TemaContexto.Provider>
    );
};

// Hook personalizado para usar o contexto
export const useTema = () => {
    return useContext(TemaContexto);
};
