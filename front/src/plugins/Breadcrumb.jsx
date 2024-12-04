import React from 'react';
import { Link } from 'react-router-dom';

function Breadcrumb({ items }) {
  return (
    <nav style={{ '--bs-breadcrumb-divider': "'>'", height: "36px", fontSize: "10px" }} aria-label="breadcrumb" className="col-md-10 col-9 d-flex">
      <ol className="breadcrumb" style={{ height: "100%", display: "flex", alignItems: "center" }}>
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
