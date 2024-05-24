import { BrowserRouter, Routes, Route } from 'react';
import { Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

//Componentes
import Header from './view/Header';

function Administrator() {
    return (
        <div>
            <Header />
            <div className="d-flex justify-content-center align-items-center" style={{ height: "85vh" }}>
                <a href="/"><img src="../assets/img/logo.png" className="" /></a>
            </div>
            <footer className='w-100' style={{ position: "absolute", bottom: "0px" }}>
                <p className='w-100 text-center'>© MINISITIO</p>
            </footer>
        </div>



    )

};

export default Administrator;
//use import {params} from 'react-router-dom'