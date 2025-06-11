
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import CookieConsent from "react-cookie-consent";

import { masterPath } from './config/config';

//Rotas
import Rotas from './routes/Rotas'


function App() {

  /*  setInterval(() => {
     const config = {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
         "authorization": 'Bearer ' + masterPath.accessToken
       }
     };
 
 
     fetch(`${masterPath.url}/test-connection`, config)
       .then((x) => {
         if (x.status == 401) {
           alert("Sessão expirada, faça login para continuar.");
           //navigate('/login');
           window.location.href = '/login';
           return Promise.reject('Sessão expirada');
         }
         return x.json();
       })
       .then((res) => {
         console.log(res)
       }).catch((error) => {
         if (error === 'Sessão expirada') {
           console.log("Sessão expirada, redirecionamento já realizado.");
           // Aqui você pode evitar que o erro seja mostrado globalmente
         } else {
           // Trate outros erros aqui, se necessário
           console.error('Erro na requisição:', error);
         }
       });
   }, 300000) */

  return (
    <div>
      <Rotas />
      <CookieConsent
        location="bottom"
        buttonText="Aceitar"
        declineButtonText="Recusar"
        enableDeclineButton
        cookieName="consentimentoUsuario"
        style={{ background: "#2B373B" }}
        buttonStyle={{ background: "#4CAF50", color: "#fff", fontSize: "13px", marginRight: "10px", borderRadius: "5px" }}
        declineButtonStyle={{ background: "#f44336", color: "#fff", fontSize: "13px", borderRadius: "5px" }}
        expires={15}
        onAccept={() => {
          console.log("Usuário aceitou os cookies!");
          // Ativar scripts de rastreamento aqui
        }}
        onDecline={() => {
          console.log("Usuário recusou os cookies.");
          // Bloquear scripts de rastreamento aqui
        }}
      >
        O Minisitio utiliza cookies para entregar uma melhor experiência durante a navegação.
        {/*   <a href="/politica-de-privacidade" style={{ color: "#FFD700" }}>
          Saiba mais
        </a> */}
      </CookieConsent>
    </div>

    /*     <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route index element={<Home />} />
              <Route path="buscar" element={<Pesquisa />} />
              <Route path="caderno" element={<Caderno />} />
              <Route path="local" element={<WebCard />} />
              <Route path="admin" element={<Administrator />} />
              <Route path="sobre/:id" element={<OutroComponente />} />
            </Route>
          </Routes>
        </BrowserRouter> */

  );
}

export default App;