import React, { useState, useEffect } from 'react';
import { masterPath } from '../../../config/config';

//LIBS
import Swal from 'sweetalert2';

//API
import { fetchEspacos } from '../../../api/admin/espacos';

const DuplicateForm = ({ option, setOption, onClose, selectId, setAnuncios }) => {
  const [uf, setUfs] = useState([]);
  const [city, setCity] = useState(null);
  const [caderno, setCaderno] = useState([]);
  const [ufSelected, setUf] = useState(0);

  const tokenAuth = sessionStorage.getItem('userTokenAccess');

  useEffect(() => {
    fetch(`${masterPath.url}/cadernos?uf=${ufSelected}`)
      .then((x) => x.json())
      .then((res) => {
        setCaderno(res)
      })
    fetch(`${masterPath.url}/ufs`)
      .then((x) => x.json())
      .then((res) => {
        setUfs(res);
      })
  }, [ufSelected]);

  const executarSelecao = (event) => {
    setUf(event.target.value);
  };
  const executarSelecaoCity = (event) => {
    const selectedValues = Array.from(event.target.selectedOptions).map(option => option.value);
    setCity(selectedValues);
    //setCity([...city, event.target.value]);
    //const select = event.target.selectedOptions

  };

  function duplicar(event) {
    event.preventDefault();
    Swal.showLoading();


    switch (Number(option)) {
      case 1:
        todosCadernos();
        break;
      case 2:
        todosEstados();
        break;
      case 3:
        todosCidades();
        break;
      default:
        Swal.fire({
          title: 'error!',
          text: "Por favor selecione uma das opções",
          icon: 'error',
          confirmButtonText: 'Entendi'
        })
    };

  };

  function todosCadernos() {
    fetch(`${masterPath.url}/admin/anuncio/duplicate?id=${selectId}&duplicationType=1`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "authorization": 'Bearer ' + tokenAuth
      },
    })
      .then((x) => x.json())
      .then(async (res) => {
        if (res.success) {
          Swal.fire({
            title: 'success!',
            text: `O anuncio foi duplicado em ${res.qtdeDup} cadernos`,
            icon: 'success',
            //confirmButtonText: 'Entendi'
          });
          setOption(0);
          onClose();
          document.querySelector("#btnBuscar").click();
        /*   await fetchEspacos(1).then((resEspacos) => {
            if (resEspacos.success) {
              setAnuncios(resEspacos);
            }
          }); */
        } else {
          Swal.fire({
            title: 'error!',
            text: `${res.message}`,
            icon: 'error',
            confirmButtonText: 'Entendi'
          });
          sessionStorage.removeItem('userTokenAccess');
          window.location.href = masterPath.domain + '/login?sessionExpired=true';

        }

      }).catch((error) => {
        console.log("deleteFetch", error)
        /*  if (deleteFetch.status === 401) {
           sessionStorage.removeItem('userTokenAccess');
           window.location.href = masterPath.domain + '/login?sessionExpired=true';
           throw new Error('Não autorizado. Por favor, faça login novamente.');
         } */
      })
  };

  function todosEstados() {
    fetch(`${masterPath.url}/admin/anuncio/duplicate?id=${selectId}&duplicationType=2&uf=${ufSelected}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "authorization": 'Bearer ' + tokenAuth
      },
    })
      .then((x) => x.json())
      .then(async (res) => {
        if (res.success) {
          Swal.fire({
            title: 'success!',
            text: `O anuncio foi duplicado em ${res.qtdeDup} cadernos`,
            icon: 'success',
            //confirmButtonText: 'Entendi'
          });
          setOption(0);
          onClose();
          document.querySelector("#btnBuscar").click();
        /*   await fetchEspacos(1).then((resEspacos) => {
            if (resEspacos.success) {
              setAnuncios(resEspacos);
            }
          }); */
        } else {
          Swal.fire({
            title: 'error!',
            text: `${res.message}`,
            icon: 'error',
            confirmButtonText: 'Entendi'
          });
          sessionStorage.removeItem('userTokenAccess');
          window.location.href = masterPath.domain + '/login?sessionExpired=true';

        }

      })
  };

  function todosCidades() {
    //console.log(city)
    fetch(`${masterPath.url}/admin/anuncio/duplicate?id=${selectId}&duplicationType=3&uf=${ufSelected}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "authorization": 'Bearer ' + tokenAuth
      },
      body: JSON.stringify(city)
    })
      .then((x) => x.json())
      .then(async (res) => {
        if (res.success) {
          Swal.fire({
            title: 'success!',
            text: `O anuncio foi duplicado em ${res.qtdeDup} cadernos`,
            icon: 'success',
            //confirmButtonText: 'Entendi'
          });
          setOption(0);
          onClose();
          document.querySelector("#btnBuscar").click();

      /*     await fetchEspacos(1).then((resEspacos) => {
            if (resEspacos.success) {
              setAnuncios(resEspacos);
            }
          }); */
        } else {
          Swal.fire({
            title: 'error!',
            text: `${res.message}`,
            icon: 'error',
            confirmButtonText: 'Entendi'
          });
          sessionStorage.removeItem('userTokenAccess');
          window.location.href = masterPath.domain + '/login?sessionExpired=true';

        }

      }).catch((error) => {
        console.log("deleteFetch", error)
        /*  if (deleteFetch.status === 401) {
           sessionStorage.removeItem('userTokenAccess');
           window.location.href = masterPath.domain + '/login?sessionExpired=true';
           throw new Error('Não autorizado. Por favor, faça login novamente.');
         } */
      })
  };

  return (
    <form>
      <label htmlFor="alter1" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <input type="radio" id="alter1" name="options" value="1" onClick={(e) => setOption(e.target.value)} style={{ marginRight: '10px' }} />
        Duplicar em todos os cadernos
      </label>
      <label htmlFor="alter2" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <input type="radio" id="alter2" name="options" value="2" onClick={(e) => setOption(e.target.value)} style={{ marginRight: '10px' }} />
        Duplicar nos estados selecionados
      </label>
      <label htmlFor="alter3" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <input type="radio" id="alter3" name="options" value="3" onClick={(e) => setOption(e.target.value)} style={{ marginRight: '10px' }} />
        Duplicar nas cidades selecionadas
      </label>
      <div>
        <h6 style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>Estados:</h6>
        {option == 2 && <select id="md-duplicate-select-1" className="md-duplicate-select" size="5" onChange={executarSelecao} multiple>
          {
            uf.map((uf, i) => (
              <option key={i} value={uf.id_uf}>{uf.sigla_uf}</option>
            ))
          }
        </select>}
      </div>
      <div>
        <h6 style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>UF:</h6>
        {option == 3 && <select id="md-duplicate-select-2" className="md-duplicate-select" size="5" onChange={executarSelecao}>
          {
            uf.map((uf, i) => (
              <option key={i} value={uf.sigla_uf}>{uf.sigla_uf}</option>
            ))
          }
        </select>}
      </div>
      <div>
        <h6 style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>Caderno:</h6>
        {option == 3 && <select id="md-duplicate-select-3" className="md-duplicate-select" size="5" onChange={executarSelecaoCity} multiple>
          {
            caderno.map((cidades) => (
              cidades.UF == ufSelected && (
                <option key={cidades.codCaderno} value={cidades.codCaderno}>{cidades.nomeCaderno}</option>
              )
            ))
          }
        </select>}
      </div>
      <div className="text-center py-3" style={{ marginTop: '20px' }}>
        <button
          type="submit"
          className="btn btn-info custom-button mx-2 text-light"
          onClick={duplicar}
        >Salvar</button>
        <button type="button" className="btn custom-button" onClick={onClose}>Cancelar</button>
      </div>
    </form>
  );
};

export default DuplicateForm;


/*  <label htmlFor="swal-input1">Input 1</label>
      <input id="swal-input1" className="swal2-input" type="text" onChange={(e) => setOption(e.target.value)} style={{ marginRight: '10px' }} placeholder="Input 1" />
      <label htmlFor="swal-input2">Input 2</label>
      <input id="swal-input2" className="swal2-input" type="text" placeholder="Input 2" />
      <label htmlFor="swal-select">Select</label>
      <select id="swal-select" className="swal2-select">
        <option value="" disabled selected>Select an option</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </select>
      <label htmlFor="swal-checkbox" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <input type="checkbox" id="swal-checkbox" style={{ marginRight: '10px' }} />
        Agree to terms
      </label> */