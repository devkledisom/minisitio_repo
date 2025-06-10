
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

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