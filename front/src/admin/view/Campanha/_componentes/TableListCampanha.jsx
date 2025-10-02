import React, { useEffect, useState, useContext } from 'react';
import { masterPath, version } from '../../../../config/config';

import Swal from 'sweetalert2';

import Table from 'react-bootstrap/Table';
import { Link2, Trash2 } from 'lucide-react';
import { Modal } from 'react-bootstrap';


export default function TableListCampanha({ campanhas, setShowSpinner }) {
  const [show, setShow] = useState(false);
  const [campanhaSelecionada, setCampanhaSelecionada] = useState(null);

  const handleOpen = (campanha) => {
    setCampanhaSelecionada(campanha);
    setShow(true);
  };

  const handleClose = () => {
    setCampanhaSelecionada(null);
    setShow(false);
  };

  function cancelarCampanha(campanha) {
    Swal.fire({
      title: 'Tem certeza?',
      text: `Você está prestes a cancelar a campanha do usuário ${campanha.desconto.usuario.descNome}. Esta ação não pode ser desfeita.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, cancelar!',
      cancelButtonText: 'Não, manter'
    }).then((result) => {
      if (result.isConfirmed) {
        setShowSpinner(true);
        fetch(`${masterPath.url}/admin/campanha/cancelar/${campanha.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(x => x.json())
          .then(res => {
            setShowSpinner(false);
            if (res.success) {
              Swal.fire(
                'Cancelada!',
                'A campanha foi cancelada com sucesso.',
                'success'
              ).then(() => {
                window.location.reload();
              });
            }
          });
      }
    });
  }

  return (
    <div>
      {campanhas && campanhas.length === 0 ?
        <p className='text-center'>Nenhuma campanha encontrada.</p>
        :
        <Table striped hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Id</th>
              <th>Uf</th>
              <th>Caderno</th>
              <th>Criador</th>
              <th>Data de Criação</th>
              <th>Data de Fim</th>
              <th>Csv</th>
              <th>Deletar</th>
            </tr>
          </thead>
          <tbody>
            {campanhas.map((campanha, index) => (
              <tr key={campanha.id}>
                <td>{index + 1}</td>
                <td>{campanha.desconto.usuario.descNome}</td>
                <td>{campanha.desconto.hash}</td>
                <td>{campanha.uf}</td>
                <td>{campanha.caderno}</td>
                <td>{campanha.criador}</td>
                <td>{campanha.createdAt}</td>
                <td>{campanha.dataFim}</td>
                <td className='text-center'>
                  <button onClick={() => handleOpen(campanha)}>
                    <Link2 />
                  </button>
                </td>
                <td className='text-center'>
                  <button onClick={() => cancelarCampanha(campanha)}>
                    <Trash2 color='red' size={20}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      }


      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          {/* <Modal.Title>Detalhes da campanha</Modal.Title> */}
        </Modal.Header>

        <Modal.Body className="form-campanha">
        </Modal.Body>
        <div className="p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            O que você deseja fazer com este link?
          </h2>
          <p className="text-gray-500 mb-6">
            Você pode abrir em uma nova guia ou copiar para compartilhar.
          </p>

          <div className="flex justify-center gap-4">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              onClick={() => window.open(`${masterPath.url}/files/campanha/campanha-${campanhaSelecionada.id}.csv`, "_blank")}
            >
              Abrir em nova guia
            </button>

            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition"
              onClick={() => {
                navigator.clipboard.writeText(`${masterPath.url}/files/campanha/campanha-${campanhaSelecionada.id}.csv`);
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Link copiado!",
                  showConfirmButton: false,
                  timer: 1500
                });
              }}
            >
              Copiar link
            </button>
          </div>
        </div>

        {/*     <Modal.Footer>
          
        </Modal.Footer> */}
      </Modal>

    </div>

  );
}