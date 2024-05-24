import React, { useState } from 'react';
import { useHistory, useNavigate } from 'react-router-dom';

const Pagination = ({ totalPages, table }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const handlePageChange = (page) => {
        setCurrentPage(page);
        navigate(`/${table}?page=${page}`);
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
                <ul className="pagination p-0 d-flex justify-content-end">
                    <li className="page-item"><a className="page-link" href="#" onClick={() => handlePageChange(Math.max(1, currentPage - 1))}>Previous</a></li>
                    {renderPaginationNumbers()}
                    <li className="page-item"><a className="page-link" href="#" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}>Next</a></li>
                </ul>
            </div>
        </div>
    );
};

export default Pagination;
