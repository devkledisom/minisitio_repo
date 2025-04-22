import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { masterPath } from "../config/config";

import { useBusca } from '../context/BuscaContext';

const Pagination = ({ totalPages, paginaAtual, totalItem, table, busca }) => {
    
    //contexto
    const { result, setResult } = useBusca();

    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {setCurrentPage(paginaAtual)}, [paginaAtual])

    const handlePageChange = async (page) => {
        setCurrentPage(page);
        //navigate(`/admin/${table}?page=${page}&search=${busca}`);
        const uf = document.querySelector('#codUf2').value;
        const codigoCaderno = document.querySelector('#codUf3').value;
        const valor_da_busca = document.querySelector('#inputBusca').value;

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "uf": uf,
                "codigoCaderno": codigoCaderno,
                "atividade": valor_da_busca,
                "totalPages": totalPages,
                "paginaAtual": page,
                "totalItem": totalItem
            })
        };


        const request = await fetch(`${masterPath.url}/buscar?page=${page}`, options).then((x) => x.json())
                    //console.log(request)
                    //setAnuncio(request)
                    setResult(request);


    };

    const renderPaginationNumbers = () => {
        const paginationNumbers = [];
        const totalPagesToShow = 3;

        // Calcula os números de página para mostrar
        const startPage = Math.max(1, currentPage - Math.floor(totalPagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + totalPagesToShow - 1);

        for (let i = startPage; i <= endPage; i++) {
            paginationNumbers.push(
                <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
                    <a className="page-link" href="#" onClick={() => handlePageChange(i)}>
                        {i}
                    </a>
                </li>
            );
        }



        return paginationNumbers;
    };


    return (
        <div className='container-fluid'>
            <div className="row px-4">
                <div className="pagination w-50 p-0 d-flex justify-content-start">
                    <div>Página {paginaAtual}/{totalPages} (Total: {parseFloat(totalItem).toLocaleString('pt-BR')})</div>
                </div>
                <ul className="pagination p-0 d-flex justify-content-end">
                    <li className="page-item"><a className="page-link" href="#" onClick={() => handlePageChange(Math.max(1, currentPage - 1))}>Anterior</a></li>
                    {renderPaginationNumbers()}
                    <li className="page-item"><a className="page-link" href="#" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}>Próxima</a></li>
                </ul>
            </div>
        </div>
    );
};

export default Pagination;
