// TemaContext.js
import React, { createContext, useContext, useState } from 'react';

// Criando o contexto
const BuscaContexto = createContext();

// Componente Provedor do Contexto
export const TemaProvider = ({ children }) => {
    const [result, setResult] = useState(['teste']);

    return (
        <BuscaContexto.Provider value={{ result, setResult }}>
            {children}
        </BuscaContexto.Provider>
    );
};

// Hook personalizado para usar o contexto
export const useBusca = () => {
    return useContext(BuscaContexto);
};
