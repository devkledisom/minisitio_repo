import React, { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { masterPath } from "../config/config";

import "../assets/css/comprar-anuncio.css";

function UploadImage(props) {
  //state
  const [imagem, setImagem] = useState(false);

  //ref
  const inputImg = useRef();


  const onDrop = useCallback((acceptedFiles) => {
    // Faça algo com os arquivos aceitos, como enviar para um servidor
    // Criar um objeto FormData para enviar a imagem para o servidor

    console.log(acceptedFiles[0])
    setImagem(acceptedFiles[0]);
    localStorage.setItem("imgname", acceptedFiles[0].name);

    document.querySelector('.comImagem img').src = URL.createObjectURL(acceptedFiles[0]);
    document.querySelector('.semImagem').style.display = 'none';
    document.querySelector('.comImagem').style.display = 'block';

    const formData = new FormData();
    formData.append('image', acceptedFiles[0]);

    // Enviar a imagem para o servidor
    fetch(`${masterPath.url}/upload-image?cod=${props.codigoUser}`, {
      method: 'POST',
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao enviar imagem para o servidor');
        }
        console.log('Imagem enviada com sucesso!');
      })
      .catch(error => {
        console.error('Erro ao enviar imagem:', error);
      });

  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const limparInputImg = () => { 
    document.querySelector('.semImagem').style.display = 'block';
    document.querySelector('.comImagem').style.display = 'none';
    setImagem(false);
  }

  return (
    <div className="row webcard choose-main" >
      <div className="col-md-8">
        <div className="input-icon margin-top-10">
          <i className="fa fa-paperclip"></i>
          <span
            className="form-control descImagem"
            style={{
              paddingTop: "5px",
              lineHeight: "38px",
              color: "#4f4f4f!important",
            }}
          >
            {imagem ? <img src={URL.createObjectURL(imagem)} width={50} style={{fontSize: "15px"}}/> : "Anexar imagem do cartão"}
            {imagem && <a href="javascript:;" class="pull-right" id="btnDeleteImagem" title="Remover arquivo" onClick={limparInputImg}><i class="fa fa-times-circle"></i></a>}

          </span>
          <input {...getInputProps({ name: "imagem" })} />
        </div>
      </div>
      <div className="col-md-4 botao-procurar" {...getRootProps()}>
        <button type="button" className="btn cinza w-100" id="btnDescImagem">
          procurar
        </button>
      </div>
    </div>
  );
}

const dropzoneStyles = {
  border: "2px dashed #cccccc",
  borderRadius: "4px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
};

export default UploadImage;
