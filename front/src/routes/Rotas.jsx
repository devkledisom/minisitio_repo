import { BrowserRouter, Routes, Route } from "react-router-dom";

import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';


import Home from '../views/Home';
import Pesquisa from '../views/Pesquisa';
import Caderno from '../views/Caderno';
import WebCard from '../views/WebCard';
import Login from '../views/Login';
import ComprarAnuncio from '../views/Comprar-anuncio';


//admin
import Administrator from '../admin/Administrator';
import OutroComponente from "../admin/view/OutroComponente";
import Users from "../admin/view/Users";
import Cadernos from "../admin/view/Cadernos";
import InfoCadernos from "../admin/view/InfoCadernos";

import Atividades from "../admin/view/Atividades";
import FormCadastro from "../admin/view/FormCadastro";
import FormEditar from "../admin/view/FormEditar";
import FormCadernos from "../admin/components/FormCadastroCadernos";
import FormCadastroAtividade from "../admin/view/FormCadastroAtividade";
import FormEditAtividade from "../admin/view/FormEditAtividade";

import GerenciarIds from "../admin/view/gerenciar_id/GerenciarIds";
import GerenciarIdCadastro from "../admin/view/gerenciar_id/FormCadastro";
import GerenciarIdEditar from "../admin/view/gerenciar_id/FormEdit";

import Espacos from "../admin/view/Espacos/Espacos";

import { TemaProvider } from '../context/BuscaContext';

function Rotas() {
    return (
        <BrowserRouter>
            <TemaProvider> {/* Movido o TemaProvider para fora de Routes */}
                <Routes>
                    <Route path="/">
                        <Route index element={<Home />} />
                        <Route path="buscar" element={<Pesquisa />} />
                        <Route path="caderno/:atividade" element={<Caderno />} />
                        <Route path="local" element={<WebCard />} />
                        <Route path="login" element={<Login />} />
                        <Route path="sobre/:id" element={<OutroComponente />} />
                    </Route>
                    <Route path="admin" element={<Administrator />} />
                    <Route path="users" element={<Users />} />
                    <Route path="Cadernos" element={<Cadernos />} />
                    <Route path="info/Cadernos" element={<InfoCadernos />} />
                    <Route path="atividades" element={<Atividades />} />
                    <Route path="usuarios/cadastro" element={<FormCadastro />} />
                    <Route path="usuarios/editar" element={<FormEditar />} />

                    <Route path="cadernos/cadastro" element={<FormCadernos />} />
                    <Route path="atividades/cadastro" element={<FormCadastroAtividade />} />
                    <Route path="atividades/editar" element={<FormEditAtividade />} />

                    <Route path="comprar-anuncio" element={<ComprarAnuncio />} />
                    <Route path="desconto" element={<GerenciarIds />} />
                    <Route path="desconto/cadastro" element={<GerenciarIdCadastro />} />
                    <Route path="desconto/editar" element={<GerenciarIdEditar />} />

                    <Route path="espacos" element={<Espacos />} />

                </Routes>
            </TemaProvider>
        </BrowserRouter>

    );
}

export default Rotas;

