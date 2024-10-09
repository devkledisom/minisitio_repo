import React from 'react';
import { Link } from 'react-router-dom';

function Breadcrumb({ items }) {
  return (
    <nav style={{ '--bs-breadcrumb-divider': "'>'", height: "36px" }} aria-label="breadcrumb" className="col-md-10 ">
      <ol className="breadcrumb">
        {items.map((item, index) => (
          <li key={index} className="breadcrumb-item" style={{ textTransform: 'uppercase' }}>
            {item.url ? (
              <Link to={item.url}>{item.label}</Link>
            ) : (
              <span>{item.label}</span>
            )}
            {index < items.length - 1 && <span>  </span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
