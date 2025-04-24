import React, { useEffect, useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { masterPath } from "../../config/config";

import "../../assets/css/comprar-anuncio.css";

function UploadImage(props) {
  //state
  const [imagem, setImagem] = useState(false);
  const [mostrarLabel, setMostrarLabel] = useState(true);
  const [textLabel, setTextLabel] = useState(props.msg);

  const [mostrarMiniPreview, setMostrarMiniPreview] = useState(props.miniPreview);
  const [ativarPreview, setPreview] = useState(props.preview);
  const [codImg, setCodImg] = useState(null);


  //ref
  const inputImg = useRef();
  useEffect(() => {
    if (!mostrarMiniPreview) {
      setMostrarLabel(false);
    }

    if (props.codImg == 0 || props.codImg == "" || props.codImg == undefined) {
      setMostrarMiniPreview(true);
      setMostrarLabel(true);
    }


  }, []);


  const onDrop = useCallback((acceptedFiles) => {
    if (props.patrocinador >= 4) {
      localStorage.setItem("imgname" + props.patrocinador, acceptedFiles[0].name);
    } else {
      localStorage.setItem("imgname", acceptedFiles[0].name);
    }

    //console.log(acceptedFiles[0])
    //setImagem(acceptedFiles[0]);
    setMostrarLabel(false);


    if (props.preview == true) {
      document.querySelector('.comImagem img').src = URL.createObjectURL(acceptedFiles[0]);
      document.querySelector('.semImagem').style.display = 'none';
      document.querySelector('.comImagem').style.display = 'block';

    }

    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);

    fetch(`${masterPath.url}/upload-pdf?cod=${props.codigoUser}&local=promocao&id=${props.minisitio['cartao_digital']}`, {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log('Pdf enviado com sucesso!', data);

      props.data({
        ...props.minisitio,
        ['cartao_digital']: data.name // ou como vier do backend
      });


      setImagem(data);
      setMostrarLabel(false);
      setMostrarMiniPreview(true);
    })


  // Enviar a imagem para o servidor
  /*  fetch(`${masterPath.url}/upload-pdf?cod=${props.codigoUser}&local=promocao`, {
     method: 'POST',
     body: formData
   })
     .then(response => {
       if (!response.ok) {
         throw new Error('Erro ao enviar imagem para o servidor');
       }
       console.log('Pdf enviado com sucesso!');
console.log(response)
       //props.data.cartao_digital = acceptedFiles[0].name;

       props.data({
         ...props.minisitio,
         ['cartao_digital']: acceptedFiles[0].name,
   
       });

       console.log(props.data.cartao_digital);
       setMostrarLabel(false);
       setMostrarMiniPreview(true);
     })
     .catch(error => {
       console.error('Erro ao enviar imagem:', error);
     }); */

}, []);

const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDrop,
  accept: { 'application/pdf': [] }, // Aceita apenas arquivos PDF
  maxFiles: 1, // Limite de 1 arquivo
  //maxSize: 5 * 1024 * 1024, // Limite de tamanho (5MB)
});

const limparInputImg = () => {
  props.data({
    ...props.minisitio,
    ['cartao_digital']: "",

  });
  if (props.preview == true) {
    document.querySelector('.semImagem').style.display = 'block';
    document.querySelector('.comImagem').style.display = 'none';
  } else {
    setImagem(false);
    setMostrarLabel(true);
    setMostrarMiniPreview(true);
    localStorage.setItem("imgname" + props.patrocinador, "");
  }


}

return (
  <div className={"row webcard choose-main" + " " + props.largura} >
    <div className="col-md-8">
      <div className="input-icon margin-top-10">
        <i className="fa fa-paperclip"></i>
        <span
          className="form-control descImagem"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "5px",
            color: "#4f4f4f!important",
            margin: "auto"
          }}
        >

          {/*  {!mostrarMiniPreview ? <img src={`${masterPath.url}/files/3/${props.codImg}`} width={50} style={{ fontSize: "15px" }} /> : ""} */}
          {!mostrarMiniPreview ? <a href={`${masterPath.url}/files/3/${props.codImg}`} target="_blank" rel="noopener noreferrer" class="pull-right d-flex" id="btnVerImagem" title="verimagem">Ver cartão digital</a> : ""}
          {!mostrarMiniPreview && <a href="javascript:;" class="pull-right" id="btnDeleteImagem" title="Remover arquivo" onClick={limparInputImg}><i class="fa fa-times-circle"></i></a>}

          {/*  {imagem ? <img src={URL.createObjectURL(imagem)} width={50} style={{ fontSize: "15px" }} /> : ""} */}
          {imagem ? <a href={`${masterPath.url}/files/3/${imagem.name}`} target="_blank" rel="noopener noreferrer" class="pull-right d-flex" id="btnVerImagem" title="verimagem">Ver cartão digital</a> : ""}
          {mostrarLabel && textLabel}
          {imagem && <a href="javascript:;" class="pull-right" id="btnDeleteImagem" title="Remover arquivo" onClick={limparInputImg}><i class="fa fa-times-circle"></i></a>}

        </span>
        <input {...getInputProps({ name: "imagem", title: "descImagem" })} />
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
