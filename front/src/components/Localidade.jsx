import React, { useState, useEffect } from "react";
import { masterPath } from "../config/config";

const Localidade = () => {
  const [ufSelected, setUf] = useState(0);
  const [uf, setUfs] = useState([]);
  const [caderno, setCaderno] = useState([]);
  const [codUser, setCodUser] = useState([]);
  const [atividades, setAtividades] = useState();

  const executarSelecao = () => {
    let codigoUf = document.querySelectorAll("#codUf6")[1].value;
    console.log(codigoUf)
    setUf(codigoUf);
  };

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
    fetch(`${masterPath.url}/pa`)
      .then((x) => x.json())
      .then((res) => {
        setCodUser(res.message + 1);
        //console.log(res.message + 1)
      });
    fetch(`${masterPath.url}/atividade/:codAtividade`)
      .then((x) => x.json())
      .then((res) => {
        setAtividades(res);
        //console.log(res)
        //decodificar()
      });
  }, []);

  return (
    <div className="localidade">
      <div className="row">
        <div class="col-md-4 col-xs-12">
          <div class="form-group input-icon margin-top-10">
            <i class="fa fa-compass icone-form p-0"></i>
            <select
              name="codUf"
              id="codUf6"
              class="form-control"
              onChange={executarSelecao}
            >
              <option value="" selected="selected">
                - UF -
              </option>
              {uf.map((item) => (
                <option id={item.id_uf} key={item.id_uf} value={item.id_uf}>
                  {item.sigla_uf}
                </option>
              ))}
            </select>{" "}
          </div>
        </div>

        <div class="col-md-8 col-xs-12">
          <div class="form-group selectCaderno form-group input-icon margin-top-10">
            <i class="fa fa-map-marker icone-form p-0"></i>
            <select name="codCaderno" id="codUf7" class="form-control">
              <option value="">- TODO -</option>
              {caderno.map(
                (item) =>
                  item.codUf == ufSelected && (
                    <option
                      id={item.codCaderno}
                      key={item.codCaderno}
                      value={item.codCaderno}
                    >
                      {item.nomeCaderno}
                    </option>
                  )
              )}
            </select>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Localidade;
