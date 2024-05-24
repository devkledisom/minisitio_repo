import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { masterPath } from "../config/config";

import "../assets/css/main.css";
import "../assets/css/default.css";
import "../assets/css/card.css";

import "bootstrap/dist/css/bootstrap.min.css";
/* import 'font-awesome/css/font-awesome.min.css'; */

//controllers
import controlCard from "../controllers/controllerCardlist";

function Cardlist(props) {
  //console.log(props.codCity);

  const [uf, setUfs] = useState([]);
  const [caderno, setCaderno] = useState([]);

  useEffect(() => {
    fetch(`${masterPath.url}/cadernos`)
      .then((x) => x.json())
      .then((res) => {
        setCaderno(res);
        //console.log(res)
      });
    fetch(`${masterPath.url}/ufs`)
      .then((x) => x.json())
      .then((res) => {
        setUfs(res);
        //console.log(res)
      });
  }, []);

  return (
    <div className="Cardlist">
      <div className="container card my-2">
        <div className="row px-2">
          <div className="col-md-2 p-0">
            <img
              src={`${masterPath.url}/files/${props.codImg}`}
              alt="Foto"
              className="h-100 w-100"
            />
          </div>
          <div className="col-md-10">
            <div className="container w-100 p-0">
              {/* row */}
              <div className="row text-start">
                <div className="col-md-12 col-xs-12 pesquisa-nome">
                  <h4 className="d-flex font-20 border-bottom border-secondary p-2">
                    {/* <i className="fa fa-tags"></i> */}
                    <span>{props.anuncio.descAnuncio}</span>
                  </h4>
                </div>
              </div>
              {/* row */}
              <div className="row text-start px-3">
                <div className="col-md-12 col-xs-12 pesquisa-nome">
                  <h4 className="d-flex">{/* font-14 */}
                    <i className="fa fa-map-marker"></i>
                    <span>{props.anuncio.descEndereco}</span> /{" "}
                    {caderno.map((item) => {
                        if(item.codCaderno == props.codCity) {
                            //console.log(uf)
                            const estado = uf.find(estado => estado.id_uf == 27)
                            return <span>{item.nomeCaderno} - {estado.sigla_uf} </span>
                        }
                     
                    })}
                  </h4>
                </div>
              </div>
              {/* row */}
              <div className="row">
                <div className="col-md-12 d-flex justify-content-end btn-view-page">
                  <button>
                    <i className="fa fa-star"></i>
                    <Link
                      to={`/caderno/${props.anuncio.descAnuncio}?page=1&book=${props.anuncio.codCaderno}&id=${props.anuncio.codAnuncio}`}
                    >
                      VER MINISITIO
                    </Link>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cardlist;
