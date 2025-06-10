import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <>
        <div style={style}></div>
        <div style={{ textAlign: "center", padding: "50px" }}>
            
            <h1>404 - Página Não Encontrada</h1>
            <p>Ops! A página que você está procurando não existe.</p>
            <Link to="/" style={{ color: "blue", textDecoration: "underline" }}>
                Voltar para a Home
            </Link>
        </div>
        </>
        
    );
}

const style = {
    width: "100%",
    height: "50px",
    backgroundColor: "#ffcc29"
}
