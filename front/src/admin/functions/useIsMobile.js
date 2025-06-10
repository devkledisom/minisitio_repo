import { useEffect, useState } from 'react';

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Adiciona o listener de evento para 'resize'
        window.addEventListener("resize", handleResize);

        // Remove o listener quando o componente é desmontado
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return isMobile;
};

export default useIsMobile;
