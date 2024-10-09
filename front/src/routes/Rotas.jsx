import { BrowserRouter, Routes, Route } from "react-router-dom";

import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import PrivateRoute from "./PrivateRoute";


import Home from '../views/Home';
import Pesquisa from '../views/Pesquisa';
import Caderno from '../views/Caderno';
import CadernoGeral from '../views/CadernoGeral';
import WebCard from '../views/WebCard';
import Login from '../views/Login';
import ComprarAnuncio from '../views/ComprarAnuncio';


//admin
import Administrator from '../admin/Administrator';
import OutroComponente from "../admin/view/OutroComponente";
import Users from "../admin/view/usuarios/Users";
import Cadernos from "../admin/view/cadernos/Cadernos";
import CadernosEdit from "../admin/view/cadernos/FormEdit";
import InfoCadernos from "../admin/view/InfoCadernos";

//MODULO DE ATIVIDADES
import Atividades from "../admin/view/Atividades/Atividades";
import FormCadastroAtividade from "../admin/view/Atividades/FormCadastroAtividade";
import FormEditAtividade from "../admin/view/Atividades/FormEditAtividade";


import FormCadastro from "../admin/view/usuarios/FormCadastro";
import FormEditar from "../admin/view/usuarios/FormEditar";
import FormCadernos from "../admin/view/cadernos/FormCadastroCadernos";

import GerenciarIds from "../admin/view/gerenciar_id/GerenciarIds";
import GerenciarIdCadastro from "../admin/view/gerenciar_id/FormCadastro";
import GerenciarIdEditar from "../admin/view/gerenciar_id/FormEdit";

import Espacos from "../admin/view/Espacos/Espacos";
import AnuncioEditar from "../admin/view/Espacos/FormEdit";
import AnuncioCadastro from "../admin/view/Espacos/FormCadastro";
import EspacosImport from "../admin/view/Espacos/EspacosImport";

import Pin from "../admin/view/Pin/Pin";
import PinCadastro from "../admin/view/Pin/FormCadastro";
import PinEditar from "../admin/view/Pin/FormEdit";

//PAINEL ADMIN ANUNCIANTE
import PainelAdmin from "../views/painelAnuciante/PainelAdmin";

//AREA DO ASSINANTE
import AssinanteCadastro from "../views/area-assinante/AssinanteCadastro";
import Qrcode from "../plugins/Qrcode";
import Adesivo from "../plugins/Adesivo";


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
                        <Route path="caderno-geral/:caderno/:estado" element={<CadernoGeral />} />
                        <Route path="local/:nomeAnuncio" element={<WebCard />} />
                        <Route path="login" element={<Login />} />
                        <Route path="sobre/:id" element={<OutroComponente />} />
                    </Route>
                    <Route path="admin" element={
                        <PrivateRoute>
                            <Administrator />
                        </PrivateRoute>}
                    />
                    <Route path="admin/users" element={<PrivateRoute><Users /></PrivateRoute>} />
                    <Route path="admin/Cadernos" element={<PrivateRoute><Cadernos /></PrivateRoute>} />
                    <Route path="admin/info/Cadernos" element={<PrivateRoute><InfoCadernos /></PrivateRoute>} />
                    <Route path="admin/atividades" element={<PrivateRoute><Atividades /></PrivateRoute>} />
                    <Route path="admin/usuarios/cadastro" element={<PrivateRoute><FormCadastro /></PrivateRoute>} />
                    <Route path="admin/usuarios/editar" element={<PrivateRoute><FormEditar /></PrivateRoute>} />

                    <Route path="admin/cadernos/cadastro" element={<PrivateRoute><FormCadernos /></PrivateRoute>} />
                    <Route path="admin/atividades/cadastro" element={<PrivateRoute><FormCadastroAtividade /></PrivateRoute>} />
                    <Route path="admin/atividades/editar" element={<PrivateRoute><FormEditAtividade /></PrivateRoute>} />

                    <Route path="/comprar-anuncio" element={<ComprarAnuncio />} />
                    <Route path="admin/desconto" element={<PrivateRoute><GerenciarIds /></PrivateRoute>} />
                    <Route path="admin/desconto/cadastro" element={<PrivateRoute><GerenciarIdCadastro /></PrivateRoute>} />
                    <Route path="admin/desconto/editar" element={<PrivateRoute><GerenciarIdEditar /></PrivateRoute>} />

                    <Route path="admin/espacos" element={<PrivateRoute><Espacos /></PrivateRoute>} />
                    <Route path="admin/anuncio/cadastro" element={<PrivateRoute><AnuncioCadastro /></PrivateRoute>} />
                    <Route path="admin/anuncio/editar" element={<PrivateRoute><AnuncioEditar /></PrivateRoute>} />
                    <Route path="admin/anuncio/import" element={<PrivateRoute><EspacosImport /></PrivateRoute>} />
                    
                    {/*ROTAS MODULO PIN*/}
                    <Route path="admin/pin" element={<PrivateRoute><Pin /></PrivateRoute>} />
                    <Route path="admin/pin/cadastro" element={<PrivateRoute><PinCadastro /></PrivateRoute>} />
                    <Route path="admin/pin/editar" element={<PrivateRoute><PinEditar /></PrivateRoute>} />


                    <Route path="admin/cadernos/editar" element={<PrivateRoute><CadernosEdit /></PrivateRoute>} />

                    {/* ROTAS PAINEL ADMIN DO ANUNCIANTE */}
                    <Route path="ver-anuncios/:cpf" element={<PrivateRoute><PainelAdmin /></PrivateRoute>} />

                    {/* ROTAS AREA DO ASSINANTE */}
                    <Route path="criar-cadastro" element={<AssinanteCadastro />} />
                    <Route path="qrcode" element={<Qrcode />} />
                    <Route path="adesivo" element={<Adesivo />} />



                </Routes>
            </TemaProvider>
        </BrowserRouter>

    );
}

export default Rotas;

