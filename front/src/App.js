
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

//Rotas
import Rotas from './routes/Rotas'


function App() {
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

{/* <div className="App"> */ }
{/* <Home /> */ }
{/* <Pesquisa /> */ }
{/*  <Caderno /> */ }
{/* <WebCard /> */ }
{/*       <Mosaico logoTop={false} />
      <div className="d-flex justify-content-center align-items-center" style={{ height: "500px" }}>
        <a href="/"><img src="../assets/img/logo.png" className="" /></a>
      </div>

      <Busca />
      <Nav styleClass="none" />
      <div className="d-flex justify-content-center align-items-center" style={{ height: "500px" }}>
        <a href="/"><img src="../assets/img/logo.png" className="" /></a>
      </div>
      <Footer /> */}
/* </div > */