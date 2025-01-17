import { BrowserRouter, Routes, Route, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { masterPath, version } from '../config/config';
import GraficoEmpresasPorEstado from "./components/GraficoEmpresasPorEstado";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

//Componentes
import Header from './view/Header';

function Administrator() {

      const [data, setData] = useState(null);

      useEffect(() => {
        const tokenAuth = sessionStorage.getItem('userTokenAccess');

         fetch(`${masterPath.url}/admin/anuncio/quantidade/uf`, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "authorization": 'Bearer ' + tokenAuth
             }
         })
                    .then((x) => x.json())
                    .then((res) => {
                        //console.log(res)
                        setData(res.data);
                    })
      }, []);

    return (
        <div>
            <Header />
            <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                <a href="/"><img src="../assets/img/logo.png" className="" /></a>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GraficoEmpresasPorEstado data={data} />
            </div>
            <footer className='w-100' style={{ paddingTop: '50px' }}>
            <p className='w-100 text-center'>© MINISITIO - {version.version}</p>
            </footer>
        </div>
    )

};

export default Administrator;
//use import {params} from 'react-router-dom'